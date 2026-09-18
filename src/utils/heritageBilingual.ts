import { HeritageSite } from '../types';

export interface QATopic {
  id: string;
  topicTitle: string;
  question: string;
  answer: string;
  tag: string;
}

export interface SiteBilingualContent {
  transcriptTitle: string;
  transcriptText: string;
  speaker: string;
  duration: string;
  topics: QATopic[];
}

// English transcript translations for the heritage sites of Donggala
const ENGLISH_TRANSCRIPTS: Record<string, string> = {
  'kpm-office-donggala':
    'Welcome to the KPM Trading Office of Donggala. Stand for a moment and listen to the waves of the Makassar Strait. In 1912, this hall was bustling with the scent of coffee, tobacco, and the rumble of steamships. From the clerk desks here, thousands of tons of copra and rattan were exported across global oceans. This edifice stands as a monumental witness to Donggala\'s maritime prominence before modern shifts altered commercial sea routes.',
  'dermaga-pelabuhan-donggala':
    'You are standing at Donggala Heritage Harbor, one of the oldest international transit seaports in Central Sulawesi. Established in the late 19th century, this pier welcomed traditional Bugis and Makassar Phinisi schooners, alongside European merchant vessels. It served as the central maritime gateway for export commodities from the Palu Valley to global markets.',
  'souraja-banawa':
    'Welcome to Banawa Souraja, the stately palace of the Banawa Kingdom aristocracy. Erected in 1892, this wooden architectural masterpiece synthesizes traditional Kaili stilt house engineering with regal Bugis-Makassar motifs. Crafted from ironwood (kayu ulin) without nails, it preserves ancient royal heirlooms, customary governance, and centuries of indigenous pride.',
  'klenteng-jin-nan-miao':
    'Welcome to Jin Nan Miao Temple, founded in 1875. As the oldest Chinese temple in Donggala, this sanctuary bears witness to maritime trade migrations from southern China. Chinese merchants settled around Donggala\'s port, trading spices, silk, and ceramics, and peacefully integrating with the local Kaili and Banawa communities.',
  'mercusuar-tanjung-batu':
    'Standing tall on the rocky promontory since 1888, Tanjung Batu Lighthouse has safely guided maritime navigators through the deep waters of the Makassar Strait. Built during the Dutch East Indies colonial era, its enduring beacon has ensured safe maritime passages for steamships, trade convoys, and fishermen for over a century.',
  'kantor-pos-telegraf-donggala':
    'This was the Colonial Post and Telegraph Office of Donggala, established in 1908. In its golden era, telegraph cables laid beneath the Makassar Strait connected Donggala directly to Batavia (Jakarta), Surabaya, and Singapore, making it the telecommunications and administrative nerve center of Sulawesi\'s western coast.',
  'rumah-residen-asisten':
    'Welcome to the Assistant Resident\'s Colonial Mansion, built in 1915 on high ground overlooking the bay. Exemplifying colonial Indische architecture with thick whitewashed masonry, wide shaded verandas, and high ceilings, it served as the administrative headquarters for the colonial governance of Donggala and Central Celebes.',
  'tugu-kemerdekaan-donggala':
    'The Donggala Independence Monument commemorates the courageous anti-colonial struggle of local patriots and youth militias in Banawa during 1945–1949. Standing proudly in the heart of town, it symbolizes Donggala\'s steadfast loyalty to the fledgling Republic of Indonesia.',
  'makam-raja-banawa':
    'Welcome to the Royal Necropolis of Banawa Kings in Gunung Bale. Resting beneath centuries-old shade trees, these carved stone and coral tombs hold the mortal remains of legendary Banawa rulers who governed the kingdom and fiercely resisted foreign subjugation while fostering regional maritime diplomacy.',
  'gedung-societeit-donggala':
    'Built in 1920, the Donggala Societeit Harmonie Hall served as a vibrant social, cultural, and gathering center during the colonial era. Here, maritime merchants, sailors, and civic leaders convened for municipal meetings, cultural performances, and evening gatherings near the harbor.',
  'masjid-raya-kebangkitan':
    'The Grand Historic Mosque of Donggala, established in 1905, represents the spiritual heart of the Muslim maritime community in Banawa. Combining Islamic architectural traditions with regional timber craftsmanship, it stands as a cornerstone of faith, moral education, and cultural harmony.',
  'sentra-tenun-donggala':
    'Welcome to the historic Donggala Silk Weaving Center in Kelurahan Boya. For centuries, master artisan weavers have hand-loomed world-renowned Donggala silk textiles (Buya Sabe) featuring intricate floral, checkered, and geometric motifs that have clothed royal dignitaries and cultural celebrations.',
  'rumah-panggung-kaili':
    'This traditional Kaili Banua Stilt House showcases authentic indigenous earthquake-resilient vernacular architecture. Raised on sturdy timber posts with natural thatch ventilation, it reflects centuries of harmonious living between the Kaili people and their coastal mountain environment.',
  'benteng-tanjung-karang':
    'Perched above turquoise coastal waters, Tanjung Karang Fort served as a coastal defense and naval lookout point during the pre-colonial and kingdom eras, safeguarding the shipping channel into Palu Bay from foreign armadas and pirate incursions.',
  'gudang-rempah-voc':
    'Constructed in the early 20th century atop earlier 18th-century foundations, this massive spice and copra storehouse stored tons of nutmeg, cloves, rattan, and dried coconut before loading onto steamships headed for international commercial hubs.'
};

