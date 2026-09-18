import { HeritageSite, HotspotPOI, KelurahanType, CategoryType } from '../types';
import { HERITAGE_SITES } from '../data/heritageSites';
import { Soundscape, DEFAULT_MUSIC_TITLE } from './soundscape';

export interface GoogleSpreadsheetInfo {
  id: string;
  name: string;
  url: string;
  modifiedTime?: string;
}

// Columns definition for the main sheet "Situs_Cagar_Budaya"
export const SITES_SHEET_HEADERS = [
  'id',
  'title',
  'localName',
  'kelurahan',
  'establishedYear',
  'period',
  'category',
  'locationDescription',
  'lat',
  'lng',
  'mapX',
  'mapY',
  'thumbnail',
  'bannerImage',
  'pastPhoto_url',
  'pastPhoto_caption',
  'pastPhoto_source',
  'pastPhoto_year',
  'currentPhoto_url',
  'currentPhoto_caption',
  'conditionStatus',
  'panorama360_url',
  'panorama360_yaw',
  'panorama360_pitch',
  'video360_url',
  'video360_title',
  'video_documentary_url',
  'audio_url',
  'briefDescription',
  'historicalSignificance',
  'architecturalStyle',
  'maritimeRelevance',
  'audio_title',
  'audio_speaker',
  'audio_duration',
  'audio_transcript',
  'trivia_separated_by_pipe'
];

// Columns definition for the "Hotspot_POI" tab
export const HOTSPOTS_SHEET_HEADERS = [
  'site_id',
  'hotspot_id',
  'title',
  'description',
  'yaw',
  'pitch'
];

// Columns definition for "Pengaturan_Website" tab
export const CONFIG_SHEET_HEADERS = [
  'kunci',
  'nilai',
  'keterangan'
];

/**
 * Find spreadsheets in user's Google Drive matching Donggala Heritage
 */
export async function findDonggalaSpreadsheets(accessToken: string): Promise<GoogleSpreadsheetInfo[]> {
  const query = encodeURIComponent("mimeType='application/vnd.google-apps.spreadsheet' and trashed=false and name contains 'Donggala'");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink,modifiedTime)&orderBy=modifiedTime desc`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gagal mencari file Google Sheets di Drive: ${errorText}`);
  }

  const data = await res.json();
  return (data.files || []).map((f: any) => ({
    id: f.id,
    name: f.name,
    url: f.webViewLink || `https://docs.google.com/spreadsheets/d/${f.id}/edit`,
    modifiedTime: f.modifiedTime,
  }));
}

/**
 * Creates a new Google Spreadsheet in the user's Drive with two tabs and seeds it with current heritage data
 */
