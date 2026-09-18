import React, { useState, useRef } from 'react';
import { HeritageSite } from '../types';
import { X, Layers, ArrowLeftRight, Calendar, Camera, ShieldCheck, MapPin, Sparkles } from 'lucide-react';

interface TimeSliderModalProps {
  site: HeritageSite;
  isOpen: boolean;
  onClose: () => void;
}

export const TimeSliderModal: React.FC<TimeSliderModalProps> = ({
  site,
  isOpen,
  onClose
}) => {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 - 100)
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  if (!isOpen) return null;

  const handlePointerDown = () => {
    isDraggingRef.current = true;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div 
      onPointerUp={handlePointerUp}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-5xl glass-modal overflow-hidden flex flex-col max-h-[90vh] shadow-2xl">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#0d0c0b]/90 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#d4a373]/15 border border-[#d4a373]/30 text-[#d4a373]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white font-serif-heading">
                  Lensa Waktu: Komparasi Sejarah
                </h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#d4a373]/20 text-[#d4a373] font-semibold border border-[#d4a373]/30">
                  {site.establishedYear} ⇄ Masa Kini
                </span>
              </div>
              <p className="text-xs text-stone-400 font-light">
                {site.title} ({site.kelurahan})
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
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6 flex-1 font-light">
          
          {/* Interactive Split Comparison Slider */}
          <div 
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            className="relative w-full h-[320px] sm:h-[420px] rounded-3xl overflow-hidden select-none cursor-ew-resize border border-white/10 shadow-2xl"
          >
            {/* Background Layer: Current Photo */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src={site.currentPhoto.url}
                alt={`Kondisi Terkini - ${site.title}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-4 right-4 glass-panel px-3.5 py-1.5 text-stone-200 text-xs font-semibold flex items-center gap-2 shadow-lg">
                <Camera className="w-3.5 h-3.5 text-emerald-400" />
                <span>Foto Terkini: {site.currentPhoto.conditionStatus}</span>
              </div>
            </div>

            {/* Foreground Layer: Past Archival Photo (Clipped by slider position) */}
            <div 
              className="absolute inset-0 h-full overflow-hidden border-r-2 border-[#d4a373] shadow-2xl"
              style={{ width: `${sliderPosition}%` }}
            >
              <div className="relative w-full h-full min-w-[300px]" style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}>
                <img
                  src={site.pastPhoto.url}
                  alt={`Foto Tempo Dulu - ${site.title}`}
                  className="w-full h-full object-cover filter grayscale contrast-125 sepia-[0.25]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-4 left-4 glass-panel px-3.5 py-1.5 text-[#d4a373] text-xs font-semibold flex items-center gap-2 shadow-lg border border-[#d4a373]/40">
                  <Calendar className="w-3.5 h-3.5 text-[#d4a373]" />
                  <span>Arsip Kolonial ({site.pastPhoto.year})</span>
                </div>
              </div>
            </div>

            {/* Central Draggable Handle */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-[#d4a373] pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#d4a373] border-2 border-[#0d0c0b] shadow-2xl flex items-center justify-center text-[#0d0c0b] font-bold">
                <ArrowLeftRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Slider Instruction Note */}
          <div className="text-center text-xs text-stone-400 flex items-center justify-center gap-2 font-light">
            <Sparkles className="w-3.5 h-3.5 text-[#d4a373]" />
            <span>Geser garis pembatas ke kiri dan kanan untuk membandingkan wujud tempo dulu dan kondisi sekarang.</span>
          </div>

          {/* Captions & Preservation Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Past Photo Info */}
            <div className="p-5 rounded-3xl glass-panel">
              <div className="flex items-center gap-2 text-[#d4a373] text-xs font-bold uppercase tracking-wider mb-2 font-serif-heading">
                <Calendar className="w-4 h-4 text-[#d4a373]" />
                Catatan Arsip Sejarah ({site.pastPhoto.year})
              </div>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                {site.pastPhoto.caption}
              </p>
              <div className="mt-3 text-[11px] text-stone-400 font-light">
                <strong className="text-stone-300 font-medium">Sumber Dokumentasi:</strong> {site.pastPhoto.source}
              </div>
            </div>

            {/* Current Preservation Info */}
            <div className="p-5 rounded-3xl glass-panel">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2 font-serif-heading">
                <ShieldCheck className="w-4 h-4" />
                Kondisi & Status Revitalisasi 2026
              </div>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                {site.currentPhoto.caption}
              </p>
              <div className="mt-3 flex items-center gap-2 text-[11px]">
                <span className="text-stone-400 font-light">Status Cagar Budaya:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  {site.currentPhoto.conditionStatus}
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
