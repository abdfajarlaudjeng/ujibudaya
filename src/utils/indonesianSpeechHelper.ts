/**
 * Indonesian Speech & Phonetic Dialect Helper
 * Menyesuaikan pengejaan, singkatan, angka, dan dialek bahasa Indonesia
 * agar dilafalkan secara alami, fasih, dan tepat oleh Audio Narator / TTS.
 */

// Konversi angka ke kata dalam Bahasa Indonesia
export function angkaKeKata(num: number): string {
  const satuan = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh', 'sebelas'];
  const n = Math.floor(Math.abs(num));

  if (n === 0) return 'nol';
  if (n < 12) return satuan[n];
  if (n < 20) return angkaKeKata(n - 10) + ' belas';
  if (n < 100) return angkaKeKata(Math.floor(n / 10)) + ' puluh' + (n % 10 !== 0 ? ' ' + satuan[n % 10] : '');
  if (n < 200) return 'seratus' + (n % 100 !== 0 ? ' ' + angkaKeKata(n % 100) : '');
  if (n < 1000) return angkaKeKata(Math.floor(n / 100)) + ' ratus' + (n % 100 !== 0 ? ' ' + angkaKeKata(n % 100) : '');
  if (n < 2000) return 'seribu' + (n % 1000 !== 0 ? ' ' + angkaKeKata(n % 1000) : '');
  if (n < 1000000) return angkaKeKata(Math.floor(n / 1000)) + ' ribu' + (n % 1000 !== 0 ? ' ' + angkaKeKata(n % 1000) : '');
  if (n < 1000000000) return angkaKeKata(Math.floor(n / 1000000)) + ' juta' + (n % 1000000 !== 0 ? ' ' + angkaKeKata(n % 1000000) : '');
  return n.toString();
}

/**
 * Normalisasi teks Bahasa Indonesia khusus untuk narasi audio:
 * - Menyesuaikan singkatan umum & gelar
 * - Mengubah penanggalan & tahun agar dibaca utuh (misal 1912 -> seribu sembilan ratus dua belas)
 * - Mengubah abad Romawi/angka (abad ke-19 -> abad kesembilan belas)
 * - Menyesuaikan istilah maritim, kolonial, dan budaya Kaili/Banawa Donggala
 * - Menghilangkan tanda baca markdown yang mengganggu intonasi
 */