export async function createDonggalaSpreadsheet(
  accessToken: string,
  title = 'Donggala Heritage - Database Cagar Budaya & 360',
  initialSites: HeritageSite[] = HERITAGE_SITES
): Promise<GoogleSpreadsheetInfo> {
  const createUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
  const body = {
    properties: {
      title,
    },
    sheets: [
      {
        properties: {
          title: 'Situs_Cagar_Budaya',
          gridProperties: { rowCount: 100, columnCount: 40, frozenRowCount: 1 },
        },
      },
      {
        properties: {
          title: 'Hotspot_POI_360',
          gridProperties: { rowCount: 200, columnCount: 10, frozenRowCount: 1 },
        },
      },
      {
        properties: {
          title: 'Pengaturan_Website',
          gridProperties: { rowCount: 20, columnCount: 5, frozenRowCount: 1 },
        },
      },
    ],
  };

  const res = await fetch(createUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gagal membuat Google Spreadsheet baru: ${err}`);
  }

  const data = await res.json();
  const spreadsheetId = data.spreadsheetId;
  const spreadsheetUrl = data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // Populate data into both sheets
  await writeSitesToSpreadsheet(accessToken, spreadsheetId, initialSites);

  return {
    id: spreadsheetId,
    name: title,
    url: spreadsheetUrl,
  };
}

/**
 * Convert HeritageSite array to 2D row array for Google Sheets
 */
export function sitesToSheetRows(sites: HeritageSite[]): any[][] {
  const rows: any[][] = [SITES_SHEET_HEADERS];

  for (const site of sites) {
    rows.push([
      site.id,
      site.title,
      site.localName || '',
      site.kelurahan,
      site.establishedYear,
      site.period,
      site.category,
      site.locationDescription,
      site.coordinates.lat,
      site.coordinates.lng,
      site.coordinates.mapX,
      site.coordinates.mapY,
      site.thumbnail,
      site.bannerImage,
      site.pastPhoto.url,
      site.pastPhoto.caption,
      site.pastPhoto.source,
      site.pastPhoto.year,
      site.currentPhoto.url,
      site.currentPhoto.caption,
      site.currentPhoto.conditionStatus,
      site.panorama360.url,
      site.panorama360.initialYaw ?? 0,
      site.panorama360.initialPitch ?? 0,
      site.video360?.url || site.panorama360.videoUrl || '',
      site.video360?.title || '',
      site.videoDocumentaryUrl || '',
      site.audioNarration.audioUrl || '',
      site.briefDescription,
      site.historicalSignificance,
      site.architecturalStyle,
      site.maritimeRelevance,
      site.audioNarration.title,
      site.audioNarration.speakerName,
      site.audioNarration.durationText,
      site.audioNarration.transcript,
      (site.trivia || []).join(' | ')
    ]);
  }

  return rows;
}

/**
 * Convert all hotspots to 2D rows for Hotspot_POI_360 sheet
 */
export function hotspotsToSheetRows(sites: HeritageSite[]): any[][] {
  const rows: any[][] = [HOTSPOTS_SHEET_HEADERS];

  for (const site of sites) {
    if (site.panorama360?.hotspots) {
      for (const h of site.panorama360.hotspots) {
        rows.push([
          site.id,
          h.id,
          h.title,
          h.description,
          h.yaw,
          h.pitch
        ]);
      }
    }
  }

  return rows;
}

/**
 * Write full site dataset to Google Spreadsheet
 */
export async function writeSitesToSpreadsheet(
  accessToken: string,
  spreadsheetId: string,
  sites: HeritageSite[]
): Promise<void> {
  // 1. Write Situs_Cagar_Budaya
  const sitesRows = sitesToSheetRows(sites);
  const sitesRange = `Situs_Cagar_Budaya!A1:AK${sitesRows.length}`;
  const sitesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sitesRange)}?valueInputOption=USER_ENTERED`;

  const res1 = await fetch(sitesUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: sitesRows }),
  });

  if (!res1.ok) {
    const err = await res1.text();
    throw new Error(`Gagal menulis data situs ke Google Sheet: ${err}`);
  }

  // 2. Write Hotspot_POI_360
  const hotspotsRows = hotspotsToSheetRows(sites);
  const hotspotsRange = `Hotspot_POI_360!A1:F${hotspotsRows.length}`;
  const hotspotsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(hotspotsRange)}?valueInputOption=USER_ENTERED`;

  const res2 = await fetch(hotspotsUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: hotspotsRows }),
  });

  if (!res2.ok) {
    console.warn('Hotspot sheet write warning:', await res2.text());
  }

  // 3. Write Pengaturan_Website (Background music and site metadata)
  try {
    const musicInfo = Soundscape.getMusicInfo();
    const configRows = [
      CONFIG_SHEET_HEADERS,
      ['musik_latar_judul', musicInfo.title || DEFAULT_MUSIC_TITLE, 'Judul Musik Latar digitalisasi situs sejarah kota tua Donggala'],
      ['musik_latar_url', musicInfo.url || '', 'Tautan audio MP3 / Google Drive untuk musik latar (kosongkan untuk audio synthesizer ombak pesisir)'],
      ['terakhir_disinkronkan', new Date().toLocaleString('id-ID'), 'Waktu terakhir data diperbaharui dari website']
    ];
    const configRange = `Pengaturan_Website!A1:C${configRows.length}`;
    const configUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(configRange)}?valueInputOption=USER_ENTERED`;

    await fetch(configUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values: configRows }),
    });
  } catch (e) {
    console.warn('Config sheet write warning:', e);
  }
}

/**
 * Read and parse sites from Google Spreadsheet back into HeritageSite[]
 */
