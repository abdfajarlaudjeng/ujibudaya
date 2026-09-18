import fs from 'fs';
import path from 'path';

const sitesData = fs.readFileSync('/tmp/sites.json', 'utf8');
const timelineData = fs.readFileSync('/tmp/timeline.json', 'utf8');
const quizData = fs.readFileSync('/tmp/quiz.json', 'utf8');
const projectData = fs.readFileSync('/tmp/project.json', 'utf8');

const htmlContent = `<!DOCTYPE html>
<html lang="id" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DIJELAJAH DONGGALA - Penjelajah Cagar Budaya Kota Tua Donggala</title>
  <meta name="description" content="Eksplorasi situs cagar budaya bersejarah Kota Tua Donggala melalui peta interaktif, panorama visual 360 derajat, audio transkripsi sejarah, komparasi linimasa foto kolonial, dan input data mandiri.">
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,400&family=Cinzel:wght@600;700;800&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: {
              terracotta: '#c85a32',
              navy: '#1e3a5f',
              sand: '#f5f0eb',
              gold: '#d4af37',
              dark: '#1c1917'
            }
          },
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            serif: ['"Playfair Display"', 'serif'],
            cinzel: ['"Cinzel"', 'serif']
          }
        }
      }
    }
  </script>

  <!-- Leaflet CSS & JS -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>

  <!-- Pannellum 360 CSS & JS -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css"/>
  <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"></script>

  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>

  <style>
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: #faf8f5;
      color: #1c1917;
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1ede8;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #c85a32;
      border-radius: 9999px;
    }
    .leaflet-popup-content-wrapper {
      border-radius: 1rem;
      padding: 0;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
    }
    .leaflet-popup-content {
      margin: 0;
      line-height: 1.5;
    }
    .tab-active {
      background-color: #c85a32;
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(200, 90, 50, 0.3);
    }
  </style>
</head>
<body class="min-h-screen flex flex-col selection:bg-[#c85a32] selection:text-white">

  <!-- TOP APP HEADER -->
  <header class="sticky top-0 z-40 bg-[#1e3a5f] text-white shadow-xl border-b border-white/10 backdrop-blur-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 sm:h-20">
        
        <!-- Logo & Title -->
        <div class="flex items-center gap-3 cursor-pointer" onclick="switchTab('map')">
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#c85a32] to-[#d4af37] p-0.5 shadow-lg flex items-center justify-center">
            <div class="w-full h-full bg-[#1e3a5f] rounded-[14px] flex items-center justify-center">
              <i data-lucide="compass" class="w-6 h-6 text-[#d4af37] animate-pulse"></i>
            </div>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-cinzel text-lg sm:text-2xl font-bold tracking-wider text-white">DIJELAJAH DONGGALA</span>
              <span class="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-[#c85a32] text-white rounded-full">FPK 2026</span>
            </div>
            <p class="text-[11px] sm:text-xs text-stone-300 font-medium tracking-wide">Pusaka Bahari & Cagar Budaya Banawa (Kota Tua)</p>
          </div>
        </div>

        <!-- Header Actions -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Input Data Button -->
          <button onclick="openInputModal()" class="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-[#c85a32] hover:bg-[#b8502a] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all transform hover:scale-105 active:scale-95 cursor-pointer">
            <i data-lucide="plus-circle" class="w-4 h-4"></i>
            <span class="hidden md:inline">Input Data Objek</span>
            <span class="md:hidden">Input</span>
          </button>

          <!-- Ambient Audio Toggle -->
          <button id="btn-ambient" onclick="toggleAmbientSound()" class="p-2 sm:px-3 sm:py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer" title="Suasana Pelabuhan & Ombak Selat Makassar">
            <i id="icon-ambient" data-lucide="volume-2" class="w-4 h-4 text-emerald-400"></i>
            <span class="hidden lg:inline text-xs font-medium" id="text-ambient">Suasana Bahari</span>
          </button>

          <!-- Download Single-File HTML Button -->
          <button onclick="downloadStandaloneFile()" class="p-2 sm:px-3 sm:py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer" title="Simpan / Download File HTML Lengkap ini untuk dibuka offline">
            <i data-lucide="download" class="w-4 h-4"></i>
            <span class="hidden sm:inline font-medium">Download HTML</span>
          </button>
        </div>

      </div>

      <!-- Navigation Tabs Bar -->
      <nav class="flex items-center gap-1 overflow-x-auto custom-scrollbar py-2 border-t border-white/10 text-xs sm:text-sm">
        <button id="tab-btn-map" onclick="switchTab('map')" class="tab-btn px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all tab-active whitespace-nowrap">
          <i data-lucide="map" class="w-4 h-4"></i>
          <span>Peta Interaktif</span>
        </button>
        <button id="tab-btn-explorer" onclick="switchTab('explorer')" class="tab-btn px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all text-stone-300 hover:text-white hover:bg-white/10 whitespace-nowrap">
          <i data-lucide="grid" class="w-4 h-4"></i>
          <span>Direktori Situs (<span id="site-count-badge">20</span>)</span>
        </button>
        <button id="tab-btn-timeline" onclick="switchTab('timeline')" class="tab-btn px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all text-stone-300 hover:text-white hover:bg-white/10 whitespace-nowrap">
          <i data-lucide="clock" class="w-4 h-4"></i>
          <span>Linimasa Sejarah</span>
        </button>
        <button id="tab-btn-quiz" onclick="switchTab('quiz')" class="tab-btn px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all text-stone-300 hover:text-white hover:bg-white/10 whitespace-nowrap">
          <i data-lucide="award" class="w-4 h-4"></i>
          <span>Tantangan Penjelajah</span>
        </button>
        <button id="tab-btn-ai" onclick="switchTab('ai')" class="tab-btn px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all text-stone-300 hover:text-white hover:bg-white/10 whitespace-nowrap">
          <i data-lucide="sparkles" class="w-4 h-4"></i>
          <span>Pemandu Cagar Budaya</span>
        </button>
      </nav>
    </div>
  </header>

  <!-- MAIN VIEW CONTAINER -->
  <main class="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 flex flex-col gap-6">

    <!-- ============================================================= -->
    <!-- VIEW 1: MAP INTERAKTIF -->
    <!-- ============================================================= -->
    <section id="view-map" class="flex flex-col gap-4 flex-1">
      <!-- Search & Controls Bar -->
      <div class="bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-stone-200 flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          <!-- Live Search Input -->
          <div class="relative flex-1 min-w-[200px]">
            <i data-lucide="search" class="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
            <input type="text" id="map-search-input" oninput="handleMapSearch(this.value)" placeholder="Cari situs (KPM, Pusentasi, Souraja, Bioskop...)" class="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#c85a32]">
          </div>

          <!-- Category Filter Select -->
          <select id="map-category-filter" onchange="filterMapByCategory(this.value)" class="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#c85a32]">
            <option value="ALL">Semua Kategori</option>
            <option value="Bangunan">Bangunan</option>
            <option value="Kawasan">Kawasan</option>
            <option value="Situs">Situs</option>
            <option value="Struktur">Struktur</option>
          </select>

          <!-- Layer Toggle (Jalan vs Satelit) -->
          <button onclick="toggleMapTileLayer()" class="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all">
            <i data-lucide="layers" class="w-4 h-4 text-[#c85a32]"></i>
            <span id="map-layer-label">Foto Satelit</span>
          </button>
        </div>

        <div class="flex items-center gap-2 text-xs text-stone-500 font-medium">
          <span>Menampilkan <strong id="map-visible-count" class="text-[#c85a32]">20</strong> Cagar Budaya</span>
        </div>
      </div>

      <!-- Map Container & Quick Detail Card -->
      <div class="relative w-full h-[600px] sm:h-[650px] rounded-3xl overflow-hidden shadow-xl border-2 border-stone-200">
        <div id="leaflet-map" class="w-full h-full z-0"></div>

        <!-- Floating Quick Panel -->
        <div id="map-floating-panel" class="hidden absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-stone-200 z-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div class="flex items-start justify-between gap-3">
            <div>
              <span id="float-cat" class="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-[#c85a32]/10 text-[#c85a32]">Kategori</span>
              <h3 id="float-title" class="font-serif text-lg font-bold text-stone-900 mt-1">Nama Objek</h3>
              <p id="float-kel" class="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                <i data-lucide="map-pin" class="w-3.5 h-3.5 text-[#c85a32]"></i>
                <span id="float-kel-text">Kelurahan</span>
              </p>
            </div>
            <button onclick="closeFloatingPanel()" class="p-1 text-stone-400 hover:text-stone-700 rounded-lg">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>
          <p id="float-desc" class="text-xs text-stone-600 line-clamp-2 mt-2">Deskripsi singkat...</p>
          <div class="flex items-center gap-2 mt-3 pt-3 border-t border-stone-100">
            <button id="float-btn-detail" class="flex-1 py-2 bg-[#1e3a5f] hover:bg-[#152a45] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5">
              <i data-lucide="info" class="w-3.5 h-3.5"></i> Detail Lengkap
            </button>
            <button id="float-btn-360" class="flex-1 py-2 bg-[#c85a32] hover:bg-[#b8502a] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5">
              <i data-lucide="eye" class="w-3.5 h-3.5"></i> Tur 360°
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================================= -->
    <!-- VIEW 2: DIREKTORI SITUS -->
    <!-- ============================================================= -->
    <section id="view-explorer" class="hidden flex flex-col gap-6">
      <div class="bg-white p-6 rounded-3xl shadow-sm border border-stone-200">
        <div class="max-w-3xl">
          <h2 class="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Katalog Cagar Budaya & Objek Sejarah Donggala</h2>
          <p class="text-sm text-stone-600 mt-2">Daftar inventarisasi digital situs, bangunan, struktur, dan kawasan cagar budaya Kota Tua Donggala dan Pesisir Banawa dilengkapi visualisasi 360°, arsip linimasa, serta transkripsi audio.</p>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3 mt-6 pt-6 border-t border-stone-100">
          <div class="flex flex-wrap items-center gap-2" id="explorer-category-pills">
            <button onclick="filterExplorer('ALL')" class="exp-pill px-3 py-1.5 rounded-full text-xs font-semibold bg-[#c85a32] text-white">Semua</button>
            <button onclick="filterExplorer('Bangunan')" class="exp-pill px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200">Bangunan</button>
            <button onclick="filterExplorer('Kawasan')" class="exp-pill px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200">Kawasan</button>
            <button onclick="filterExplorer('Situs')" class="exp-pill px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200">Situs</button>
            <button onclick="filterExplorer('Struktur')" class="exp-pill px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200">Struktur</button>
          </div>
          <div class="relative w-full sm:w-72">
            <i data-lucide="search" class="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
            <input type="text" id="explorer-search-input" oninput="handleExplorerSearch(this.value)" placeholder="Cari nama atau kelurahan..." class="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#c85a32]">
          </div>
        </div>
      </div>

      <!-- Sites Grid -->
      <div id="explorer-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
    </section>

    <!-- ============================================================= -->
    <!-- VIEW 3: LINIMASA SEJARAH -->
    <!-- ============================================================= -->
    <section id="view-timeline" class="hidden flex flex-col gap-6">
      <div class="bg-gradient-to-br from-[#1e3a5f] to-[#152a45] text-white p-6 sm:p-8 rounded-3xl shadow-lg">
        <span class="px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-bold uppercase tracking-wider">Historiografi Maritim</span>
        <h2 class="font-serif text-2xl sm:text-4xl font-bold mt-2">Linimasa Peradaban Kota Tua Donggala</h2>
        <p class="text-sm text-stone-300 mt-2 max-w-3xl leading-relaxed">Perjalanan kronologis dari formasi geologi alami karst Selat Makassar, masa keemasan pelabuhan niaga rempah, era kolonial KPM, hingga konservasi digital masa kini.</p>
      </div>

      <div id="timeline-container" class="relative pl-6 sm:pl-8 border-l-2 border-[#c85a32]/30 space-y-8 my-4"></div>
    </section>

    <!-- ============================================================= -->
    <!-- VIEW 4: TANTANGAN PENJELAJAH (KUIS) -->
    <!-- ============================================================= -->
    <section id="view-quiz" class="hidden flex flex-col gap-6 max-w-3xl mx-auto w-full">
      <div class="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-stone-200 text-center">
        <div class="w-16 h-16 rounded-2xl bg-[#c85a32]/10 text-[#c85a32] mx-auto flex items-center justify-center mb-4">
          <i data-lucide="award" class="w-8 h-8"></i>
        </div>
        <h2 class="font-serif text-2xl sm:text-3xl font-bold text-stone-900">Tantangan Penjelajah Cagar Budaya</h2>
        <p class="text-sm text-stone-600 mt-2">Uji pengetahuan Anda tentang sejarah arsitektur, maritim, dan objek budaya bersejarah Donggala.</p>
        
        <div class="mt-6 flex items-center justify-center gap-4 text-xs font-semibold text-stone-500">
          <span class="px-3 py-1 bg-stone-100 rounded-full">5 Pertanyaan Pilihan</span>
          <span class="px-3 py-1 bg-stone-100 rounded-full">Sertifikat Lencana</span>
        </div>
      </div>

      <!-- Quiz Card Area -->
      <div id="quiz-card-box" class="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-stone-200"></div>
    </section>

    <!-- ============================================================= -->
    <!-- VIEW 5: PEMANDU CAGAR BUDAYA AI -->
    <!-- ============================================================= -->
    <section id="view-ai" class="hidden flex flex-col gap-6 max-w-3xl mx-auto w-full">
      <div class="bg-white p-6 rounded-3xl shadow-md border border-stone-200">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#c85a32] to-[#d4af37] flex items-center justify-center text-white">
            <i data-lucide="bot" class="w-6 h-6"></i>
          </div>
          <div>
            <h2 class="font-serif text-xl font-bold text-stone-900">Pemandu Sejarah & Budaya Banawa</h2>
            <p class="text-xs text-stone-500">Tanyakan apapun seputar situs, legenda, arsitektur kayu ulin, dan sejarah maritim Donggala</p>
          </div>
        </div>

        <!-- Quick Prompts -->
        <div class="flex flex-wrap gap-2 mt-4 pt-4 border-t border-stone-100">
          <button onclick="askPrompt('Ceritakan tentang keunikan Pusentasi (Pusat Laut) Donggala')" class="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-full text-xs font-medium text-stone-700 transition-all">Pusentasi (Pusat Laut)</button>
          <button onclick="askPrompt('Apa fungsi Kantor Dagang KPM tempo dulu di Donggala?')" class="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-full text-xs font-medium text-stone-700 transition-all">Kantor KPM</button>
          <button onclick="askPrompt('Bagaimana keistimewaan arsitektur Rumah Adat Souraja?')" class="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-full text-xs font-medium text-stone-700 transition-all">Rumah Souraja</button>
          <button onclick="askPrompt('Ceritakan sejarah bioskop tua Gembira Theater Donggala')" class="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-full text-xs font-medium text-stone-700 transition-all">Gembira Theater</button>
        </div>

        <!-- Chat History -->
        <div id="ai-chat-box" class="h-96 overflow-y-auto custom-scrollbar bg-stone-50 border border-stone-200 rounded-2xl p-4 mt-4 space-y-4">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center shrink-0 text-xs font-bold">AI</div>
            <div class="bg-white p-3.5 rounded-2xl rounded-tl-none shadow-sm border border-stone-200 text-xs sm:text-sm text-stone-700 leading-relaxed">
              <strong>Tabe! Salam kenal.</strong> Saya adalah asisten panduan digital Cagar Budaya Donggala. Ada yang ingin Anda ketahui tentang sejarah pesisir Banawa, arsitektur kolonial, atau legenda rakyat Kaili?
            </div>
          </div>
        </div>

        <!-- Chat Input -->
        <form onsubmit="handleChatSubmit(event)" class="flex items-center gap-2 mt-4">
          <input type="text" id="ai-chat-input" placeholder="Ketik pertanyaan sejarah Anda di sini..." class="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#c85a32]">
          <button type="submit" class="px-4 py-2.5 bg-[#c85a32] hover:bg-[#b8502a] text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5 transition-all">
            <i data-lucide="send" class="w-4 h-4"></i>
            <span>Kirim</span>
          </button>
        </form>
      </div>
    </section>

  </main>

  <!-- ============================================================= -->
  <!-- MODAL: DETAIL CAGAR BUDAYA LENGKAP -->
  <!-- ============================================================= -->
  <div id="site-detail-modal" class="hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
    <div class="bg-white max-w-4xl w-full rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
      
      <!-- Modal Header Banner -->
      <div class="relative h-48 sm:h-64 shrink-0 bg-stone-900">
        <img id="detail-banner" src="" alt="Banner" class="w-full h-full object-cover opacity-80">
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        <button onclick="closeDetailModal()" class="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all cursor-pointer">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
        <div class="absolute bottom-4 left-4 right-4">
          <span id="detail-cat-badge" class="px-2.5 py-1 text-[11px] font-bold uppercase rounded-lg bg-[#c85a32] text-white">Situs</span>
          <h2 id="detail-title" class="font-serif text-xl sm:text-3xl font-bold text-white mt-1">Nama Objek</h2>
          <p id="detail-kel" class="text-xs sm:text-sm text-stone-300 flex items-center gap-1.5 mt-1">
            <i data-lucide="map-pin" class="w-4 h-4 text-amber-400"></i>
            <span id="detail-kel-text">Kelurahan, Donggala</span>
          </p>
        </div>
      </div>

      <!-- Modal Body Tabs -->
      <div class="flex items-center gap-2 px-6 pt-4 border-b border-stone-100 overflow-x-auto text-xs font-semibold">
        <button onclick="setDetailTab('info')" id="det-tab-info" class="pb-3 border-b-2 border-[#c85a32] text-[#c85a32]">Informasi & Sejarah</button>
        <button onclick="setDetailTab('360')" id="det-tab-360" class="pb-3 border-b-2 border-transparent text-stone-500 hover:text-stone-900">Panorama 360°</button>
        <button onclick="setDetailTab('timeslider')" id="det-tab-timeslider" class="pb-3 border-b-2 border-transparent text-stone-500 hover:text-stone-900">Foto Dulu vs Sekarang</button>
        <button onclick="setDetailTab('audio')" id="det-tab-audio" class="pb-3 border-b-2 border-transparent text-stone-500 hover:text-stone-900">Audio Narasi</button>
      </div>

      <div class="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
        
        <!-- Tab 1: Info Content -->
        <div id="det-content-info" class="space-y-4">
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-stone-400">Nilai Sejarah & Signifikansi</h4>
            <p id="detail-history" class="text-xs sm:text-sm text-stone-700 leading-relaxed mt-1"></p>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-100" id="detail-keyfacts"></div>
          <div class="pt-4 border-t border-stone-100 flex flex-wrap gap-2">
            <a id="detail-gmaps-link" href="#" target="_blank" class="px-4 py-2 bg-[#1e3a5f] hover:bg-[#152a45] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5">
              <i data-lucide="navigation" class="w-3.5 h-3.5"></i> Rute di Google Maps
            </a>
            <button onclick="copyCurrentSiteLink()" class="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl flex items-center gap-1.5">
              <i data-lucide="share-2" class="w-3.5 h-3.5"></i> Salin Tautan
            </button>
          </div>
        </div>

        <!-- Tab 2: Panorama 360 Content -->
        <div id="det-content-360" class="hidden space-y-4">
          <div class="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-stone-200 relative bg-stone-900">
            <div id="pannellum-viewer" class="w-full h-full"></div>
          </div>
          <p class="text-xs text-stone-500 text-center">Gunakan kursor mouse atau sentuhan jari untuk mengarahkan pandangan 360 derajat.</p>
        </div>

        <!-- Tab 3: Time Slider Content -->
        <div id="det-content-timeslider" class="hidden space-y-4">
          <div class="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden select-none border border-stone-200" id="slider-box">
            <img id="slider-img-after" src="" class="absolute inset-0 w-full h-full object-cover">
            <div id="slider-clip" class="absolute inset-0 w-1/2 overflow-hidden border-r-2 border-white shadow-2xl">
              <img id="slider-img-before" src="" class="absolute inset-0 w-full h-full object-cover">
              <span class="absolute top-3 left-3 px-2 py-1 bg-black/70 text-white rounded text-[10px] font-bold">FOTO DULU</span>
            </div>
            <span class="absolute top-3 right-3 px-2 py-1 bg-black/70 text-white rounded text-[10px] font-bold">KONDISI SEKARANG</span>
            <input type="range" min="0" max="100" value="50" oninput="updateTimeSlider(this.value)" class="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize">
          </div>
          <p id="slider-caption" class="text-xs text-stone-600 text-center italic"></p>
        </div>

        <!-- Tab 4: Audio Narasi Content -->
        <div id="det-content-audio" class="hidden space-y-4">
          <div class="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <div>
                <h5 id="audio-title" class="font-bold text-sm text-stone-900">Audio Cerita Sejarah</h5>
                <p id="audio-speaker" class="text-xs text-stone-500">Pemandu Budaya</p>
              </div>
              <button onclick="toggleAudioNarration()" id="btn-audio-play" class="w-10 h-10 rounded-full bg-[#c85a32] text-white flex items-center justify-center hover:bg-[#b8502a] transition-all">
                <i data-lucide="play" class="w-5 h-5 ml-0.5"></i>
              </button>
            </div>
            <div class="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div id="audio-progress" class="bg-[#c85a32] h-full w-0 transition-all duration-200"></div>
            </div>
          </div>
          <div>
            <h5 class="text-xs font-bold uppercase tracking-wider text-stone-400">Transkrip Narasi</h5>
            <p id="audio-transcript" class="text-xs sm:text-sm text-stone-700 leading-relaxed mt-2 p-4 bg-white rounded-2xl border border-stone-200 italic"></p>
          </div>
        </div>

      </div>

    </div>
  </div>

  <!-- ============================================================= -->
  <!-- MODAL: INPUT DATA OBJEK BUDAYA (11 KOLOM LENGKAP) -->
  <!-- ============================================================= -->
  <div id="input-data-modal" class="hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
    <div class="bg-white max-w-3xl w-full rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
      
      <!-- Modal Header -->
      <div class="p-6 bg-[#1e3a5f] text-white flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-[#c85a32] flex items-center justify-center text-white">
            <i data-lucide="database" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="font-serif text-lg sm:text-xl font-bold">Input Data Objek Cagar Budaya</h3>
            <p class="text-xs text-stone-300">Format 11 Kolom Lengkap • Tersimpan Otomatis di Tautan Link & Browser</p>
          </div>
        </div>
        <button onclick="closeInputModal()" class="p-2 text-stone-300 hover:text-white rounded-lg">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
      </div>

      <!-- Mode Tabs (Input Form / Import CSV / Export) -->
      <div class="flex items-center gap-2 px-6 pt-3 bg-stone-50 border-b border-stone-200 text-xs font-semibold">
        <button onclick="setInputMode('form')" id="in-mode-form" class="pb-2.5 border-b-2 border-[#c85a32] text-[#c85a32]">Formulir 11 Kolom</button>
        <button onclick="setInputMode('csv')" id="in-mode-csv" class="pb-2.5 border-b-2 border-transparent text-stone-500 hover:text-stone-900">Impor / Ekspor CSV</button>
      </div>

      <!-- Form Body -->
      <div class="p-6 overflow-y-auto custom-scrollbar flex-1">
        
        <!-- Form Mode -->
        <form id="cultural-object-form" onsubmit="handleSaveCulturalObject(event)" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-stone-700 uppercase mb-1">1. ID Objek *</label>
              <input type="text" id="inp-id" required placeholder="Contoh: BUDAYA-352" class="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#c85a32]">
            </div>
            <div>
              <label class="block text-xs font-bold text-stone-700 uppercase mb-1">2. Nama Objek *</label>
              <input type="text" id="inp-nama" required placeholder="Contoh: Pusentasi (Pusat Laut)" class="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#c85a32]">
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-stone-700 uppercase mb-1">3. Kategori *</label>
              <select id="inp-kategori" class="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#c85a32]">
                <option value="Situs">Situs</option>
                <option value="Bangunan">Bangunan</option>
                <option value="Kawasan">Kawasan</option>
                <option value="Struktur">Struktur</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-stone-700 uppercase mb-1">Kelurahan / Lokasi</label>
              <input type="text" id="inp-kelurahan" placeholder="Contoh: Kelurahan Boya / Tanjung Batu" class="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#c85a32]">
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-stone-700 uppercase mb-1">4. Deskripsi *</label>
            <textarea id="inp-deskripsi" rows="3" required placeholder="Penjelasan sejarah, arsitektur, dan nilai penting cagar budaya..." class="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#c85a32]"></textarea>
          </div>

          <!-- GPS Coordinates with Paste Tool -->
          <div class="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-amber-900">Titik Koordinat GPS (Selat Makassar / Donggala)</span>
              <button type="button" onclick="detectCoordsFromPrompt()" class="text-[11px] text-[#c85a32] font-semibold underline">Deteksi dari Link Maps</button>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] text-stone-600 mb-0.5">5. Latitude *</label>
                <input type="number" step="any" id="inp-lat" required placeholder="-0.6683" class="w-full px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg">
              </div>
              <div>
                <label class="block text-[11px] text-stone-600 mb-0.5">6. Longitude *</label>
                <input type="number" step="any" id="inp-lng" required placeholder="119.7385" class="w-full px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg">
              </div>
            </div>
          </div>

          <!-- URLs -->
          <div class="space-y-3">
            <div>
              <label class="block text-xs font-bold text-stone-700 uppercase mb-1">7. URL Gambar Utama *</label>
              <input type="url" id="inp-url-gambar" required placeholder="https://..." class="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl">
            </div>
            <div>
              <label class="block text-xs font-bold text-stone-700 uppercase mb-1">8. URL Gambar 360 (Panorama Equirectangular)</label>
              <input type="url" id="inp-url-360" placeholder="https://..." class="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl">
            </div>
            <div>
              <label class="block text-xs font-bold text-stone-700 uppercase mb-1">9. URL Video (Dokumenter / YouTube)</label>
              <input type="url" id="inp-url-video" placeholder="https://www.youtube.com/watch?v=..." class="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl">
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-stone-700 uppercase mb-1">10. Gambar Lama (Arsip Kolonial)</label>
                <input type="url" id="inp-gambar-lama" placeholder="https://..." class="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl">
              </div>
              <div>
                <label class="block text-xs font-bold text-stone-700 uppercase mb-1">11. Gambar Baru (Kondisi Terkini)</label>
                <input type="url" id="inp-gambar-baru" placeholder="https://..." class="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl">
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="pt-4 border-t border-stone-100 flex items-center justify-between">
            <span class="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <i data-lucide="check-circle" class="w-4 h-4"></i> Tersimpan Otomatis ke Link
            </span>
            <button type="submit" class="px-6 py-2.5 bg-[#c85a32] hover:bg-[#b8502a] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg transition-all transform hover:scale-105">
              Simpan Objek Cagar Budaya
            </button>
          </div>
        </form>

        <!-- CSV Mode -->
        <div id="cultural-csv-box" class="hidden space-y-6">
          <div class="p-4 bg-stone-50 border border-stone-200 rounded-2xl">
            <h4 class="font-bold text-sm text-stone-800 mb-1">Struktur 11 Kolom CSV:</h4>
            <code class="block text-[11px] bg-stone-900 text-emerald-400 p-2.5 rounded-lg overflow-x-auto font-mono">
              ID,Nama_Objek,Kategori,Deskripsi,Latitude,Longitude,URL_Gambar,URL_Gambar_360,URL_Video,Gambar_Lama,Gambar_Baru
            </code>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <button onclick="exportSitesToCSV()" class="px-4 py-2 bg-[#1e3a5f] hover:bg-[#152a45] text-white text-xs font-semibold rounded-xl flex items-center gap-2">
              <i data-lucide="download" class="w-4 h-4"></i> Ekspor Semua Data ke CSV
            </button>
            <label class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer">
              <i data-lucide="upload" class="w-4 h-4"></i> Impor Berkas CSV
              <input type="file" accept=".csv" onchange="handleCSVFileUpload(event)" class="hidden">
            </label>
          </div>
        </div>

      </div>

    </div>
  </div>

  <!-- FOOTER -->
  <footer class="bg-[#1e3a5f] text-white border-t border-white/10 mt-auto py-8 text-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <span class="font-cinzel font-bold tracking-wider text-sm">DIJELAJAH DONGGALA</span>
        <span class="text-stone-400">|</span>
        <span class="text-stone-300">Fasilitasi Pemajuan Kebudayaan (FPK) 2026</span>
      </div>
      <div class="flex flex-wrap items-center gap-4 text-stone-300">
        <button onclick="openInputModal()" class="hover:text-amber-300">Input Data Objek</button>
        <span>•</span>
        <button onclick="downloadStandaloneFile()" class="hover:text-amber-300">Unduh HTML Mandiri</button>
        <span>•</span>
        <span>BPK Wilayah XVIII Sulteng & Gorontalo</span>
      </div>
    </div>
  </footer>

  <!-- EMBEDDED COMPLETE DATA (Sites, Timeline, Quizzes) -->
  <script id="embedded-data" type="application/json">
    ${sitesData}
  </script>
  <script id="embedded-timeline" type="application/json">
    ${timelineData}
  </script>
  <script id="embedded-quiz" type="application/json">
    ${quizData}
  </script>

  <!-- APPLICATION LOGIC SCRIPT -->
  <script>
    // 1. Load Initial Data
    const rawSites = JSON.parse(document.getElementById('embedded-data').textContent);
    const rawTimeline = JSON.parse(document.getElementById('embedded-timeline').textContent);
    const rawQuizzes = JSON.parse(document.getElementById('embedded-quiz').textContent);

    let allSites = [...rawSites];
    let activeCategory = 'ALL';
    let currentTileLayer = 'osm';
    let leafletMap = null;
    let markersLayer = null;
    let selectedSite = allSites[0];
    let isAmbientPlaying = false;
    let audioSynthInterval = null;
    let pannellumInstance = null;

    // Merge any localStorage custom sites
    try {
      const stored = localStorage.getItem('donggala_custom_sites');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach(p => {
            const idx = allSites.findIndex(s => s.id === p.id);
            if (idx >= 0) allSites[idx] = p;
            else allSites.unshift(p);
          });
        }
      }
    } catch(e) {
      console.warn(e);
    }

    // 2. Tab Navigation
    function switchTab(tabId) {
      const tabs = ['map', 'explorer', 'timeline', 'quiz', 'ai'];
      tabs.forEach(t => {
        const view = document.getElementById('view-' + t);
        const btn = document.getElementById('tab-btn-' + t);
        if (view && btn) {
          if (t === tabId) {
            view.classList.remove('hidden');
            btn.className = 'tab-btn px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all tab-active whitespace-nowrap';
          } else {
            view.classList.add('hidden');
            btn.className = 'tab-btn px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all text-stone-300 hover:text-white hover:bg-white/10 whitespace-nowrap';
          }
        }
      });
      if (tabId === 'map' && leafletMap) {
        setTimeout(() => leafletMap.invalidateSize(), 200);
      }
      if (tabId === 'explorer') renderExplorerGrid();
      if (tabId === 'timeline') renderTimeline();
      if (tabId === 'quiz') startQuiz();
    }

    // 3. Leaflet Map Initialization
    function initMap() {
      if (leafletMap) return;
      
      // Center of Banawa, Donggala Kota Tua
      leafletMap = L.map('leaflet-map', {
        center: [-0.6698, 119.7408],
        zoom: 14,
        zoomControl: true
      });

      // Standard OSM Tiles
      window.osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | Cagar Budaya Donggala'
      }).addTo(leafletMap);

      // Satellite Imagery Layer
      window.satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri'
      });

      markersLayer = L.layerGroup().addTo(leafletMap);
      renderMapMarkers();
    }

    function toggleMapTileLayer() {
      const label = document.getElementById('map-layer-label');
      if (currentTileLayer === 'osm') {
        leafletMap.removeLayer(window.osmLayer);
        window.satelliteLayer.addTo(leafletMap);
        currentTileLayer = 'satellite';
        label.innerText = 'Peta Jalan (OSM)';
      } else {
        leafletMap.removeLayer(window.satelliteLayer);
        window.osmLayer.addTo(leafletMap);
        currentTileLayer = 'osm';
        label.innerText = 'Foto Satelit';
      }
    }

    function renderMapMarkers() {
      if (!markersLayer) return;
      markersLayer.clearLayers();

      const filtered = allSites.filter(s => {
        if (activeCategory !== 'ALL' && s.category !== activeCategory) return false;
        return true;
      });

      document.getElementById('map-visible-count').innerText = filtered.length;

      filtered.forEach(site => {
        const lat = site.coordinates?.lat || -0.67;
        const lng = site.coordinates?.lng || 119.74;

        // Color by category
        let color = '#c85a32'; // Bangunan
        if (site.category === 'Kawasan') color = '#1e3a5f';
        if (site.category === 'Situs') color = '#10b981';
        if (site.category === 'Struktur') color = '#d97706';

        const customIcon = L.divIcon({
          className: 'custom-div-icon',
          html: \`<div style="background-color: \${color}; width: 34px; height: 34px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>\`,
          iconSize: [34, 34],
          iconAnchor: [17, 34]
        });

        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(markersLayer);
        
        marker.on('click', () => {
          showFloatingPanel(site);
        });

        marker.bindPopup(\`
          <div class="w-64">
            <img src="\${site.thumbnail}" class="w-full h-28 object-cover">
            <div class="p-3">
              <span class="text-[10px] uppercase font-bold text-[#c85a32]">\${site.category}</span>
              <h4 class="font-serif font-bold text-sm text-stone-900 mt-0.5">\${site.title}</h4>
              <p class="text-xs text-stone-500 mt-0.5">\${site.kelurahan || 'Banawa, Donggala'}</p>
              <button onclick="openDetailModal('\${site.id}')" class="mt-2 w-full py-1.5 bg-[#c85a32] text-white text-xs font-semibold rounded-lg">Buka Detail Lengkap</button>
            </div>
          </div>
        \`);
      });
    }

    function showFloatingPanel(site) {
      selectedSite = site;
      const panel = document.getElementById('map-floating-panel');
      document.getElementById('float-cat').innerText = site.category;
      document.getElementById('float-title').innerText = site.title;
      document.getElementById('float-kel-text').innerText = site.kelurahan || site.locationDescription;
      document.getElementById('float-desc').innerText = site.briefDescription || site.historicalSignificance;
      
      document.getElementById('float-btn-detail').onclick = () => openDetailModal(site.id);
      document.getElementById('float-btn-360').onclick = () => {
        openDetailModal(site.id);
        setDetailTab('360');
      };
      panel.classList.remove('hidden');
    }

    function closeFloatingPanel() {
      document.getElementById('map-floating-panel').classList.add('hidden');
    }

    function handleMapSearch(val) {
      const q = val.toLowerCase().trim();
      const filtered = allSites.filter(s => {
        return s.title.toLowerCase().includes(q) || 
               (s.kelurahan && s.kelurahan.toLowerCase().includes(q)) ||
               (s.category && s.category.toLowerCase().includes(q));
      });
      if (filtered.length > 0 && leafletMap) {
        const first = filtered[0];
        leafletMap.setView([first.coordinates.lat, first.coordinates.lng], 16);
        showFloatingPanel(first);
      }
    }

    function filterMapByCategory(cat) {
      activeCategory = cat;
      renderMapMarkers();
    }

    // 4. Explorer Directory View
    function renderExplorerGrid(sites = allSites) {
      const grid = document.getElementById('explorer-grid');
      document.getElementById('site-count-badge').innerText = allSites.length;
      grid.innerHTML = sites.map(site => \`
        <div class="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-stone-200 transition-all duration-300 flex flex-col group">
          <div class="relative h-48 overflow-hidden bg-stone-900">
            <img src="\${site.thumbnail}" alt="\${site.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
            <span class="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg bg-[#c85a32] text-white shadow-md">\${site.category}</span>
            <span class="absolute bottom-3 left-3 text-xs font-semibold text-white/90">\${site.establishedYear || 'Bersejarah'}</span>
          </div>
          <div class="p-5 flex-1 flex flex-col">
            <h3 class="font-serif text-lg font-bold text-stone-900 group-hover:text-[#c85a32] transition-colors">\${site.title}</h3>
            <p class="text-xs text-stone-500 flex items-center gap-1 mt-1">
              <i data-lucide="map-pin" class="w-3.5 h-3.5 text-[#c85a32]"></i>
              <span>\${site.kelurahan || 'Kawasan Banawa'}</span>
            </p>
            <p class="text-xs text-stone-600 line-clamp-2 mt-2.5 flex-1">\${site.briefDescription || site.historicalSignificance}</p>
            
            <div class="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-stone-100">
              <button onclick="openDetailModal('\${site.id}'); setDetailTab('360')" class="py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all">
                <i data-lucide="eye" class="w-3.5 h-3.5 text-[#c85a32]"></i> Tur 360°
              </button>
              <button onclick="openDetailModal('\${site.id}')" class="py-2 bg-[#1e3a5f] hover:bg-[#152a45] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all">
                <i data-lucide="info" class="w-3.5 h-3.5"></i> Detail Situs
              </button>
            </div>
          </div>
        </div>
      \`).join('');
      lucide.createIcons();
    }

    function filterExplorer(cat) {
      document.querySelectorAll('.exp-pill').forEach(btn => {
        if (btn.innerText.includes(cat) || (cat === 'ALL' && btn.innerText === 'Semua')) {
          btn.className = 'exp-pill px-3 py-1.5 rounded-full text-xs font-semibold bg-[#c85a32] text-white';
        } else {
          btn.className = 'exp-pill px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200';
        }
      });
      const filtered = cat === 'ALL' ? allSites : allSites.filter(s => s.category === cat);
      renderExplorerGrid(filtered);
    }

    function handleExplorerSearch(val) {
      const q = val.toLowerCase().trim();
      const filtered = allSites.filter(s => {
        return s.title.toLowerCase().includes(q) || 
               (s.kelurahan && s.kelurahan.toLowerCase().includes(q)) ||
               (s.briefDescription && s.briefDescription.toLowerCase().includes(q));
      });
      renderExplorerGrid(filtered);
    }

    // 5. Timeline View
    function renderTimeline() {
      const container = document.getElementById('timeline-container');
      container.innerHTML = rawTimeline.map((item, idx) => \`
        <div class="relative group">
          <div class="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-white border-4 border-[#c85a32] shadow-md group-hover:scale-125 transition-transform"></div>
          <div class="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-stone-200 hover:shadow-md transition-shadow">
            <span class="px-2.5 py-1 text-[10px] font-bold uppercase rounded-md bg-[#1e3a5f]/10 text-[#1e3a5f]">\${item.category}</span>
            <h3 class="font-serif text-lg sm:text-xl font-bold text-stone-900 mt-1.5">\${item.year} — \${item.title}</h3>
            <p class="text-xs sm:text-sm text-stone-600 leading-relaxed mt-2">\${item.description}</p>
          </div>
        </div>
      \`).join('');
    }

    // 6. Quiz Game
    let currentQuizIndex = 0;
    let quizScore = 0;

    function startQuiz() {
      currentQuizIndex = 0;
      quizScore = 0;
      renderQuizQuestion();
    }

    function renderQuizQuestion() {
      const box = document.getElementById('quiz-card-box');
      if (currentQuizIndex >= rawQuizzes.length) {
        box.innerHTML = \`
          <div class="text-center py-6 space-y-4">
            <div class="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">🏆</div>
            <h3 class="font-serif text-2xl font-bold text-stone-900">Selamat! Tantangan Selesai</h3>
            <p class="text-sm text-stone-600">Skor Anda: <strong class="text-[#c85a32] text-xl">\${quizScore} / \${rawQuizzes.length}</strong></p>
            <p class="text-xs text-stone-500 max-w-md mx-auto">Anda telah membuktikan kepedulian dan wawasan tinggi dalam melestarikan pusaka maritim Donggala.</p>
            <button onclick="startQuiz()" class="px-6 py-2.5 bg-[#c85a32] text-white text-xs font-bold rounded-xl shadow-md">Ulangi Tantangan</button>
          </div>
        \`;
        return;
      }

      const q = rawQuizzes[currentQuizIndex];
      box.innerHTML = \`
        <div>
          <div class="flex items-center justify-between text-xs text-stone-400 font-bold uppercase mb-2">
            <span>Pertanyaan \${currentQuizIndex + 1} dari \${rawQuizzes.length}</span>
            <span>Skor: \${quizScore}</span>
          </div>
          <h3 class="font-serif text-lg font-bold text-stone-900">\${q.question}</h3>
          
          <div class="space-y-2 mt-4">
            \${q.options.map((opt, i) => \`
              <button onclick="checkQuizAnswer(\${i})" class="w-full text-left p-3.5 rounded-xl border border-stone-200 hover:border-[#c85a32] hover:bg-stone-50 text-xs sm:text-sm text-stone-800 font-medium transition-all">
                \${opt}
              </button>
            \`).join('')}
          </div>
        </div>
      \`;
    }

    function checkQuizAnswer(selectedIdx) {
      const q = rawQuizzes[currentQuizIndex];
      const isCorrect = selectedIdx === q.correctAnswer;
      if (isCorrect) quizScore++;

      const box = document.getElementById('quiz-card-box');
      box.innerHTML = \`
        <div class="space-y-4">
          <div class="p-4 rounded-2xl \${isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}">
            <h4 class="font-bold text-sm flex items-center gap-2">
              \${isCorrect ? 'Benar Sekali!' : 'Kurang Tepat'}
            </h4>
            <p class="text-xs mt-1 leading-relaxed">\${q.explanation}</p>
          </div>
          <button onclick="nextQuizQuestion()" class="w-full py-2.5 bg-[#1e3a5f] text-white text-xs font-bold rounded-xl shadow-md">
            Lanjut ke Pertanyaan Berikutnya &rarr;
          </button>
        </div>
      \`;
    }

    function nextQuizQuestion() {
      currentQuizIndex++;
      renderQuizQuestion();
    }

    // 7. Site Detail Modal & Tabs
    function openDetailModal(siteId) {
      const site = allSites.find(s => s.id === siteId) || allSites[0];
      selectedSite = site;

      document.getElementById('detail-banner').src = site.bannerImage || site.thumbnail;
      document.getElementById('detail-cat-badge').innerText = site.category;
      document.getElementById('detail-title').innerText = site.title;
      document.getElementById('detail-kel-text').innerText = site.kelurahan || site.locationDescription;
      document.getElementById('detail-history').innerText = site.historicalSignificance || site.briefDescription;

      // Key facts
      const factsContainer = document.getElementById('detail-keyfacts');
      if (site.keyFacts && site.keyFacts.length > 0) {
        factsContainer.innerHTML = site.keyFacts.map(f => \`
          <div class="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
            <span class="text-[10px] font-bold text-stone-400 uppercase">\${f.label}</span>
            <p class="text-xs font-bold text-stone-800 mt-0.5">\${f.value}</p>
          </div>
        \`).join('');
      } else {
        factsContainer.innerHTML = '';
      }

      // Maps link
      const lat = site.coordinates?.lat || -0.669;
      const lng = site.coordinates?.lng || 119.74;
      document.getElementById('detail-gmaps-link').href = \`https://www.google.com/maps/dir/?api=1&destination=\${lat},\${lng}\`;

      // Slider images
      document.getElementById('slider-img-before').src = site.pastPhoto?.url || site.thumbnail;
      document.getElementById('slider-img-after').src = site.currentPhoto?.url || site.thumbnail;
      document.getElementById('slider-caption').innerText = site.pastPhoto?.caption || 'Perbandingan kondisi masa lampau dengan masa sekarang.';

      // Audio narasi
      document.getElementById('audio-title').innerText = site.audioNarration?.title || 'Audio Narasi Cerita Sejarah';
      document.getElementById('audio-speaker').innerText = site.audioNarration?.speakerName || 'Pemandu Budaya Banawa';
      document.getElementById('audio-transcript').innerText = site.audioNarration?.transcript || site.historicalSignificance;

      setDetailTab('info');
      document.getElementById('site-detail-modal').classList.remove('hidden');
      lucide.createIcons();
    }

    function closeDetailModal() {
      document.getElementById('site-detail-modal').classList.add('hidden');
    }

    function setDetailTab(tab) {
      const tabs = ['info', '360', 'timeslider', 'audio'];
      tabs.forEach(t => {
        const btn = document.getElementById('det-tab-' + t);
        const content = document.getElementById('det-content-' + t);
        if (t === tab) {
          btn.className = 'pb-3 border-b-2 border-[#c85a32] text-[#c85a32] font-bold';
          content.classList.remove('hidden');
        } else {
          btn.className = 'pb-3 border-b-2 border-transparent text-stone-500 hover:text-stone-900';
          content.classList.add('hidden');
        }
      });

      if (tab === '360') {
        setTimeout(initPannellumViewer, 100);
      }
    }

    function initPannellumViewer() {
      const panoUrl = selectedSite.panorama360?.url || selectedSite.bannerImage || selectedSite.thumbnail;
      if (window.pannellum) {
        try {
          pannellum.viewer('pannellum-viewer', {
            type: 'equirectangular',
            panorama: panoUrl,
            autoLoad: true,
            compass: true,
            showZoomCtrl: true,
            showFullscreenCtrl: true
          });
        } catch(e) {
          console.log('Pannellum init error or already active:', e);
        }
      }
    }

    function updateTimeSlider(val) {
      document.getElementById('slider-clip').style.width = val + '%';
    }

    function toggleAudioNarration() {
      const btn = document.getElementById('btn-audio-play');
      const text = selectedSite.audioNarration?.transcript || selectedSite.briefDescription;
      
      if ('speechSynthesis' in window) {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
          btn.innerHTML = '<i data-lucide="play" class="w-5 h-5 ml-0.5"></i>';
          lucide.createIcons();
          return;
        }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        utterance.rate = 0.95;
        utterance.onend = () => {
          btn.innerHTML = '<i data-lucide="play" class="w-5 h-5 ml-0.5"></i>';
          document.getElementById('audio-progress').style.width = '0%';
          lucide.createIcons();
        };
        window.speechSynthesis.speak(utterance);
        btn.innerHTML = '<i data-lucide="pause" class="w-5 h-5"></i>';
        lucide.createIcons();

        // Simulate progress
        let pct = 0;
        const progressTimer = setInterval(() => {
          if (!window.speechSynthesis.speaking) {
            clearInterval(progressTimer);
          } else {
            pct = Math.min(pct + 2, 95);
            document.getElementById('audio-progress').style.width = pct + '%';
          }
        }, 300);
      } else {
        alert('Fitur Audio Synthesizer tidak didukung oleh browser Anda.');
      }
    }

    function copyCurrentSiteLink() {
      const url = window.location.origin + window.location.pathname + '?site=' + encodeURIComponent(selectedSite.id);
      navigator.clipboard.writeText(url);
      alert('Tautan situs berhasil disalin! ' + url);
    }

    // 8. Input Data Modal (11 Columns)
    function openInputModal() {
      document.getElementById('cultural-object-form').reset();
      setInputMode('form');
      document.getElementById('input-data-modal').classList.remove('hidden');
      lucide.createIcons();
    }

    function closeInputModal() {
      document.getElementById('input-data-modal').classList.add('hidden');
    }

    function setInputMode(mode) {
      if (mode === 'form') {
        document.getElementById('in-mode-form').className = 'pb-2.5 border-b-2 border-[#c85a32] text-[#c85a32] font-bold';
        document.getElementById('in-mode-csv').className = 'pb-2.5 border-b-2 border-transparent text-stone-500 hover:text-stone-900';
        document.getElementById('cultural-object-form').classList.remove('hidden');
        document.getElementById('cultural-csv-box').classList.add('hidden');
      } else {
        document.getElementById('in-mode-csv').className = 'pb-2.5 border-b-2 border-[#c85a32] text-[#c85a32] font-bold';
        document.getElementById('in-mode-form').className = 'pb-2.5 border-b-2 border-transparent text-stone-500 hover:text-stone-900';
        document.getElementById('cultural-object-form').classList.add('hidden');
        document.getElementById('cultural-csv-box').classList.remove('hidden');
      }
    }

    function detectCoordsFromPrompt() {
      const url = prompt('Tempelkan URL Google Maps (contoh: https://maps.google.com/?q=-0.668,119.738):');
      if (!url) return;
      const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || url.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (match) {
        document.getElementById('inp-lat').value = match[1];
        document.getElementById('inp-lng').value = match[2];
        alert(\`Koordinat ditemukan: Lat \${match[1]}, Lng \${match[2]}\`);
      } else {
        alert('Tidak dapat mendeteksi koordinat otomatis dari tautan tersebut. Mohon isi angka manual.');
      }
    }

    function handleSaveCulturalObject(e) {
      e.preventDefault();
      const newObj = {
        id: document.getElementById('inp-id').value.trim(),
        title: document.getElementById('inp-nama').value.trim(),
        category: document.getElementById('inp-kategori').value,
        kelurahan: document.getElementById('inp-kelurahan').value.trim() || 'Kawasan Banawa',
        historicalSignificance: document.getElementById('inp-deskripsi').value.trim(),
        briefDescription: document.getElementById('inp-deskripsi').value.trim(),
        coordinates: {
          lat: parseFloat(document.getElementById('inp-lat').value),
          lng: parseFloat(document.getElementById('inp-lng').value)
        },
        thumbnail: document.getElementById('inp-url-gambar').value.trim(),
        bannerImage: document.getElementById('inp-url-gambar').value.trim(),
        panorama360: {
          url: document.getElementById('inp-url-360').value.trim() || document.getElementById('inp-url-gambar').value.trim()
        },
        videoDocumentaryUrl: document.getElementById('inp-url-video').value.trim(),
        pastPhoto: {
          url: document.getElementById('inp-gambar-lama').value.trim() || document.getElementById('inp-url-gambar').value.trim(),
          caption: 'Foto Arsip Masa Lampau'
        },
        currentPhoto: {
          url: document.getElementById('inp-gambar-baru').value.trim() || document.getElementById('inp-url-gambar').value.trim(),
          caption: 'Kondisi Terkini'
        }
      };

      const existingIdx = allSites.findIndex(s => s.id === newObj.id);
      if (existingIdx >= 0) allSites[existingIdx] = newObj;
      else allSites.unshift(newObj);

      // Save to localStorage
      try {
        localStorage.setItem('donggala_custom_sites', JSON.stringify(allSites));
      } catch(err) {
        console.warn(err);
      }

      // Update UI
      renderMapMarkers();
      renderExplorerGrid();
      closeInputModal();
      
      // Select and focus on map
      selectedSite = newObj;
      switchTab('map');
      if (leafletMap) {
        leafletMap.setView([newObj.coordinates.lat, newObj.coordinates.lng], 16);
        showFloatingPanel(newObj);
      }
      alert(\`Objek cagar budaya "\${newObj.title}" berhasil disimpan dan langsung terpetakan!\`);
    }

    // CSV Export & Import
    function exportSitesToCSV() {
      const headers = ['ID', 'Nama_Objek', 'Kategori', 'Deskripsi', 'Latitude', 'Longitude', 'URL_Gambar', 'URL_Gambar_360', 'URL_Video', 'Gambar_Lama', 'Gambar_Baru'];
      const rows = allSites.map(s => [
        \`"\${s.id}"\`,
        \`"\${s.title.replace(/"/g, '""')}"\`,
        \`"\${s.category}"\`,
        \`"\${(s.historicalSignificance || s.briefDescription || '').replace(/"/g, '""')}"\`,
        s.coordinates?.lat || '',
        s.coordinates?.lng || '',
        \`"\${s.thumbnail || ''}"\`,
        \`"\${s.panorama360?.url || ''}"\`,
        \`"\${s.videoDocumentaryUrl || ''}"\`,
        \`"\${s.pastPhoto?.url || ''}"\`,
        \`"\${s.currentPhoto?.url || ''}"\`
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'cagar_budaya_donggala_11_kolom.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    function handleCSVFileUpload(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(evt) {
        const text = evt.target.result;
        const lines = text.split('\\n').filter(l => l.trim().length > 0);
        if (lines.length <= 1) return alert('Format berkas CSV kosong atau tidak valid.');
        
        // Parse CSV lines
        let addedCount = 0;
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(',').map(p => p.replace(/^"|"$/g, '').trim());
          if (parts.length >= 6) {
            const [id, nama, kategori, deskripsi, lat, lng, urlGambar, url360, urlVideo, gmbLama, gmbBaru] = parts;
            const newSite = {
              id: id || 'SITUS-' + Date.now(),
              title: nama,
              category: kategori || 'Situs',
              kelurahan: 'Kabupaten Donggala',
              historicalSignificance: deskripsi,
              briefDescription: deskripsi,
              coordinates: { lat: parseFloat(lat) || -0.669, lng: parseFloat(lng) || 119.74 },
              thumbnail: urlGambar || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800',
              bannerImage: urlGambar || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800',
              panorama360: { url: url360 || urlGambar },
              videoDocumentaryUrl: urlVideo,
              pastPhoto: { url: gmbLama || urlGambar, caption: 'Foto Masa Lampau' },
              currentPhoto: { url: gmbBaru || urlGambar, caption: 'Kondisi Terkini' }
            };
            const idx = allSites.findIndex(s => s.id === newSite.id);
            if (idx >= 0) allSites[idx] = newSite;
            else allSites.unshift(newSite);
            addedCount++;
          }
        }
        localStorage.setItem('donggala_custom_sites', JSON.stringify(allSites));
        renderMapMarkers();
        renderExplorerGrid();
        alert(\`Berhasil mengimpor \${addedCount} data objek cagar budaya dari CSV!\`);
        closeInputModal();
      };
      reader.readAsText(file);
    }

    // 9. AI Guide Chat
    const knowledgeBase = {
      'pusentasi': 'Pusentasi (Pusat Laut) adalah sumur raksasa alami di Desa Towale, pesisir Banawa berdiameter 10 meter dan kedalaman 7 meter. Memiliki fenomena unik di mana air lautnya sangat jernih kebiruan dan pasang surutnya berkebalikan dengan pasang surut air laut.',
      'kpm': 'Kantor Dagang KPM Donggala dibangun sekitar tahun 1912 oleh maskapai Koninklijke Paketvaart-Maatschappij. Gedung ini menjadi pusat kantor pelayaran uap niaga dan jalur rempah di Selat Makassar tempo dulu.',
      'souraja': 'Rumah Adat Souraja (Banua Oge) didirikan tahun 1892 oleh bangsawan Kaili Lamarauna. Memiliki arsitektur panggung bebas paku dari kayu ulin dengan ornamen kaligrafi serta ukiran khas Kaili-Bugis.',
      'bioskop': 'Gedung Bioskop Donggala (Gembira Theater) berdiri sekitar 1950 di Kelurahan Boya. Tempat ini adalah pusat hiburan layar perak legendaris masyarakat Donggala dan para pelaut Selat Makassar.'
    };

    function askPrompt(text) {
      document.getElementById('ai-chat-input').value = text;
      handleChatSubmit(new Event('submit'));
    }

    function handleChatSubmit(e) {
      e.preventDefault();
      const input = document.getElementById('ai-chat-input');
      const msg = input.value.trim();
      if (!msg) return;

      const chatBox = document.getElementById('ai-chat-box');
      // User message
      chatBox.innerHTML += \`
        <div class="flex items-start justify-end gap-3">
          <div class="bg-[#c85a32] text-white p-3.5 rounded-2xl rounded-tr-none shadow-sm text-xs sm:text-sm">
            \${msg}
          </div>
        </div>
      \`;
      input.value = '';
      chatBox.scrollTop = chatBox.scrollHeight;

      // AI reply logic
      setTimeout(() => {
        let reply = 'Donggala memiliki warisan maritim yang luar biasa kaya sejak abad ke-15 di perairan Selat Makassar.';
        const qLower = msg.toLowerCase();
        if (qLower.includes('pusentasi') || qLower.includes('pusat laut')) reply = knowledgeBase['pusentasi'];
        else if (qLower.includes('kpm') || qLower.includes('pelabuhan')) reply = knowledgeBase['kpm'];
        else if (qLower.includes('souraja') || qLower.includes('rumah adat')) reply = knowledgeBase['souraja'];
        else if (qLower.includes('bioskop') || qLower.includes('gembira')) reply = knowledgeBase['bioskop'];
        else {
          const match = allSites.find(s => qLower.includes(s.title.toLowerCase()) || qLower.includes(s.id.toLowerCase()));
          if (match) reply = \`\${match.title} (\${match.category}) di \${match.kelurahan || 'Donggala'}: \${match.briefDescription || match.historicalSignificance}\`;
        }

        chatBox.innerHTML += \`
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center shrink-0 text-xs font-bold">AI</div>
            <div class="bg-white p-3.5 rounded-2xl rounded-tl-none shadow-sm border border-stone-200 text-xs sm:text-sm text-stone-700 leading-relaxed">
              \${reply}
            </div>
          </div>
        \`;
        chatBox.scrollTop = chatBox.scrollHeight;
      }, 500);
    }

    // 10. Ambient Sound Synthesizer (Sea waves & bells)
    function toggleAmbientSound() {
      const btn = document.getElementById('btn-ambient');
      const icon = document.getElementById('icon-ambient');
      
      if (isAmbientPlaying) {
        if (window.audioCtx) window.audioCtx.close();
        isAmbientPlaying = false;
        icon.className = 'w-4 h-4 text-stone-400';
        btn.classList.remove('bg-white/30');
      } else {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        window.audioCtx = new AudioContext();
        
        // Gentle noise for sea waves
        const bufferSize = audioCtx.sampleRate * 2;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = audioCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 350;

        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 0.05;

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        whiteNoise.start();

        isAmbientPlaying = true;
        icon.className = 'w-4 h-4 text-emerald-400 animate-pulse';
        btn.classList.add('bg-white/30');
      }
    }

    // 11. Download Standalone HTML File Directly
    function downloadStandaloneFile() {
      const html = '<!DOCTYPE html>' + document.documentElement.outerHTML;
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dijelajah-donggala-cagar-budaya.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    // Check URL parameters for direct site opening
    window.addEventListener('DOMContentLoaded', () => {
      initMap();
      renderExplorerGrid();
      lucide.createIcons();

      const urlParams = new URLSearchParams(window.location.search);
      const siteParam = urlParams.get('site');
      if (siteParam) {
        const target = allSites.find(s => s.id === siteParam);
        if (target) {
          openDetailModal(target.id);
        }
      }
    });
  </script>
</body>
</html>
`;

fs.writeFileSync('cagar-budaya-donggala.html', htmlContent);

// Also ensure public/ folder exists and save there for Vite dev/preview server
if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}
fs.writeFileSync('public/cagar-budaya-donggala.html', htmlContent);

console.log('Successfully generated standalone HTML files:');
console.log(' - ./cagar-budaya-donggala.html (Size: ' + htmlContent.length + ' bytes)');
console.log(' - ./public/cagar-budaya-donggala.html (Size: ' + htmlContent.length + ' bytes)');
