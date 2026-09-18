import { HeritageSite, HotspotPOI } from '../types';

export interface RawCulturalObjectInput {
  ID?: string;
  Nama_Objek: string;
  Kategori: string;
  Deskripsi: string;
  Latitude: number | string;
  Longitude: number | string;
  URL_Gambar: string;
  URL_Gambar_360?: string;
  URL_Video?: string;
  Gambar_Lama?: string;
  Gambar_Baru?: string;
}

// Convert user raw input to full HeritageSite
export function rawInputToHeritageSite(raw: RawCulturalObjectInput): HeritageSite {
  const cleanId = (raw.ID && raw.ID.trim())
    ? raw.ID.trim()
    : `BUDAYA-${Date.now().toString().slice(-4)}`;
  
  const title = (raw.Nama_Objek || 'Objek Budaya Donggala').trim();
  const lat = typeof raw.Latitude === 'number' ? raw.Latitude : parseFloat(String(raw.Latitude || '-0.6728'));
  const lng = typeof raw.Longitude === 'number' ? raw.Longitude : parseFloat(String(raw.Longitude || '119.7423'));
  
  const desc = (raw.Deskripsi || '').trim() || `Objek cagar budaya ${title} di Kabupaten Donggala, Sulawesi Tengah.`;
  const mainImage = (raw.URL_Gambar || '').trim() || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80';
  const pano360 = (raw.URL_Gambar_360 || '').trim() || mainImage;
  const videoUrl = (raw.URL_Video || '').trim();
  const pastImg = (raw.Gambar_Lama || '').trim() || mainImage;
  const currentImg = (raw.Gambar_Baru || '').trim() || mainImage;

  // Approximate relative percentage on local SVG map
  const mapX = Math.min(95, Math.max(5, Math.round(((lng - 119.65) / (119.78 - 119.65)) * 100)));
  const mapY = Math.min(95, Math.max(5, Math.round(((-0.64 - lat) / (-0.64 - (-0.73))) * 100)));

  return {
    id: cleanId,
    title: title,
    localName: title,
    kelurahan: 'Kawasan Pesisir Banawa',
    establishedYear: 'Warisan Budaya',
    period: 'Sejarah & Tradisi Donggala',
    category: (raw.Kategori || 'Situs').trim(),
    locationDescription: `Kabupaten Donggala (${lat.toFixed(5)}, ${lng.toFixed(5)})`,
    coordinates: {
      lat: isNaN(lat) ? -0.6728 : lat,
      lng: isNaN(lng) ? 119.7423 : lng,
      mapX: isNaN(mapX) ? 50 : mapX,
      mapY: isNaN(mapY) ? 50 : mapY,
    },
    thumbnail: mainImage,
    bannerImage: mainImage,
    pastPhoto: {
      url: pastImg,
      caption: `Dokumentasi arsip masa lampau: ${title}`,
      source: 'Arsip Budaya & Komunitas Donggala',
      year: 'Era Klasik'
    },
    currentPhoto: {
      url: currentImg,
      caption: `Dokumentasi kondisi terkini: ${title}`,
      conditionStatus: 'Terawat'
    },
    panorama360: {
      url: pano360,
      videoUrl: videoUrl || undefined,
      type: 'sphere',
      initialYaw: 0,
      initialPitch: 0,
      hotspots: []
    },
    video360: videoUrl ? {
      url: videoUrl,
      title: `Dokumentasi Video ${title}`,
      provider: videoUrl.includes('youtu') ? 'youtube' : 'mp4'
    } : undefined,
    videoDocumentaryUrl: videoUrl || undefined,
    briefDescription: desc.length > 180 ? desc.slice(0, 180) + '...' : desc,
    historicalSignificance: desc,
    architecturalStyle: `Karakteristik ${raw.Kategori || 'Warisan Budaya'} Tradisional / Pesisir`,
    maritimeRelevance: 'Menjadi bagian penting dari identitas sejarah maritim dan budaya masyarakat Donggala di pesisir Selat Makassar.',
    audioNarration: {
      title: `Kisah & Memori ${title}`,
      speakerName: 'Pemandu Budaya Donggala',
      durationText: '2:15',
      transcript: desc
    },
    talkingPersona: {
      name: title,
      role: `Warisan Budaya ${title}`,
      avatar: mainImage,
      greeting: `Tabe! Saya adalah representasi dari ${title}. Senang menyambut kunjungan Anda di Kota Tua Donggala.`,
      systemPrompt: `Anda adalah persona interaktif untuk "${title}" di Kabupaten Donggala. Berbicaralah dengan ramah, hangat, dalam persona orang pertama ("saya").`,
      sampleQuestions: [
        `Ceritakan sejarah dan keunikan ${title}`,
        `Di mana lokasi tepatnya dan bagaimana cara berkunjung?`,
        `Apa arti penting tempat ini bagi masyarakat Donggala?`
      ]
    },
    trivia: [
      `Kategori warisan budaya: ${raw.Kategori || 'Situs'}`,
      `Lokasi koordinat: ${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      desc.slice(0, 90) + '...'
    ],
    keyFacts: [
      { label: 'Kategori', value: raw.Kategori || 'Situs' },
      { label: 'Koordinat', value: `${lat.toFixed(5)}, ${lng.toFixed(5)}` },
      { label: 'Status Data', value: 'Terverifikasi Digital' }
    ]
  };
}

// Convert HeritageSite back to raw input for editing or export
export function heritageSiteToRawInput(site: HeritageSite): RawCulturalObjectInput {
  return {
    ID: site.id,
    Nama_Objek: site.title,
    Kategori: site.category,
    Deskripsi: site.historicalSignificance || site.briefDescription || '',
    Latitude: site.coordinates.lat,
    Longitude: site.coordinates.lng,
    URL_Gambar: site.thumbnail,
    URL_Gambar_360: site.panorama360?.url || '',
    URL_Video: site.videoDocumentaryUrl || site.video360?.url || '',
    Gambar_Lama: site.pastPhoto?.url || '',
    Gambar_Baru: site.currentPhoto?.url || ''
  };
}

// Robust CSV Parser supporting multiline quoted strings and escaped double quotes
export function parseCulturalCSV(csvText: string): RawCulturalObjectInput[] {
  if (!csvText || !csvText.trim()) return [];

  // Parse lines considering quotes
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentField.trim());
      currentField = '';
      if (currentRow.some(col => col.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
    } else {
      currentField += char;
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(col => col.length > 0)) {
      rows.push(currentRow);
    }
  }

  if (rows.length === 0) return [];

  // Determine headers or map default order
  // Header expected: ID,Nama_Objek,Kategori,Deskripsi,Latitude,Longitude,URL_Gambar,URL_Gambar_360,URL_Video,Gambar_Lama,Gambar_Baru
  const firstRow = rows[0].map(h => h.toLowerCase().replace(/[\s_-]/g, ''));
  const hasHeader = firstRow.some(h => 
    h.includes('nama') || h.includes('objek') || h.includes('kategori') || h.includes('deskripsi') || h.includes('latitude')
  );

  const dataRows = hasHeader ? rows.slice(1) : rows;

  return dataRows.map((row, idx) => {
    // Map index by column name if header exists, otherwise fallback to standard positional index
    const getVal = (colNames: string[], defaultIdx: number): string => {
      if (hasHeader) {
        for (const name of colNames) {
          const headerIdx = firstRow.findIndex(h => h.includes(name));
          if (headerIdx !== -1 && row[headerIdx] !== undefined) {
            return row[headerIdx];
          }
        }
      }
      return row[defaultIdx] !== undefined ? row[defaultIdx] : '';
    };

    const idVal = getVal(['id'], 0);
    const namaObjek = getVal(['nama', 'objek', 'title', 'judul'], 1);
    const kategori = getVal(['kategori', 'category', 'jenis'], 2) || 'Situs';
    const deskripsi = getVal(['deskripsi', 'description', 'keterangan'], 3);
    const lat = getVal(['latitude', 'lat'], 4);
    const lng = getVal(['longitude', 'lng', 'long'], 5);
    const urlGambar = getVal(['urlgambar', 'gambar', 'foto', 'thumbnail'], 6);
    const url360 = getVal(['urlgambar360', 'gambar360', '360', 'panorama'], 7);
    const urlVideo = getVal(['urlvideo', 'video', 'youtube'], 8);
    const gbrLama = getVal(['gambarlama', 'lama', 'past'], 9);
    const gbrBaru = getVal(['gambarbaru', 'baru', 'current'], 10);

    const generatedId = idVal && idVal.trim() 
      ? idVal.trim() 
      : (namaObjek ? `BUDAYA-${namaObjek.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 16)}-${idx + 1}` : `BUDAYA-${idx + 1}`);

    return {
      ID: generatedId,
      Nama_Objek: namaObjek || `Objek Budaya ${idx + 1}`,
      Kategori: kategori,
      Deskripsi: deskripsi,
      Latitude: lat || '-0.6728',
      Longitude: lng || '119.7423',
      URL_Gambar: urlGambar,
      URL_Gambar_360: url360,
      URL_Video: urlVideo,
      Gambar_Lama: gbrLama,
      Gambar_Baru: gbrBaru
    };
  }).filter(item => item.Nama_Objek && item.Nama_Objek.trim().length > 0);
}

// Escape field for CSV
function escapeCSVField(val: any): string {
  const str = String(val ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Export array of HeritageSite to exact requested CSV format
export function exportSitesToCSV(sites: HeritageSite[]): string {
  const header = 'ID,Nama_Objek,Kategori,Deskripsi,Latitude,Longitude,URL_Gambar,URL_Gambar_360,URL_Video,Gambar_Lama,Gambar_Baru';
  const lines = sites.map(site => {
    const raw = heritageSiteToRawInput(site);
    return [
      escapeCSVField(raw.ID),
      escapeCSVField(raw.Nama_Objek),
      escapeCSVField(raw.Kategori),
      escapeCSVField(raw.Deskripsi),
      escapeCSVField(raw.Latitude),
      escapeCSVField(raw.Longitude),
      escapeCSVField(raw.URL_Gambar),
      escapeCSVField(raw.URL_Gambar_360),
      escapeCSVField(raw.URL_Video),
      escapeCSVField(raw.Gambar_Lama),
      escapeCSVField(raw.Gambar_Baru)
    ].join(',');
  });

  return [header, ...lines].join('\n');
}

// Generate automatic shareable URL for a site
export function generateSiteShareLink(siteId: string, customOrigin?: string): string {
  const origin = customOrigin || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${origin}/?tab=map&site=${encodeURIComponent(siteId)}`;
}

// Generate direct self-contained portable link encoded with full site data
export function generatePortableSiteLink(site: HeritageSite, customOrigin?: string): string {
  const origin = customOrigin || (typeof window !== 'undefined' ? window.location.origin : '');
  const raw = heritageSiteToRawInput(site);
  try {
    const json = JSON.stringify(raw);
    const b64 = btoa(unescape(encodeURIComponent(json)));
    return `${origin}/?tab=map&siteData=${b64}`;
  } catch (e) {
    return generateSiteShareLink(site.id, origin);
  }
}

// Parse portable link data from URL if present
export function parsePortableSiteFromURL(): HeritageSite | null {
  if (typeof window === 'undefined') return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const siteData = params.get('siteData');
    if (siteData) {
      const json = decodeURIComponent(escape(atob(siteData)));
      const raw = JSON.parse(json);
      if (raw && (raw.Nama_Objek || raw.ID)) {
        return rawInputToHeritageSite(raw);
      }
    }
  } catch (e) {
    console.warn('Failed to parse siteData from URL:', e);
  }
  return null;
}
