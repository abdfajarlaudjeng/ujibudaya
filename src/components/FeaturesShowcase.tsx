import React from 'react';
import { 
  Map as MapIcon, 
  Box, 
  History, 
  Volume2, 
  ArrowRight, 
  Search, 
  Layers, 
  Sparkles, 
  Camera, 
  Navigation,
  Compass,
  CheckCircle2,
  Calendar,
  ArrowLeftRight
} from 'lucide-react';
import { HeritageSite } from '../types';

interface FeaturesShowcaseProps {
  onOpenMap: () => void;
  onStart360Tour: (site?: HeritageSite) => void;
  featuredSite?: HeritageSite;
}

export const FeaturesShowcase: React.FC<FeaturesShowcaseProps> = ({
  onOpenMap,
  onStart360Tour,
  featuredSite
}) => {
  return (
    <section className="py-12 sm:py-16 bg-[#FAF8F5] border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C85A32]/10 text-[#C85A32] text-xs font-bold border border-[#C85A32]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>FITUR DIGITALISASI CAGAR BUDAYA</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#1C1917] font-serif-heading tracking-tight">
            Eksplorasi Sejarah Melalui Dua Fitur Utama
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
            Menghidupkan kembali pesona Kota Tua Donggala dalam satu portal digital interaktif melalui integrasi peta cagar budaya, linimasa komparasi foto sejarah, dan tur panorama 360° yang imersif.
          </p>
        </div>

        {/* Two Main Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          
          {/* =====================================================================
              KARTU FITUR 1: PETA INTERAKTIF & LINIMASA FOTO
              ===================================================================== */}
          <div className="flex flex-col bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
            
            {/* Screenshot / Visual Representation Mockup of Interactive Map */}
            <div className="relative h-64 sm:h-72 bg-gradient-to-br from-[#e8edf2] to-[#d6e0ea] p-4 flex flex-col justify-between overflow-hidden border-b border-stone-200 select-none">
              
              {/* Simulated Map Top Bar with Search & Filters */}
              <div className="flex items-center justify-between gap-2 z-10">
                <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-stone-200/80 text-xs font-semibold text-stone-800">
                  <MapIcon className="w-3.5 h-3.5 text-[#0F4C81]" />
                  <span>Peta Google Maps Vektor</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-full shadow-sm border border-stone-200/80 text-[11px] text-stone-600">
                  <Search className="w-3 h-3 text-stone-500" />
                  <span className="hidden sm:inline">Cari 15 Cagar Budaya...</span>
                </div>
              </div>

              {/* Simulated Map Visual Canvas with Real Donggala Coordinates & Markers */}
              <div className="absolute inset-0 opacity-90">
                <svg className="w-full h-full" viewBox="0 0 500 300" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Sea Area (Teluk Palu / Selat Makassar) */}
                  <path d="M0 0 L220 0 Q200 120 260 200 T180 300 L0 300 Z" fill="#b9d6eb" />
                  <text x="35" y="160" fill="#0369a1" fontSize="11" fontWeight="bold" opacity="0.6" letterSpacing="2">
                    TELUK PALU / SELAT MAKASSAR
                  </text>

                  {/* Coastline Shore */}
                  <path d="M220 0 Q200 120 260 200 T180 300" stroke="#f1e0c6" strokeWidth="6" strokeLinecap="round" />

                  {/* Land Grid Lines (Donggala Town Blocks) */}
                  <rect x="225" y="0" width="275" height="300" fill="#f4f1ea" />
                  <path d="M250 40 L480 40 M240 100 L490 100 M260 170 L480 170 M230 240 L490 240" stroke="#e3ded3" strokeWidth="2" />
                  <path d="M310 0 L310 300 M390 0 L390 300 M460 0 L460 300" stroke="#e3ded3" strokeWidth="2" />

                  {/* Roads in Donggala */}
                  <path d="M240 20 L270 90 L330 140 L380 280" stroke="#ffffff" strokeWidth="5" />
                  <path d="M240 20 L270 90 L330 140 L380 280" stroke="#f59e0b" strokeWidth="2.5" />
                  <path d="M270 90 L480 110" stroke="#ffffff" strokeWidth="4" />
                  <path d="M270 90 L480 110" stroke="#fbbf24" strokeWidth="2" />
                </svg>
              </div>

              {/* Simulated Map Markers */}
              <div className="absolute top-[35%] left-[52%] z-10 flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-[#9e3d1b] border-2 border-[#ffd166] text-white flex items-center justify-center text-xs font-bold shadow-lg transform -translate-y-1">
                  1
                </div>
                <div className="px-2 py-0.5 mt-1 bg-white/95 rounded-md shadow-sm border border-stone-200 text-[9px] font-bold text-stone-800 whitespace-nowrap">
                  Kantor Dagang KPM
                </div>
              </div>

              <div className="absolute top-[60%] left-[68%] z-10 flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-[#1b4332] border-2 border-[#ffd166] text-white flex items-center justify-center text-[10px] font-bold shadow-lg">
                  2
                </div>
                <div className="px-1.5 py-0.5 mt-0.5 bg-white/95 rounded-md shadow-sm border border-stone-200 text-[8px] font-bold text-stone-700 whitespace-nowrap">
                  Rumah Bea Cukai
                </div>
              </div>

              {/* Inset Screenshot: Linimasa Komparasi Foto Tempo Dulu vs Kini */}
              <div className="relative z-20 self-end mt-auto max-w-[270px] sm:max-w-[290px] bg-stone-900/95 backdrop-blur-md rounded-2xl p-2.5 border border-amber-500/40 shadow-xl text-white">
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className="text-[10px] font-bold text-amber-300 flex items-center gap-1">
                    <History className="w-3 h-3 text-amber-400" />
                    <span>Fitur Linimasa Foto</span>
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                    Lalu ⇄ Kini
                  </span>
                </div>
                <div className="relative h-16 rounded-lg overflow-hidden border border-stone-700 grid grid-cols-2">
                  <div className="relative bg-stone-800 flex items-center justify-center border-r border-amber-400/80">
                    <img
                      src="https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=400&q=80"
                      alt="Foto Masa Lampau"
                      className="w-full h-full object-cover filter grayscale contrast-125 sepia-[0.2]"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-1 left-1 bg-black/80 px-1 py-0.2 rounded text-[7px] font-semibold text-amber-300">
                      Tahun 1920
                    </span>
                  </div>
                  <div className="relative bg-stone-800 flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80"
                      alt="Foto Masa Kini"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.2 rounded text-[7px] font-semibold text-emerald-300">
                      Masa Kini
                    </span>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#d4af37] border border-stone-900 flex items-center justify-center text-stone-900 shadow-md">
                    <ArrowLeftRight className="w-2.5 h-2.5" />
                  </div>
                </div>
              </div>

            </div>

            {/* Description & Action */}
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F4C81]">
                  <Layers className="w-4 h-4 text-[#0F4C81]" />
                  <span>NAVIGASI PRESISI & SEJARAH VISUAL</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#1C1917] font-serif-heading">
                  Peta Interaktif & Linimasa Foto
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                  Jelajahi sebaran 15 objek cagar budaya di kawasan Kota Tua Donggala berbasis peta vektor Google Maps. Dilengkapi pencarian objek, filter 3 kategori resmi (Situs, Kawasan, Bangunan & Struktur), serta fitur linimasa komparasi foto masa lampau dan kondisi masa kini.
                </p>

                {/* Feature Bullets */}
                <div className="pt-2 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Pemetaan 15 cagar budaya lengkap koordinat geografis presisi</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Linimasa interaktif geser foto arsip tempo dulu vs dokumentasi terkini</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Arah rute navigasi langsung terintegrasi Google Maps</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenMap}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl bg-[#0F4C81] hover:bg-[#0c3c66] text-white font-bold text-xs sm:text-sm shadow-sm transition-all transform hover:scale-[1.02] cursor-pointer"
                >
                  <MapIcon className="w-4 h-4" />
                  <span>Buka Peta Interaktif</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* =====================================================================
              KARTU FITUR 2: TUR PANORAMA 360° & AUDIO SEJARAH
              ===================================================================== */}
          <div className="flex flex-col bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
            
            {/* Screenshot / Visual Representation Mockup of 360 Panorama Tour */}
            <div className="relative h-64 sm:h-72 bg-stone-950 p-4 flex flex-col justify-between overflow-hidden border-b border-stone-200 select-none">
              
              {/* Background 360 Panorama Image */}
              <div className="absolute inset-0 opacity-80 group-hover:scale-105 transition-transform duration-700">
                <img
                  src={featuredSite?.panorama360.url || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80"}
                  alt="Panorama 360 Derajat Cagar Budaya Donggala"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/60 pointer-events-none" />
              </div>

              {/* 360 Viewer Simulated Controls Bar */}
              <div className="relative z-10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs font-semibold text-white">
                  <Box className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Panorama 360° Imersif</span>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-500/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-400/40 text-[10px] font-bold text-amber-300">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>Putar Sudut Bebas</span>
                </div>
              </div>

              {/* Simulated Center Hotspot Marker in 360 Space */}
              <div className="relative z-10 my-auto self-center flex flex-col items-center text-center space-y-1.5">
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-[#D4AF37] bg-[#D4AF37]/25 backdrop-blur-xs flex items-center justify-center animate-pulse">
                  <Box className="w-5 h-5 text-amber-200" />
                </div>
                <div className="bg-black/75 backdrop-blur-md px-3 py-1 rounded-xl border border-white/20 text-[10px] text-stone-200 font-semibold shadow-lg">
                  Hotspot Sejarah: Pilar Kolonial Belanda (1912)
                </div>
              </div>

              {/* Simulated Audio Narration Bar */}
              <div className="relative z-10 bg-black/75 backdrop-blur-md p-2.5 rounded-2xl border border-white/15 flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1.5 rounded-xl bg-[#C85A32] text-white flex-shrink-0">
                    <Volume2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold truncate">Audio Narasi: Sejarah Maritim Donggala</p>
                    <p className="text-[9px] text-stone-300 font-light truncate">Transkripsi Dwibahasa Indonesia & Kaili Tara</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[#D4AF37] text-[10px] font-mono flex-shrink-0">
                  <span className="w-1.5 h-3 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-5 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>

            </div>

            {/* Description & Action */}
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C85A32]">
                  <Box className="w-4 h-4 text-[#C85A32]" />
                  <span>PENGALAMAN VISUAL IMERSIF</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#1C1917] font-serif-heading">
                  Tur Panorama Visual 360° & Audio Narasi
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                  Rasakan atmosfer ruang fisik peninggalan arsitektur kolonial dan pesisir Donggala secara 360 derajat. Dilengkapi audio transkripsi sejarah dwibahasa, hotspot informasi arsitektur, dan suasana suara latar pelabuhan tempo dulu.
                </p>

                {/* Feature Bullets */}
                <div className="pt-2 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Jelajah panorama 360° resolusi tinggi langsung di peramban</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Audio transkripsi sejarah lengkap berbahasa Indonesia & Kaili</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Hotspot informatif interaktif pada setiap elemen arsitektur penting</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onStart360Tour(featuredSite)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl bg-[#C85A32] hover:bg-[#b8502a] text-white font-bold text-xs sm:text-sm shadow-sm transition-all transform hover:scale-[1.02] cursor-pointer"
                >
                  <Box className="w-4 h-4" />
                  <span>Jelajahi Tur Panorama 360°</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
