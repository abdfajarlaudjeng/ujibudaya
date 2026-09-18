import React from 'react';
import { 
  Compass, 
  Map, 
  Volume2, 
  VolumeX, 
  Users,
  Database,
  Plus,
  Download
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'sites' | 'map';
  onSelectTab: (tab: 'sites' | 'map') => void;
  onOpenTantanganPenjelajah?: () => void;
  onOpenAboutUs: () => void;
  onOpenGoogleWorkspace?: () => void;
  onOpenInputData?: () => void;
  isGoogleConnected?: boolean;
  visitedCount?: number;
  totalSites?: number;
  isAmbientPlaying: boolean;
  onToggleAmbient: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenAboutUs,
  onOpenInputData,
  isAmbientPlaying,
  onToggleAmbient
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#F5F3EF]/95 backdrop-blur-xl border-b border-stone-200/80 text-[#1C1917]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Title */}
          <div 
            onClick={() => onSelectTab('sites')}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#C85A32] via-[#B8502A] to-[#0F4C81] p-0.5 shadow-md shadow-[#C85A32]/20 flex items-center justify-center text-white font-serif-heading font-bold text-xl group-hover:scale-105 transition-transform">
              <span className="font-display text-amber-100">D</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-[#1C1917] font-serif-heading">
                  DIJELAJAH DONGGALA
                </span>
                <span className="hidden md:inline-flex text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#C85A32]/10 text-[#C85A32] border border-[#C85A32]/25">
                  FPK 2026
                </span>
              </div>
              <p className="text-xs text-stone-500 font-light tracking-wide max-w-xs sm:max-w-md truncate">
                Eksplorasi situs bersejarah Kota Tua Donggala
              </p>
            </div>
          </div>

          {/* 2 Main Navigation Pages: Beranda & Peta Interaktif */}
          <nav className="hidden md:flex items-center gap-1.5 bg-stone-100/90 p-1.5 rounded-2xl border border-stone-200/80">
            {/* 1. Beranda */}
            <button
              id="nav-tab-landing"
              onClick={() => onSelectTab('sites')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'sites'
                  ? 'bg-white text-[#C85A32] shadow-sm font-bold border border-stone-200/80'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Beranda</span>
            </button>

            {/* 2. Peta Interaktif */}
            <button
              id="nav-tab-map"
              onClick={() => onSelectTab('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'map'
                  ? 'bg-white text-[#0F4C81] shadow-sm font-bold border border-stone-200/80'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <Map className="w-4 h-4 text-[#0F4C81]" />
              <span>Peta Interaktif</span>
            </button>
          </nav>

          {/* Right Action Tools: Input Data, Tentang Kami & Musik Latar */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Input Data Objek Budaya Button */}
            {onOpenInputData && (
              <button
                id="btn-nav-input-data"
                onClick={onOpenInputData}
                title="Input Data Objek Budaya Donggala & Simpan Otomatis di Link"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#C85A32]/10 border border-[#C85A32]/30 hover:bg-[#C85A32] text-[#C85A32] hover:text-white text-xs font-bold shadow-xs transition-all cursor-pointer group"
              >
                <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
                <span className="hidden sm:inline">Input Data Objek</span>
                <span className="sm:hidden">Input</span>
              </button>
            )}

            {/* Unduh File HTML Mandiri Lengkap */}
            <a
              id="btn-nav-download-html"
              href="/download-html"
              download="dijelajah-donggala-cagar-budaya.html"
              title="Unduh File HTML Lengkap untuk dibuka mandiri / offline"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 border border-amber-300/80 hover:bg-amber-100 text-amber-900 text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden lg:inline">Unduh HTML</span>
            </a>

            {/* Tentang Kami Icon Button */}
            <button
              id="btn-nav-about-us"
              onClick={onOpenAboutUs}
              title="Tentang Kami, Tim Kerja & Kolaborasi Kemitraan"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-200 hover:border-[#0F4C81]/40 text-stone-700 hover:text-[#0F4C81] text-xs font-medium shadow-xs transition-all cursor-pointer group"
            >
              <Users className="w-4 h-4 text-[#0F4C81] group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Tentang Kami</span>
            </button>

            {/* Musik Latar Toggle */}
            <button
              id="btn-toggle-soundscape"
              onClick={onToggleAmbient}
              title={isAmbientPlaying ? 'Hentikan musik latar digitalisasi situs sejarah kota tua donggala' : 'Putar musik latar digitalisasi situs sejarah kota tua donggala'}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                isAmbientPlaying
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm'
                  : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              {isAmbientPlaying ? (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-700 animate-pulse" />
                  <span className="font-semibold">Musik Latar</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-stone-400" />
                  <span>Musik Latar</span>
                </>
              )}
            </button>

          </div>

        </div>

        {/* Mobile Navigation Row: Beranda, Peta Interaktif, Input Data & Tentang Kami */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-stone-200 text-xs">
          <button
            onClick={() => onSelectTab('sites')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'sites' ? 'bg-[#C85A32] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </button>
          <button
            onClick={() => onSelectTab('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === 'map' ? 'bg-[#0F4C81] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Peta</span>
          </button>
          {onOpenInputData && (
            <button
              onClick={onOpenInputData}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[#C85A32] bg-[#C85A32]/10 hover:bg-[#C85A32]/20 font-bold transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Input</span>
            </button>
          )}
          <button
            onClick={onOpenAboutUs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 font-medium transition-all"
          >
            <Users className="w-3.5 h-3.5 text-[#0F4C81]" />
            <span>Tentang</span>
          </button>
        </div>

      </div>
    </header>
  );
};