/**
 * Returns bilingual transcript information for a given site
 */
export function getSiteTranscript(
  site: HeritageSite, 
  lang: 'id' | 'en'
): { title: string; speaker: string; transcript: string; duration: string } {
  if (lang === 'en') {
    const fallbackEn = ENGLISH_TRANSCRIPTS[site.id] || 
      `Welcome to ${site.title}. Established in ${site.establishedYear}, this historical site in ${site.kelurahan} stands as a testament to Donggala's rich maritime, architectural, and cultural heritage in Central Sulawesi.`;
    return {
      title: `Audio Transcript: ${site.title}`,
      speaker: 'Heritage Audio Guide (English)',
      transcript: fallbackEn,
      duration: site.audioNarration.durationText || '2 Min'
    };
  }

  return {
    title: site.audioNarration.title || `Transkrip Audio: ${site.title}`,
    speaker: site.audioNarration.speakerName || 'Pemandu Sejarah Donggala',
    transcript: site.audioNarration.transcript,
    duration: site.audioNarration.durationText || '2 Menit'
  };
}

/**
 * Returns structured curated Q&A topics for a site.
 * This directly satisfies the requirement:
 * "pilih topik untuk mendengarkan informasi seputar situs sejarah, agar pengguna tidak membuat pertanyaan pribadi yang tidak relevan".
 */