export function prepareIndonesianSpeechText(text: string): string {
  if (!text) return '';

  let cleaned = text;

  // 1. Bersihkan formatting markdown & karakter khusus
  cleaned = cleaned
    .replace(/[*_#`~\[\]]/g, ' ')
    .replace(/\(([^)]+)\)/g, ', $1,') // ganti tanda kurung dengan koma agar ada jeda nafas alami
    .replace(/\s+/g, ' ');

  // 2. Abad Romawi & Angka
  const abadMap: Record<string, string> = {
    'abad ke-xv': 'abad kelima belas',
    'abad ke-xvi': 'abad keenam belas',
    'abad ke-xvii': 'abad ketujuh belas',
    'abad ke-xviii': 'abad kedelapan belas',
    'abad ke-xix': 'abad kesembilan belas',
    'abad ke-xx': 'abad kedua puluh',
    'abad ke-xxi': 'abad kedua puluh satu',
    'abad xv': 'abad kelima belas',
    'abad xvi': 'abad keenam belas',
    'abad xvii': 'abad ketujuh belas',
    'abad xviii': 'abad kedelapan belas',
    'abad xix': 'abad kesembilan belas',
    'abad xx': 'abad kedua puluh',
    'abad xxi': 'abad kedua puluh satu',
  };

  for (const [key, val] of Object.entries(abadMap)) {
    const reg = new RegExp(`\\b${key}\\b`, 'gi');
    cleaned = cleaned.replace(reg, val);
  }

  // Abad ke-N (angka)
  cleaned = cleaned.replace(/\babad ke-(\d+)\b/gi, (_, n) => {
    const num = parseInt(n, 10);
    if (num === 1) return 'abad pertama';
    return `abad ke${angkaKeKata(num)}`;
  });

  // Dekade (contoh: 1920-an -> seribu sembilan ratus dua puluhan)
  cleaned = cleaned.replace(/\b(1\d{3}|20\d{2})-an\b/g, (_, year) => {
    return `${angkaKeKata(parseInt(year, 10))}an`;
  });

  // Rentang tahun (contoh: 1945–1949 -> 1945 sampai 1949)
  cleaned = cleaned.replace(/\b(1\d{3}|20\d{2})\s*[-–—]\s*(1\d{3}|20\d{2})\b/g, (_, y1, y2) => {
    return `${angkaKeKata(parseInt(y1, 10))} sampai ${angkaKeKata(parseInt(y2, 10))}`;
  });

  // Satuan & Simbol
  cleaned = cleaned
    .replace(/360°/g, 'tiga ratus enam puluh derajat')
    .replace(/°/g, ' derajat')
    .replace(/km²|km2/gi, 'kilometer persegi')
    .replace(/m²|m2/gi, 'meter persegi')
    .replace(/%/g, ' persen');

  // Angka + Satuan (misal: 30 cm -> tiga puluh sentimeter)
  cleaned = cleaned
    .replace(/\b(\d+)\s*cm\b/gi, (_, n) => `${angkaKeKata(parseInt(n, 10))} sentimeter`)
    .replace(/\b(\d+)\s*km\b/gi, (_, n) => `${angkaKeKata(parseInt(n, 10))} kilometer`)
    .replace(/\b(\d+)\s*m\b/gi, (_, n) => `${angkaKeKata(parseInt(n, 10))} meter`);

  // Tahun 4-digit (1500 - 2099)
  cleaned = cleaned.replace(/\b(1[5-9]\d{2}|20\d{2})\b/g, (m) => {
    return angkaKeKata(parseInt(m, 10));
  });

  // Singkatan administrasi & alamat
  cleaned = cleaned
    .replace(/\bJl\.\s*/gi, 'Jalan ')
    .replace(/\bNo\.\s*/gi, 'Nomor ')
    .replace(/\bThn\.\s*/gi, 'Tahun ')
    .replace(/\bTh\.\s*/gi, 'Tahun ')
    .replace(/\bDs\.\s*/gi, 'Desa ')
    .replace(/\bKel\.\s*/gi, 'Kelurahan ')
    .replace(/\bKec\.\s*/gi, 'Kecamatan ')
    .replace(/\bKab\.\s*/gi, 'Kabupaten ')
    .replace(/\bProv\.\s*/gi, 'Provinsi ')
    .replace(/\bS\.Sos\b/gi, 'Sarjana Sosial');

  // Singkatan sejarah, lembaga, dan maritim Donggala
  // Disesuaikan agar pelafalan fonetis pas di telinga orang Indonesia
  cleaned = cleaned
    .replace(/\bKPM\b/g, 'Ka-Pe-Em')
    .replace(/\bVOC\b/g, 'Ve-O-Ce')
    .replace(/\bBPK\b/g, 'Be-Pe-Ka')
    .replace(/\bFPK\b/g, 'Ef-Pe-Ka')
    .replace(/\bM\b(?=\s*(?:asehi|\.))/g, 'Masehi')
    .replace(/\bSM\b/g, 'Sebelum Masehi');

  // Penyesuaian fonetik istilah serapan kolonial / kearifan lokal
  cleaned = cleaned
    .replace(/\bSocieteit Harmonie\b/gi, 'Sosietet Harmoni')
    .replace(/\bSocieteit\b/gi, 'Sosietet')
    .replace(/\bHavenmeester\b/gi, 'Havenmester')
    .replace(/\bControleur\b/gi, 'Kontrolir')
    .replace(/\bBovenlicht\b/gi, 'Bofenlikht')
    .replace(/\bJin Nan Miao\b/gi, 'Jin Nan Miao')
    .replace(/\bPhinisi\b/gi, 'Pinisi');

  // Angka tersisa (1-3 digit) yang berdiri sendiri
  cleaned = cleaned.replace(/\b(\d+)\b/g, (m) => {
    const num = parseInt(m, 10);
    if (!isNaN(num) && num < 1000) {
      return angkaKeKata(num);
    }
    return m;
  });

  // Pastikan sapaan khas Sulawesi 'Tabe!' diberi jeda intonasi hangat
  cleaned = cleaned.replace(/\bTabe!\s*/gi, 'Tabe! ');

  // Rapikan spasi dan tanda koma berulang
  cleaned = cleaned
    .replace(/\s+,/g, ',')
    .replace(/,\s*,+/g, ',')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned;
}

/**
 * Konfigurasi profil suara Gemini TTS & Fallback
 */
export const LEDA_VOICE_CONFIG = {
  voiceName: 'Leda' as const,
  languageCode: 'id-ID',
  description: 'Suara Wanita Muda, Lembut (Leda) dengan Tone Suara Bersemangat & Penuh Energi',
  tonePrompt: 'Bicaralah dengan suara wanita muda Indonesia bernama Leda. Gunakan intonasi yang lembut, ramah, artikulasi jernih, serta bertone bersemangat dan penuh energi (cheerful, energetic, warm storytelling). Lafalkan kalimat berikut secara alami dengan dialek bahasa Indonesia yang baik, fasih, dan artikulatif:',
  sampleRate: 24000,
  webSpeechPitch: 1.15, // Nada wanita muda, lembut
  webSpeechRate: 1.05,  // Penuh energi & bersemangat
};
