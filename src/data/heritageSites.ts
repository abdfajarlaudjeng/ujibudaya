import { HeritageSite, QuizQuestion } from '../types';

export const HERITAGE_SITES: HeritageSite[] = [
  {
    id: 'kpm-office-donggala',
    title: 'Kantor Dagang KPM Donggala',
    localName: 'Kantoor der Koninklijke Paketvaart-Maatschappij',
    kelurahan: 'Kelurahan Boya',
    establishedYear: '1912',
    period: 'Masa Kolonial Hindia Belanda',
    category: 'Maritim & Pelabuhan',
    locationDescription: 'Kawasan Pelabuhan Tua, Jl. Kemakmuran, Kelurahan Boya, Banawa',
    coordinates: {
      lat: -0.6728,
      lng: 119.7423,
      mapX: 42,
      mapY: 38,
    },
    thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80',
    pastPhoto: {
      url: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1000&q=80',
      caption: 'Aktivitas bongkar muat kapal uap KPM di pelabuhan Donggala tahun 1920 (Arsip Tropenmuseum).',
      source: 'Arsip Hindia Belanda & Koleksi Sejarah Donggala',
      year: '1920'
    },
    currentPhoto: {
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
      caption: 'Struktur arsitektur kolonial tropis dengan pilar bata tebal dan ventilasi busur klasik di tepi Teluk Palu / Selat Makassar.',
      conditionStatus: 'Perlu Revitalisasi'
    },
    panorama360: {
      url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=2000&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      type: 'sphere',
      initialYaw: 15,
      initialPitch: 0,
      hotspots: [
        {
          id: 'kpm-hotspot-1',
          title: 'Ruang Kantor Administrasi Pelayaran',
          description: 'Lokasi pencatatan manifes muatan rempah, kopra, kayu cendana, dan damar yang dikirim ke Batavia, Makassar, dan Singapura.',
          yaw: 25,
          pitch: 5
        },
        {
          id: 'kpm-hotspot-2',
          title: 'Bovenlicht & Ventilasi Tropis Kolonial',
          description: 'Rancangan arsitektur Belanda adaptif dengan sirkulasi silang penahan terik matahari pesisir Selat Makassar.',
          yaw: -80,
          pitch: 18
        },
        {
          id: 'kpm-hotspot-3',
          title: 'Pintu Gerbang Menghadap Dermaga',
          description: 'Akses langsung para nahkoda kapal uap dan klerk bea cukai memeriksa arus kapal logistik.',
          yaw: 140,
          pitch: -5
        }
      ]
    },
    video360: {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      title: 'Tur Video 360° Penjelajahan Pelabuhan & Gedung KPM Donggala',
      provider: 'mp4',
      duration: '2:15'
    },
    videoDocumentaryUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    briefDescription: 'Simbol kejayaan Donggala sebagai pusat transit maritim terbesar di pesisir barat Sulawesi pada awal abad ke-20.',
    historicalSignificance: 'Kantor KPM didirikan ketika Donggala menjadi pelabuhan singgah utama rute kapal Hindia Belanda yang menghubungkan Jawa, Makassar, Ternate, dan Manado. Donggala saat itu merupakan pintu gerbang ekonomi seluruh wilayah Lembah Palu dan pedalaman Sulawesi Tengah.',
    architecturalStyle: 'Indische Empire Style adaptif dengan dinding tebal 30 cm, pilar simetris, teras depan teduh, dan atap perisai tinggi.',
    maritimeRelevance: 'Menjadi saksi ratusan kapal uap perintis KPM bersandar setiap bulan membawa hasil bumi kopra, rotan, dan mutiara.',
    audioNarration: {
      title: 'Derap Langkah di Kantor KPM 1912',
      speakerName: 'Pemandu Sejarah Ian Dwi Putera',
      durationText: '2 Menit 15 Detik',
      transcript: 'Selamat datang di Kantor Dagang KPM Donggala. Berdirilah sejenak dan dengarkan deburan ombak Selat Makassar. Pada tahun 1912, ruangan ini dipenuhi aroma kopi, tembakau, dan deru mesin kapal uap. Dari meja klerk di sudut ini, jutaan ton kopra dan rotan diekspor melintasi samudra. Gedung ini adalah saksi bisu betapa gemilangnya Donggala sebelum gempa dan perubahan zaman menggeser pusat perdagangan ke Teluk Palu.'
    },
    talkingPersona: {
      name: 'Gedung KPM Donggala',
      role: 'Monumen Kejayaan Pelayaran Selat Makassar',
      avatar: '🏛️',
      greeting: 'Tabe! Saya adalah Gedung Kantor KPM Donggala. Sudah lebih dari 110 tahun saya berdiri memandang Selat Makassar. Ingin tahu rahasia kapal-kapal uap dunia yang pernah bersandar di depan teras saya?',
      systemPrompt: 'Kamu adalah personifikasi dari Gedung Kantor Dagang KPM Donggala yang dibangun tahun 1912 di Kelurahan Boya, Banawa. Bicaralah secara ramah, puitis, berwawasan mendalam dengan logat santun khas Sulawesi Tengah/Banawa (menyisipkan kata seperti "Tabe", "Pangnganro", atau kearifan lokal sesekali). Jelaskan sejarah perdagangan maritim, rute KPM, komoditas kopra dan rotan, serta kerinduanmu untuk direvitalisasi dan dilestarikan oleh generasi muda Indonesia.',
      sampleQuestions: [
        'Apa peranmu dalam jaringan perdagangan Hindia Belanda?',
        'Barang dagangan apa saja yang paling berharga di pelabuhanmu?',
        'Bagaimana suasana pelabuhan Donggala saat kapal KPM bersandar?',
        'Apa harapanmu untuk masa depan Kota Tua Donggala?'
      ]
    },
    trivia: [
      'Donggala dijuluki "Kota Pelabuhan Emas" karena kapal-kapal dari Singapura dan Hong Kong rutin berlabuh di sini.',
      'Lantai ubin terakota gedung ini diimpor langsung dari Belanda lewat Surabaya pada tahun 1911.'
    ],
    keyFacts: [
      { label: 'Tahun Pembangunan', value: '1912 Masehi' },
      { label: 'Status Cagar Budaya', value: 'Didata BPK Wilayah XVIII' },
      { label: 'Zona Wilayah', value: 'Kawasan Inti Pelabuhan Tua Boya' },
      { label: 'Fungsi Awal', value: 'Kantor Perusahaan Pelayaran Kerajaan Belanda' }
    ]
  },
  {
    id: 'mercusuar-tanjung-batu',
    title: 'Mercusuar Tanjung Batu Donggala',
    localName: 'Vuurtoren Kaap Banawa',
    kelurahan: 'Kelurahan Tanjung Batu',
    establishedYear: '1898',
    period: 'Masa Kolonial Abad ke-19',
    category: 'Pertahanan & Pengawasan',
    locationDescription: 'Ujung Semenanjung Tanjung Batu, Kelurahan Tanjung Batu, Banawa',
    coordinates: {
      lat: -0.6552,
      lng: 119.7335,
      mapX: 25,
      mapY: 18,
    },
    thumbnail: 'https://images.unsplash.com/photo-1507034589631-9433cc6bc453?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    pastPhoto: {
      url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80',
      caption: 'Struktur menara suar baja Tanjung Batu era navigasi Selat Makassar awal 1900-an.',
      source: 'Dinas Hidrografi & Navigasi Hindia Belanda',
      year: '1904'
    },
    currentPhoto: {
      url: 'https://images.unsplash.com/photo-1507034589631-9433cc6bc453?auto=format&fit=crop&w=1000&q=80',
      caption: 'Menara suar yang tetap berdiri gagah di atas bukit karang Tanjung Batu menghadap lautan lepas.',
      conditionStatus: 'Terawat'
    },
    panorama360: {
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80',
      type: 'sphere',
      initialYaw: 45,
      initialPitch: 10,
      hotspots: [
        {
          id: 'mercusuar-hotspot-1',
          title: 'Lensa Fresnel Orisinil',
          description: 'Lensa prisma kaca kristal buatan Prancis/Belanda yang membiaskan cahaya hingga jarak 18 mil laut.',
          yaw: 50,
          pitch: 35
        },
        {
          id: 'mercusuar-hotspot-2',
          title: 'Panorama Selat Makassar & Teluk Palu',
          description: 'Titik strategis pengamatan keluar masuk armada kapal niaga dari Selat Makassar menuju Palu dan Toli-Toli.',
          yaw: -120,
          pitch: -5
        },
        {
          id: 'mercusuar-hotspot-3',
          title: 'Pondasi Batu Karang Kuno',
          description: 'Pondasi masif diukir langsung di tebing karang Tanjung Batu untuk menahan terjangan badai barat.',
          yaw: 0,
          pitch: -45
        }
      ]
    },
    briefDescription: 'Pemandu navigasi tertua di pesisir barat Sulawesi yang telah menjaga ribuan kapal selama lebih dari 128 tahun.',
    historicalSignificance: 'Dibangun pada akhir abad ke-19 untuk mengamankan jalur pelayaran internasional di Selat Makassar, menghubungkan jalur rempah Maluku ke Batavia dan Singapura.',
    architecturalStyle: 'Konstruksi kerangka baja kolonial heksagonal dengan lentera kaca dan balkon inspeksi keliling.',
    maritimeRelevance: 'Menjadi mercu penanda paling krusial bagi pelaut Bugis, Mandar, Arab, dan Belanda yang memasuki Teluk Donggala.',
    audioNarration: {
      title: 'Cahaya Abadi Penjaga Tanjung Batu',
      speakerName: 'Pemandu Narasi Budaya Jamrin Abubakar',
      durationText: '2 Menit 40 Detik',
      transcript: 'Di ujung tebing Tanjung Batu ini, angin laut bertiup kencang menceritakan ribuan malam tanpa tidur. Sejak 1898, lentera suar ini menyala memandu kapal Phinisi, Lambo, hingga kapal uap modern. Banyak pelaut meneteskan air mata haru saat melihat kedipan cahaya suar ini di kejauhan malam, tanda bahwa mereka telah selamat tiba di tanah Banawa.'
    },
    talkingPersona: {
      name: 'Lentera Suar Tanjung Batu',
      role: 'Penjaga Navigasi & Saksi Badai Selat Makassar',
      avatar: '🗼',
      greeting: 'Salam dari puncak tebing karang! Saya adalah Mercusuar Tanjung Batu. Sudah 128 tahun mata cahaya saya tak pernah lelap memandu kapal di Selat Makassar. Tanya saya tentang rahasia laut dalam di depan kita!',
      systemPrompt: 'Kamu adalah personifikasi dari Mercusuar Tanjung Batu Donggala (dibangun 1898). Karaktermu berwibawa, bijaksana, tangguh seperti batu karang, dan penuh kisah bahari petualangan laut. Ceritakan tentang navigasi masa lalu, badai laut yang kau saksikan, dan keindahan panorama matahari terbenam Tanjung Batu.',
      sampleQuestions: [
        'Berapa jauh sorotan cahayamu memandu pelaut di malam hari?',
        'Ceritakan badai terbesar yang pernah menerjang Tanjung Batu!',
        'Bagaimana perbedaan kapal zaman dulu dengan kapal modern?',
        'Mengapa posisimu sangat strategis di Selat Makassar?'
      ]
    },
    trivia: [
      'Cahaya mercusuar ini memiliki karakter kedipan khas yang tercatat dalam peta navigasi pelayaran dunia Admiralty Chart.',
      'Dari puncak mercusuar dapat terlihat siluet perbukitan Donggala dan perairan lumba-lumba Teluk Palu.'
    ],
    keyFacts: [
      { label: 'Tahun Pendirian', value: '1898 Masehi' },
      { label: 'Jarak Pancar Cahaya', value: '18 Mil Laut' },
      { label: 'Tinggi Menara', value: '± 22 Meter' },
      { label: 'Letak Wilayah', value: 'Tanjung Batu, Kecamatan Banawa' }
    ]
  },
  {
    id: 'rumah-asisten-residen',
    title: 'Gedung Eks Asisten Residen Donggala',
    localName: 'Het Woonhuis van de Assistent-Resident / Gedung Kuning',
    kelurahan: 'Kelurahan Gunung Bale',
    establishedYear: '1905',
    period: 'Pusat Administrasi Afdeeling Donggala',
    category: 'Kolonial & Pemerintahan',
    locationDescription: 'Kawasan Perbukitan Hijau, Kelurahan Gunung Bale, Banawa',
    coordinates: {
      lat: -0.6785,
      lng: 119.7402,
      mapX: 52,
      mapY: 55,
    },
    thumbnail: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    pastPhoto: {
      url: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1000&q=80',
      caption: 'Gedung Asisten Residen pada perayaan resmi masa Hindia Belanda tahun 1918.',
      source: 'Koninklijk Instituut voor Taal-, Land- en Volkenkunde (KITLV)',
      year: '1918'
    },
    currentPhoto: {
      url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80',
      caption: 'Gedung bergaya kolonial agung dengan pekarangan luas dan pohon peneduh tua di lereng Gunung Bale.',
      conditionStatus: 'Perlu Revitalisasi'
    },
    panorama360: {
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80',
      type: 'sphere',
      initialYaw: 90,
      initialPitch: -5,
      hotspots: [
        {
          id: 'residen-hotspot-1',
          title: 'Serambi Depan Pilar Kembar',
          description: 'Tempat pertemuan diplomatik antara Asisten Residen Belanda dengan Raja Banawa dan pemuka adat Kaili.',
          yaw: 90,
          pitch: 5
        },
        {
          id: 'residen-hotspot-2',
          title: 'Kamar Tidur Utama & Jendela Krepyak Kayu',
          description: 'Jendela jalusi kayu jati tebal yang dirancang untuk meredam suhu panas tropis pesisir.',
          yaw: -30,
          pitch: 10
        },
        {
          id: 'residen-hotspot-3',
          title: 'Ruang Kerja & Arsip Afdeeling',
          description: 'Pusat pengambilan kebijakan hukum, pajak hasil bumi, dan pemetaan wilayah Sulawesi Tengah tempo dulu.',
          yaw: -150,
          pitch: 0
        }
      ]
    },
    briefDescription: 'Pusat kendali pemerintahan kolonial Afdeeling Midden Celebes yang membawahi seluruh wilayah Sulawesi Tengah.',
    historicalSignificance: 'Di gedung inilah keputusan-keputusan administratif penting dibuat yang mengatur tata kelola pelabuhan, perkebunan kopra, dan hubungan antara pemerintah kolonial dengan kerajaan-kerajaan lokal di Teluk Palu dan Banawa.',
    architecturalStyle: 'Arsitektur Indis Klasik dengan atap perisai curam, pilar silindris bergaya Doric/Tuscan, dan lantai keramik antik.',
    maritimeRelevance: 'Menghadap langsung ke arah teluk sehingga sang Asisten Residen dapat memantau pergerakan kapal yang masuk pelabuhan.',
    audioNarration: {
      title: 'Gema Diplomasi di Gunung Bale',
      speakerName: 'Pemandu Sejarah Ian Dwi Putera',
      durationText: '2 Menit 30 Detik',
      transcript: 'Berada di ketinggian Kelurahan Gunung Bale, gedung ini sengaja dibangun di lereng bukit agar mendapatkan hembusan angin sejuk. Dari beranda depan ini, para petinggi kolonial dan Raja Banawa sering duduk berdialog sambil memandang kapal-kapal yang bersandar di dermaga Boya. Gedung ini merekam pertautan politik antara kerajaan tradisional dan administrasi modern awal abad ke-20.'
    },
    talkingPersona: {
      name: 'Wisma Gunung Bale',
      role: 'Pusat Pemerintahan Afdeeling Donggala 1905',
      avatar: '🏛️',
      greeting: 'Selamat datang di ruang kehormatan Gunung Bale! Saya adalah saksi dari setiap perjanjian dan diplomasi yang menentukan nasib tanah Sulawesi Tengah tempo dulu. Ingin tahu rahasia di balik pilar-pilar kokoh ini?',
      systemPrompt: 'Kamu adalah Rumah Eks Asisten Residen Donggala di Gunung Bale. Berbicara dengan nada terhormat, diplomatis, mengisahkan sejarah administrasi kolonial, hubungan harmonis dan dinamis dengan Raja Banawa, serta nilai estetika arsitektur pilar Indis.',
      sampleQuestions: [
        'Mengapa kamu dibangun di atas bukit Gunung Bale?',
        'Bagaimana hubungan Asisten Residen dengan Raja-raja Banawa?',
        'Ruangan apa saja yang ada di dalam gedung ini?',
        'Apa yang membuatnya menjadi warisan cagar budaya yang bernilai tinggi?'
      ]
    },
    trivia: [
      'Gedung ini memiliki sistem pendinginan pasif alami berkat plafon tinggi berkayu eboni dan lubang ventilasi geometris.',
      'Pemandangan dari halamannya memperlihatkan panorama 180 derajat Kota Donggala dan laut biru.'
    ],
    keyFacts: [
      { label: 'Tahun Berdiri', value: '1905 Masehi' },
      { label: 'Kelurahan', value: 'Gunung Bale, Banawa' },
      { label: 'Status Struktur', value: 'Bangunan Cagar Budaya Peringkat Kabupaten' },
      { label: 'Luas Lahan', value: '± 2.400 Meter Persegi' }
    ]
  },
  {
    id: 'souraja-donggala-banawa',
    title: 'Rumah Tradisional Souraja Banawa',
    localName: 'Souraja / Banua Oge Kerajaan Banawa',
    kelurahan: 'Kelurahan Gunung Bale',
    establishedYear: '1892',
    period: 'Era Kerajaan Banawa',
    category: 'Arsitektur & Rumah Adat',
    locationDescription: 'Pusat Pemukiman Bangsawan Kaili, Kelurahan Gunung Bale, Banawa',
    coordinates: {
      lat: -0.6761,
      lng: 119.7389,
      mapX: 48,
      mapY: 62,
    },
    thumbnail: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1600&q=80',
    pastPhoto: {
      url: 'https://images.unsplash.com/photo-1464817739973-0128fe77aaa1?auto=format&fit=crop&w=1000&q=80',
      caption: 'Upacara adat di halaman Souraja Banawa dengan pakaian adat Kaili tempo dulu.',
      source: 'Koleksi Tetua Lembaga Adat Banawa',
      year: '1935'
    },
    currentPhoto: {
      url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80',
      caption: 'Kemegahan arsitektur kayu ulin panggung khas Kaili Banawa dengan ukiran ragam hias flora maritim.',
      conditionStatus: 'Terawat'
    },
    panorama360: {
      url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=2000&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      type: 'sphere',
      initialYaw: 0,
      initialPitch: 0,
      hotspots: [
        {
          id: 'souraja-hotspot-1',
          title: 'Gandaria (Serambi Depan Bangsawan)',
          description: 'Ruang musyawarah adat tetua suku Kaili dan tempat menerima tamu kehormatan dari berbagai kerajaan Nusantara.',
          yaw: 10,
          pitch: -5
        },
        {
          id: 'souraja-hotspot-2',
          title: 'Ukiran Kaligrafi & Flora Lokal Banawa',
          description: 'Ragam hias pahatan kayu bermotif sulur tanaman lokal dan simbol keselarasan manusia dengan alam maritim.',
          yaw: -75,
          pitch: 25
        },
        {
          id: 'souraja-hotspot-3',
          title: 'Tiang Utama Kayu Ulin Bebas Paku',
          description: 'Konstruksi pasak kayu tradisional tahan gempa yang terbukti bertahan melewati berbagai guncangan seismik.',
          yaw: 110,
          pitch: -15
        }
      ]
    },
    video360: {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      title: 'Tur Video 360° Arsitektur Pasak Kayu & Ruang Adat Souraja',
      provider: 'mp4',
      duration: '3:10'
    },
    briefDescription: 'Istana rumah panggung kayu agung para Raja Banawa dengan filosofi arsitektur vernakular Kaili yang tahan gempa.',
    historicalSignificance: 'Souraja adalah pusat kebudayaan, hukum adat, dan kearifan luhur masyarakat Kaili Banawa. Di tempat ini nilai-nilai musyawarah, seni tari, dan diplomasi maritim dipelihara turun-temurun.',
    architecturalStyle: 'Rumah panggung kayu tradisional (Banua Oge) dengan 36 tiang kayu ulin/kayu besi, konstruksi purus-pasak elastis ramah gempa.',
    maritimeRelevance: 'Para bangsawan Banawa di Souraja memegang hak perlindungan pelabuhan dan armada pelaut perahu tradisi.',
    audioNarration: {
      title: 'Jiwa Kearifan Kayu Ulin Souraja',
      speakerName: 'Tokoh Adat & Tim Ahli Cagar Budaya',
      durationText: '3 Menit 10 Detik',
      transcript: 'Inilah Souraja, rumah besar kebanggaan tanah Banawa. Setiap bilah papan dan tiang kayu di sini dirakit tanpa paku besi, melainkan pasak kayu yang bernafas bersama bumi. Ketika gempa mengguncang, Souraja bergoyang lentur namun tak runtuh. Masuklah ke serambi Gandaria dan rasakan kehangatan keramahan para leluhur Kaili yang selalu memuliakan setiap tamu yang menyeberangi samudra.'
    },
    talkingPersona: {
      name: 'Souraja Banawa',
      role: 'Rumah Agung Adat & Jiwa Luhur Kaili',
      avatar: '🪵',
      greeting: 'Kareba maroso! Saya adalah Souraja Banawa, rumah panggung tempat bersemayamnya marwah dan adat istiadat Kaili. Ingin mendengar petuah leluhur dan rahasia konstruksi kayu tahan gempa kami?',
      systemPrompt: 'Kamu adalah personifikasi Souraja Banawa, rumah adat kayu agung Kaili di Donggala. Karaktermu penuh kearifan luhur, mengayomi, menjunjung tinggi nilai persaudaraan dan keadilan adat. Ceritakan tentang kehebatan arsitektur pasak kayu, filosofi rumah panggung, dan peran Raja Banawa.',
      sampleQuestions: [
        'Mengapa konstruksi kayumu bisa tahan terhadap gempa bumi?',
        'Apa arti pembagian ruangan di dalam Souraja?',
        'Bagaimana adat menerima tamu di serambi Gandaria?',
        'Apa pesan leluhur Kaili untuk generasi masa depan?'
      ]
    },
    trivia: [
      'Konstruksi purus dan pasak kayu pada Souraja membuat bangunan ini fleksibel meredam getaran seismik tektonik.',
      'Kayu ulin yang digunakan ditebang dengan ritual doa adat khusus dan direndam di air payau selama bertahun-tahun agar sekeras baja.'
    ],
    keyFacts: [
      { label: 'Tahun Berdiri', value: '1892 Masehi' },
      { label: 'Bahan Konstruksi', value: 'Kayu Ulin / Kayu Besi Asli Sulawesi' },
      { label: 'Jumlah Tiang Utama', value: '36 Tiang Kayu Masif' },
      { label: 'Sistem Sambungan', value: 'Knock-down Purus & Pasak Tradisional' }
    ]
  },
  {
    id: 'dermaga-kayu-pelabuhan',
    title: 'Dermaga Kayu & Gudang Garam Kuno',
    localName: 'De Oude Houten Steiger van Donggala',
    kelurahan: 'Kelurahan Boya',
    establishedYear: 'Awal Abad ke-19',
    period: 'Pusat Bongkar Muat Selat Makassar',
    category: 'Maritim & Pelabuhan',
    locationDescription: 'Pesisir Pantai Kelurahan Boya, Kecamatan Banawa',
    coordinates: {
      lat: -0.6715,
      lng: 119.7438,
      mapX: 38,
      mapY: 34,
    },
    thumbnail: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    pastPhoto: {
      url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80',
      caption: 'Deretan kapal layar perahu lambo dan kapal uap berlabuh di dermaga kayu Donggala tahun 1910.',
      source: 'Tropenmuseum Collection',
      year: '1910'
    },
    currentPhoto: {
      url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
      caption: 'Sisa pilar-pilar kayu ulin kuno yang tertancap kokoh di dasar laut dangkal pesisir Boya.',
      conditionStatus: 'Sisa Struktur/Puing'
    },
    panorama360: {
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80',
      type: 'sphere',
      initialYaw: -60,
      initialPitch: -10,
      hotspots: [
        {
          id: 'dermaga-hotspot-1',
          title: 'Pilar Pancang Kayu Ulin Raksasa',
          description: 'Tiang kayu besi yang ditancapkan sedalam 6 meter ke dasar karang untuk menahan benturan kapal kargo.',
          yaw: -50,
          pitch: -20
        },
        {
          id: 'dermaga-hotspot-2',
          title: 'Gudang Garam & Komoditas Rempah',
          description: 'Gudang penyimpanan garam laut dan hasil bumi sebelum dinaikkan ke kapal menuju pulau Jawa.',
          yaw: 80,
          pitch: 5
        }
      ]
    },
    briefDescription: 'Pintu gerbang utama tempat bertemunya perahu layar tradisional Phinisi dengan armada kapal uap modern Eropa.',
    historicalSignificance: 'Pada abad ke-19 hingga pertengahan abad ke-20, dermaga ini merupakan dermaga terpanjang di Sulawesi Tengah, mampu menampung kapal bertonase besar.',
    architecturalStyle: 'Struktur dermaga jetty panggung kayu ulin maritim tahan air asin dengan lantai balok.',
    maritimeRelevance: 'Menjadi urat nadi ekonomi tempat pertukaran budaya antarbangsa di pesisir Selat Makassar.',
    audioNarration: {
      title: 'Deburan Ombak di Dermaga Kayu Kuno',
      speakerName: 'Pemandu Sejarah Ian Dwi Putera',
      durationText: '2 Menit',
      transcript: 'Di atas papan-papan kayu inilah ribuan karung kopra, cengkih, dan kemiri dipanggul oleh para kuli pelabuhan yang gagah. Tawa para pelaut dari Madura, Makassar, Mandar, Tiongkok, dan Eropa berbaur dalam satu irama kerja yang riuh. Kini hanya tersisa pilar-pilar kayu di dalam air laut, namun semangat baharinya tetap hidup abadi.'
    },
    talkingPersona: {
      name: 'Dermaga Kayu Pelabuhan',
      role: 'Urat Nadi Niaga Bahari Donggala',
      avatar: '⚓',
      greeting: 'Ahooy! Saya adalah Dermaga Kayu Pelabuhan Tua Donggala. Sudah tak terhitung berapa juta tali tambang kapal yang tertambat di tubuh saya. Ingin tahu cerita kapal-kapal layar raksasa yang pernah bersandar?',
      systemPrompt: 'Kamu adalah Dermaga Kayu Pelabuhan Tua Donggala di Kelurahan Boya. Bicaralah penuh semangat bahari, menceritakan pelaut lintas pulau, proses bongkar muat barang berharga, dan suara denting koin perdagangan masa lalu.',
      sampleQuestions: [
        'Kapal jenis apa saja yang pernah bersandar di dermagamu?',
        'Mengapa kayu tiang dermaga bisa bertahan begitu lama di dalam air laut?',
        'Bagaimana kehidupan malam di pelabuhan ketika kapal dagang tiba?'
      ]
    },
    trivia: [
      'Kayu ulin yang terendam air asin justru mengalami proses mineralisasi alami sehingga semakin padat dan tidak lapuk.',
      'Dermaga ini dulunya dilengkapi rel lori kecil manual untuk mempercepat pemindahan karung kopra ke gudang.'
    ],
    keyFacts: [
      { label: 'Era Pembangunan', value: 'Abad ke-19 (1880-an)' },
      { label: 'Material Utama', value: 'Kayu Besi / Ulin Kalimantan & Sulawesi' },
      { label: 'Panjang Asli', value: '± 150 Meter Menjorok ke Laut' },
      { label: 'Kawasan', value: 'Pantai Boya, Banawa' }
    ]
  },
  {
    id: 'masjid-tua-al-hilal',
    title: 'Masjid Tua Al-Hilal Donggala',
    localName: 'Masjid Tua Kelurahan Labuan Bajo / Boya',
    kelurahan: 'Kelurahan Labuan Bajo',
    establishedYear: '1900',
    period: 'Penyebaran Islam & Komunitas Pesisir',
    category: 'Religi & Multikultural',
    locationDescription: 'Pusat Pemukiman Pesisir Labuan Bajo, Banawa',
    coordinates: {
      lat: -0.6802,
      lng: 119.7461,
      mapX: 60,
      mapY: 45,
    },
    thumbnail: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1600&q=80',
    pastPhoto: {
      url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1000&q=80',
      caption: 'Jamaah Masjid Tua Donggala usai shalat Idul Fitri pada tahun 1928.',
      source: 'Arsip Sejarah Islam Nusantara',
      year: '1928'
    },
    currentPhoto: {
      url: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1000&q=80',
      caption: 'Atap tumpang bertingkat khas Nusantara berpadu dengan ornamen ventilasi kaligrafi kayu jati kuno.',
      conditionStatus: 'Terawat'
    },
    panorama360: {
      url: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=2000&q=80',
      type: 'sphere',
      initialYaw: 180,
      initialPitch: 10,
      hotspots: [
        {
          id: 'masjid-hotspot-1',
          title: 'Mimbar Khutbah Kayu Jati Berukir 1900',
          description: 'Mimbar ukir mahakarya seniman Melayu dan Kaili dengan motif sulur tumbuhan dan kaligrafi ayat suci.',
          yaw: 180,
          pitch: 0
        },
        {
          id: 'masjid-hotspot-2',
          title: 'Empat Tiang Soko Guru Kayu Utuh',
          description: 'Tiang utama penyangga kubah tumpang yang melambangkan 4 sahabat utama Nabi dan empat unsur kehidupan.',
          yaw: 90,
          pitch: 15
        },
        {
          id: 'masjid-hotspot-3',
          title: 'Bedug Raksasa Kulit Kerbau',
          description: 'Bedug tua yang suaranya menggema ke seluruh teluk Donggala menandai waktu shalat dan peringatan warga.',
          yaw: -45,
          pitch: -10
        }
      ]
    },
    briefDescription: 'Pusat syiar Islam tertua di kawasan pesisir Banawa yang memadukan arsitektur Nusantara dengan corak bahari.',
    historicalSignificance: 'Didirikan oleh para ulama bersama saudagar Hadhrami (Arab) dan tokoh adat Kaili sebagai mercusuar spiritual pelaut yang hendak mengarungi samudera.',
    architecturalStyle: 'Atap tumpang tiga Nusantara dengan mustaka kuningan, tiang soko guru kayu utuh, dan ventilasi geometris.',
    maritimeRelevance: 'Menjadi tempat singgah para pelaut muslim dari Gresik, Ternate, dan Hadramaut memohon keselamatan pelayaran.',
    audioNarration: {
      title: 'Gema Doa Penyeberang Lautan',
      speakerName: 'Tokoh Agama & Sejarawan Donggala',
      durationText: '2 Menit 20 Detik',
      transcript: 'Di bawah naungan atap tumpang Masjid Tua Al-Hilal, keheningan terasa begitu menyejukkan jiwa. Selama lebih dari seratus tahun, para nahkoda kapal bersujud di sini sebelum mengangkat sauh menuju Selat Makassar. Mimbar kayu jati ini adalah saksi tausiyah yang menanamkan kejujuran dalam berdagang dan keberanian dalam mengarungi ombak.'
    },
    talkingPersona: {
      name: 'Masjid Tua Al-Hilal',
      role: 'Mercusuar Spiritual Pelaut Donggala',
      avatar: '🕌',
      greeting: 'Assalamu alaikum wr. wb. Saya adalah Masjid Tua Al-Hilal Donggala. Sudah lebih dari satu abad saya menjadi tempat berteduh jiwa para musafir dan pelaut. Apa yang ingin engkau tanyakan tentang sejarah syiar dan kedamaian di pesisir ini?',
      systemPrompt: 'Kamu adalah Masjid Tua Al-Hilal Donggala. Tutur katamu santun, teduh, bijaksana, dan sarat nilai spiritual serta sejarah kerukunan umat beragama dan persaudaraan masyarakat maritim di Donggala.',
      sampleQuestions: [
        'Siapa saja tokoh yang memprakarsai pembangunan masjid ini?',
        'Bagaimana filosofi dari atap tumpang bertingkat tiga?',
        'Apakah pelaut dari luar pulau sering singgah beribadah di sini?'
      ]
    },
    trivia: [
      'Mustaka kuningan di puncak kubah dibuat secara tradisional oleh pandai tembaga lokal tanpa sambungan las modern.',
      'Sumur di samping masjid memiliki air tawar jernih meski lokasinya hanya berjarak beberapa puluh meter dari bibir laut.'
    ],
    keyFacts: [
      { label: 'Tahun Berdiri', value: '1900 Masehi' },
      { label: 'Gaya Arsitektur', value: 'Tradisional Nusantara Maritim' },
      { label: 'Material Mimbar', value: 'Kayu Jati Berukir Orisinil' },
      { label: 'Lokasi', value: 'Kelurahan Labuan Bajo, Banawa' }
    ]
  },
  {
    id: 'rumah-saudagar-arab',
    title: 'Rumah Saudagar Arab & Melayu Boya',
    localName: 'Huis van de Hadhrami Kooplieden',
    kelurahan: 'Kelurahan Boya',
    establishedYear: '1915',
    period: 'Kejayaan Perdagangan Rempah & Kopra',
    category: 'Arsitektur & Rumah Adat',
    locationDescription: 'Jl. Sam Ratulangi / Kawasan Perkampungan Tua, Kelurahan Boya, Banawa',
    coordinates: {
      lat: -0.6745,
      lng: 119.7410,
      mapX: 45,
      mapY: 42,
    },
    thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    pastPhoto: {
      url: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1000&q=80',
      caption: 'Keluarga saudagar terkemuka berfoto di depan serambi bertingkat rumah mewah Boya tahun 1925.',
      source: 'Koleksi Arsip Keluarga Saudagar Donggala',
      year: '1925'
    },
    currentPhoto: {
      url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
      caption: 'Rumah bertingkat dua dengan balkon kayu berukir motif Timur Tengah berpadu dengan arsitektur Indis.',
      conditionStatus: 'Perlu Revitalisasi'
    },
    panorama360: {
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80',
      type: 'sphere',
      initialYaw: 120,
      initialPitch: 5,
      hotspots: [
        {
          id: 'saudagar-hotspot-1',
          title: 'Balkon Ukir Kisi Kayu (Mashrabiya)',
          description: 'Kisi-kisi ventilasi kayu berornamen Arab-Melayu yang memungkinkan sirkulasi udara optimal dan privasi keluarga.',
          yaw: 120,
          pitch: 20
        },
        {
          id: 'saudagar-hotspot-2',
          title: 'Ruang Tamu Majelis Dagang',
          description: 'Tempat para saudagar menegosiasikan harga kopra, tekstil tenun Donggala, dan mutiara bersama mitra bisnis mancanegara.',
          yaw: -30,
          pitch: -5
        }
      ]
    },
    briefDescription: 'Mahakarya perpaduan arsitektur Hadhramaut Timur Tengah, kolonial Eropa, dan kayu lokal pesisir Donggala.',
    historicalSignificance: 'Menjadi bukti keberhasilan diaspora saudagar Arab dan Melayu dalam menggerakkan perekonomian ekspor Donggala ke Timur Tengah dan Eropa.',
    architecturalStyle: 'Eklektik Indis-Timur Tengah dengan lengkungan tapal kuda, balkon kayu jati bertingkat, dan tegel semen berpola klasik.',
    maritimeRelevance: 'Menjadi markas jaringan armada kapal niaga swasta yang melayari rute Donggala-Surabaya-Singapura-Yaman.',
    audioNarration: {
      title: 'Aroma Gaharu dan Transaksi Niaga Saudagar',
      speakerName: 'Pemandu Sejarah Ian Dwi Putera',
      durationText: '2 Menit 10 Detik',
      transcript: 'Di ruang majelis ini, aroma kayu gaharu dan kopi rempah pernah menyapa para tamu saudagar yang datang dari berbagai penjuru dunia. Di balik balkon kayu kisi-kisi ini, transaksi kain Tenun Donggala yang legendaris dirundingkan. Rumah ini adalah simbol keterbukaan dan keberagaman yang telah mengakar kuat di Donggala sejak lebih dari seabad silam.'
    },
    talkingPersona: {
      name: 'Rumah Saudagar Boya',
      role: 'Simbol Kejayaan Niaga & Akulturasi Budaya',
      avatar: '🏡',
      greeting: 'Marhaban bikum! Saya adalah Rumah Saudagar Boya. Dinding kayu dan balkon saya menyimpan kisah kejayaan perdagangan kain tenun, rempah, dan persahabatan antarbangsa. Ada yang ingin kau tanyakan tentang transaksi dagang tempo dulu?',
      systemPrompt: 'Kamu adalah Rumah Saudagar Arab & Melayu di Kelurahan Boya. Gaya bicaramu ramah, hangat, penuh wawasan bisnis tempo dulu, menceritakan komoditas Tenun Donggala, rempah, dan kehangatan tradisi menjamu tamu.',
      sampleQuestions: [
        'Bagaimana perdagangan kain Tenun Donggala diekspor ke mancanegara?',
        'Mengapa saudagar dari Yaman memilih bermukim di Donggala?',
        'Apa keunikan ukiran balkon kayu pada rumahmu?'
      ]
    },
    trivia: [
      'Kain Tenun Donggala yang disimpan di rumah ini terkenal hingga ke Timur Tengah karena kehalusan sutra dan motif Subi/Bombo.',
      'Lantai bawah rumah difungsikan sebagai gudang penimbangan komoditas, sementara lantai atas sebagai tempat tinggal keluarga.'
    ],
    keyFacts: [
      { label: 'Tahun Pendirian', value: '1915 Masehi' },
      { label: 'Gaya Desain', value: 'Eklektik Hadhramaut - Indische Empire' },
      { label: 'Material Utama', value: 'Kayu Jati, Ulin & Dinding Bata Kapur' },
      { label: 'Zona', value: 'Pecinan & Kampung Arab Kelurahan Boya' }
    ]
  },
  {
    id: 'klenteng-thian-hou-kiong',
    title: 'Klenteng Tua Thian Hou Kiong Donggala',
    localName: 'Vihara / Klenteng Dewi Samudera Mazu',
    kelurahan: 'Kelurahan Boya',
    establishedYear: '1885',
    period: 'Komunitas Tionghoa Maritim Pesisir',
    category: 'Religi & Multikultural',
    locationDescription: 'Dekat Muara Pelabuhan Tua, Kelurahan Boya, Banawa',
    coordinates: {
      lat: -0.6732,
      lng: 119.7418,
      mapX: 40,
      mapY: 36,
    },
    thumbnail: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=80',
    pastPhoto: {
      url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=80',
      caption: 'Perayaan Cap Go Meh di halaman Klenteng Donggala dengan pertunjukan seni barongsai tahun 1930.',
      source: 'Arsip Komunitas Tionghoa Donggala',
      year: '1930'
    },
    currentPhoto: {
      url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=80',
      caption: 'Struktur klenteng berornamen naga dan patung Dewi Mazu yang menghadap ke laut lepas.',
      conditionStatus: 'Terawat'
    },
    panorama360: {
      url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=2000&q=80',
      type: 'sphere',
      initialYaw: 0,
      initialPitch: 0,
      hotspots: [
        {
          id: 'klenteng-hotspot-1',
          title: 'Altar Utama Dewi Samudera (Mazu)',
          description: 'Patung Dewi Mazu pelindung para pelaut dari amukan badai laut di Selat Makassar.',
          yaw: 0,
          pitch: 5
        },
        {
          id: 'klenteng-hotspot-2',
          title: 'Lonceng Perunggu Kuno 1885',
          description: 'Lonceng perunggu hadiah dari asosiasi pedagang kapal layar Fujian yang berlabuh di Donggala.',
          yaw: -85,
          pitch: 15
        }
      ]
    },
    briefDescription: 'Situs cagar budaya tertua yang memperingati perlindungan bagi para pelaut dan bukti kuat toleransi multikultural di Donggala.',
    historicalSignificance: 'Masyarakat Tionghoa Donggala berperan penting dalam perdagangan hasil bumi dan perikanan sejak abad ke-18. Klenteng ini menjadi pusat komunitas dan perlindungan spiritual pelaut.',
    architecturalStyle: 'Arsitektur tradisional Tiongkok Selatan (Fujian) dengan bubungan atap ekor walet melengkung dan pilar ukir naga.',
    maritimeRelevance: 'Menghadap langsung ke arah laut sebagai simbol doa keselamatan pelayaran.',
    audioNarration: {
      title: 'Dupa dan Doa Keselamatan Pelaut',
      speakerName: 'Pemandu Budaya Ian Dwi Putera',
      durationText: '2 Menit 15 Detik',
      transcript: 'Asap dupa yang mengepul lembut di Klenteng Thian Hou Kiong membimbing ingatan kita pada ratusan pelaut yang datang mengucap syukur setelah berbulan-bulan diterjang badai laut. Di Donggala, toleransi bukanlah sekadar slogan, melainkan detak jantung persaudaraan yang telah terjalin damai selama ratusan tahun antara masyarakat Kaili, Bugis, Melayu, Arab, dan Tionghoa.'
    },
    talkingPersona: {
      name: 'Klenteng Thian Hou Kiong',
      role: 'Penjaga Tradisi Bahari & Persaudaraan Pesisir',
      avatar: '🏮',
      greeting: 'Ni Hao! Saya adalah Klenteng Thian Hou Kiong Donggala. Sejak 1885, saya menjaga rasa syukur para pelaut dan harmoni hidup bersama di Kota Tua ini. Ingin tahu cerita keajaiban laut dan persahabatan antaretnis kami?',
      systemPrompt: 'Kamu adalah Klenteng Tua Thian Hou Kiong Donggala. Bicaralah dengan penuh ketenangan, nilai kebajikan, menceritakan tentang Dewi Mazu pelindung pelaut, lonceng perunggu tua, dan indahnya kerukunan hidup berdampingan di pesisir Banawa.',
      sampleQuestions: [
        'Mengapa Klenteng ini dibangun menghadap ke Selat Makassar?',
        'Siapa Dewi Mazu dan mengapa sangat dihormati oleh para pelaut?',
        'Bagaimana kehidupan komunitas di sekitar klenteng pada masa keemasan Donggala?'
      ]
    },
    trivia: [
      'Batu granit yang menjadi alas pilar klenteng dibawa langsung sebagai pemberat kapal layar (ballast) dari Tiongkok.',
      'Klenteng ini selamat dari gelombang tsunami dan gempa berkat konstruksi balok kayu saling mengunci.'
    ],
    keyFacts: [
      { label: 'Tahun Pendirian', value: '1885 Masehi' },
      { label: 'Tokoh Pemujaan Utama', value: 'Dewi Mazu (Makco) Pelindung Pelaut' },
      { label: 'Gaya Arsitektur', value: 'Tradisional Minnan / Fujian Kuno' },
      { label: 'Status', value: 'Situs Cagar Budaya Multikultural' }
    ]
  },
  {
    id: 'kantor-pos-telegraf-kolonial',
    title: 'Kantor Pos & Telegraf Hindia Belanda',
    localName: 'Post- en Telegraafkantoor Donggala',
    kelurahan: 'Kelurahan Boya',
    establishedYear: '1908',
    period: 'Era Telekomunikasi Kabel Laut Hindia Belanda',
    category: 'Kolonial & Pemerintahan',
    locationDescription: 'Kawasan Kota Lama, Kelurahan Boya, Banawa',
    coordinates: {
      lat: -0.6738,
      lng: 119.7425,
      mapX: 43,
      mapY: 40,
    },
    thumbnail: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
    pastPhoto: {
      url: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1000&q=80',
      caption: 'Petugas pos Hindia Belanda dengan sepeda onthel pos di depan gedung kantor pos Donggala 1922.',
      source: 'Museum Pos Indonesia & Arsip Kolonial',
      year: '1922'
    },
    currentPhoto: {
      url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1000&q=80',
      caption: 'Gedung bata dengan loket kayu berteralis besi khas awal abad ke-20.',
      conditionStatus: 'Perlu Revitalisasi'
    },
    panorama360: {
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2000&q=80',
      type: 'sphere',
      initialYaw: 45,
      initialPitch: 0,
      hotspots: [
        {
          id: 'pos-hotspot-1',
          title: 'Loket Surat & Telegram Morse',
          description: 'Loket tempat ratusan pesan kawat telegram dikirim ke Batavia, Surabaya, dan Amsterdam.',
          yaw: 50,
          pitch: 5
        },
        {
          id: 'pos-hotspot-2',
          title: 'Stasiun Hubung Kabel Laut Selat Makassar',
          description: 'Terminal sambungan kabel telegraf bawah laut yang menghubungkan pulau Sulawesi dengan Jawa dan Kalimantan.',
          yaw: -90,
          pitch: 0
        }
      ]
    },
    briefDescription: 'Pusat telekomunikasi modern pertama di Sulawesi Tengah yang menghubungkan Donggala dengan jaringan informasi global.',
    historicalSignificance: 'Melalui stasiun telegraf Donggala, informasi harga komoditas dunia, berita politik, dan laporan pelayaran disalurkan secara cepat menggunakan sandi Morse.',
    architecturalStyle: 'Kolonial Fungsional Belanda dengan ventilasi jalusi kayu tinggi, lantai semen merah, dan kanopi seng tebal.',
    maritimeRelevance: 'Menjadi stasiun penerima laporan cuaca buruk dan kondisi gelombang laut di Selat Makassar.',
    audioNarration: {
      title: 'Ketukan Sandi Morse Penghubung Dunia',
      speakerName: 'Pemandu Sejarah Ian Dwi Putera',
      durationText: '2 Menit',
      transcript: 'Dengarkan ketukan ritmis sandi Morse yang dulu tak pernah berhenti di gedung ini: titik, garis, titik. Melalui kabel laut yang melintasi palung Selat Makassar, Donggala berbicara langsung dengan Batavia, Singapura, hingga Amsterdam. Berita pasar kopra dunia di Rotterdam langsung diketahui di Donggala dalam hitungan menit!'
    },
    talkingPersona: {
      name: 'Kantor Pos & Telegraf Donggala',
      role: 'Jantung Komunikasi Kabel Laut 1908',
      avatar: '📮',
      greeting: 'Tit-tit-tat-tit! Selamat datang di Kantor Pos dan Telegraf Donggala. Saya adalah mesin penyampai berita tercepat pada zamannya. Ingin tahu pesan-pesan telegram paling rahasia yang pernah saya kirimkan?',
      systemPrompt: 'Kamu adalah Kantor Pos dan Telegraf Kolonial Donggala. Bicaralah cerdas, dinamis, menceritakan sensasi komunikasi telegraf kawat, kabel bawah laut, prangko langka, dan kegembiraan orang-orang saat menerima surat dari seberang samudra.',
      sampleQuestions: [
        'Bagaimana telegram kabel laut menghubungkan Donggala ke seluruh dunia?',
        'Berapa lama waktu yang dibutuhkan surat dari Belanda sampai ke Donggala?',
        'Apa isi pesan telegram paling bersejarah yang pernah kau kirimkan?'
      ]
    },
    trivia: [
      'Donggala memiliki stasiun telegraf kabel laut bahkan sebelum kota-kota lain di pedalaman Sulawesi memiliki jalur darat.',
      'Prangko bergambar Ratu Wilhelmina dengan cap pos "DONGGALA" kini menjadi barang koleksi filateli yang sangat langka di dunia.'
    ],
    keyFacts: [
      { label: 'Tahun Pendirian', value: '1908 Masehi' },
      { label: 'Infrastruktur Kunci', value: 'Kabel Telegraf Bawah Laut Selat Makassar' },
      { label: 'Fungsi Awal', value: 'Pos, Giro & Stasiun Telegraf Hindia Belanda' },
      { label: 'Lokasi', value: 'Kelurahan Boya, Banawa' }
    ]
  },
  {
    id: 'makam-raja-raja-banawa',
    title: 'Kompleks Makam Raja-Raja Banawa',
    localName: 'Makam Keramat Raja Banawa & Tanjung Batu',
    kelurahan: 'Kelurahan Tanjung Batu',
    establishedYear: 'Abad ke-17 - 19',
    period: 'Zaman Kedatuan & Kerajaan Banawa',
    category: 'Religi & Multikultural',
    locationDescription: 'Perbukitan Asri Tanjung Batu, Kelurahan Tanjung Batu, Banawa',
    coordinates: {
      lat: -0.6580,
      lng: 119.7350,
      mapX: 28,
      mapY: 22,
    },
    thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1507034589631-9433cc6bc453?auto=format&fit=crop&w=1600&q=80',
    pastPhoto: {
      url: 'https://images.unsplash.com/photo-1464817739973-0128fe77aaa1?auto=format&fit=crop&w=1000&q=80',
      caption: 'Ziarah makam Raja-Raja Banawa oleh para pembesar adat pada awal tahun 1900-an.',
      source: 'Dokumentasi Lembaga Adat Kaili Banawa',
      year: '1915'
    },
    currentPhoto: {
      url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80',
      caption: 'Batu nisan kuno berukir motif khas Kaili di bawah naungan pohon kamboja tua yang rindang.',
      conditionStatus: 'Terawat'
    },
    panorama360: {
      url: 'https://images.unsplash.com/photo-1507034589631-9433cc6bc453?auto=format&fit=crop&w=2000&q=80',
      type: 'sphere',
      initialYaw: 90,
      initialPitch: -10,
      hotspots: [
        {
          id: 'makam-hotspot-1',
          title: 'Nisan Batu Pualam Berukir Kaligrafi & Sulur',
          description: 'Nisan kubur para raja Banawa dengan perpaduan ornamen Islam Nusantara dan motif kebesaran Kaili.',
          yaw: 90,
          pitch: -15
        },
        {
          id: 'makam-hotspot-2',
          title: 'Pohon Kamboja Kuno Berusia Lebih dari 150 Tahun',
          description: 'Pohon peneduh sakral yang terus berbunga harum menebarkan suasana damai dan hening.',
          yaw: -45,
          pitch: 20
        }
      ]
    },
    briefDescription: 'Kompleks peristirahatan terakhir para penguasa luhur Kerajaan Banawa yang mempertahankan kedaulatan tanah Donggala.',
    historicalSignificance: 'Di kompleks suci ini disemayamkan para raja Banawa seperti Raja La Makagili (Magau Banawa) dan keturunannya yang berjuang memimpin rakyat dengan kearifan maritim.',
    architecturalStyle: 'Makam batu padas bertingkat dengan nisan tipe Bugis-Makassar dan ukiran motif Kaili Banawa.',
    maritimeRelevance: 'Menghadap ke laut sebagai simbol para raja bahari yang menjaga perbatasan samudera.',
    audioNarration: {
      title: 'Heningnya Doa Para Penguasa Samudera',
      speakerName: 'Pemandu Sejarah Jamrin Abubakar S.Sos',
      durationText: '2 Menit 45 Detik',
      transcript: 'Langkahkan kaki dengan penuh takzim. Di bukit Tanjung Batu ini, para Magau (Raja) Banawa beristirahat dalam damai. Merekalah para pemimpin yang adil, yang memastikan setiap perahu nelayan dan kapal niaga yang masuk ke Donggala diperlakukan setara di bawah panji kehormatan adat Kaili.'
    },
    talkingPersona: {
      name: 'Makam Raja-Raja Banawa',
      role: 'Situs Penghormatan Leluhur & Magau Banawa',
      avatar: '👑',
      greeting: 'Pangnganro salam. Saya adalah kompleks peristirahatan Raja-raja Banawa. Dari atas bukit ini, semangat kepemimpinan luhur dan keberanian para leluhur terus memancarkan keteladanan bagi generasi kini.',
      systemPrompt: 'Kamu adalah Kompleks Makam Raja-Raja Banawa. Berbicaralah dengan nada agung, khidmat, menghargai nilai-nilai kepemimpinan adil, kearifan adat Kaili Banawa, dan silsilah kerajaan tempo dulu.',
      sampleQuestions: [
        'Siapa saja Raja Banawa yang paling terkenal dimakamkan di sini?',
        'Bagaimana Kerajaan Banawa menjaga kedaulatan wilayahnya di Selat Makassar?',
        'Apa makna simbolis ukiran pada nisan-nisan batu kuno ini?'
      ]
    },
    trivia: [
      'Batu nisan tertua di kompleks ini dipahat dari batu andesit padat oleh pengrajin batu ahli abad ke-17.',
      'Makam ini menjadi destinasi ziarah budaya tahunan masyarakat Sulawesi Tengah sebelum tradisi perayaan maritim.'
    ],
    keyFacts: [
      { label: 'Periode Sejarah', value: 'Abad ke-17 hingga Awal Abad ke-20' },
      { label: 'Gelar Pemimpin', value: 'Magau Banawa (Raja Banawa)' },
      { label: 'Tipe Nisan', value: 'Nisan Batu Pualam Berelief Kaligrafi & Flora' },
      { label: 'Lokasi', value: 'Kelurahan Tanjung Batu, Banawa' }
    ]
  },
  {
    id: 'gedung-lp-tua-boya',
    title: 'Gedung Penjara / Lembaga Pemasyarakatan Tua Boya',
    localName: 'De Oude Gevangenis van Donggala',
    kelurahan: 'Kelurahan Boya',
    establishedYear: '1920',
    period: 'Masa Penegakan Hukum Kolonial',
    category: 'Kolonial & Pemerintahan',
    locationDescription: 'Pusat Kelurahan Boya, Kecamatan Banawa',
    coordinates: {
      lat: -0.6750,
      lng: 119.7430,
      mapX: 46,
      mapY: 41,
    },
    thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80',
    pastPhoto: {
      url: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1000&q=80',
      caption: 'Tembok tebal penjara kolonial Donggala dengan pos jaga gerbang besi tahun 1928.',
      source: 'Arsip Kehakiman Hindia Belanda',
      year: '1928'
    },
    currentPhoto: {
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
      caption: 'Tembok benteng bata tebal 40 cm dengan jeruji besi tempa orisinil masa kolonial.',
      conditionStatus: 'Perlu Revitalisasi'
    },
    panorama360: {
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2000&q=80',
      type: 'sphere',
      initialYaw: 0,
      initialPitch: 0,
      hotspots: [
        {
          id: 'penjara-hotspot-1',
          title: 'Tembok Penjara Tebal Berpintu Besi Tempa',
          description: 'Dinding masif tahan guncangan yang dibangun dengan campuran kapur tohor dan batu bata merah bakar.',
          yaw: 10,
          pitch: 0
        },
        {
          id: 'penjara-hotspot-2',
          title: 'Pos Pengawas Menara Sudut',
          description: 'Gardu pantau penjaga untuk mengawasi seluruh area halaman dalam dan gerbang keluar.',
          yaw: -70,
          pitch: 15
        }
      ]
    },
    briefDescription: 'Struktur pertahanan dan peradilan tertua yang menjadi saksi pergolakan politik masa kolonial hingga awal kemerdekaan.',
    historicalSignificance: 'Pernah menjadi tempat penahanan para pejuang kemerdekaan pergerakan nasional di Sulawesi Tengah sebelum dipindahkan ke Makassar.',
    architecturalStyle: 'Benteng Kolonial Belanda Berdinding Bata Tebal dengan gerbang lengkung besi tempa.',
    maritimeRelevance: 'Menjaga keamanan kawasan pelabuhan dari aksi penyelundupan dan bajak laut Selat Makassar.',
    audioNarration: {
      title: 'Tembok Bisu Pejuang Kemerdekaan',
      speakerName: 'Pemandu Sejarah Ian Dwi Putera',
      durationText: '2 Menit',
      transcript: 'Di balik jeruji besi dingin ini, gema patriotisme tak pernah padam. Para pemuda pejuang kemerdekaan Donggala dan Sulawesi Tengah pernah mendekam di ruangan ini, memupuk keyakinan bahwa suatu hari bendera Merah Putih akan berkibar merdeka di atas tanah pertiwi.'
    },
    talkingPersona: {
      name: 'Benteng Penjara Tua Boya',
      role: 'Saksi Perjuangan & Hukum Kolonial 1920',
      avatar: '⛓️',
      greeting: 'Dinding saya tebal dan dingin, namun di dalamnya tersimpan bara api semangat para pejuang bangsa. Saya adalah Penjara Tua Boya. Ingin tahu kisah heroik di balik jeruji besi ini?',
      systemPrompt: 'Kamu adalah Gedung Penjara Tua Boya. Bicaralah tegas, penuh empati pada para pejuang kemerdekaan, menceritakan kisah keteguhan jiwa, perjuangan melawan penindasan kolonial, dan harapan kemerdekaan.',
      sampleQuestions: [
        'Siapa saja tokoh pergerakan yang pernah ditahan di sini?',
        'Bagaimana sistem keamanan penjara ini dirancang pada masa Belanda?',
        'Mengapa gedung ini penting sebagai bagian cagar budaya perjuangan bangsa?'
      ]
    },
    trivia: [
      'Campuran spesi perekat batu bata menggunakan adonan kapur tohor, pasir laut cuci, dan getah pohon khusus sehingga merekat sangat kuat.',
      'Pada masa pasca-kemerdekaan, gedung ini sempat difungsikan sebagai markas keamanan teritorial.'
    ],
    keyFacts: [
      { label: 'Tahun Dibangun', value: '1920-an' },
      { label: 'Ketebalan Tembok', value: '± 40 - 50 Sentimeter' },
      { label: 'Gaya Arsitektur', value: 'Fortress Kolonial Utilitarian' },
      { label: 'Wilayah', value: 'Kelurahan Boya, Banawa' }
    ]
  },
  {
    id: 'kantor-syahbandar-pelabuhan',
    title: 'Kantor Eks Syahbandar Pelabuhan Donggala',
    localName: 'Havenmeesterskantoor Donggala',
    kelurahan: 'Kelurahan Boya',
    establishedYear: '1910',
    period: 'Administrasi Maritim & Otoritas Pelabuhan',
    category: 'Maritim & Pelabuhan',
    locationDescription: 'Pesisir Dermaga Lama, Kelurahan Boya, Banawa',
    coordinates: {
      lat: -0.6720,
      lng: 119.7432,
      mapX: 39,
      mapY: 37,
    },
    thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    pastPhoto: {
      url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80',
      caption: 'Syahbandar pelabuhan memeriksa pas jalan kapal dagang bertonase besar tahun 1924.',
      source: 'Havenbedrijf Nederlandsch-Indie',
      year: '1924'
    },
    currentPhoto: {
      url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80',
      caption: 'Bangunan dua lantai dengan jendela pandang mengarah 360 derajat ke laut lepas teluk.',
      conditionStatus: 'Perlu Revitalisasi'
    },
    panorama360: {
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80',
      type: 'sphere',
      initialYaw: 30,
      initialPitch: 10,
      hotspots: [
        {
          id: 'syahbandar-hotspot-1',
          title: 'Balkon Menara Pantau Syahbandar',
          description: 'Tempat petugas syahbandar mengamati bendera isyarat kode maritim internasional (International Code of Signals).',
          yaw: 35,
          pitch: 15
        },
        {
          id: 'syahbandar-hotspot-2',
          title: 'Ruang Verifikasi Pas & Surat Laut',
          description: 'Meja pengesahan izin berlayar bagi kapal-kapal niaga antarpulau dan mancanegara.',
          yaw: -80,
          pitch: 0
        }
      ]
    },
    briefDescription: 'Pusat otoritas maritim yang mengatur ribuan izin sandar dan keselamatan pelayaran di Selat Makassar.',
    historicalSignificance: 'Syahbandar Donggala adalah salah satu otoritas kepelabuhanan tertua di Indonesia Timur yang menerapkan hukum laut modern.',
    architecturalStyle: 'Arsitektur Maritim Kolonial dengan menara observasi lantai atas dan teras pandang.',
    maritimeRelevance: 'Pusat penegakan aturan keselamatan pelayaran dan pemanduan kapal ke kolam labuh.',
    audioNarration: {
      title: 'Isyarat Bendera dan Izin Berlayar',
      speakerName: 'Pemandu Sejarah Ian Dwi Putera',
      durationText: '2 Menit 10 Detik',
      transcript: 'Dari balkon lantai dua ini, teropong kuningan syahbandar memantau setiap titik kapal di cakrawala. Begitu bendera isyarat dinaikkan ke tiang suar, perahu pemandu segera meluncur ke tengah laut menjemput nahkoda. Kantor Syahbandar adalah komandan dari seluruh ketertiban pelayaran di Teluk Donggala.'
    },
    talkingPersona: {
      name: 'Kantor Syahbandar Donggala',
      role: 'Komandan Tata Tertib Laut Selat Makassar',
      avatar: '🧭',
      greeting: 'Siap! Saya adalah Kantor Syahbandar Pelabuhan Donggala. Tidak ada kapal yang boleh melempar sauh atau mengangkat layar tanpa izin dari ruang komando saya. Mau tahu aturan pelayaran emas abad ke-19?',
      systemPrompt: 'Kamu adalah Kantor Syahbandar Donggala. Karaktermu disiplin, teratur, menguasai ilmu navigasi maritim, hukum laut, dan etika kepelabuhanan masa lampau.',
      sampleQuestions: [
        'Bagaimana cara memandu kapal besar masuk ke dermaga Donggala tempo dulu?',
        'Apa saja syarat bagi kapal asing yang ingin berdagang di Donggala?',
        'Bagaimana syahbandar menangani cuaca badai di Selat Makassar?'
      ]
    },
    trivia: [
      'Setiap kapal yang berlabuh wajib mencatatkan nama kapal, asal pelabuhan, dan muatan dalam Buku Register Pelabuhan Kulit Tebal.',
      'Bangunan ini memiliki tiang bendera semafor yang terlihat hingga jarak 5 mil dari laut.'
    ],
    keyFacts: [
      { label: 'Tahun Berdiri', value: '1910 Masehi' },
      { label: 'Fungsi Utama', value: 'Otoritas Navigasi, Izin Sandar & Kepelabuhanan' },
      { label: 'Struktur Khusus', value: 'Menara Observasi Pengawas 360 Derajat' },
      { label: 'Lokasi', value: 'Kelurahan Boya, Banawa' }
    ]
  },
  {
    id: 'gudang-kopra-kpm',
    title: 'Gudang Kopra & Hasil Bumi Kolonial KPM',
    localName: 'Copra Pakhuis & Expeditie Donggala',
    kelurahan: 'Kelurahan Boya',
    establishedYear: '1914',
    period: 'Zaman Keemasan Ekspor "Emas Putih" Kopra',
    category: 'Maritim & Pelabuhan',
    locationDescription: 'Kawasan Pergudangan Pantai Boya, Banawa',
    coordinates: {
      lat: -0.6725,
      lng: 119.7420,
      mapX: 41,
      mapY: 37,
    },
    thumbnail: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80',
    pastPhoto: {
      url: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1000&q=80',
      caption: 'Ribuan karung kopra berkualitas tinggi disusun rapi di gudang KPM Donggala siap ekspor tahun 1926.',
      source: 'Koloniaal Instituut Amsterdam',
      year: '1926'
    },
    currentPhoto: {
      url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80',
      caption: 'Rangka atap kayu bentang lebar berarsitektur industri kolonial awal abad ke-20.',
      conditionStatus: 'Perlu Revitalisasi'
    },
    panorama360: {
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2000&q=80',
      type: 'sphere',
      initialYaw: 180,
      initialPitch: 5,
      hotspots: [
        {
          id: 'gudang-hotspot-1',
          title: 'Kuda-Kuda Atap Kayu Bentang Lebar',
          description: 'Struktur teknik sambungan kayu tanpa tiang tengah agar ruang penyimpanan lapang dan sirkulasi udara kering terjaga.',
          yaw: 180,
          pitch: 25
        },
        {
          id: 'gudang-hotspot-2',
          title: 'Timbangan Gantung Raksasa',
          description: 'Alat ukur tonase komoditas berskala ratusan kilogram buatan pabrik mesin di Belanda.',
          yaw: 70,
          pitch: -5
        }
      ]
    },
    briefDescription: 'Gudang raksasa tempat disimpannya jutaan ton kopra, komoditas unggulan yang menjadikan Donggala kaya raya.',
    historicalSignificance: 'Kopra Donggala diakui sebagai salah satu kualitas terbaik dunia, diekspor untuk bahan baku mentega, sabun, dan minyak di Eropa.',
    architecturalStyle: 'Arsitektur Industri Gudang Kolonial dengan dinding ventilasi bata lubang angin berulang.',
    maritimeRelevance: 'Titik temu antara jalur perkebunan rakyat pedalaman dengan jalur kapal kargo samudra.',
    audioNarration: {
      title: 'Aroma Minyak dan Kejayaan Emas Putih',
      speakerName: 'Pemandu Sejarah Ian Dwi Putera',
      durationText: '2 Menit',
      transcript: 'Aroma wangi minyak kelapa dan kopra asap tercium hingga bermil-mil ke tengah laut. Di gudang inilah keringat para petani kelapa dari pelosok Banawa dan Lembah Palu dihargai tinggi dalam gulden Belanda dan pound sterling. Kopra adalah emas putih yang membangun peradaban megah Kota Donggala.'
    },
    talkingPersona: {
      name: 'Gudang Kopra KPM',
      role: 'Lumbung Emas Putih Komoditas Dunia',
      avatar: '🥥',
      greeting: 'Wangi kopra kering masih terasa di sudut-sudut kayu saya. Saya adalah Gudang Kopra KPM Donggala. Ingin tahu mengapa kopra Donggala diperebutkan pedagang dari London hingga Marseille?',
      systemPrompt: 'Kamu adalah Gudang Kopra Kolonial KPM di Donggala. Bicaralah penuh semangat agraris-maritim, menceritakan kerja keras petani kelapa, kualitas kopra kelas satu, dan jaringan kapal logistik internasional.',
      sampleQuestions: [
        'Mengapa kopra Donggala begitu terkenal di pasar dunia?',
        'Bagaimana cara menyimpan kopra agar tidak rusak selama berbulan-bulan di laut?',
        'Siapa saja pembeli internasional yang rutin datang ke gudang ini?'
      ]
    },
    trivia: [
      'Donggala dijuluki "Ibukota Kopra Sulawesi" sebelum kelapa sawit mendominasi pasar minyak nabati dunia.',
      'Rangka atap kayu gudang ini dirancang khusus agar uap panas kopra mengalir keluar secara alami tanpa bantuan kipas mesin.'
    ],
    keyFacts: [
      { label: 'Tahun Pembangunan', value: '1914 Masehi' },
      { label: 'Kapasitas Simpan', value: 'Hingga 5.000 Ton Karung Kopra' },
      { label: 'Struktur Atap', value: 'Rangka Kuda-Kuda Kayu Bentang Bebas' },
      { label: 'Lokasi', value: 'Kelurahan Boya, Banawa' }
    ]
  },
  {
    id: 'benteng-pos-pengawas-selat',
    title: 'Benteng & Pos Pengawas Selat Makassar',
    localName: 'Kustwacht & Verdedigingsfort Banawa',
    kelurahan: 'Kelurahan Tanjung Batu',
    establishedYear: 'Akhir Abad ke-18',
    period: 'Pertahanan Maritim Kerajaan Banawa & VOC/Kolonial',
    category: 'Pertahanan & Pengawasan',
    locationDescription: 'Tebing Karang Pantai Tanjung Batu, Banawa',
    coordinates: {
      lat: -0.6540,
      lng: 119.7320,
      mapX: 23,
      mapY: 16,
    },
    thumbnail: 'https://images.unsplash.com/photo-1507034589631-9433cc6bc453?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    pastPhoto: {
      url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80',
      caption: 'Meriam kuno di pos pertahanan pantai menghadap ke perairan Selat Makassar.',
      source: 'Koleksi Dokumentasi Benteng Pesisir',
      year: '1910'
    },
    currentPhoto: {
      url: 'https://images.unsplash.com/photo-1507034589631-9433cc6bc453?auto=format&fit=crop&w=1000&q=80',
      caption: 'Sisa bastion batu karang berundak yang kokoh menyatu dengan tebing Tanjung Batu.',
      conditionStatus: 'Sisa Struktur/Puing'
    },
    panorama360: {
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80',
      type: 'sphere',
      initialYaw: -90,
      initialPitch: -5,
      hotspots: [
        {
          id: 'benteng-hotspot-1',
          title: 'Embrasur Dudukan Meriam Besi Cor',
          description: 'Lubang intai dan celah tembak meriam pertahanan pantai yang mengunci gerbang masuk Teluk Palu.',
          yaw: -90,
          pitch: -5
        },
        {
          id: 'benteng-hotspot-2',
          title: 'Tembok Batu Karang Karst Alam',
          description: 'Dinding benteng yang memanfaatkan batu karang alam pantai sebagai tameng pelindung alamiah.',
          yaw: 45,
          pitch: -15
        }
      ]
    },
    briefDescription: 'Benteng pertahanan dan pos pemantau strategis yang mengamankan perairan Donggala dari serbuan bajak laut.',
    historicalSignificance: 'Menjadi saksi berbagai pertempuran laut dan pengintaian kapal patroli di jalur strategis Selat Makassar.',
    architecturalStyle: 'Bastion pertahanan batu karang alam pesisir bertingkat dengan parit lindung.',
    maritimeRelevance: 'Titik pertahanan garis depan mengontrol setiap armada kapal yang melintas antara Kalimantan dan Sulawesi.',
    audioNarration: {
      title: 'Dentum Meriam Penjaga Selat Makassar',
      speakerName: 'Pemandu Sejarah Jamrin Abubakar S.Sos',
      durationText: '2 Menit 15 Detik',
      transcript: 'Di atas tebing karang Tanjung Batu ini, mata para prajurit pengintai tak pernah berkedip memandang ombak Selat Makassar. Dari sini, lambaian layar perahu bajak laut dapat dideteksi dari kejauhan sebelum mereka sempat mendekati pemukiman rakyat. Ini adalah benteng keberanian tanah Banawa.'
    },
    talkingPersona: {
      name: 'Pos Benteng Tanjung Batu',
      role: 'Ksatria Pertahanan Pantai Banawa',
      avatar: '🛡️',
      greeting: 'Waspada di cakrawala! Saya adalah Pos Benteng Tanjung Batu. Meriam dan batu karang saya telah melindungi rakyat Donggala dari ancaman bahaya laut selama ratusan tahun. Ingin mendengar taktik pertahanan pantai kami?',
      systemPrompt: 'Kamu adalah Benteng Pos Pengawas Tanjung Batu Donggala. Karaktermu ksatria perkasa, waspada, menceritakan taktik pertahanan maritim, kepahlawanan para penjaga pantai, dan sejarah pertempuran laut.',
      sampleQuestions: [
        'Bagaimana cara prajurit mengintai kapal musuh di masa lampau?',
        'Mengapa tebing Tanjung Batu dipilih sebagai lokasi benteng utama?',
        'Senjata apa saja yang ditempatkan di benteng ini?'
      ]
    },
    trivia: [
      'Meriam besi cor yang pernah ada di pos ini bertuliskan lambang VOC dan diproduksi di Rotterdam abad ke-18.',
      'Tebing benteng memiliki gua-gua karang alami yang difungsikan sebagai tempat persembunyian amunisi mesiu.'
    ],
    keyFacts: [
      { label: 'Era Pembangunan', value: 'Akhir Abad ke-18 (± 1790)' },
      { label: 'Struktur Material', value: 'Batu Karang Alam & Pasak Kapur' },
      { label: 'Sudut Pandang', value: '270 Derajat Menghadap Selat Makassar' },
      { label: 'Zona', value: 'Kelurahan Tanjung Batu, Banawa' }
    ]
  },
  {
    id: 'dermaga-tenun-labuan-bajo',
    title: 'Dermaga Tradisional & Sentra Tenun Labuan Bajo',
    localName: 'Kampung Pelaut & Perajin Tenun Donggala',
    kelurahan: 'Kelurahan Labuan Bajo',
    establishedYear: 'Turun-Temurun (Abad ke-16)',
    period: 'Pusat Kebudayaan Maritim & Kerajinan Tenun Kaili',
    category: 'Arsitektur & Rumah Adat',
    locationDescription: 'Pesisir Kampung Labuan Bajo, Kecamatan Banawa',
    coordinates: {
      lat: -0.6820,
      lng: 119.7485,
      mapX: 68,
      mapY: 48,
    },
    thumbnail: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1600&q=80',
    pastPhoto: {
      url: 'https://images.unsplash.com/photo-1464817739973-0128fe77aaa1?auto=format&fit=crop&w=1000&q=80',
      caption: 'Ibu-ibu penenun Donggala menggunakan alat tenun gedogan tradisional di kolong rumah panggung pesisir tahun 1932.',
      source: 'Arsip Etnografi Sulawesi Tengah',
      year: '1932'
    },
    currentPhoto: {
      url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80',
      caption: 'Deretan rumah panggung kayu pesisir dengan perahu cadik nelayan berlabuh di tepian pantai.',
      conditionStatus: 'Terawat'
    },
    panorama360: {
      url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=2000&q=80',
      type: 'sphere',
      initialYaw: 140,
      initialPitch: 0,
      hotspots: [
        {
          id: 'tenun-hotspot-1',
          title: 'Alat Tenun Tradisional Gedogan',
          description: 'Alat tenun kayu manual warisan leluhur yang menghasilkan mahakarya Tenun Donggala motif Buya Bombo dan Subi.',
          yaw: 140,
          pitch: -10
        },
        {
          id: 'tenun-hotspot-2',
          title: 'Tambatan Perahu Lambo & Cadik Tradisional',
          description: 'Dermaga kayu tempat para nelayan mendaratkan hasil tangkapan ikan cakalang dan kakap merah segar.',
          yaw: -40,
          pitch: -5
        }
      ]
    },
    briefDescription: 'Kampung budaya pesisir hidup di mana tradisi berlayar dan mahakarya Tenun Donggala tetap lestari hingga kini.',
    historicalSignificance: 'Tenun Donggala merupakan salah satu warisan budaya takbenda paling bernilai di Indonesia. Labuan Bajo Banawa adalah episentrum para penenun mahir yang kainnya dipakai oleh para raja dan tokoh bangsawan.',
    architecturalStyle: 'Perkampungan Rumah Panggung Kayu Tepi Laut (Stilt Houses) dengan jembatan titian kayu (pelataran).',
    maritimeRelevance: 'Kehidupan komunitas nelayan tradisional yang memadukan mata pencaharian laut dengan seni tenun.',
    audioNarration: {
      title: 'Irama Hentakan Kayu Tenun Donggala',
      speakerName: 'Pemandu Budaya Ian Dwi Putera',
      durationText: '2 Menit 30 Detik',
      transcript: 'Dengarkan suara "tuk-klak-tuk-klak" dari alat tenun kayu di bawah rumah-rumah panggung Labuan Bajo. Dari jemari terampil kaum perempuan Banawa, benang-benang sutra dianyam menjadi sehelai kain Tenun Donggala yang anggun. Kain ini bukan sekadar busana, melainkan doa, kesabaran, dan identitas kehormatan masyarakat pesisir Donggala.'
    },
    talkingPersona: {
      name: 'Kampung Tenun Labuan Bajo',
      role: 'Penenun Tradisi & Pelaut Pesisir Banawa',
      avatar: '🧵',
      greeting: 'Kareba maroso! Selamat datang di pesisir Labuan Bajo Donggala. Di sini, angin laut berpadu dengan irama alat tenun tradisional. Mau tahu rahasia motif legendaris Tenun Donggala dan kisah para pelaut kami?',
      systemPrompt: 'Kamu adalah Kampung Tenun & Nelayan Labuan Bajo Banawa. Berbicaralah hangat, bersahaja, penuh rasa bangga akan kain Tenun Donggala (motif Buya Bombo, Subi, Palekat), keindahan perahu cadik, dan kearifan hidup para nelayan.',
      sampleQuestions: [
        'Apa saja motif Tenun Donggala yang paling bernilai tinggi?',
        'Berapa lama waktu yang dibutuhkan untuk menenun satu lembar kain sutra Donggala?',
        'Bagaimana kehidupan nelayan tradisional di Labuan Bajo Banawa?'
      ]
    },
    trivia: [
      'Kain Tenun Donggala pernah menjadi mahar kehormatan dalam pernikahan bangsawan di seluruh Sulawesi dan Kalimantan.',
      'Pewarna alami kain tempo dulu diekstrak dari kulit kayu mangrove, daun tarum, dan kunyit hutan.'
    ],
    keyFacts: [
      { label: 'Tradisi Sejarah', value: 'Sejak Abad ke-16 Masehi' },
      { label: 'Produk Kebudayaan', value: 'Kain Tenun Donggala (Warisan Budaya Nasional)' },
      { label: 'Kategori Kawasan', value: 'Living Heritage & Pemukiman Nelayan Tradisional' },
      { label: 'Lokasi', value: 'Kelurahan Labuan Bajo, Banawa' }
    ]
  },
  {
    id: 'gedung-percetakan-kolonial',
    title: 'Gedung Eks Percetakan Kolonial Donggala',
    localName: 'Drukkerij & Boekhandel Donggala',
    kelurahan: 'Kelurahan Gunung Bale',
    establishedYear: '1918',
    period: 'Era Literasi & Publikasi Hindia Belanda',
    category: 'Kolonial & Pemerintahan',
    locationDescription: 'Kawasan Lereng Gunung Bale, Banawa',
    coordinates: {
      lat: -0.6770,
      lng: 119.7395,
      mapX: 50,
      mapY: 58,
    },
    thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    pastPhoto: {
      url: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=1000&q=80',
      caption: 'Mesin cetak timah kuno dan tumpukan lembaran warta di percetakan Donggala tahun 1925.',
      source: 'Arsip Perpustakaan Nasional & Koleksi Daerah',
      year: '1925'
    },
    currentPhoto: {
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
      caption: 'Bangunan bercat putih dengan pintu ganda kayu jati dan ventilasi geometris antik.',
      conditionStatus: 'Perlu Revitalisasi'
    },
    panorama360: {
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80',
      type: 'sphere',
      initialYaw: 60,
      initialPitch: 0,
      hotspots: [
        {
          id: 'cetak-hotspot-1',
          title: 'Ruang Mesin Cetak Huruf Timah (Letterpress)',
          description: 'Tempat penyusunan huruf timah manual untuk mencetak lembaran berita resmi dan dokumen niaga.',
          yaw: 60,
          pitch: 5
        },
        {
          id: 'cetak-hotspot-2',
          title: 'Gudang Kertas & Bahan Arsip Pemerintahan',
          description: 'Ruang penyimpanan kertas segel dan dokumen bersejarah Afdeeling Donggala.',
          yaw: -80,
          pitch: 0
        }
      ]
    },
    briefDescription: 'Pusat penerbitan warta dan dokumen resmi pertama di Sulawesi Tengah pada awal abad ke-20.',
    historicalSignificance: 'Di gedung percetakan inilah dokumen-dokumen perdagangan pelabuhan, surat kabar lokal, dan warta pemerintah dicetak untuk disebarkan ke seluruh wilayah pedalaman.',
    architecturalStyle: 'Arsitektur Kolonial Transisi dengan jendela kaca kotak-kotak dan langit-langit berplafon kayu.',
    maritimeRelevance: 'Mencetak peta navigasi pesisir dan jadwal pasang surut air laut untuk para nahkoda kapal.',
    audioNarration: {
      title: 'Aroma Tinta dan Jejak Literasi Donggala',
      speakerName: 'Pemandu Sejarah Ian Dwi Putera',
      durationText: '2 Menit',
      transcript: 'Aroma tinta hitam dan derit mesin cetak huruf timah pernah menghidupkan gedung ini. Di zaman ketika informasi adalah barang mewah, percetakan Donggala adalah jendela ilmu pengetahuan bagi masyarakat pesisir dan pembesar kerajaan. Dari sini ide-ide kemajuan dicetak di atas lembaran kertas.'
    },
    talkingPersona: {
      name: 'Gedung Percetakan Kolonial',
      role: 'Perekam Jejak Literasi & Sejarah Donggala',
      avatar: '📰',
      greeting: 'Tinta saya mengering, tetapi kata-kata sejarah tak pernah pudar! Saya adalah Gedung Percetakan Kolonial Donggala. Ingin tahu lembaran warta apa yang paling mengguncang kota ini 100 tahun lalu?',
      systemPrompt: 'Kamu adalah Gedung Percetakan Kolonial Donggala di Gunung Bale. Karaktermu cerdas, kutu buku sejarah, suka berkisah tentang literasi pers masa lalu, mesin cetak huruf timah, dan surat kabar tempo dulu.',
      sampleQuestions: [
        'Surat kabar dan dokumen apa saja yang dicetak di sini?',
        'Bagaimana proses mencetak dokumen dengan huruf timah manual?',
        'Mengapa percetakan ini didirikan di Donggala dan bukan di kota lain?'
      ]
    },
    trivia: [
      'Huruf-huruf timah (letterpress font) diimpor langsung dari pabrik tipe aksara di Haarlem, Belanda.',
      'Gedung ini juga pernah mencetak buku panduan bahasa Kaili-Belanda karya ahli bahasa awal abad ke-20.'
    ],
    keyFacts: [
      { label: 'Tahun Berdiri', value: '1918 Masehi' },
      { label: 'Teknologi Utama', value: 'Mesin Cetak Letterpress Huruf Timah' },
      { label: 'Fungsi Awal', value: 'Percetakan Dokumen Resmi & Warta Niaga' },
      { label: 'Lokasi', value: 'Kelurahan Gunung Bale, Banawa' }
    ]
  },
  {
    id: 'kompleks-makam-keramat-tanjung',
    title: 'Situs Makam Keramat Pesisir Tanjung Batu',
    localName: 'Makam Keramat Dato Pesisir Banawa',
    kelurahan: 'Kelurahan Tanjung Batu',
    establishedYear: 'Abad ke-16',
    period: 'Penyebaran Awal Agama Islam & Tokoh Bahari',
    category: 'Religi & Multikultural',
    locationDescription: 'Pesisir Pantai Tanjung Batu, Banawa',
    coordinates: {
      lat: -0.6565,
      lng: 119.7340,
      mapX: 26,
      mapY: 20,
    },
    thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1507034589631-9433cc6bc453?auto=format&fit=crop&w=1600&q=80',
    pastPhoto: {
      url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80',
      caption: 'Para pelaut menggelar doa selamat di makam keramat sebelum mengarungi Samudra Pasifik tahun 1920.',
      source: 'Arsip Tradisi Bahari Sulawesi',
      year: '1920'
    },
    currentPhoto: {
      url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80',
      caption: 'Bangunan cungkup pelindung kayu sederhana berlatar belakang lautan biru jernih Tanjung Batu.',
      conditionStatus: 'Terawat'
    },
    panorama360: {
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80',
      type: 'sphere',
      initialYaw: 180,
      initialPitch: 0,
      hotspots: [
        {
          id: 'keramat-hotspot-1',
          title: 'Nisan Batu Karang Tua',
          description: 'Nisan batu alam kuno tokoh penyebar agama dan pelindung para musafir laut.',
          yaw: 180,
          pitch: -10
        }
      ]
    },
    briefDescription: 'Situs ziarah spiritual pesisir yang dihormati para pelaut antarpulau untuk memohon keselamatan di laut.',
    historicalSignificance: 'Makam ini menjadi simbol keterikatan batin pelaut dengan tanah leluhur, serta penghormatan pada tokoh penyebar kebajikan awal di pesisir Banawa.',
    architecturalStyle: 'Arsitektur Makam Cungkup Pesisir Tradisional dengan dinding kayu berventilasi laut.',
    maritimeRelevance: 'Titik perhentian kapal nelayan melafalkan doa sebelum melewati perairan Selat Makassar yang berarus deras.',
    audioNarration: {
      title: 'Doa Selamat di Tepian Tanjung Batu',
      speakerName: 'Pemandu Sejarah Jamrin Abubakar S.Sos',
      durationText: '2 Menit 10 Detik',
      transcript: 'Di tepi ombak yang memecah karang Tanjung Batu, doa-doa para pelaut dilantunkan dengan khusyuk. Menghormati mereka yang mendahului kita adalah kearifan bahari yang mengajarkan kerendahan hati manusia di hadapan luas dan dahsyatnya samudera raya.'
    },
    talkingPersona: {
      name: 'Makam Keramat Tanjung Batu',
      role: 'Penjaga Doa & Spiritualitas Pelaut Banawa',
      avatar: '🌊',
      greeting: 'Salam kedamaian dari tepi samudra. Saya adalah Makam Keramat Tanjung Batu. Di sini para pelaut belajar bahwa keberanian di laut harus senantiasa dilandasi dengan doa dan kerendahan hati.',
      systemPrompt: 'Kamu adalah Situs Makam Keramat Tanjung Batu. Karaktermu teduh, spiritual, menghargai tradisi bahari Nusantara, keselamatan pelayaran, dan nilai kesucian alam laut.',
      sampleQuestions: [
        'Siapa tokoh penyebar ajaran yang dimakamkan di sini?',
        'Mengapa para pelaut selalu singgah berdoa sebelum berlayar jauh?',
        'Bagaimana kearifan lokal menjaga kebersihan perairan Tanjung Batu?'
      ]
    },
    trivia: [
      'Di sekitar makam terdapat sumber mata air tawar kecil yang tidak pernah asin meski berada tepat di atas garis pasang air laut.',
      'Situs ini menjadi titik tolak ritual adat keselamatan laut yang diadakan secara berkala oleh masyarakat Banawa.'
    ],
    keyFacts: [
      { label: 'Era Situs', value: 'Abad ke-16 / Abad ke-17' },
      { label: 'Fungsi Budaya', value: 'Situs Ziarah Spiritual & Sejarah Maritim' },
      { label: 'Lingkungan', value: 'Tanjung Karang Pesisir Pantai' },
      { label: 'Lokasi', value: 'Kelurahan Tanjung Batu, Banawa' }
    ]
  },
  {
    id: 'gedung-kantor-pos-pantai',
    title: 'Gedung Syahbandar Pembantu & Pos Pantau Boya',
    localName: 'Hulp Havenkantoor & Kustpost',
    kelurahan: 'Kelurahan Boya',
    establishedYear: '1922',
    period: 'Pusat Keamanan Lalu Lintas Laut',
    category: 'Pertahanan & Pengawasan',
    locationDescription: 'Tepi Muara Boya, Banawa',
    coordinates: {
      lat: -0.6730,
      lng: 119.7435,
      mapX: 42,
      mapY: 39,
    },
    thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
    pastPhoto: {
      url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80',
      caption: 'Petugas pantai memeriksa perahu nelayan yang merapat di muara sungai Boya 1928.',
      source: 'Arsip Maritim Hindia Belanda',
      year: '1928'
    },
    currentPhoto: {
      url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80',
      caption: 'Struktur bangunan beratap seng tebal dengan dinding kayu ulin pesisir.',
      conditionStatus: 'Perlu Revitalisasi'
    },
    panorama360: {
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80',
      type: 'sphere',
      initialYaw: 0,
      initialPitch: 0,
      hotspots: [
        {
          id: 'pospantai-hotspot-1',
          title: 'Ruang Pemeriksaan Muatan Sungai & Laut',
          description: 'Pos pengecekan hasil tangkapan nelayan dan komoditas yang diangkut perahu sampan dari hulu sungai.',
          yaw: 15,
          pitch: 0
        }
      ]
    },
    briefDescription: 'Pos pengawasan lalu lintas perahu tradisional dan pertahanan pesisir muara pelabuhan Boya.',
    historicalSignificance: 'Menghubungkan arus logistik perahu sungai dari lembah pedalaman Donggala dengan kapal kargo laut terbuka.',
    architecturalStyle: 'Bangunan Kayu Tropis Panggung Pesisir dengan fondasi tiang beton cor antik.',
    maritimeRelevance: 'Mengatur alur keluar masuk perahu nelayan agar tidak bertabrakan dengan kapal uap besar.',
    audioNarration: {
      title: 'Pertemuan Muara Sungai dan Laut Luas',
      speakerName: 'Pemandu Sejarah Ian Dwi Putera',
      durationText: '1 Menit 50 Detik',
      transcript: 'Di muara inilah perahu-perahu lesung dan sampan dari pedalaman Banawa bertemu dengan ombak asin Selat Makassar. Pos pantau ini menjadi pengatur irama lalu lintas air, memastikan setiap perahu nelayan pulang dengan selamat membawa berkah bagi keluarganya.'
    },
    talkingPersona: {
      name: 'Pos Pantau Muara Boya',
      role: 'Pengawal Alur Muara & Perahu Nelayan',
      avatar: '🛶',
      greeting: 'Salam dari muara! Saya adalah Pos Pantau Muara Boya. Menyaksikan hilir mudik ribuan perahu sampan hingga kapal kayu bermesin adalah rutinitas sehari-hari saya.',
      systemPrompt: 'Kamu adalah Pos Pantau Muara Boya Donggala. Karaktermu ramah, akrab dengan nelayan lokal, mengerti seluk beluk pasang surut air sungai dan laut.',
      sampleQuestions: [
        'Bagaimana sistem pengaturan lalu lintas perahu di muara?',
        'Apa saja komoditas yang dibawa dari pedalaman lewat sungai?',
        'Bagaimana kondisi pasang surut mempengaruhi sandar perahu?'
      ]
    },
    trivia: [
      'Pos ini dilengkapi lonceng kabut dari kuningan tebal untuk memandu perahu saat pandangan terhalang hujan lebat.',
      'Muara Boya dulunya adalah habitat burung camar laut dan bakau asri yang melindungi garis pantai dari abrasi.'
    ],
    keyFacts: [
      { label: 'Tahun Dibangun', value: '1922 Masehi' },
      { label: 'Fungsi Kunci', value: 'Pengawas Lalu Lintas Muara & Dermaga Nelayan' },
      { label: 'Material', value: 'Kayu Ulin & Rangka Seng Belanda' },
      { label: 'Zona', value: 'Muara Pantai Boya, Banawa' }
    ]
  },
  {
    id: 'BUDAYA-352',
    title: 'Pusentasi (Pusat Laut)',
    localName: 'Pusentasi',
    kelurahan: 'Kelurahan Tanjung Batu',
    establishedYear: 'Alami / Prasejarah',
    period: 'Geologi Pesisir & Legenda Kaili',
    category: 'Situs',
    locationDescription: 'Desa Towale / Pesisir Banawa, Kabupaten Donggala (-0.7101073, 119.6638642)',
    coordinates: {
      lat: -0.7101073,
      lng: 119.6638642,
      mapX: 22,
      mapY: 76,
    },
    thumbnail: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlfH06gTE6NxCKLfyPO5y1WUmqfqCivx76S_jFkUcksheiTQzsxHUQXp1DyKPS0kvpgo4WjUjxsb0ugjcUeQApIPSZXlocAXk2PgxqrQ-hjA05LfBih0lLBhGdWr7kkYGQOCJ5tPg=s680-w680-h510-rw',
    bannerImage: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlfH06gTE6NxCKLfyPO5y1WUmqfqCivx76S_jFkUcksheiTQzsxHUQXp1DyKPS0kvpgo4WjUjxsb0ugjcUeQApIPSZXlocAXk2PgxqrQ-hjA05LfBih0lLBhGdWr7kkYGQOCJ5tPg=s680-w680-h510-rw',
    pastPhoto: {
      url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlfH06gTE6NxCKLfyPO5y1WUmqfqCivx76S_jFkUcksheiTQzsxHUQXp1DyKPS0kvpgo4WjUjxsb0ugjcUeQApIPSZXlocAXk2PgxqrQ-hjA05LfBih0lLBhGdWr7kkYGQOCJ5tPg=s680-w680-h510-rw',
      caption: 'Dokumentasi Sumur Raksasa Alami Pusentasi Donggala (Dok. Jamrin Abubakar).',
      source: 'Koleksi Cerita Rakyat Kabupaten Donggala',
      year: '1970'
    },
    currentPhoto: {
      url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlfH06gTE6NxCKLfyPO5y1WUmqfqCivx76S_jFkUcksheiTQzsxHUQXp1DyKPS0kvpgo4WjUjxsb0ugjcUeQApIPSZXlocAXk2PgxqrQ-hjA05LfBih0lLBhGdWr7kkYGQOCJ5tPg=s680-w680-h510-rw',
      caption: 'Pusentasi (Pusat Laut) dengan air asin jernih kebiruan berdiameter 10 meter dan kedalaman 7 meter.',
      conditionStatus: 'Terawat'
    },
    panorama360: {
      url: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlfH06gTE6NxCKLfyPO5y1WUmqfqCivx76S_jFkUcksheiTQzsxHUQXp1DyKPS0kvpgo4WjUjxsb0ugjcUeQApIPSZXlocAXk2PgxqrQ-hjA05LfBih0lLBhGdWr7kkYGQOCJ5tPg=s680-w680-h510-rw',
      type: 'sphere',
      initialYaw: 0,
      initialPitch: 0,
      hotspots: [
        {
          id: 'pusentasi-hotspot-1',
          title: 'Sumur Alami Air Asin',
          description: 'Berjarak 300 meter dari pantai dan memiliki fenomena unik pasang surut berkebalikan dari air laut.',
          yaw: 10,
          pitch: -5
        }
      ]
    },
    video360: {
      url: 'https://www.youtube.com/watch?v=zgKjAvmdY5o',
      title: 'Dokumenter Video Pusentasi Donggala',
      provider: 'youtube'
    },
    videoDocumentaryUrl: 'https://www.youtube.com/watch?v=zgKjAvmdY5o',
    briefDescription: 'Sumur Raksasa alami berdiameter 10 meter dengan kedalaman 7 meter berair asin jernih kebiruan yang pasang surutnya berkebalikan dengan air laut.',
    historicalSignificance: 'Pusentasi (pusat Laut) adalah Sumur Raksasa yang terbentuk secara alami berdiameter 10 meter dan mempunyai kedalaman 7 meter. Nama Pusentasi dalam bahasa Kaili (suku asli Sulawesi Tengah) berasal dari kata "Pusen" berarti Pusat dan "Tasi" berarti Laut. Air di dalamnya berasa asin seperti air laut dan berwarna jernih kebiru-biruan. Diduga ada sebuah lubang yang menghubungkan antara pantai dan pusentasi, karenanya jaraknya sekitar 300 meter. Keunikan pusentasi airnya tidak pernah keruh dan akan mengalami pasang apabila air laut sedang surut dan demikian pula sebaliknya. Memiliki legenda cerita rakyat yang oleh Jamrin Abubakar seorang wartawan di Donggala telah menulisnya dalam sebuah buku berjudul Pusentasi Cerita Rakyat Kabupaten Donggala.',
    architecturalStyle: 'Formasi Geologi Alami Karst Pesisir Selat Makassar',
    maritimeRelevance: 'Memiliki keterhubungan hidrologis unik dengan laut Selat Makassar serta menjadi simbol kekayaan geologi dan cerita rakyat maritim Donggala.',
    audioNarration: {
      title: 'Misteri Sumur Raksasa Pusentasi Donggala',
      speakerName: 'Pemandu Budaya Donggala',
      durationText: '2 Menit 10 Detik',
      transcript: 'Tabe! Dalam bahasa Kaili, Pusen berarti Pusat dan Tasi berarti Laut. Sumur raksasa alami berdiameter 10 meter dengan kedalaman 7 meter ini airnya jernih kebiruan dan berasa asin seperti air laut, menyimpan legenda rakyat Kabupaten Donggala yang memesona.'
    },
    talkingPersona: {
      name: 'Pusentasi (Pusat Laut)',
      role: 'Situs Alami & Warisan Budaya Donggala',
      avatar: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlfH06gTE6NxCKLfyPO5y1WUmqfqCivx76S_jFkUcksheiTQzsxHUQXp1DyKPS0kvpgo4WjUjxsb0ugjcUeQApIPSZXlocAXk2PgxqrQ-hjA05LfBih0lLBhGdWr7kkYGQOCJ5tPg=s680-w680-h510-rw',
      greeting: 'Tabe! Saya Pusentasi, sumur raksasa alami berair asin jernih di pesisir Banawa, Donggala.',
      systemPrompt: 'Anda adalah persona Pusentasi (Pusat Laut) Kabupaten Donggala. Karakter ramah, bersahaja, menjelaskan keajaiban alam dan legenda kaili pusentasi.',
      sampleQuestions: [
        'Mengapa airmu berasa asin seperti laut?',
        'Bagaimana kaitan pasang surutmu dengan air laut?',
        'Ceritakan legenda cerita rakyat di balik Pusentasi'
      ]
    },
    trivia: [
      'Berasal dari bahasa Kaili: Pusen (Pusat) dan Tasi (Laut).',
      'Airnya tidak pernah keruh dan akan pasang ketika air laut surut, dan sebaliknya.',
      'Diabadikan oleh wartawan Jamrin Abubakar dalam buku Cerita Rakyat Kabupaten Donggala.'
    ],
    keyFacts: [
      { label: 'Diameter', value: '10 Meter' },
      { label: 'Kedalaman', value: '7 Meter' },
      { label: 'Jarak ke Pantai', value: '±300 Meter' },
      { label: 'Kategori', value: 'Situs Cagar Budaya & Alam' }
    ]
  },
  {
    id: 'gedung-bioskop',
    title: 'Gedung Bioskop Donggala (Gembira Theater)',
    localName: 'Gembira Theater Donggala',
    kelurahan: 'Kelurahan Boya',
    establishedYear: '1950',
    period: 'Era Pasca-Kemerdekaan & Modern Klasik',
    category: 'Kawasan',
    locationDescription: 'Kawasan Pusat Kota Donggala, Banawa (-0.6683706, 119.7385271)',
    coordinates: {
      lat: -0.6683706,
      lng: 119.7385271,
      mapX: 46,
      mapY: 34,
    },
    thumbnail: 'https://assets-a2.kompasiana.com/items/album/2025/06/19/dua-bekas-loket-pertama-di-gedung-gembira-theater-yang-sangat-lama-digunakan-foto-jamrin-ab-6853f963ed641537973f6932.jpg?t=o&v=770',
    bannerImage: 'https://assets-a2.kompasiana.com/items/album/2025/06/19/dua-bekas-loket-pertama-di-gedung-gembira-theater-yang-sangat-lama-digunakan-foto-jamrin-ab-6853f963ed641537973f6932.jpg?t=o&v=770',
    pastPhoto: {
      url: 'https://assets-a2.kompasiana.com/items/album/2025/06/19/dua-bekas-loket-pertama-di-gedung-gembira-theater-yang-sangat-lama-digunakan-foto-jamrin-ab-6853f963ed641537973f6932.jpg?t=o&v=770',
      caption: 'Dua bekas loket tiket pertama di gedung Gembira Theater yang sangat lama digunakan (Foto: Jamrin Abubakar).',
      source: 'Arsip Jamrin Abubakar',
      year: '1960'
    },
    currentPhoto: {
      url: 'https://assets-a2.kompasiana.com/items/album/2025/06/19/dua-bekas-loket-pertama-di-gedung-gembira-theater-yang-sangat-lama-digunakan-foto-jamrin-ab-6853f963ed641537973f6932.jpg?t=o&v=770',
      caption: 'Sisa fisik loket tiket bioskop tua Gembira Theater Donggala.',
      conditionStatus: 'Sisa Struktur/Puing'
    },
    panorama360: {
      url: 'https://assets-a2.kompasiana.com/items/album/2025/06/19/dua-bekas-loket-pertama-di-gedung-gembira-theater-yang-sangat-lama-digunakan-foto-jamrin-ab-6853f963ed641537973f6932.jpg?t=o&v=770',
      type: 'sphere',
      initialYaw: 0,
      initialPitch: 0,
      hotspots: [
        {
          id: 'bioskop-hotspot-1',
          title: 'Loket Tiket Layar Perak',
          description: 'Dua loket tiket bersejarah tempat warga membeli karcis menonton film layar lebar.',
          yaw: 0,
          pitch: 0
        }
      ]
    },
    video360: {
      url: 'https://www.youtube.com/watch?v=zgKjAvmdY5o',
      title: 'Nostalgia Bioskop Donggala',
      provider: 'youtube'
    },
    videoDocumentaryUrl: 'https://www.youtube.com/watch?v=zgKjAvmdY5o',
    briefDescription: 'Gedung bioskop bersejarah Gembira Theater yang menjadi pusat hiburan layar perak masyarakat Donggala sejak masa keemasannya.',
    historicalSignificance: 'Bioskop Donggala (Gembira Theater) merupakan saksi bisu denyut kehidupan urban dan budaya hiburan rakyat di Donggala pada era keemasan pelabuhan dan perdagangan. Bekas loket tiketnya masih memperlihatkan jejak interaksi masyarakat menikmati film-film klasik masa lampau.',
    architecturalStyle: 'Arsitektur Komersial Pertengahan Abad ke-20',
    maritimeRelevance: 'Menjadi tempat rekreasi hiburan bagi para awak kapal niaga dan masyarakat pesisir saat sandar di Pelabuhan Donggala.',
    audioNarration: {
      title: 'Layar Perak di Pesisir Banawa',
      speakerName: 'Pemandu Budaya Donggala',
      durationText: '1 Menit 45 Detik',
      transcript: 'Gembira Theater adalah detak hiburan perfilman tempo dulu di Donggala. Di loket bersejarah inilah masyarakat berbondong-bondong mengantre karcis untuk menyaksikan keajaiban film layar perak.'
    },
    talkingPersona: {
      name: 'Gedung Bioskop Donggala',
      role: 'Saksi Sejarah Hiburan Layar Perak',
      avatar: 'https://assets-a2.kompasiana.com/items/album/2025/06/19/dua-bekas-loket-pertama-di-gedung-gembira-theater-yang-sangat-lama-digunakan-foto-jamrin-ab-6853f963ed641537973f6932.jpg?t=o&v=770',
      greeting: 'Tabe! Selamat datang di bekas loket Gembira Theater, gedung bioskop kebanggaan warga Donggala tempo dulu.',
      systemPrompt: 'Anda adalah persona Gedung Bioskop Donggala (Gembira Theater). Ceritakan tentang kenangan film klasik, dua loket tiket legendaris, dan suasana ramai masyarakat Donggala saat menonton.',
      sampleQuestions: [
        'Kapan bioskop ini pertama kali beroperasi?',
        'Film apa saja yang populer di Gembira Theater?',
        'Bagaimana cerita di balik dua loket tiket yang tersisa?'
      ]
    },
    trivia: [
      'Dikenal masyarakat sebagai Gembira Theater.',
      'Memiliki dua lubang loket tiket bersejarah yang diabadikan oleh jurnalis Jamrin Abubakar.',
      'Pusat berkumpulnya kawula muda dan masyarakat Donggala menikmati film layar perak.'
    ],
    keyFacts: [
      { label: 'Nama Populer', value: 'Gembira Theater' },
      { label: 'Fungsi Awal', value: 'Bioskop Layar Lebar' },
      { label: 'Kategori', value: 'Kawasan Bersejarah' },
      { label: 'Lokasi', value: 'Pusat Kota Donggala' }
    ]
  }
];

