import React, { useState, useRef } from 'react';
import { HeritageSite } from '../types';
import { 
  X, 
  Box, 
  MessageSquareQuote, 
  Layers, 
  Volume2, 
  VolumeX, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  Anchor, 
  BookOpen, 
  Building2, 
  HelpCircle,
  Share2,
  Check,
  Eye,
  Video,
  Film,
  Play,
  ExternalLink
} from 'lucide-react';
import { VoiceNarrator } from '../services/api';
import { useSiteVisitCount, formatVisitCount } from '../utils/visitTracker';

interface SiteDetailsModalProps {
  site: HeritageSite | null;
  isVisited?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onOpen360: (site: HeritageSite) => void;
  onOpenTalkingTour: (site: HeritageSite) => void;
  onOpenTimeSlider: (site: HeritageSite) => void;
}

export const SiteDetailsModal: React.FC<SiteDetailsModalProps> = ({
  site,
  isVisited = false,
  isOpen,
  onClose,
  onOpen360,
  onOpenTalkingTour,
  onOpenTimeSlider
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const visitCount = useSiteVisitCount(site?.id || '');

  // YouTube embed helper for documentary video
  const getYouTubeEmbedUrl = (url?: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return null;
  };

  if (!isOpen || !site) return null;

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current = null;
      }
      VoiceNarrator.stop();
      setIsPlayingAudio(false);
    } else {
      // If authentic recorded audio is available from Google Sheets
      if (site.audioNarration?.audioUrl) {
        const audio = new Audio(site.audioNarration.audioUrl);
        audioElementRef.current = audio;
        audio.play().then(() => {
          setIsPlayingAudio(true);
        }).catch(() => {
          VoiceNarrator.speak(
            site.audioNarration.transcript,
            () => setIsPlayingAudio(true),
            () => setIsPlayingAudio(false),
            () => setIsPlayingAudio(false)
          );
        });
        audio.onended = () => {
          setIsPlayingAudio(false);
          audioElementRef.current = null;
        };
        return;
      }

      VoiceNarrator.speak(
        site.audioNarration.transcript,
        () => setIsPlayingAudio(true),
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false),
        'id'
      );
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Box */}
      <div className="relative w-full max-w-4xl glass-modal overflow-hidden flex flex-col max-h-[92vh] shadow-2xl">
        
        {/* Banner Image & Top Header */}
        <div className="relative h-64 sm:h-72 w-full bg-[#0d0c0b] overflow-hidden">
          <img
            src={site.bannerImage || site.thumbnail}
            alt={site.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0c0b] via-[#0d0c0b]/60 to-black/40" />

          {/* Top Actions */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#d4a373] text-[#0d0c0b] font-bold text-xs shadow-md">
                {site.establishedYear}
              </span>
              <span className="px-3 py-1 rounded-full glass-panel text-stone-300 text-xs">
                {site.category}
              </span>
              {isVisited ? (
                <span className="px-2.5 py-1 rounded-full bg-emerald-600/95 text-white font-semibold text-xs border border-emerald-400/50 flex items-center gap-1 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Sudah Dijelajahi</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-black/60 text-stone-300 text-xs border border-white/10 backdrop-blur-md">
                  Belum Dijelajahi
                </span>
              )}
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-stone-200 text-xs flex items-center gap-1 border border-white/10 backdrop-blur-md">
                <Eye className="w-3.5 h-3.5 text-[#d4a373]" />
                <span>{formatVisitCount(visitCount)} kunjungan</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/10 text-stone-200 border border-white/10 backdrop-blur-md transition-colors cursor-pointer"
                title="Bagikan Tautan Situs"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-[#d4a373]" />}
              </button>

              <button
                onClick={() => {
                  VoiceNarrator.stop();
                  onClose();
                }}
                className="p-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 backdrop-blur-md transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Bottom Title on Banner */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 text-xs text-[#d4a373] font-medium mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{site.locationDescription}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif-heading">
              {site.title}
            </h2>
            {site.localName && (
              <p className="text-xs text-stone-300 italic mt-0.5 font-light">
                Nama Bersejarah: {site.localName}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="px-6 py-3.5 bg-[#0d0c0b]/90 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex flex-wrap items-center gap-2.5">
            {/* 360 Tour */}
            <button
              onClick={() => {
                onClose();
                onOpen360(site);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#d4a373] hover:bg-[#e2b98f] text-[#0d0c0b] font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              <Box className="w-4 h-4" />
              <span>Masuk Tur 360°</span>
            </button>

            {/* Video 360 Tour Direct Button (if available) */}
            {site.video360?.url && (
              <button
                onClick={() => {
                  onClose();
                  onOpen360(site);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer border border-rose-400/50"
              >
                <Video className="w-4 h-4 text-white animate-pulse" />
                <span>Tur Video 360°</span>
              </button>
            )}

            {/* Tanya & Jawab */}
            <button
              onClick={() => {
                onClose();
                onOpenTalkingTour(site);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              title="Tanya & Jawab: Pilih topik seputar situs sejarah"
            >
              <HelpCircle className="w-4 h-4 text-[#ffd166]" />
              <span>Tanya & Jawab</span>
            </button>

            {/* Time Slider */}
            <button
              onClick={() => {
                onClose();
                onOpenTimeSlider(site);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/10 text-stone-200 font-medium text-xs border border-white/10 transition-colors cursor-pointer"
            >
              <Layers className="w-4 h-4 text-[#d4a373]" />
              <span>Lensa Waktu</span>
            </button>
          </div>

          {/* Audio Narration Toggle */}
          <button
            onClick={handleToggleAudio}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold border transition-all cursor-pointer ${
              isPlayingAudio
                ? 'bg-[#d4a373] text-[#0d0c0b] border-[#d4a373] font-bold shadow-md'
                : 'bg-white/[0.05] text-stone-300 border-white/10 hover:bg-white/10 hover:border-[#d4a373]/40'
            }`}
            title="Dengarkan narasi audio cagar budaya"
          >
            {isPlayingAudio ? (
              <>
                <div className="flex items-center gap-0.5">
                  <span className="w-1 h-3 bg-[#0d0c0b] rounded-full animate-bounce" />
                  <span className="w-1 h-4 bg-[#0d0c0b] rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1 h-2.5 bg-[#0d0c0b] rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
                <span>Memutar Audio...</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-[#d4a373]" />
                <span>Putar Narasi Audio</span>
              </>
            )}
          </button>

        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-stone-300 text-sm leading-relaxed font-light">
          
          {/* Audio Story Transcript Box */}
          <div className="p-5 rounded-3xl bg-[#d4a373]/10 border border-[#d4a373]/30 shadow-lg space-y-2.5">
            <div className="flex flex-wrap items-center justify-between text-xs font-bold text-[#d4a373] gap-2 font-serif-heading">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-[#d4a373]" />
                Naskah Narasi Suara: {site.audioNarration.title}
              </span>
              <span className="text-[11px] text-amber-300 font-sans font-medium">
                Durasi: {site.audioNarration.durationText}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-200 italic leading-relaxed font-light">
              "{site.audioNarration.transcript}"
            </p>
            <div className="flex items-center justify-between text-[11px] text-amber-300/80 pt-1 border-t border-[#d4a373]/20">
              <span>Pengejaan terstandarisasi dialek Indonesia & Donggala</span>
              <span>Audio Terintegrasi</span>
            </div>
          </div>

          {/* Historical Significance */}
          <div>
            <h3 className="text-base font-bold text-white font-serif-heading flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-[#d4a373]" />
              Signifikansi Sejarah & Peran Peradaban
            </h3>
            <p className="leading-relaxed">{site.historicalSignificance}</p>
          </div>

          {/* Architecture & Maritime Importance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-5 rounded-3xl glass-panel">
              <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5 mb-2 font-serif-heading">
                <Building2 className="w-4 h-4" />
                Gaya & Struktur Arsitektur
              </h4>
              <p className="text-xs sm:text-sm text-stone-300 font-light">
                {site.architecturalStyle}
              </p>
            </div>

            <div className="p-5 rounded-3xl glass-panel">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-2 font-serif-heading">
                <Anchor className="w-4 h-4" />
                Relevansi Jalur Maritim Selat Makassar
              </h4>
              <p className="text-xs sm:text-sm text-stone-300 font-light">
                {site.maritimeRelevance}
              </p>
            </div>

          </div>

          {/* Key Facts Table */}
          <div>
            <h3 className="text-base font-bold text-white font-serif-heading flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-[#d4a373]" />
              Data Inventarisasi Cagar Budaya
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {site.keyFacts.map((fact, idx) => (
                <div key={idx} className="p-4 rounded-2xl glass-panel flex items-center justify-between text-xs">
                  <span className="text-stone-400 font-medium">{fact.label}</span>
                  <span className="text-white font-semibold">{fact.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fun Historical Trivia */}
          {site.trivia.length > 0 && (
            <div className="p-5 rounded-3xl glass-panel">
              <h4 className="text-xs font-bold text-[#d4a373] uppercase tracking-wider flex items-center gap-1.5 mb-2 font-serif-heading">
                <HelpCircle className="w-4 h-4 text-[#d4a373]" />
                Fakta Menarik & Rahasia Sejarah
              </h4>
              <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-stone-300 font-light">
                {site.trivia.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
