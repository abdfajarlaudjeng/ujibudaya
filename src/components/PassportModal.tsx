import React from 'react';
import confetti from 'canvas-confetti';
import { HeritageSite } from '../types';
import { 
  X, 
  Award, 
  CheckCircle2, 
  Lock, 
  Printer, 
  Sparkles, 
  ShieldCheck, 
  Compass, 
  Share2, 
  MapPin 
} from 'lucide-react';

interface PassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  sites: HeritageSite[];
  visitedSiteIds: string[];
  onSelectSite: (site: HeritageSite) => void;
}

export const PassportModal: React.FC<PassportModalProps> = ({
  isOpen,
  onClose,
  sites,
  visitedSiteIds,
  onSelectSite
}) => {
  if (!isOpen) return null;

  const total = sites.length;
  const visitedCount = visitedSiteIds.length;
  const progressPercentage = Math.round((visitedCount / total) * 100);

  let badgeRank = 'Penjelajah Pemula';
  let badgeColor = 'text-amber-400 border-amber-500/40 bg-amber-500/10';
  if (visitedCount >= 5) {
    badgeRank = 'Pemerhati Kota Tua';
    badgeColor = 'text-sky-400 border-sky-500/40 bg-sky-500/10';
  }
  if (visitedCount >= 10) {
    badgeRank = 'Sahabat Cagar Budaya Donggala';
    badgeColor = 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
  }
  if (visitedCount === total) {
    badgeRank = 'Duta Warisan Maritim Nusantara 🏅';
    badgeColor = 'text-amber-300 border-amber-400 bg-amber-500/20';
  }

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handlePrintCertificate = () => {
    triggerConfetti();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-4xl glass-modal overflow-hidden flex flex-col max-h-[90vh] shadow-2xl">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-[#0d0c0b]/90 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#d4a373]/15 border border-[#d4a373]/30 text-[#d4a373]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white font-serif-heading">
                  Paspor Budaya Digital Kota Tua Donggala
                </h3>
                <span className={`text-[11px] px-3 py-0.5 rounded-full border font-bold ${badgeColor}`}>
                  {badgeRank}
                </span>
              </div>
              <p className="text-xs text-stone-400 font-light">
                Koleksi stempel penjelajahan dan sertifikat apresiasi cagar budaya
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 font-light">
          
          {/* Progress Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-white/[0.04] via-white/[0.02] to-[#d4a373]/10 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-[#d4a373] uppercase tracking-wider flex items-center gap-1.5 font-serif-heading">
                <Sparkles className="w-4 h-4 text-[#d4a373]" />
                Kemajuan Eksplorasi Anda
              </div>
              <h4 className="text-lg font-bold text-white font-serif-heading">
                {visitedCount} dari {total} Situs Sejarah Telah Dikunjungi
              </h4>
              <p className="text-xs text-stone-400 font-light">
                Buka Tur 360° atau dengarkan narasi berbicara untuk melengkapi semua stempel.
              </p>
            </div>

            <div className="w-full sm:w-48 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-stone-300">
                <span>Kelengkapan</span>
                <span className="text-[#d4a373]">{progressPercentage}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#b58051] to-[#d4a373] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

          </div>

          {/* Certificate Download Callout */}
          {visitedCount >= 5 && (
            <div className="p-5 rounded-3xl bg-[#d4a373]/10 border border-[#d4a373]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-[#d4a373] flex-shrink-0" />
                <div className="text-xs sm:text-sm text-stone-200 font-light">
                  <strong className="text-white font-medium">Selamat!</strong> Anda berhak mencetak Sertifikat Partisipasi Apresiasi Cagar Budaya Donggala.
                </div>
              </div>
              <button
                onClick={handlePrintCertificate}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#d4a373] hover:bg-[#e2b98f] text-[#0d0c0b] font-bold text-xs shadow-md transition-colors whitespace-nowrap cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Sertifikat</span>
              </button>
            </div>
          )}

          {/* Stamps Grid */}
          <div>
            <h4 className="text-sm font-bold text-white font-serif-heading mb-4 flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#d4a373]" />
              15 Stempel Paspor Warisan Budaya
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {sites.map((site) => {
                const isVisited = visitedSiteIds.includes(site.id);

                return (
                  <div
                    key={site.id}
                    onClick={() => {
                      onClose();
                      onSelectSite(site);
                    }}
                    className={`group relative p-4 rounded-3xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between ${
                      isVisited
                        ? 'bg-[#d4a373]/15 border-[#d4a373]/50 hover:border-[#d4a373] shadow-lg'
                        : 'glass-panel opacity-60 hover:opacity-100 hover:border-white/20'
                    }`}
                  >
                    {/* Stamp Circular Badge */}
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl border-2 mb-2 transition-transform group-hover:scale-110 ${
                      isVisited
                        ? 'bg-[#0d0c0b] border-[#d4a373] shadow-lg shadow-[#d4a373]/20'
                        : 'bg-white/[0.04] border-white/10 text-stone-600'
                    }`}>
                      {isVisited ? site.talkingPersona.avatar : <Lock className="w-5 h-5 text-stone-600" />}
                    </div>

                    <div className="w-full">
                      <div className="text-xs font-bold text-white truncate font-serif-heading">
                        {site.title.replace('Kantor Dagang ', '').replace('Rumah Tradisional ', '')}
                      </div>
                      <div className="text-[10px] text-stone-400 truncate mt-0.5 font-light">
                        {site.kelurahan.replace('Kelurahan ', '')}
                      </div>

                      {isVisited ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 mt-1.5">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Sudah Dijelajahi</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-stone-500 mt-1.5 block font-light">
                          Belum Dijelajahi
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