export const HISTORICAL_TIMELINE = [
  {
    year: 'Abad ke-15 - 16',
    title: 'Era Pelabuhan Perdagangan Antarpulau & Kerajaan Banawa',
    description: 'Donggala menjadi pelabuhan transit tersibuk di pesisir barat Sulawesi dalam jalur perdagangan Selat Makassar selain Selat Malaka dan Laut Banda.',
    category: 'Maritim & Kerajaan'
  },
  {
    year: '1885',
    title: 'Pembangunan Klenteng Thian Hou Kiong',
    description: 'Komunitas Tionghoa dan saudagar maritim mendirikan klenteng pemujaan Dewi Samudera Mazu di muara pelabuhan Boya sebagai simbol perlindungan pelaut.',
    category: 'Multikultural & Religi'
  },
  {
    year: '1892',
    title: 'Pembangunan Souraja (Banua Oge) Kerajaan Banawa',
    description: 'Istana kayu agung Kaili didirikan di Gunung Bale tanpa paku besi, menampilkan arsitektur tahan gempa dan pusat kearifan hukum adat Kaili.',
    category: 'Arsitektur & Budaya'
  },
  {
    year: '1898',
    title: 'Pemasangan Menara Mercusuar Tanjung Batu',
    description: 'Pemerintah kolonial Hindia Belanda membangun menara suar baja di Tanjung Batu untuk memandu jalur pelayaran internasional Selat Makassar.',
    category: 'Navigasi Maritim'
  },
  {
    year: '1905',
    title: 'Pendirian Gedung Asisten Residen Gunung Bale',
    description: 'Donggala ditetapkan sebagai ibukota Afdeeling Midden Celebes (Sulawesi Tengah), menjadikannya pusat administrasi pemerintahan kolonial.',
    category: 'Pemerintahan'
  },
  {
    year: '1912',
    title: 'Peresmian Kantor Dagang KPM Donggala',
    description: 'Maskapai pelayaran Koninklijke Paketvaart-Maatschappij menjadikan Donggala pangkalan utama kapal uap kargo rempah, rotan, dan kopra dunia.',
    category: 'Ekonomi & Pelayaran'
  },
  {
    year: '1915 - 1925',
    title: 'Zaman Keemasan Ekspor Kopra & Tenun Donggala',
    description: 'Deretan rumah saudagar Arab-Melayu di Boya dibangun dan ekspor kopra mencapai puncaknya, menjadikan Donggala kota pelabuhan modern terkemuka.',
    category: 'Kejayaan Niaga'
  },
  {
    year: '2026',
    title: 'Inisiatif Digitalisasi Situs Sejarah Kota Tua Donggala (FPK 2026)',
    description: 'Peluncuran platform digital interaktif "Menghidupkan Donggala dalam Satu Pintu Digital" didukung Balai Pelestarian Kebudayaan Wilayah XVIII & Kemendikdasmen.',
    category: 'Pelestarian Digital'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Kapan Menara Mercusuar Tanjung Batu Donggala pertama kali didirikan?',
    options: ['Tahun 1898', 'Tahun 1945', 'Tahun 1920', 'Tahun 1850'],
    correctIndex: 0,
    explanation: 'Mercusuar Tanjung Batu didirikan pada tahun 1898 untuk memandu kapal dagang di perairan strategis Selat Makassar.',
    siteIdReference: 'mercusuar-tanjung-batu'
  },
  {
    id: 'q2',
    question: 'Apa keunikan arsitektur utama dari Rumah Adat Souraja Banawa?',
    options: [
      'Menggunakan beton cor bertingkat tiga',
      'Konstruksi kayu panggung yang dirakit dengan sistem pasak tanpa paku besi sehingga lentur tahan gempa',
      'Dibangun di atas tongkang terapung di laut',
      'Atapnya terbuat dari kubah kaca Prancis'
    ],
    correctIndex: 1,
    explanation: 'Souraja dibangun menggunakan kayu ulin dengan konstruksi knock-down purus dan pasak kayu tradisional tanpa paku besi, terbukti tangguh meredam getaran seismik tektonik.',
    siteIdReference: 'souraja-donggala-banawa'
  },
  {
    id: 'q3',
    question: 'Perusahaan pelayaran Belanda manakah yang mendirikan kantor dagang megah di Kelurahan Boya pada tahun 1912?',
    options: [
      'VOC (Vereenigde Oostindische Compagnie)',
      'KPM (Koninklijke Paketvaart-Maatschappij)',
      'KNIL (Koninklijk Nederlandsch-Indisch Leger)',
      'BPM (Bataafsche Petroleum Maatschappij)'
    ],
    correctIndex: 1,
    explanation: 'KPM (Koninklijke Paketvaart-Maatschappij) mendirikan kantor megah di Donggala tahun 1912 untuk mengangkut komoditas kopra dan hasil bumi melintasi samudra.',
    siteIdReference: 'kpm-office-donggala'
  },
  {
    id: 'q4',
    question: 'Kain tradisional khas Donggala yang terkenal hingga mancanegara dan ditenun di pesisir Labuan Bajo adalah...',
    options: [
      'Kain Ulos',
      'Tenun Donggala (motif Buya Bombo & Subi)',
      'Batik Parang Rusak',
      'Kain Songket Palembang'
    ],
    correctIndex: 1,
    explanation: 'Tenun Donggala dengan motif khas seperti Buya Bombo, Subi, dan Palekat merupakan warisan budaya kebanggaan masyarakat pesisir Banawa.',
    siteIdReference: 'dermaga-tenun-labuan-bajo'
  },
  {
    id: 'q5',
    question: 'Di kelurahan manakah terletak Gedung Eks Asisten Residen Donggala yang berada di kawasan perbukitan?',
    options: [
      'Kelurahan Gunung Bale',
      'Kelurahan Tanjung Batu',
      'Kelurahan Boya',
      'Kelurahan Labuan Bajo'
    ],
    correctIndex: 0,
    explanation: 'Gedung Asisten Residen Donggala didirikan tahun 1905 di lereng asri Kelurahan Gunung Bale untuk memantau kota dan pelabuhan dari ketinggian.',
    siteIdReference: 'rumah-asisten-residen'
  }
];

