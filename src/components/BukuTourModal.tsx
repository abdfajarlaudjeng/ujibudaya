import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { HeritageSite } from '../types';
import { 
  X, 
  Award, 
  CheckCircle2, 
  Lock, 
  Printer, 
  Sparkles, 
  BookOpen, 
  Compass, 
  Share2, 
  MapPin,
  Box,
  Layers,
  ChevronRight,
  ShieldCheck,
  Download
} from 'lucide-react';

interface BukuTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  sites: HeritageSite[];
  visitedSiteIds: string[];
  onSelectSite: (site: HeritageSite) => void;
  onOpen360Tour: (site: HeritageSite) => void;
}

export const BukuTourModal: React.FC<BukuTourModalProps> = ({
  isOpen,
  onClose,
  sites,
  visitedSiteIds,
  onSelectSite,
  onOpen360Tour
}) => {
  const [activeTab, setActiveTab] = useState<'sites' | 'badges' | 'certificate'>('sites');
  const [explorerName, setExplorerName] = useState<string>(() => {
    try {
      return localStorage.getItem('donggala_explorer_name') || 'Penjelajah Warisan';
    } catch {
      return 'Penjelajah Warisan';
    }
  });
  const [isEditingName, setIsEditingName] = useState(false);

  if (!isOpen) return null;

  const total = sites.length;
  const visitedCount = visitedSiteIds.length;
  const progressPercentage = Math.round((visitedCount / total) * 100);

  // Badges logic based on explorer progress
  const badges = [
    {
      id: 'first_step',
      title: 'Langkah Awal Penjelajah',
      description: 'Menjelajahi situs cagar budaya pertama di Kota Tua Donggala.',
      icon: '🏛️',
      unlocked: visitedCount >= 1,
      required: '1 Situs'
    },
    {
      id: 'colonial_enthusiast',
      title: 'Kolektor Arsitektur Kolonial',
      description: 'Menyusuri 3 situs era kolonial termasuk Gedung KPM & Pelabuhan Lama.',
      icon: '🚢',
      unlocked: visitedCount >= 3,
      required: '3 Situs'
    },
    {
      id: 'maritime_scout',
      title: 'Pengelana Maritim Selat Makassar',
      description: 'Menjelajahi 7 titik strategis pesisir dan mercusuar Banawa.',
      icon: '🧭',
      unlocked: visitedCount >= 7,
      required: '7 Situs'
    },
    {
      id: 'heritage_guardian',
      title: 'Pemerhati Pusaka Tradisional',
      description: 'Menjelajahi 10 situs bersejarah termasuk Rumah Adat Souraja & Kelenteng.',
      icon: '📜',
      unlocked: visitedCount >= 10,
      required: '10 Situs'
    },
    {
      id: 'grand_master',
      title: 'Maestro Warisan Kota Tua Donggala',
      description: 'Menuntaskan seluruh 15 ekspedisi visual 360° di 4 Kelurahan Banawa.',
      icon: '👑',
      unlocked: visitedCount >= total,
      required: '15 Situs Lengkap'
    }
  ];

  const handleSaveName = (name: string) => {
    setExplorerName(name);
    try {
      localStorage.setItem('donggala_explorer_name', name);
    } catch (e) {
      console.warn(e);
    }
    setIsEditingName(false);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handlePrintCertificate = () => {
    triggerConfetti();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-4xl bg-[#faf8f5] rounded-3xl overflow-hidden flex flex-col max-h-[92vh] shadow-2xl border border-stone-300">
        
        {/* Header Bar */}
        <div className="px-6 py-5 bg-[#1b4332] text-white flex items-center justify-between border-b border-[#d4af37]/30">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37]">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-base sm:text-xl font-bold font-serif-heading text-[#f5efe6]">
                  Buku Tour Kota Tua Donggala
                </h3>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#d4af37] text-[#1b4332] font-extrabold shadow-xs">
                  {progressPercentage}% Selesai
                </span>
              </div>
              <p className="text-xs text-stone-300 font-light mt-0.5">
                Jurnal & logbook resmi ekspedisi digital 15 situs cagar budaya Banawa
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Ribbon & Navigation Tabs */}
        <div className="bg-white px-6 py-3 border-b border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Progress Visual Bar */}
          <div className="w-full sm:w-72 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-stone-600 font-medium">
              <span>Progres Jelajah:</span>
              <span className="font-bold text-[#c85a32]">{visitedCount} dari {total} Situs</span>
            </div>
            <div className="h-2.5 w-full bg-stone-100 rounded-full overflow-hidden border border-stone-200">
              <div 
                className="h-full bg-gradient-to-r from-[#c85a32] to-[#d4af37] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
            <button
              onClick={() => setActiveTab('sites')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'sites'
                  ? 'bg-white text-[#1b4332] shadow-xs border border-stone-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Daftar Stempel Situs ({visitedCount})
            </button>

            <button
              onClick={() => setActiveTab('badges')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'badges'
                  ? 'bg-white text-[#c85a32] shadow-xs border border-stone-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>Lencana Prestasi</span>
              <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
            </button>

            <button
              onClick={() => setActiveTab('certificate')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'certificate'
                  ? 'bg-white text-[#0f4c81] shadow-xs border border-stone-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Sertifikat Penjelajah
            </button>
          </div>

        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#faf8f5]">
          
          {/* TAB 1: SITES STEMPEL & LOGBOOK */}
          {activeTab === 'sites' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-stone-900 font-serif-heading">
                    Koleksi Stempel Eksplorasi 360°
                  </h4>
                  <p className="text-xs text-stone-500 font-light">
                    Setiap kali Anda membuka dan menjelajahi Tur 360° di suatu lokasi, stempel resmi akan otomatis terbuka di Buku Tour Anda.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {sites.map((site, index) => {
                  const isVisited = visitedSiteIds.includes(site.id);

                  return (
                    <div
                      key={site.id}
                      className={`p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3 ${
                        isVisited
                          ? 'bg-white border-[#1b4332]/30 shadow-sm ring-1 ring-[#1b4332]/10'
                          : 'bg-stone-50 border-stone-200/80 opacity-80'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Thumbnail or Stamp Placeholder */}
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-200 flex-shrink-0 border border-stone-200">
                          <img
                            src={site.thumbnail}
                            alt={site.title}
                            className={`w-full h-full object-cover ${!isVisited ? 'grayscale opacity-60' : ''}`}
                            referrerPolicy="no-referrer"
                          />
                          {isVisited ? (
                            <div className="absolute inset-0 bg-[#1b4332]/30 backdrop-blur-[1px] flex items-center justify-center">
                              <CheckCircle2 className="w-5 h-5 text-[#d4af37]" />
                            </div>
                          ) : (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Lock className="w-4 h-4 text-white/80" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-stone-400 font-mono">
                              #{index + 1}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 font-medium truncate">
                              {site.kelurahan.replace('Kelurahan ', '')}
                            </span>
                          </div>
                          <h5 className="text-xs font-bold text-stone-900 truncate font-serif-heading mt-0.5">
                            {site.title}
                          </h5>
                          <p className="text-[10px] text-stone-500 truncate">
                            Th. {site.establishedYear} • {site.category}
                          </p>
                        </div>
                      </div>

                      {/* Bottom Status & Action */}
                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                        {isVisited ? (
                          <span className="text-[10px] font-bold text-[#1b4332] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Sudah Dijelajahi</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-stone-400 font-medium">
                            Belum Dijelajahi
                          </span>
                        )}

                        <button
                          onClick={() => {
                            onClose();
                            onOpen360Tour(site);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#c85a32] hover:bg-[#b8502a] text-white text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                        >
                          <Box className="w-3 h-3" />
                          <span>Tur 360°</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: BADGES & PENCAPAIAN */}
          {activeTab === 'badges' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-stone-900 font-serif-heading">
                  Lencana Apresiasi & Gelar Penjelajah
                </h4>
                <p className="text-xs text-stone-500 font-light">
                  Kumpulkan seluruh lencana cagar budaya dengan menjelajahi setiap sudut bersejarah di Donggala.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                      badge.unlocked
                        ? 'bg-white border-[#d4af37]/60 shadow-md ring-1 ring-[#d4af37]/30'
                        : 'bg-stone-100/60 border-stone-200 opacity-60'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border shadow-xs ${
                      badge.unlocked
                        ? 'bg-gradient-to-br from-amber-100 to-orange-100 border-[#d4af37]'
                        : 'bg-stone-200 border-stone-300'
                    }`}>
                      {badge.unlocked ? badge.icon : '🔒'}
                    </div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h5 className="text-xs sm:text-sm font-bold text-stone-900 font-serif-heading">
                          {badge.title}
                        </h5>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          badge.unlocked
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-stone-200 text-stone-600'
                        }`}>
                          {badge.unlocked ? 'Terbuka' : badge.required}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 font-light leading-relaxed">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SERTIFIKAT DIGITAL EKSPLORASI */}
          {activeTab === 'certificate' && (
            <div className="space-y-6">
              
              {/* Explorer Name Customizer */}
              <div className="p-4 bg-white rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                <div className="space-y-0.5">
                  <span className="text-xs text-stone-500 font-medium">Nama pada Sertifikat:</span>
                  <div className="text-sm font-bold text-stone-900 font-serif-heading">
                    {explorerName}
                  </div>
                </div>

                {isEditingName ? (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="text"
                      defaultValue={explorerName}
                      id="input-explorer-name"
                      placeholder="Ketik Nama Anda..."
                      className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-none focus:border-[#c85a32]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveName((e.target as HTMLInputElement).value);
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById('input-explorer-name') as HTMLInputElement;
                        if (input) handleSaveName(input.value);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#c85a32] text-white text-xs font-bold cursor-pointer"
                    >
                      Simpan
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-200 cursor-pointer"
                  >
                    Ubah Nama
                  </button>
                )}
              </div>

              {/* Printable Certificate Canvas Visual */}
              <div className="p-8 sm:p-10 rounded-3xl bg-[#fffefc] border-4 border-[#1b4332] shadow-xl relative overflow-hidden text-center space-y-6">
                
                {/* Decorative Traditional Border Ornament */}
                <div className="absolute top-2 left-2 right-2 bottom-2 border-2 border-[#d4af37]/60 pointer-events-none rounded-2xl" />
                <div className="absolute top-4 left-4 right-4 bottom-4 border border-dashed border-[#1b4332]/20 pointer-events-none rounded-xl" />

                {/* Certificate Header */}
                <div className="space-y-2 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b4332] text-[#d4af37] text-[11px] font-bold uppercase tracking-widest border border-[#d4af37]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Sertifikat Apresiasi Ekspedisi Budaya</span>
                  </div>

                  <h3 className="text-xl sm:text-3xl font-extrabold text-[#1b4332] font-serif-heading tracking-wide">
                    PENJELAJAH KOTA TUA DONGGALA
                  </h3>
                  <p className="text-xs text-stone-500 tracking-wider uppercase font-semibold">
                    Digitalisasi Situs Sejarah Kota Tua Donggala • FPK 2026
                  </p>
                </div>

                {/* Certificate Body */}
                <div className="space-y-3 relative z-10 max-w-lg mx-auto">
                  <p className="text-xs text-stone-600 italic">Diberikan dengan hormat kepada:</p>
                  <div className="text-xl sm:text-2xl font-bold text-[#c85a32] font-serif-heading border-b-2 border-[#d4af37]/50 pb-2 inline-block px-8">
                    {explorerName}
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed font-light">
                    Atas partisipasi dan dedikasi dalam menelusuri serta mempelajari warisan sejarah dan cagar budaya <strong>Kota Tua Donggala</strong> melalui platform virtual interaktif berbasis 360° dan narasi sejarah maritim Nusantara.
                  </p>
                </div>

                {/* Progress Details on Certificate */}
                <div className="grid grid-cols-3 gap-2 max-w-md mx-auto py-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs">
                  <div>
                    <div className="text-[10px] text-stone-500">Total Situs</div>
                    <div className="font-bold text-stone-900 font-mono">{visitedCount} / {total}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-500">Capaian</div>
                    <div className="font-bold text-[#c85a32] font-mono">{progressPercentage}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-stone-500">Status</div>
                    <div className="font-bold text-[#1b4332]">
                      {visitedCount >= total ? 'Tuntas' : 'Aktif'}
                    </div>
                  </div>
                </div>

                {/* Signatures / Badges row */}
                <div className="pt-4 flex items-center justify-between border-t border-stone-200 text-[10px] text-stone-500 px-4">
                  <div className="text-left">
                    <div className="font-bold text-stone-800">Kementerian Pendidikan Dasar & Menengah</div>
                    <div>Program FPK 2026</div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#1b4332] text-[#d4af37] border-2 border-[#d4af37] flex items-center justify-center font-bold text-xs shadow-md">
                    👑
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-stone-800">Pemerintah Kab. Donggala</div>
                    <div>Balai Pelestarian Kebudayaan</div>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handlePrintCertificate}
                  className="px-6 py-3 rounded-xl bg-[#1b4332] hover:bg-[#13382c] text-[#d4af37] font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Simpan PDF Sertifikat</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
