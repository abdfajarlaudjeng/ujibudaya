// Virtual Tour Audio Guides & Local Narration in Indonesian & Kaili Language

export interface VirtualGuideNarration {
  siteId: string;
  idTitle: string;
  idGuide: string;
  idTranscript: string;
  kailiTitle: string;
  kailiGuide: string;
  kailiTranscript: string;
}

export const VIRTUAL_GUIDE_DATA: Record<string, VirtualGuideNarration> = {
  'kpm-office-donggala': {
    siteId: 'kpm-office-donggala',
    idTitle: 'Kantor Dagang KPM Donggala (1912)',
    idGuide: 'Pemandu Sejarah Banawa (Ian Dwi Putera)',
    idTranscript: 'Selamat datang di Kantor Dagang KPM Donggala. Berdirilah sejenak dan dengarkan deburan ombak Selat Makassar. Pada tahun 1912, ruangan ini dipenuhi aroma kopi, tembakau, dan deru mesin kapal uap. Dari meja klerk di sudut ini, jutaan ton kopra dan rotan diekspor melintasi samudra. Gedung ini adalah saksi bisu betapa gemilangnya Donggala sebelum gempa dan perubahan zaman menggeser pusat perdagangan ke Teluk Palu.',
    kailiTitle: 'Banua Dagang KPM Donggala (1912)',
    kailiGuide: 'Toris Ntotua Banawa (Tetua Adat Kaili)',
    kailiTranscript: 'Tabe toris nte roa purapura! Nariu ri Banua Dagang KPM Donggala. Ri taun 1912, ruanji he\'i naponoi aromana kopi, tabako, ante suarana kapal mualili Selat Makassar. Nggari panggagana he\'i, jutan ton kopra nte uwe ni-dagangaka ka tana nte tana. Banua he\'i nosaksi kagaana Donggala ri tempona ntotua mbana.'
  },
  'mercusuar-tanjung-batu': {
    siteId: 'mercusuar-tanjung-batu',
    idTitle: 'Mercusuar Tanjung Batu (1898)',
    idGuide: 'Penjaga Menara Suar & Pemerhati Maritim',
    idTranscript: 'Anda kini berada di puncak karang Tanjung Batu, memandang lautan lepas Selat Makassar. Mercusuar ini dibangun tahun 1898 oleh pemerintah Hindia Belanda dengan konstruksi baja kokoh. Lampu lentera di puncaknya telah memandu ribuan kapal niaga, perahu pinisi, dan pelaut dunia dari bahaya karang terjal selama lebih dari satu abad.',
    kailiTitle: 'Vuurtoren Tanjung Batu (1898)',
    kailiGuide: 'Panggaga Menara Suar Kaap Banawa',
    kailiTranscript: 'Tabe! Kita ri he\'i nandoo ri bava ngguntu Tanjung Batu, nggita Talaga Makassar. Menara suar he\'i nitanggu ri taun 1898 ante baja kabaa. Palita ri lolo menara he\'i nompaitaka rala ka sakaya nte pinisi nggari purapura lipu doko mamongko batu karang.'
  },
  'pelabuhan-tua-donggala': {
    siteId: 'pelabuhan-tua-donggala',
    idTitle: 'Pelabuhan Tua Donggala & Dermaga Kayu Ulin (1902)',
    idGuide: 'Syahbandar Sejarah & Tetua Nelayan Boya',
    idTranscript: 'Selamat datang di Pelabuhan Tua Donggala, jantung nadi maritim Sulawesi Tengah masa lampau. Di atas dermaga kayu ulin ini, para pelaut Bugis, Mandar, Arab, dan Tionghoa bersandar menurunkan rempah dan sutra. Pada masa keemasannya, pelabuhan ini menghubungkan jalur pelayaran internasional dari Singapura, Batavia, hingga Ternate.',
    kailiTitle: 'Labuang Ntotua Donggala (1902)',
    kailiGuide: 'Tetua Nelayan Kelurahan Boya',
    kailiTranscript: 'Tabe nte salam! Kita nandoo ri Labuang Ntotua Donggala, puse nggari panggagana talagang ri Banawa. Ri lolo jambatan kaju ulin he\'i, to Bugis, Mandar, Arab nte Cino nosandara sakayana manggeni rempah-rempah nte buya sabe. Labuang he\'i nosambung ka Singapura nte Batavia.'
  },
  'souraja-banua-oge': {
    siteId: 'souraja-banua-oge',
    idTitle: 'Rumah Adat Souraja / Banua Oge (1892)',
    idGuide: 'Pemangku Lembaga Adat Kaili Banawa',
    idTranscript: 'Tabe! Anda sedang berada di Souraja atau Banua Oge, istana kayu megah milik Raja Banawa yang didirikan pada tahun 1892 oleh Yodjokodi. Struktur panggungnya dibangun dengan kayu ulin dan bayam pilihan tanpa paku besi, memadukan arsitektur tradisional Kaili dengan sentuhan Bugis dan Eropa. Di sinilah keputusan penting tentang tanah Banawa dimusyawarahkan.',
    kailiTitle: 'Banua Oge Souraja Banawa (1892)',
    kailiGuide: 'Pemangku Adat Kaili Donggala',
    kailiTranscript: 'Tabe maroso! Kita nandoo ri Souraja bara Banua Oge, banua nggari Datu Banawa nitanggu ri taun 1892 nte Raja Yodjokodi. Kaju ulin nte bayam nitanggu daa pake paku bosi, nompatengka arsitektur Kaili nte Bugis. Ri he\'i purapura habar madosa ni-musyawarahaka.'
  },
  'rumah-panggung-kaili-boya': {
    siteId: 'rumah-panggung-kaili-boya',
    idTitle: 'Rumah Panggung Tradisional Kaili Boya (1925)',
    idGuide: 'Pewaris Arsitektur Vernakular Kaili',
    idTranscript: 'Selamat datang di pemukiman Rumah Panggung Kaili di Kelurahan Boya. Arsitektur rumah panggung kayu ini dirancang adaptif terhadap iklim tropis pesisir dan ramah gempa dengan sistem sambungan pasak kayu tradisional (tatamba). Teras terbukanya menjadi ruang interaksi sosial warga sejak puluhan tahun silam.',
    kailiTitle: 'Banua Panggung Kaili Boya (1925)',
    kailiGuide: 'Panggaga Banua Kaili Boya',
    kailiTranscript: 'Tabe! Nariu ri banua panggung Kaili ri Boya. Banua kaju he\'i nitanggu adaptif ka bayo talaga nte nambolosi lindu ante pasak kaju tradisional. Gandaria ri aona majadi panggagana mosangkani purapura to Boya.'
  },
  'gudang-kopra-borsumij': {
    siteId: 'gudang-kopra-borsumij',
    idTitle: 'Gudang Kopra Borsumij (1915)',
    idGuide: 'Pemerhati Sejarah Niaga Selat Makassar',
    idTranscript: 'Gudang bata masif ini milik Borneo Sumatra Maatschappij (Borsumij), dibangun tahun 1915 untuk menampung ribuan karung kopra berkualitas tinggi dari seluruh perkebunan kelapa di pesisir barat Sulawesi sebelum dimuat ke kapal samudra.',
    kailiTitle: 'Gudang Kopra Borsumij (1915)',
    kailiGuide: 'Toris Niaga Banawa',
    kailiTranscript: 'Tabe! Gudang bosi nte bata he\'i anu Borneo Sumatra Maatschappij nitanggu taun 1915, panggagana manampung ribuan karung kopra nggari kokona kaluku ri tana Kaili sakoni ninao ka kapal samudra.'
  },
  'rumah-pejabat-kolonial-controleur': {
    siteId: 'rumah-pejabat-kolonial-controleur',
    idTitle: 'Rumah Dinas Pejabat Kolonial Controleur (1908)',
    idGuide: 'Arsiparis Sejarah Pemerintahan Banawa',
    idTranscript: 'Gedung kediaman Asisten Residen atau Controleur Hindia Belanda ini bertengger di lereng bukit Gunung Bale, memberikan pemandangan penuh ke Teluk Donggala dan Selat Makassar untuk memantau lalu lintas maritim pada masa kolonial.',
    kailiTitle: 'Banua Controleur Kolonial (1908)',
    kailiGuide: 'Panggaga Pustaka Banawa',
    kailiTranscript: 'Tabe! Banua he\'i panggagana pejabat Controleur Welanda ri bava bulu Gunung Bale, manggita talaga nte labuang Donggala nomantau kapal niaga ri zaman kolonial.'
  },
  'masjid-tua-donggala': {
    siteId: 'masjid-tua-donggala',
    idTitle: 'Masjid Tua Donggala (1900)',
    idGuide: 'Imam & Takmir Masjid Tua',
    idTranscript: 'Masjid bersejarah ini menjadi pusat dakwah Islam di pesisir Banawa sejak awal abad ke-20. Didirikan dengan arsitektur atap tumpang bertingkat khas Nusantara dan mimbar kayu jati berukir kaligrafi yang sarat makna.',
    kailiTitle: 'Masigi Ntotua Donggala (1900)',
    kailiGuide: 'Imam Masigi Ntotua',
    kailiTranscript: 'Tabe! Masigi he\'i puse nggari syiar Islam ri talaga Banawa nggari taun 1900. Atapna bertingkat khas Nusantara nte mimbar kaju maukir kaligrafi panggagana ibadah ntotua mbana.'
  },
  'klenteng-jin-de-yuan': {
    siteId: 'klenteng-jin-de-yuan',
    idTitle: 'Kelenteng Jin De Yuan Donggala (1895)',
    idGuide: 'Pengurus Yayasan Tridharma Donggala',
    idTranscript: 'Kelenteng tertua di Sulawesi Tengah ini membuktikan kerukunan dan persaudaraan lintas etnis yang telah terjalin ratusan tahun antara masyarakat Tionghoa perantauan dan penduduk asli Kaili di pesisir Banawa.',
    kailiTitle: 'Klenteng Jin De Yuan Donggala (1895)',
    kailiGuide: 'Pengurus Tridharma Banawa',
    kailiTranscript: 'Tabe! Klenteng he\'i panggagana to Cino nte to Kaili mosi-asi nte moroa ri pesisir Banawa nggari taun 1895, tanda kerukunan roa ri tana Donggala.'
  },
  'makam-raja-raja-banawa': {
    siteId: 'makam-raja-raja-banawa',
    idTitle: 'Kompleks Makam Raja-Raja Banawa (Abad ke-18)',
    idGuide: 'Juru Pelihara Cagar Budaya Makam Raja',
    idTranscript: 'Kompleks pemakaman sakral di perbukitan Gunung Bale ini merupakan peristirahatan terakhir para Datu dan Raja Kerajaan Banawa yang memimpin rakyatnya melawan hegemoni asing dengan gagah berani.',
    kailiTitle: 'Koburu Datu Raja-Raja Banawa',
    kailiGuide: 'Juru Pelihara Koburu Datu',
    kailiTranscript: 'Tabe! Kompleks koburu keramat ri bulu Gunung Bale he\'i panggagana peristirahatan purapura Datu Kerajaan Banawa to noposabara nolak penjajah ante barani.'
  },
  'gedung-eks-penjara-kolonial': {
    siteId: 'gedung-eks-penjara-kolonial',
    idTitle: 'Gedung Eks Penjara Kolonial (1918)',
    idGuide: 'Pemandu Cagar Budaya Benteng Hukum',
    idTranscript: 'Bangunan berdinding batu tebal 40 cm dengan jeruji besi tempa ini menjadi saksi penahanan para pejuang kemerdekaan dan tokoh adat Kaili yang menentang rodi dan pajak kolonial.',
    kailiTitle: 'Banua Tarungku Welanda (1918)',
    kailiGuide: 'Panggaga Sejarah Penjara Kolonial',
    kailiTranscript: 'Tabe! Banua batu makandai he\'i bekas tarungku Welanda taun 1918, nosaksi purapura pejuang kemerdekaan Kaili to nitanggu sababu nolak rodi.'
  },
  'rumah-singgah-saudagar-bugis': {
    siteId: 'rumah-singgah-saudagar-bugis',
    idTitle: 'Rumah Singgah Saudagar Bugis (1910)',
    idGuide: 'Pemerhati Diaspora Maritim Nusantara',
    idTranscript: 'Rumah panggung kayu berornamen ukiran khas Sulawesi Selatan ini menjadi tempat menginap para nakhoda dan saudagar Bugis-Makassar saat menunggu pergantian angin muson di Selat Makassar.',
    kailiTitle: 'Banua Panggagana Saudagar Bugis (1910)',
    kailiGuide: 'Toris Diaspora Maritim',
    kailiTranscript: 'Tabe! Banua panggung kayu he\'i panggagana to Bugis nte Makassar menginap sakoni nomantagi angi muson ri Selat Makassar mamongko sakayana.'
  },
  'sentra-tenun-donggala': {
    siteId: 'sentra-tenun-donggala',
    idTitle: 'Sentra Tenun Buya Sabe Donggala',
    idGuide: 'Maestro Penenun Sutra Donggala',
    idTranscript: 'Melihat denting alat tenun bukan mesin (ATBM) menenun benang sutra emas menjadi mahakarya kain sarung Buya Sabe dengan motif Suba, Bomba, dan Kasa yang melegenda di seantero Nusantara.',
    kailiTitle: 'Panggagana Tenun Buya Sabe Donggala',
    kailiGuide: 'Maestro Teno Kaili',
    kailiTranscript: 'Tabe! Nandoo ri he\'i to maneno Buya Sabe sutra ante motif Suba nte Bomba to melegenda ri tana Nusantara nggari zaman ntotua mbana.'
  },
  'benteng-kaap-banawa': {
    siteId: 'benteng-kaap-banawa',
    idTitle: 'Situs Benteng Kaap Banawa',
    idGuide: 'Arkeolog Maritim Banawa',
    idTranscript: 'Puing-puing benteng pengawas pesisir era Portugis dan Belanda di bibir tebing Tanjung Batu yang mengontrol lalu lintas kapal perang di mulut Selat Makassar.',
    kailiTitle: 'Benteng Kaap Banawa ri Tanjung Batu',
    kailiGuide: 'Panggaga Benteng Banawa',
    kailiTranscript: 'Tabe! Puing benteng pengawas talaga ri lolo Tanjung Batu he\'i panggagana mangontrol purapura kapal parang ri Talaga Makassar zaman mbana.'
  },
  'pantai-tanjung-karang-pusentasi': {
    siteId: 'pantai-tanjung-karang-pusentasi',
    idTitle: 'Pesisir Tanjung Karang & Pusentasi',
    idGuide: 'Pemandu Bahari & Konservasi Terumbu Karang',
    idTranscript: 'Pesona bentang alam bahari pesisir Banawa dengan hamparan pasir putih, terumbu karang alami, dan sumur laut alami Pusentasi yang terhubung ke laut bebas.',
    kailiTitle: 'Pesisir Tanjung Karang nte Pusentasi',
    kailiGuide: 'Pemandu Alam Bahari Banawa',
    kailiTranscript: 'Tabe! Kagaana talagang Tanjung Karang ante bone mopute nte Pusentasi sumur talaga to nosambung ka talaga bebas Selat Makassar.'
  }
};