export const AMBIENT_SOUNDSCAPES = [
  {
    id: 'selat-makassar-waves',
    title: 'Deru Ombak Selat Makassar',
    subtitle: 'Suasana pesisir pantai Tanjung Batu & angin laut',
    icon: '🌊',
    audioFreq: 220,
    type: 'waves'
  },
  {
    id: 'pelabuhan-donggala-bustle',
    title: 'Lonceng & Peluit Kapal Pelabuhan 1912',
    subtitle: 'Gema derap niaga dan kapal uap bersandar di Boya',
    icon: '⚓',
    audioFreq: 440,
    type: 'harbor'
  },
  {
    id: 'kaili-traditional-harmonies',
    title: 'Petikan Kecapi & Seruling Kaili',
    subtitle: 'Alunan musik tradisional yang menyejukkan hati di Souraja',
    icon: '🎵',
    audioFreq: 330,
    type: 'melody'
  }
];

export const projectDetails = {
  title: 'Menghidupkan Donggala dalam Satu Pintu Digital',
  subtitle: 'Platform Digital Interaktif dan Imersif Situs Sejarah Kota Tua Donggala',
  applicantName: 'Ian Dwi Putera',
  expertAdvisor: 'Jamrin Abubakar, S.Sos',
  expertAdvisorDesc: 'Tim Ahli Cagar Budaya Kab Donggala dan Tokoh Budaya Kabupaten Donggala',
  leadership: [
    { role: 'Ketua Tim Pengusul', name: 'Ian Dwi Putera' },
    { role: 'Sekretaris', name: 'Andi Hendrawan' },
    { role: 'Bendahara', name: 'Annisa' }
  ],
  techAndDesign: [
    { role: 'Perancang Desain Antarmuka (UI/UX Designer) & Integrasi Konten', name: 'Ian Dwi Putera' },
    { role: 'Pengembang Web (Web Programmer)', name: 'Abdul Fajar Laudjeng' },
    { role: 'Penulis Skrip', name: 'Andi Hendrawan' }
  ],
  creativeAndMedia: [
    { role: 'Editor konten 360°', name: 'Zulkarnain' },
    { role: 'Perancang Audio & Musik Latar', name: 'Renal' },
    { role: 'Tim Narator', name: '(Nama dikosongkan)' }
  ],
  operationsAndField: [
    { role: 'Divisi Dokumentasi & Transportasi', name: 'Afid A' },
    { role: 'Divisi Perlengkapan', name: 'Razya Saputra' },
    { role: 'Divisi Konsumsi & Akomodasi', name: 'Arya Ananta & Bahrul Ulum' }
  ],
  teamMembers: [
    'Ian Dwi Putera (Ketua Tim Pengusul & UI/UX Designer)',
    'Andi Hendrawan (Sekretaris & Penulis Skrip)',
    'Annisa (Bendahara)',
    'Abdul Fajar Laudjeng (Pengembang Web / Web Programmer)',
    'Zulkarnain (Editor Konten 360°)',
    'Renal (Perancang Audio & Musik Latar)',
    'Tim Narator (Dikosongkan)',
    'Afid A (Divisi Dokumentasi & Transportasi)',
    'Razya Saputra (Divisi Perlengkapan)',
    'Arya Ananta & Bahrul Ulum (Divisi Konsumsi & Akomodasi)'
  ],
  fundingProgram: 'Bantuan Pemerintah Fasilitasi Pemajuan Kebudayaan (FPK) 2026',
  fundingCategory: 'Dokumentasi Karya / Pengetahuan Tradisional / Objek Pemajuan Kebudayaan Digital',
  recommendingInstitution: 'Balai Pelestarian Kebudayaan (BPK) Wilayah XVIII (Sulawesi Tengah & Gorontalo)',
  recommendationDetails: 'Rekomendasi Resmi Pemanfaatan & Digitalisasi Cagar Budaya Kota Tua Donggala',
  targetLocation: 'Kawasan Kota Tua Donggala (Kelurahan Boya, Kelurahan Gunung Bale, Kelurahan Tanjung Batu, Kelurahan Labuan Bajo), Kec. Banawa, Kab. Donggala, Sulawesi Tengah',
  background: 'Kawasan Kota Tua Donggala merupakan episentrum sejarah maritim di Selat Makassar sejak abad ke-15 yang menyimpan 15 situs cagar budaya megah. Namun, banyak bangunan bersejarah mengalami penurunan kondisi fisik dan minimnya aksesibilitas dokumentasi digital generasi muda. Platform ini menghadirkan "Satu Pintu Digital" berstandar internasional dengan visual 360°, audio storytelling, komparasi linimasa foto kolonial, dan dialog interaktif Talking Tour AI terinspirasi Google Arts & Culture untuk melestarikan memori peradaban maritim nusantara.',
  targetSitesList: [
    'Kantor Dagang KPM Donggala (1912) - Kelurahan Boya',
    'Menara Mercusuar Tanjung Batu (1898) - Kelurahan Tanjung Batu',
    'Rumah Adat Souraja / Banua Oge (1892) - Kelurahan Gunung Bale',
    'Rumah Eks Asisten Residen Donggala (1905) - Kelurahan Gunung Bale',
    'Gedung Eks Kantor Bea & Cukai Donggala (1915) - Kelurahan Boya',
    'Rumah Saudagar Arab Hadramaut (1918) - Kelurahan Boya',
    'Klenteng Jin De Yuan / Thian Hou Kiong (1885) - Kelurahan Boya',
    'Dermaga Sentra Tenun Donggala Tradisional (1930) - Kelurahan Labuan Bajo',
    'Makam Magau Banawa & Raja Lamarauna (1890) - Kelurahan Gunung Bale',
    'Gedung Eks Percetakan & Kantor Pos Kolonial (1920) - Kelurahan Boya',
    'Gedung Eks Rumah Sakit Militer Kolonial (1916) - Kelurahan Gunung Bale',
    'Gudang Kopra & Hasil Bumi Selat Makassar (1922) - Kelurahan Boya',
    'Tugu Nol Kilometer & Jam Kota Tua (1928) - Kelurahan Boya',
    'Rumah Panggung Kayu Etnis Bugis-Kaili (1908) - Kelurahan Tanjung Batu',
    'Benteng Pos Pengawas Pesisir Tanjung Batu (1875) - Kelurahan Tanjung Batu'
  ]
};

export const heritageSites = HERITAGE_SITES;
export const timelineEvents = HISTORICAL_TIMELINE.map((t, idx) => ({
  id: `evt-${idx + 1}`,
  year: t.year,
  era: t.category,
  title: t.title,
  description: t.description,
  image: HERITAGE_SITES[idx % HERITAGE_SITES.length]?.thumbnail
}));
export const quizQuestions = QUIZ_QUESTIONS;

