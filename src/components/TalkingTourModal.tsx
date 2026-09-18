import React, { useState, useEffect } from 'react';
import { HeritageSite } from '../types';
import { VoiceNarrator } from '../services/api';
import { getSiteQATopics, QATopic } from '../utils/heritageBilingual';
import { 
  X, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Sparkles, 
  ChevronRight,
  CheckCircle2,
  Globe2,
  MapPin,
  Pause,
  Play
} from 'lucide-react';

interface TalkingTourModalProps {
  site: HeritageSite;
  allSites: HeritageSite[];
  isOpen: boolean;
  onClose: () => void;
  onSelectSite: (site: HeritageSite) => void;
  initialLang?: 'id' | 'en';
}

export const TalkingTourModal: React.FC<TalkingTourModalProps> = ({
  site,
  allSites,
  isOpen,
  onClose,
  onSelectSite,
  initialLang = 'id'
}) => {
  const [lang, setLang] = useState<'id' | 'en'>(initialLang);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('topic-history');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingTopicId, setSpeakingTopicId] = useState<string | null>(null);

  // Sync initial language if prop changes
  useEffect(() => {
    setLang(initialLang);
  }, [initialLang]);

  // Fetch bilingual curated topics
  const topics: QATopic[] = getSiteQATopics(site, lang);
  const activeTopic = topics.find(t => t.id === selectedTopicId) || topics[0];

  // Stop voice narration on close or site change
  useEffect(() => {
    if (!isOpen) {
      VoiceNarrator.stop();
      setIsSpeaking(false);
      setSpeakingTopicId(null);
    }
    return () => {
      VoiceNarrator.stop();
    };
  }, [isOpen, site.id]);

  // When language changes, stop speech
  const handleToggleLang = (newLang: 'id' | 'en') => {
    if (newLang === lang) return;
    VoiceNarrator.stop();
    setIsSpeaking(false);
    setSpeakingTopicId(null);
    setLang(newLang);
  };

  if (!isOpen) return null;

  const handlePlayVoice = (topic: QATopic) => {
    if (isSpeaking && speakingTopicId === topic.id) {
      VoiceNarrator.stop();
      setIsSpeaking(false);
      setSpeakingTopicId(null);
      return;
    }

    VoiceNarrator.stop();
    setIsSpeaking(true);
    setSpeakingTopicId(topic.id);

    const speechText = `${topic.question}. ${topic.answer}`;
    VoiceNarrator.speak(
      speechText,
      () => {
        setIsSpeaking(true);
        setSpeakingTopicId(topic.id);
      },
      () => {
        setIsSpeaking(false);
        setSpeakingTopicId(null);
      },
      () => {
        setIsSpeaking(false);
        setSpeakingTopicId(null);
      },
      lang
    );
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] bg-[#11261f] border-2 border-[#d4af37]/60 rounded-3xl flex flex-col overflow-hidden shadow-2xl text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-4.5 bg-[#0b1d17] border-b border-[#d4af37]/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-[#c85a32] border border-[#d4af37] flex items-center justify-center text-white shadow-md flex-shrink-0">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white font-serif-heading truncate">
                  {lang === 'id' ? 'Tanya & Jawab' : 'Questions & Answers'}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 font-semibold uppercase tracking-wider">
                  {site.title}
                </span>
              </div>
              <p className="text-xs text-amber-200/80 font-light mt-0.5 truncate">
                {lang === 'id' 
                  ? 'Pilih topik untuk mendengarkan informasi seputar situs sejarah' 
                  : 'Select a topic to listen to information about this historical site'}
              </p>
            </div>
          </div>

          {/* Controls: Language Switcher & Close */}
          <div className="flex items-center gap-2.5">
            {/* Language Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => handleToggleLang('id')}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  lang === 'id'
                    ? 'bg-[#c85a32] text-white shadow-xs'
                    : 'text-stone-400 hover:text-white'
                }`}
                title="Bahasa Indonesia"
              >
                IND
              </button>
              <button
                type="button"
                onClick={() => handleToggleLang('en')}
                className={`px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[#0f4c81] text-white shadow-xs'
                    : 'text-stone-400 hover:text-white'
                }`}
                title="English Language"
              >
                ENG
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Topic Selection & Detail Answer */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left Column: Topics List (40% on LG) */}
          <div className="lg:col-span-5 space-y-2.5">
            <div className="text-[11px] font-bold text-[#d4af37] uppercase tracking-wider px-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{lang === 'id' ? 'Daftar Topik Sejarah' : 'Historical Topics List'}</span>
            </div>

            <div className="space-y-2">
              {topics.map((topic) => {
                const isSelected = topic.id === selectedTopicId;
                const isItemSpeaking = isSpeaking && speakingTopicId === topic.id;

                return (
                  <button
                    key={topic.id}
                    onClick={() => {
                      setSelectedTopicId(topic.id);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-2.5 ${
                      isSelected
                        ? 'bg-[#c85a32] border-[#d4af37] text-white shadow-lg scale-[1.01]'
                        : 'bg-black/30 hover:bg-black/50 border-white/10 text-stone-300 hover:text-white'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                          isSelected ? 'bg-black/30 text-amber-200' : 'bg-white/10 text-stone-400'
                        }`}>
                          {topic.tag}
                        </span>
                        {isItemSpeaking && (
                          <span className="flex items-center gap-1 text-[10px] text-amber-300 font-medium animate-pulse">
                            <Volume2 className="w-3 h-3" />
                            <span>{lang === 'id' ? 'Bicara...' : 'Speaking...'}</span>
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold font-serif-heading leading-snug">
                        {topic.topicTitle}
                      </h4>
                    </div>
                    <ChevronRight className={`w-4 h-4 flex-shrink-0 mt-1 transition-transform ${
                      isSelected ? 'text-amber-300 translate-x-1' : 'text-stone-500'
                    }`} />
                  </button>
                );
              })}
            </div>

            {/* Note preventing irrelevant personal questions */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-[11px] text-stone-400 leading-relaxed">
              <span className="text-[#d4af37] font-bold block mb-0.5">
                {lang === 'id' ? 'ℹ️ Panduan Topik Cagar Budaya' : 'ℹ️ Heritage Topic Guidance'}
              </span>
              {lang === 'id'
                ? 'Topik telah dikurasi secara terverifikasi berdasarkan riset sejarah Kota Tua Donggala untuk memberikan informasi yang akurat dan terpercaya.'
                : 'Topics are strictly curated based on verified historical archives of Donggala Old Town to deliver authentic and accurate heritage education.'}
            </div>
          </div>

          {/* Right Column: Active Topic Answer & Audio Narration (60% on LG) */}
          <div className="lg:col-span-7 flex flex-col justify-between p-5 rounded-3xl bg-black/40 border border-[#d4af37]/40 shadow-inner">
            <div className="space-y-4">
              {/* Question Header */}
              <div className="pb-3 border-b border-white/10">
                <span className="text-[10px] px-2.5 py-1 rounded-md bg-[#d4af37]/20 text-[#d4af37] font-bold uppercase tracking-wider inline-block mb-2">
                  {activeTopic.tag}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white font-serif-heading leading-snug">
                  "{activeTopic.question}"
                </h3>
              </div>

              {/* Answer Content */}
              <div className="text-xs sm:text-sm text-stone-200 leading-relaxed font-light space-y-3">
                <p>{activeTopic.answer}</p>
              </div>
            </div>

            {/* Audio Listen Action Toolbar */}
            <div className="pt-5 mt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-amber-200/90 font-medium">
                <Volume2 className="w-4 h-4 text-[#d4af37]" />
                <span>
                  {lang === 'id' 
                    ? 'Audio Narasi Jawaban' 
                    : 'Heritage Voice Guide'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {isSpeaking && speakingTopicId === activeTopic.id && (
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold animate-pulse">
                    <span className="inline-block w-1.5 h-3 bg-amber-400 rounded-full animate-bounce" />
                    <span className="inline-block w-1.5 h-4 bg-amber-300 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="inline-block w-1.5 h-2.5 bg-amber-400 rounded-full animate-bounce [animation-delay:300ms]" />
                    <span className="ml-1 text-[11px]">{lang === 'id' ? 'Memutar Audio...' : 'Playing Audio...'}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handlePlayVoice(activeTopic)}
                  className={`px-5 py-2.5 rounded-2xl flex items-center gap-2 font-bold text-xs shadow-lg transition-all cursor-pointer ${
                    isSpeaking && speakingTopicId === activeTopic.id
                      ? 'bg-[#c85a32] text-white ring-2 ring-[#d4af37]'
                      : 'bg-[#d4af37] text-[#11261f] hover:brightness-110'
                  }`}
                >
                  {isSpeaking && speakingTopicId === activeTopic.id ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>{lang === 'id' ? 'Jeda Audio' : 'Pause Audio'}</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>
                        {lang === 'id' 
                          ? 'Dengarkan Jawaban' 
                          : 'Listen to This Answer'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Navigation Antar Situs */}
        <div className="px-6 py-3 bg-[#0b1d17] border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#d4af37] flex-shrink-0" />
            <span className="truncate">{site.kelurahan} • {site.period}</span>
          </div>
          <span className="text-[11px] text-amber-300/80 font-mono">
            {lang === 'id' ? 'Situs Terpilih' : 'Selected Site'}: {site.title}
          </span>
        </div>

      </div>
    </div>
  );
};
