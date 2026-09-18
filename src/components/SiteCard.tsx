import React, { useState } from 'react';
import { HeritageSite } from '../types';
import { 
  Box, 
  MessageSquareQuote, 
  Layers, 
  Volume2, 
  VolumeX, 
  MapPin, 
  Calendar, 
  ArrowUpRight, 
  Sparkles, 
  ShieldCheck,
  Eye,
  HelpCircle 
} from 'lucide-react';
import { VoiceNarrator } from '../services/api';
import { useSiteVisitCount, formatVisitCount } from '../utils/visitTracker';

interface SiteCardProps {
  site: HeritageSite;
  isVisited: boolean;
  onSelect: (site: HeritageSite) => void;
  onOpen360: (site: HeritageSite) => void;
  onOpenTalkingTour: (site: HeritageSite) => void;
  onOpenTimeSlider: (site: HeritageSite) => void;
}

export const SiteCard: React.FC<SiteCardProps> = ({
  site,
  isVisited,
  onSelect,
  onOpen360,
  onOpenTalkingTour,
  onOpenTimeSlider
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const visitCount = useSiteVisitCount(site.id);

  const handleToggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlayingAudio) {
      VoiceNarrator.stop();
      setIsPlayingAudio(false);
    } else {
      VoiceNarrator.speak(
        site.audioNarration.transcript,
        () => setIsPlayingAudio(true),
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false),
        'id'
      );
    }
  };

  return (
    <div 
      onClick={() => onSelect(site)}
      className="group relative bg-white border border-stone-200/90 rounded-2xl flex flex-col cursor-pointer overflow-hidden shadow-sm hover:shadow-xl hover:border-[#c85a32]/40 transition-all duration-300 transform hover:-translate-y-1"
    >
      
      {/* Thumbnail & Image Overlay Header */}
      <div className="relative w-full h-56 overflow-hidden bg-stone-100">
        <img
          src={site.thumbnail}
          alt={site.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-3 py-1 rounded-lg bg-black/75 backdrop-blur-md text-amber-300 font-serif-heading italic font-bold text-xs border border-white/10 shadow">
            Tahun {site.establishedYear}
          </span>

          {isVisited ? (
            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-600/95 text-white font-semibold text-[11px] border border-emerald-400/50 flex items-center gap-1 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sudah Dijelajahi</span>
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-lg bg-black/60 text-stone-300 text-[11px] border border-white/10 backdrop-blur-md">
              Belum Dijelajahi
            </span>
          )}
        </div>

        {/* Audio Narration Quick Play Button */}
        <button
          onClick={handleToggleAudio}
          className={`absolute bottom-3 right-3 p-2.5 rounded-xl backdrop-blur-md shadow-lg border transition-all cursor-pointer ${
            isPlayingAudio
              ? 'bg-[#c85a32] border-[#c85a32] text-white font-bold scale-110 shadow-[#c85a32]/40'
              : 'bg-black/70 border-white/20 text-white hover:bg-black/90 hover:scale-105'
          }`}
          title={isPlayingAudio ? 'Hentikan Audio' : 'Dengarkan Narasi Audio'}
        >
          {isPlayingAudio ? (
            <div className="flex items-center gap-0.5">
              <span className="w-1 h-3 bg-white rounded-full animate-bounce" />
              <span className="w-1 h-4 bg-white rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1 h-2 bg-white rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          ) : (
            <Volume2 className="w-4 h-4 text-amber-300" />
          )}
        </button>

        {/* Persona Avatar Tag */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/15 text-xs text-stone-100">
          <span>{site.talkingPersona.avatar}</span>
          <span className="text-[11px] font-medium tracking-wide">{site.talkingPersona.name}</span>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-white">
        
        <div>
          <div className="flex items-center justify-between gap-1.5 text-xs text-[#c85a32] font-semibold mb-1">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{site.kelurahan}</span>
              <span className="text-stone-300">•</span>
              <span className="text-stone-500 font-normal truncate">{site.category}</span>
            </div>
            <div 
              className="flex items-center gap-1 text-[11px] text-stone-600 font-medium bg-stone-100 px-2.5 py-0.5 rounded-full flex-shrink-0 border border-stone-200"
              title="Jumlah kunjungan yang menjelajahi situs ini"
            >
              <Eye className="w-3 h-3 text-stone-400" />
              <span>{formatVisitCount(visitCount)} kunjungan</span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-[#1c1917] font-serif-heading group-hover:text-[#c85a32] transition-colors line-clamp-1">
            {site.title}
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed font-light">
            {site.briefDescription}
          </p>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="pt-3.5 border-t border-stone-100 flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-1.5">
            {/* 360 Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpen360(site);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-[#c85a32] text-stone-700 hover:text-white text-xs font-semibold border border-stone-200 hover:border-[#c85a32] transition-all cursor-pointer"
              title="Masuk ke Tur 360°"
            >
              <Box className="w-3.5 h-3.5" />
              <span>360°</span>
            </button>

            {/* Tanya & Jawab Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenTalkingTour(site);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f4c81]/10 hover:bg-[#0f4c81] text-[#0f4c81] hover:text-white text-xs font-semibold border border-[#0f4c81]/25 hover:border-[#0f4c81] transition-all cursor-pointer"
              title="Tanya & Jawab: Pilih topik seputar situs sejarah"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Tanya & Jawab</span>
            </button>

            {/* Time Comparison Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenTimeSlider(site);
              }}
              className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-200 transition-colors cursor-pointer"
              title="Lensa Waktu Komparasi"
            >
              <Layers className="w-3.5 h-3.5 text-[#c85a32]" />
            </button>
          </div>

          <span className="text-xs text-stone-500 group-hover:text-[#c85a32] flex items-center font-medium transition-colors">
            <span>Detail</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
          </span>

        </div>

      </div>

    </div>
  );
};
