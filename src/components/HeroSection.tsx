import React, { useState } from 'react';
import { 
  Sparkles, 
  Box, 
  Compass, 
  Volume2, 
  ArrowRight, 
  ShieldCheck, 
  MapPin, 
  Navigation,
  RotateCw,
  Eye,
  Layers,
  MessageSquareQuote,
  Maximize2,
  Smartphone,
  Anchor,
  Building2,
  BookOpen,
  Map as MapIcon,
  Trophy,
  Target,
  Camera,
  History
} from 'lucide-react';
import { heritageSites } from '../data/heritageSites';
import { HeritageSite } from '../types';

interface HeroSectionProps {
  onStart360Tour: (site?: HeritageSite) => void;
  onOpenMap: () => void;
  onOpenTantanganPenjelajah: () => void;
  onOpenTimeSlider?: (site: HeritageSite) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStart360Tour,
  onOpenMap,
  onOpenTantanganPenjelajah,
  onOpenTimeSlider
}) => {
  const [activeSiteIdx, setActiveSiteIdx] = useState(0);
  const activeSite = heritageSites[activeSiteIdx] || heritageSites[0];

  return (
    <section className="relative overflow-hidden bg-[#F5F3EF] border-b border-stone-200/80">
      
      {/* Decorative Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C85A32]/6 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#0F4C81]/6 rounded-full blur-3xl pointer-events-none" />
      
      {/* Tenun Donggala Top Border Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#C85A32] via-[#D4AF37] to-[#0F4C81]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-16 sm:pb-24 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* =========================================================================
              LEFT COLUMN: Typography, Description & Primary CTA
              ========================================================================= */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            
            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-bold text-[#1C1917] font-serif-heading tracking-tight leading-[1.15]">
                DIJELAJAH{' '}
                <span className="text-[#C85A32] relative inline-block">
                  DONGGALA
                  <span className="absolute left-0 -bottom-1 w-full h-1 bg-[#D4AF37]/50 rounded-full" />
                </span>
              </h1>
              <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed max-w-xl">
                Eksplorasi situs bersejarah Kota Tua Donggala melalui peta interaktif, panorama visual 360 derajat, audio transkripsi sejarah, linimasa serta media pembelajaran budaya lokal
              </p>
            </div>

            {/* Primary Call to Action: Mulai Jelajah */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                id="btn-hero-start-explore"
                onClick={onOpenMap}
                className="px-8 py-4 rounded-2xl bg-[#C85A32] hover:bg-[#B8502A] text-white font-bold text-base sm:text-lg flex items-center justify-center gap-3 shadow-xl shadow-[#C85A32]/25 hover:shadow-2xl transition-all transform hover:-translate-y-0.5 cursor-pointer group"
              >
                <Compass className="w-5 h-5 text-amber-200 transition-transform group-hover:rotate-45" />
                <span>Mulai Jelajah</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5" />
              </button>
            </div>

            {/* Feature Information & Petunjuk Penggunaan Cards */}
            <div className="pt-5 border-t border-stone-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* 1. Tantangan Penjelajah */}
              <div className="p-3.5 rounded-2xl bg-white/80 border border-stone-200/90 shadow-xs space-y-1.5">
                <div className="flex items-center gap-2 text-[#1B4332] font-bold text-xs font-serif-heading">
                  <Trophy className="w-4 h-4 flex-shrink-0 text-amber-600" />
                  <span>Tantangan Penjelajah</span>
                </div>
                <p className="text-[11px] text-stone-600 font-light leading-relaxed">
                  Kumpulkan stempel di buku kunjungan budaya dan selesaikan kuis sejarah untuk meraih sertifikat.
                </p>
                <div className="text-[10px] text-[#1B4332] font-medium pt-1 border-t border-stone-100 flex items-center gap-1">
                  <span className="font-bold">Panduan:</span> Buka dari beranda atau peta interaktif
                </div>
              </div>

              {/* 2. Peta Interaktif */}
              <div className="p-3.5 rounded-2xl bg-white/80 border border-stone-200/90 shadow-xs space-y-1.5">
                <div className="flex items-center gap-2 text-[#0F4C81] font-bold text-xs font-serif-heading">
                  <MapIcon className="w-4 h-4 flex-shrink-0 text-[#0F4C81]" />
                  <span>Peta Interaktif</span>
                </div>
                <p className="text-[11px] text-stone-600 font-light leading-relaxed">
                  Navigasi 15 titik cagar budaya di peta satelit dengan filter 3 kategori dan petunjuk rute.
                </p>
                <div className="text-[10px] text-[#0F4C81] font-medium pt-1 border-t border-stone-100 flex items-center gap-1">
                  <span className="font-bold">Panduan:</span> Klik titik untuk buka tur & rute
                </div>
              </div>

              {/* 3. Tur 360° & Audio */}
              <div className="p-3.5 rounded-2xl bg-white/80 border border-stone-200/90 shadow-xs space-y-1.5">
                <div className="flex items-center gap-2 text-[#C85A32] font-bold text-xs font-serif-heading">
                  <Compass className="w-4 h-4 flex-shrink-0 text-[#C85A32]" />
                  <span>Tur 360° & Audio</span>
                </div>
                <p className="text-[11px] text-stone-600 font-light leading-relaxed">
                  Visual panorama 360° imersif, hotspot detail arsitektur, dan narasi dwibahasa Kaili-ID.
                </p>
                <div className="text-[10px] text-[#C85A32] font-medium pt-1 border-t border-stone-100 flex items-center gap-1">
                  <span className="font-bold">Panduan:</span> Akses langsung dari titik peta interaktif
                </div>
              </div>
            </div>

          </div>

          {/* =========================================================================
              RIGHT COLUMN: TWO MOBILE DEVICE MOCKUPS
              - Mockup 1: Gedung Tua Gudang Kopra Donggala (Foto Masa Kini)
              - Mockup 2: Linimasa Gudang Kopra (Masa Lampau & Masa Kini)
              ========================================================================= */}
          <div className="lg:col-span-6 flex items-center justify-center relative">
            
            {/* Ambient Backing Glow */}
            <div className="absolute w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-tr from-[#C85A32]/20 to-[#0F4C81]/20 rounded-full blur-3xl -z-10" />

            {/* Container for both mockups */}
            <div className="relative w-full max-w-lg h-[460px] sm:h-[500px] flex items-center justify-center">

              {/* =====================================================================
                  MOCKUP 1 (PRIMARY): ILUSTRASI VECTOR ARSITEKTUR GEDUNG TUA DONGGALA
                  ===================================================================== */}
              <div 
                className="absolute left-0 sm:left-4 top-2 sm:top-4 z-20 w-[240px] sm:w-[270px] bg-stone-900 rounded-[2.5rem] p-2.5 shadow-2xl border-4 border-stone-800 transform -rotate-2 hover:rotate-0 transition-transform duration-500 group select-none"
              >
                
                {/* Speaker Ear Notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-stone-800 rounded-full z-30" />

                {/* Phone Screen Canvas */}
                <div className="relative h-[380px] sm:h-[420px] rounded-[2rem] overflow-hidden bg-stone-950 flex flex-col justify-between p-3.5 text-white border border-stone-800/80">
                  
                  {/* Background SVG Vector Illustration: Arsitektur Gedung Tua Kolonial */}
                  <div className="absolute inset-0 w-full h-full pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 240 420" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="skyGrad1" x1="120" y1="0" x2="120" y2="420" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#0a0f1d" />
                          <stop offset="0.45" stopColor="#152238" />
                          <stop offset="0.75" stopColor="#25354e" />
                          <stop offset="1" stopColor="#111827" />
                        </linearGradient>
                        <linearGradient id="roofGrad1" x1="120" y1="120" x2="120" y2="180" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#d97706" />
                          <stop offset="1" stopColor="#92400e" />
                        </linearGradient>
                        <linearGradient id="wallGrad1" x1="120" y1="180" x2="120" y2="280" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#e7e5e4" />
                          <stop offset="1" stopColor="#a8a29e" />
                        </linearGradient>
                      </defs>

                      {/* Sky & Coastline */}
                      <rect width="240" height="420" fill="url(#skyGrad1)" />

                      {/* Vector Stars / Constellation Points */}
                      <circle cx="45" cy="40" r="1.5" fill="#fef08a" opacity="0.6" />
                      <circle cx="195" cy="55" r="1" fill="#fef08a" opacity="0.5" />
                      <circle cx="120" cy="30" r="1.5" fill="#fef08a" opacity="0.7" />
                      <circle cx="70" cy="75" r="1" fill="#fef08a" opacity="0.4" />
                      <circle cx="170" cy="80" r="1.5" fill="#fef08a" opacity="0.6" />

                      {/* Distant Mountains of Donggala Bay */}
                      <path d="M0 160 Q60 135 130 150 T240 145 L240 230 L0 230 Z" fill="#0f172a" opacity="0.7" />
                      <path d="M0 175 Q90 155 170 170 T240 165 L240 240 L0 240 Z" fill="#1e293b" opacity="0.8" />
                      
                      {/* Calm Coastal Water Lines */}
                      <line x1="15" y1="215" x2="85" y2="215" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                      <line x1="140" y1="220" x2="225" y2="220" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />

                      {/* Ground Platform */}
                      <rect x="0" y="275" width="240" height="145" fill="#18181b" />
                      <line x1="0" y1="275" x2="240" y2="275" stroke="#d4af37" strokeWidth="1.5" opacity="0.6" />

                      {/* Coconut Palm Left */}
                      <path d="M30 275 Q24 205 40 155" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
                      <path d="M40 155 Q15 145 5 160 M40 155 Q25 130 20 140 M40 155 Q50 135 60 145 M40 155 Q55 150 65 165" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" fill="none" />

                      {/* Coconut Palm Right */}
                      <path d="M210 275 Q216 205 200 155" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
                      <path d="M200 155 Q225 145 235 160 M200 155 Q215 130 220 140 M200 155 Q190 135 180 145 M200 155 Q185 150 175 165" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" fill="none" />

                      {/* Colonial Building Plinth */}
                      <rect x="48" y="265" width="144" height="12" rx="2" fill="#52525b" stroke="#3f3f46" strokeWidth="1" />

                      {/* Main Facade Wall */}
                      <rect x="54" y="180" width="132" height="85" fill="url(#wallGrad1)" stroke="#57534e" strokeWidth="1.5" />
                      
                      {/* Brick lines */}
                      <line x1="54" y1="202" x2="186" y2="202" stroke="#a8a29e" strokeWidth="0.75" opacity="0.6" />
                      <line x1="54" y1="224" x2="186" y2="224" stroke="#a8a29e" strokeWidth="0.75" opacity="0.6" />
                      <line x1="54" y1="246" x2="186" y2="246" stroke="#a8a29e" strokeWidth="0.75" opacity="0.6" />

                      {/* Pilasters */}
                      <rect x="54" y="180" width="10" height="85" fill="#a8a29e" />
                      <rect x="176" y="180" width="10" height="85" fill="#a8a29e" />
                      <rect x="94" y="180" width="8" height="85" fill="#d6d3d1" />
                      <rect x="138" y="180" width="8" height="85" fill="#d6d3d1" />

                      {/* Left Window (Krepyak Kolonial) */}
                      <rect x="70" y="196" width="16" height="34" rx="2" fill="#18181b" stroke="#78350f" strokeWidth="1.5" />
                      <line x1="70" y1="204" x2="86" y2="204" stroke="#d97706" strokeWidth="1" />
                      <line x1="70" y1="212" x2="86" y2="212" stroke="#d97706" strokeWidth="1" />
                      <line x1="70" y1="220" x2="86" y2="220" stroke="#d97706" strokeWidth="1" />

                      {/* Right Window (Krepyak Kolonial) */}
                      <rect x="154" y="196" width="16" height="34" rx="2" fill="#18181b" stroke="#78350f" strokeWidth="1.5" />
                      <line x1="154" y1="204" x2="170" y2="204" stroke="#d97706" strokeWidth="1" />
                      <line x1="154" y1="212" x2="170" y2="212" stroke="#d97706" strokeWidth="1" />
                      <line x1="154" y1="220" x2="170" y2="220" stroke="#d97706" strokeWidth="1" />

                      {/* Central Entrance */}
                      <path d="M106 265 L106 208 Q120 198 134 208 L134 265 Z" fill="#27272a" stroke="#78350f" strokeWidth="1.5" />
                      <line x1="120" y1="203" x2="120" y2="265" stroke="#78350f" strokeWidth="1" />
                      <circle cx="116" cy="240" r="1.5" fill="#d4af37" />
                      <circle cx="124" cy="240" r="1.5" fill="#d4af37" />

                      {/* Pediment & Gabled Warehouse Roof */}
                      <polygon points="120,126 44,180 196,180" fill="url(#roofGrad1)" stroke="#57534e" strokeWidth="1.5" />
                      <line x1="120" y1="128" x2="120" y2="180" stroke="#fcd34d" strokeWidth="1" opacity="0.6" />
                      
                      {/* Ventilation Grille */}
                      <circle cx="120" cy="158" r="9" fill="#18181b" stroke="#fcd34d" strokeWidth="1.5" />
                      <line x1="112" y1="158" x2="128" y2="158" stroke="#fcd34d" strokeWidth="1" />
                      <line x1="120" y1="150" x2="120" y2="166" stroke="#fcd34d" strokeWidth="1" />

                      {/* 360° Rotational Orbit Guideline Overlay */}
                      <ellipse cx="120" cy="215" rx="88" ry="32" stroke="#d4af37" strokeWidth="1.2" strokeDasharray="4 4" fill="none" opacity="0.6" />
                      <circle cx="32" cy="215" r="3" fill="#d4af37" />
                      <circle cx="208" cy="215" r="3" fill="#d4af37" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/60 pointer-events-none" />

                  {/* Top Floating Badge inside Screen */}
                  <div className="relative z-10 pt-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-[10px] font-bold border border-amber-400/40 flex items-center gap-1.5 text-amber-300">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>ILUSTRASI ARSITEKTUR</span>
                    </span>
                    <span className="text-[10px] text-stone-300 font-mono bg-stone-900/80 px-2 py-0.5 rounded-md border border-stone-700">
                      Contoh Visual
                    </span>
                  </div>

                  {/* Center Hotspot Indicator (Purely Illustrative) */}
                  <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center space-y-1.5 pointer-events-none">
                    <div className="w-11 h-11 rounded-full border-2 border-dashed border-amber-400/70 bg-amber-500/15 backdrop-blur-xs flex items-center justify-center shadow-lg">
                      <Building2 className="w-5 h-5 text-amber-300" />
                    </div>
                    <span className="text-[10px] font-semibold text-amber-200 bg-black/60 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-amber-300/30">
                      Gedung Tua Gudang Kopra
                    </span>
                  </div>

                  {/* Bottom Info inside Screen */}
                  <div className="relative z-10 space-y-2">
                    <div>
                      <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block">
                        Kawasan Pelabuhan Donggala
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold font-serif-heading truncate text-white">
                        Gedung Tua Gudang Kopra
                      </h4>
                    </div>

                    {/* Mini Information Bar */}
                    <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <Box className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span className="truncate max-w-[130px] text-stone-200">Ilustrasi Format Visual 360°</span>
                      </div>
                      <span className="text-amber-300 font-mono text-[9px]">Simulasi</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* =====================================================================
                  MOCKUP 2 (SECONDARY): ILUSTRASI VECTOR LINIMASA SEJARAH
                  ===================================================================== */}
              <div 
                className="absolute right-0 sm:right-4 bottom-2 sm:bottom-4 z-10 w-[230px] sm:w-[260px] bg-stone-900 rounded-[2.5rem] p-2.5 shadow-xl border-4 border-stone-800 transform rotate-3 hover:rotate-0 transition-transform duration-500 group select-none hidden sm:block"
              >
                
                {/* Speaker Ear Notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-14 h-3 bg-stone-800 rounded-full z-30" />

                {/* Phone Screen Canvas */}
                <div className="relative h-[360px] sm:h-[400px] rounded-[2rem] overflow-hidden bg-stone-950 flex flex-col justify-between p-3 text-white border border-stone-800">
                  
                  {/* Top Ribbon on Screen */}
                  <div className="relative z-10 pt-1 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[9px] font-bold flex items-center gap-1">
                      <History className="w-3 h-3 text-amber-400" />
                      <span>ILUSTRASI LINIMASA</span>
                    </span>
                    <span className="text-[9px] text-stone-300 font-mono bg-black/60 px-1.5 py-0.5 rounded">
                      1914 ➔ 2026
                    </span>
                  </div>

                  {/* Linimasa Split: Vector Masa Lampau vs Vector Masa Kini */}
                  <div className="relative z-10 my-auto space-y-1.5 py-1">
                    
                    {/* 1. Panel Vector Ilustrasi Masa Lampau (Era Maritim 1924) */}
                    <div className="relative h-[105px] sm:h-[115px] rounded-xl overflow-hidden border border-amber-500/40 bg-[#1c130c]">
                      <svg className="w-full h-full" viewBox="0 0 220 115" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id="pastSkyGrad" x1="110" y1="0" x2="110" y2="115" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#451a03" />
                            <stop offset="0.6" stopColor="#9a3412" />
                            <stop offset="1" stopColor="#1c1917" />
                          </linearGradient>
                        </defs>
                        <rect width="220" height="115" fill="url(#pastSkyGrad)" />
                        
                        {/* Vintage Sun */}
                        <circle cx="170" cy="40" r="16" fill="#fbbf24" opacity="0.8" />
                        
                        {/* Coastline & Hills */}
                        <path d="M0 65 Q60 50 130 58 T220 55 L220 115 L0 115 Z" fill="#29180f" opacity="0.8" />
                        <path d="M0 75 Q70 65 140 70 T220 68 L220 115 L0 115 Z" fill="#18120e" />

                        {/* Sea Lines */}
                        <line x1="10" y1="82" x2="70" y2="82" stroke="#fbbf24" strokeWidth="0.8" opacity="0.4" />
                        <line x1="90" y1="88" x2="150" y2="88" stroke="#fbbf24" strokeWidth="0.8" opacity="0.3" />

                        {/* Historic Steam / Cargo Ship */}
                        <path d="M120 78 L145 78 L142 84 L118 84 Z" fill="#1c1917" stroke="#fbbf24" strokeWidth="0.75" />
                        <line x1="130" y1="70" x2="130" y2="78" stroke="#fcd34d" strokeWidth="1" />
                        <line x1="138" y1="72" x2="138" y2="78" stroke="#fcd34d" strokeWidth="0.8" />
                        <rect x="127" y="73" width="6" height="5" fill="#78350f" />

                        {/* Pier & Wooden Pilings */}
                        <rect x="10" y="80" width="80" height="8" fill="#573318" stroke="#29180f" strokeWidth="0.75" />
                        <line x1="20" y1="88" x2="20" y2="105" stroke="#3e2210" strokeWidth="2.5" />
                        <line x1="45" y1="88" x2="45" y2="108" stroke="#3e2210" strokeWidth="2.5" />
                        <line x1="70" y1="88" x2="70" y2="106" stroke="#3e2210" strokeWidth="2.5" />

                        {/* Copra Cargo Sacks & Barrels */}
                        <circle cx="28" cy="76" r="4" fill="#d97706" />
                        <circle cx="34" cy="76" r="4" fill="#b45309" />
                        <circle cx="31" cy="71" r="3.5" fill="#f59e0b" />
                        <rect x="44" y="70" width="7" height="10" rx="1" fill="#78350f" stroke="#d97706" strokeWidth="0.5" />
                      </svg>
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/30 pointer-events-none" />
                      
                      {/* Badge Masa Lampau */}
                      <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/75 backdrop-blur-xs border border-amber-400/60 text-amber-300 text-[8px] font-bold">
                        Masa Lampau (Era 1924)
                      </div>
                      
                      <div className="absolute bottom-1 left-1.5 right-1.5 flex items-center justify-between text-[8px]">
                        <span className="text-stone-200 truncate max-w-[140px]">Pelabuhan & Perdagangan Kopra</span>
                        <span className="text-amber-300/80 font-mono">Arsip Sejarah</span>
                      </div>
                    </div>

                    {/* Timeline Connector Bridge */}
                    <div className="flex items-center justify-center gap-1.5 py-0.5">
                      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
                      <span className="text-[8px] font-semibold text-amber-300 uppercase bg-stone-900 px-2 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1 shadow-xs">
                        <ArrowRight className="w-2.5 h-2.5 text-amber-400" />
                        <span>Transformasi Waktu</span>
                      </span>
                      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
                    </div>

                    {/* 2. Panel Vector Ilustrasi Masa Kini (Pelestarian) */}
                    <div className="relative h-[105px] sm:h-[115px] rounded-xl overflow-hidden border border-emerald-500/40 bg-[#091e17]">
                      <svg className="w-full h-full" viewBox="0 0 220 115" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id="presSkyGrad" x1="110" y1="0" x2="110" y2="115" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#064e3b" />
                            <stop offset="0.7" stopColor="#022c22" />
                            <stop offset="1" stopColor="#0f172a" />
                          </linearGradient>
                        </defs>
                        <rect width="220" height="115" fill="url(#presSkyGrad)" />
                        
                        {/* Digital Heritage Grid Lines */}
                        <line x1="0" y1="35" x2="220" y2="35" stroke="#10b981" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
                        <line x1="0" y1="70" x2="220" y2="70" stroke="#10b981" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
                        
                        {/* Mountain Coastline */}
                        <path d="M0 65 Q70 50 140 60 T220 58 L220 115 L0 115 Z" fill="#032119" />

                        {/* Preserved Warehouse Silhouette */}
                        <rect x="65" y="60" width="90" height="35" fill="#e7e5e4" stroke="#047857" strokeWidth="1" />
                        <polygon points="110,40 58,60 162,60" fill="#b45309" stroke="#78350f" strokeWidth="1" />
                        <circle cx="110" cy="51" r="4.5" fill="#1c1917" stroke="#fcd34d" strokeWidth="1" />
                        
                        {/* Windows & Doors */}
                        <rect x="75" y="68" width="10" height="16" rx="1" fill="#18181b" stroke="#047857" strokeWidth="0.8" />
                        <rect x="135" y="68" width="10" height="16" rx="1" fill="#18181b" stroke="#047857" strokeWidth="0.8" />
                        <rect x="102" y="70" width="16" height="25" fill="#292524" stroke="#047857" strokeWidth="0.8" />

                        {/* Ground & Vegetation */}
                        <rect x="0" y="95" width="220" height="20" fill="#022c22" />
                        <circle cx="30" cy="85" r="12" fill="#047857" opacity="0.8" />
                        <circle cx="45" cy="80" r="14" fill="#059669" opacity="0.9" />
                        <circle cx="185" cy="82" r="12" fill="#047857" opacity="0.8" />
                        <circle cx="198" cy="85" r="10" fill="#059669" opacity="0.9" />

                        {/* Cultural Protection Beacon */}
                        <circle cx="110" cy="40" r="12" stroke="#34d399" strokeWidth="1" strokeDasharray="2 2" fill="none" opacity="0.8" />
                        <circle cx="110" cy="40" r="3" fill="#34d399" />
                      </svg>
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/30 pointer-events-none" />
                      
                      {/* Badge Masa Kini */}
                      <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/75 backdrop-blur-xs border border-emerald-400/60 text-emerald-300 text-[8px] font-bold">
                        Masa Kini (Pelestarian)
                      </div>
                      
                      <div className="absolute bottom-1 left-1.5 right-1.5 flex items-center justify-between text-[8px]">
                        <span className="text-stone-200 truncate max-w-[140px]">Pelestarian Cagar Budaya</span>
                        <span className="text-emerald-300/90 font-mono">Konservasi</span>
                      </div>
                    </div>

                  </div>

                  {/* Bottom Linimasa Card */}
                  <div className="relative z-10 p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-white">Ilustrasi Linimasa Sejarah</span>
                      <span className="text-amber-300 font-mono text-[9px]">Simulasi</span>
                    </div>
                    <p className="text-[8px] text-stone-300 font-light mt-0.5 leading-tight">
                      Contoh visual perbandingan transformasi cagar budaya Donggala.
                    </p>
                  </div>

                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};