export function getSiteQATopics(site: HeritageSite, lang: 'id' | 'en'): QATopic[] {
  if (lang === 'en') {
    return [
      {
        id: 'topic-history',
        topicTitle: 'Origins & Founding History',
        question: `When was ${site.title} founded and what was its historical origin?`,
        answer: `${site.title} was established in ${site.establishedYear} during the ${site.period}. ${site.historicalSignificance} As a core component of Donggala's cultural landscape in ${site.kelurahan}, this site played a vital role in shaping the civil, economic, and social fabric of the region.`,
        tag: 'History'
      },
      {
        id: 'topic-architecture',
        topicTitle: 'Architecture & Design Style',
        question: `What are the unique architectural characteristics of ${site.title}?`,
        answer: `The architectural style of this site is characterized as: ${site.architecturalStyle} Built with high adaptability to tropical coastal weather and seismic factors, it reflects profound craftsmanship and cultural adaptation. Today, its physical condition is recorded as "${site.currentPhoto.conditionStatus}".`,
        tag: 'Architecture'
      },
      {
        id: 'topic-maritime',
        topicTitle: 'Role in Maritime Trade Routes',
        question: `How did this site connect to the Makassar Strait maritime network?`,
        answer: `${site.maritimeRelevance} Located strategically along the Makassar Strait—one of the world's most historic maritime corridors—Donggala operated as an international transit harbor welcoming ships from across the archipelago, Europe, and Asia.`,
        tag: 'Maritime'
      },
      {
        id: 'topic-trivia',
        topicTitle: 'Unique Facts & Cultural Trivia',
        question: `What are the most fascinating facts and trivia about ${site.title}?`,
        answer: site.trivia && site.trivia.length > 0 
          ? `Key historical facts include: ${site.trivia.join(' ')} Additional archival records indicate that it remains an officially documented cultural heritage landmark.`
          : `${site.title} is an officially protected heritage landmark in Central Sulawesi, serving as an educational asset and beacon of local identity.`,
        tag: 'Trivia'
      },
      {
        id: 'topic-conservation',
        topicTitle: 'Preservation Status & Value',
        question: `What is the current preservation status and community value of this site?`,
        answer: `Currently categorized as "${site.currentPhoto.conditionStatus}", ${site.title} is recognized under cultural preservation documentation for preservation and educational tourism. Revitalization initiatives aim to ensure its historical integrity inspires future generations.`,
        tag: 'Conservation'
      }
    ];
  }

  // Bahasa Indonesia
  return [
    {
      id: 'topic-history',
      topicTitle: 'Asal-Usul & Sejarah Pendirian',
      question: `Kapan ${site.title} didirikan dan bagaimana latar belakang sejarah awalnya?`,
      answer: `${site.title} didirikan pada tahun ${site.establishedYear} pada ${site.period}. ${site.historicalSignificance} Keberadaannya di ${site.kelurahan} menjadi pilar penting yang menandai perkembangan sejarah dan peradaban Kota Tua Donggala.`,
      tag: 'Sejarah'
    },
    {
      id: 'topic-architecture',
      topicTitle: 'Karakteristik & Gaya Arsitektur',
      question: `Apa gaya arsitektur dan keunikan konstruksi dari ${site.title}?`,
      answer: `Gaya dan struktur fisik bangunan ini bercirikan: ${site.architecturalStyle} Konstruksinya dirancang adaptif terhadap iklim pesisir tropis serta ketahanan alamiah. Saat ini, status fisik bangunan tercatat dalam kondisi "${site.currentPhoto.conditionStatus}".`,
      tag: 'Arsitektur'
    },
    {
      id: 'topic-maritime',
      topicTitle: 'Peran dalam Jalur Dagang & Bahari',
      question: `Bagaimana hubungan situs ini dengan kejayaan maritim Selat Makassar?`,
      answer: `${site.maritimeRelevance} Berada di bibir Selat Makassar, situs ini menjadi saksi denyut nadi ekonomi perdagangan antarpulau dan internasional yang membawa komoditas rempah, kopra, dan sutra ke panggung dunia.`,
      tag: 'Bahari'
    },
    {
      id: 'topic-trivia',
      topicTitle: 'Fakta Unik & Kisah Bersejarah',
      question: `Apa saja fakta unik dan cerita menarik yang tersimpan di balik situs ini?`,
      answer: site.trivia && site.trivia.length > 0
        ? `Beberapa fakta sejarah terkemuka: ${site.trivia.join(' ')}`
        : `${site.title} menyimpan nilai historis tinggi yang memperkaya khazanah kebudayaan Nusantara di tanah Banawa.`,
      tag: 'Fakta Unik'
    },
    {
      id: 'topic-conservation',
      topicTitle: 'Status Pelestarian & Masa Depan',
      question: `Bagaimana status pelestarian fisik dan pentingnya menjaga situs ini saat ini?`,
      answer: `Dengan status fisik "${site.currentPhoto.conditionStatus}", cagar budaya ini memerlukan perhatian kolektif pelestarian cagar budaya. Digitalisasi dan pemugaran berkelanjutan bertujuan menjaga agar jejak sejarah keemasan Donggala tetap hidup bagi generasi mendatang.`,
      tag: 'Pelestarian'
    }
  ];
}