export async function readSitesFromSpreadsheet(
  accessToken: string,
  spreadsheetId: string,
  fallbackSites: HeritageSite[] = HERITAGE_SITES
): Promise<HeritageSite[]> {
  // Check available tabs first
  const metaUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties.title`;
  const metaRes = await fetch(metaUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!metaRes.ok) {
    const err = await metaRes.text();
    throw new Error(`Gagal membaca metadata Google Sheet (${spreadsheetId}): ${err}`);
  }

  const metaData = await metaRes.json();
  const sheetTitles: string[] = (metaData.sheets || []).map((s: any) => s.properties.title);

  // Find target sheet tab names
  const mainTab = sheetTitles.find((t) => t.toLowerCase().includes('situs') || t.toLowerCase().includes('cagar') || t.toLowerCase().includes('heritage')) || sheetTitles[0];
  const hotspotTab = sheetTitles.find((t) => t.toLowerCase().includes('hotspot') || t.toLowerCase().includes('poi'));
  const configTab = sheetTitles.find((t) => t.toLowerCase().includes('pengaturan') || t.toLowerCase().includes('konfigurasi') || t.toLowerCase().includes('config'));

  // 1. Fetch main sites data
  const readSitesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(mainTab)}!A1:AK200`;
  const sitesRes = await fetch(readSitesUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!sitesRes.ok) {
    const err = await sitesRes.text();
    throw new Error(`Gagal membaca baris tabel ${mainTab}: ${err}`);
  }

  const sitesJson = await sitesRes.json();
  const rawRows: string[][] = sitesJson.values || [];

  if (rawRows.length <= 1) {
    throw new Error(`Sheet ${mainTab} kosong atau hanya memiliki header.`);
  }

  const headerRow = rawRows[0].map((h) => (h || '').toString().trim());
  const headerIdx: Record<string, number> = {};
  headerRow.forEach((h, idx) => {
    headerIdx[h] = idx;
  });

  // 2. Fetch hotspots data if tab exists
  const hotspotsBySiteId: Record<string, HotspotPOI[]> = {};
  if (hotspotTab) {
    try {
      const readHotspotsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(hotspotTab)}!A1:F500`;
      const hsRes = await fetch(readHotspotsUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (hsRes.ok) {
        const hsJson = await hsRes.json();
        const hsRows: string[][] = hsJson.values || [];
        for (let i = 1; i < hsRows.length; i++) {
          const row = hsRows[i];
          const sId = (row[0] || '').trim();
          const hId = (row[1] || `hotspot-${i}`).trim();
          const title = row[2] || 'Titik Observasi';
          const description = row[3] || '';
          const yaw = parseFloat(row[4] || '0') || 0;
          const pitch = parseFloat(row[5] || '0') || 0;

          if (sId) {
            if (!hotspotsBySiteId[sId]) hotspotsBySiteId[sId] = [];
            hotspotsBySiteId[sId].push({
              id: hId,
              title,
              description,
              yaw,
              pitch,
            });
          }
        }
      }
    } catch (e) {
      console.warn('Gagal membaca tab hotspot:', e);
    }
  }

  // 3. Fetch Pengaturan_Website (Background Music & Config) if tab exists
  if (configTab) {
    try {
      const readConfigUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(configTab)}!A1:C20`;
      const cfgRes = await fetch(readConfigUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (cfgRes.ok) {
        const cfgJson = await cfgRes.json();
        const cfgRows: string[][] = cfgJson.values || [];
        let loadedTitle = '';
        let loadedUrl = '';
        for (let i = 1; i < cfgRows.length; i++) {
          const key = (cfgRows[i][0] || '').trim().toLowerCase();
          const val = (cfgRows[i][1] || '').trim();
          if (key === 'musik_latar_judul') loadedTitle = val;
          if (key === 'musik_latar_url') loadedUrl = val;
        }
        if (loadedTitle || loadedUrl) {
          Soundscape.setCustomTrack(loadedUrl, loadedTitle);
        }
      }
    } catch (e) {
      console.warn('Gagal membaca tab pengaturan website:', e);
    }
  }

  // Fallback map by ID for rich fallback objects (persona, trivia, keyfacts, etc.)
  const fallbackMap = new Map<string, HeritageSite>(fallbackSites.map((s) => [s.id, s]));

  const parsedSites: HeritageSite[] = [];

  for (let r = 1; r < rawRows.length; r++) {
    const row = rawRows[r];
    if (!row || row.length === 0 || !row[0]) continue;

    const id = row[headerIdx['id'] ?? 0]?.trim();
    if (!id) continue;

    const fallback = fallbackMap.get(id) || fallbackSites[0];

    const getVal = (colName: string, fallbackVal: string) => {
      const idx = headerIdx[colName];
      if (idx !== undefined && row[idx] !== undefined && row[idx] !== '') {
        return row[idx].toString().trim();
      }
      return fallbackVal;
    };

    const getNum = (colName: string, fallbackNum: number) => {
      const str = getVal(colName, String(fallbackNum));
      const n = parseFloat(str);
      return isNaN(n) ? fallbackNum : n;
    };

    const title = getVal('title', fallback?.title || id);
    const localName = getVal('localName', fallback?.localName || '');
    const kelurahan = getVal('kelurahan', fallback?.kelurahan || 'Kelurahan Boya') as KelurahanType;
    const establishedYear = getVal('establishedYear', fallback?.establishedYear || '1900');
    const period = getVal('period', fallback?.period || 'Masa Kolonial Hindia Belanda');
    const category = getVal('category', fallback?.category || 'Maritim & Pelabuhan') as CategoryType;
    const locationDescription = getVal('locationDescription', fallback?.locationDescription || 'Donggala');

    const lat = getNum('lat', fallback?.coordinates.lat || -0.6728);
    const lng = getNum('lng', fallback?.coordinates.lng || 119.7423);
    const mapX = getNum('mapX', fallback?.coordinates.mapX || 50);
    const mapY = getNum('mapY', fallback?.coordinates.mapY || 50);

    const thumbnail = getVal('thumbnail', fallback?.thumbnail || '');
    const bannerImage = getVal('bannerImage', fallback?.bannerImage || '');

    const pastPhotoUrl = getVal('pastPhoto_url', fallback?.pastPhoto.url || '');
    const pastPhotoCaption = getVal('pastPhoto_caption', fallback?.pastPhoto.caption || '');
    const pastPhotoSource = getVal('pastPhoto_source', fallback?.pastPhoto.source || '');
    const pastPhotoYear = getVal('pastPhoto_year', fallback?.pastPhoto.year || '');

    const currentPhotoUrl = getVal('currentPhoto_url', fallback?.currentPhoto.url || '');
    const currentPhotoCaption = getVal('currentPhoto_caption', fallback?.currentPhoto.caption || '');
    const conditionStatus = getVal('conditionStatus', fallback?.currentPhoto.conditionStatus || 'Perlu Revitalisasi') as any;

    const panoramaUrl = getVal('panorama360_url', fallback?.panorama360.url || '');
    const panoYaw = getNum('panorama360_yaw', fallback?.panorama360.initialYaw || 0);
    const panoPitch = getNum('panorama360_pitch', fallback?.panorama360.initialPitch || 0);

    const video360Url = getVal('video360_url', fallback?.video360?.url || fallback?.panorama360?.videoUrl || '');
    const video360Title = getVal('video360_title', fallback?.video360?.title || `Tur Video 360° ${title}`);
    const videoDocumentaryUrl = getVal('video_documentary_url', fallback?.videoDocumentaryUrl || '');
    const audioUrl = getVal('audio_url', fallback?.audioNarration?.audioUrl || '');

    const briefDescription = getVal('briefDescription', fallback?.briefDescription || '');
    const historicalSignificance = getVal('historicalSignificance', fallback?.historicalSignificance || '');
    const architecturalStyle = getVal('architecturalStyle', fallback?.architecturalStyle || '');
    const maritimeRelevance = getVal('maritimeRelevance', fallback?.maritimeRelevance || '');

    const audioTitle = getVal('audio_title', fallback?.audioNarration?.title || `Panduan Audio ${title}`);
    const audioSpeaker = getVal('audio_speaker', fallback?.audioNarration?.speakerName || 'Kurator Budaya Donggala');
    const audioDuration = getVal('audio_duration', fallback?.audioNarration?.durationText || '3:15 menit');
    const audioTranscript = getVal('audio_transcript', fallback?.audioNarration?.transcript || briefDescription);

    const triviaRaw = getVal('trivia_separated_by_pipe', '');
    const triviaList = triviaRaw ? triviaRaw.split('|').map((t) => t.trim()).filter(Boolean) : (fallback?.trivia || []);

    const loadedHotspots = hotspotsBySiteId[id] && hotspotsBySiteId[id].length > 0 
      ? hotspotsBySiteId[id] 
      : (fallback?.panorama360?.hotspots || []);

    parsedSites.push({
      id,
      title,
      localName,
      kelurahan,
      establishedYear,
      period,
      category,
      locationDescription,
      coordinates: {
        lat,
        lng,
        mapX,
        mapY,
      },
      thumbnail,
      bannerImage,
      pastPhoto: {
        url: pastPhotoUrl,
        caption: pastPhotoCaption,
        source: pastPhotoSource,
        year: pastPhotoYear,
      },
      currentPhoto: {
        url: currentPhotoUrl,
        caption: currentPhotoCaption,
        conditionStatus,
      },
      panorama360: {
        url: panoramaUrl,
        videoUrl: video360Url || undefined,
        type: 'sphere',
        initialYaw: panoYaw,
        initialPitch: panoPitch,
        hotspots: loadedHotspots,
      },
      video360: video360Url ? {
        url: video360Url,
        title: video360Title,
      } : fallback?.video360,
      videoDocumentaryUrl: videoDocumentaryUrl || fallback?.videoDocumentaryUrl,
      briefDescription,
      historicalSignificance,
      architecturalStyle,
      maritimeRelevance,
      audioNarration: {
        title: audioTitle,
        speakerName: audioSpeaker,
        durationText: audioDuration,
        transcript: audioTranscript,
        audioUrl: audioUrl || undefined,
      },
      talkingPersona: fallback?.talkingPersona || {
        name: 'Kurator Donggala',
        role: 'Pemandu Cagar Budaya',
        avatar: thumbnail,
        greeting: `Selamat datang di ${title}.`,
        systemPrompt: `Anda adalah pemandu sejarah untuk ${title}.`,
        sampleQuestions: ['Bagaimana sejarah bangunan ini?']
      },
      trivia: triviaList,
      keyFacts: fallback?.keyFacts || [
        { label: 'Tahun Dibangun', value: establishedYear },
        { label: 'Kelurahan', value: kelurahan },
        { label: 'Kategori', value: category }
      ]
    });
  }

  return parsedSites;
}
