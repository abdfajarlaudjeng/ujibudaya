import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { HeritageSite, QuizQuestion } from '../types';
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
  Download,
  Target,
  Trophy,
  HelpCircle,
  Zap,
  Flame,
  RotateCcw,
  Lightbulb,
  Check,
  UserCheck
} from 'lucide-react';

interface TantanganPenjelajahModalProps {
  isOpen: boolean;
  onClose: () => void;
  sites: HeritageSite[];
  visitedSiteIds: string[];
  questions: QuizQuestion[];
  onSelectSite: (site: HeritageSite) => void;
  onOpen360Tour: (site: HeritageSite) => void;
}

export const TantanganPenjelajahModal: React.FC<TantanganPenjelajahModalProps> = ({
  isOpen,
  onClose,
  sites,
  visitedSiteIds,
  questions,
  onSelectSite,
  onOpen360Tour
}) => {
  // Main sub-tabs: 'buku' (Buku Kunjungan Budaya), 'kuis' (Misi Kuis Budaya), 'sertifikat' (Sertifikat Penjelajah)
  const [activeTab, setActiveTab] = useState<'buku' | 'kuis' | 'sertifikat'>('buku');

  // Explorer Profile Name
  const [explorerName, setExplorerName] = useState<string>(() => {
    try {
      return localStorage.getItem('donggala_explorer_name') || 'Penjelajah Warisan';
    } catch {
      return 'Penjelajah Warisan';
    }
  });
  const [isEditingName, setIsEditingName] = useState(false);

  // Quiz Engine State
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizStreak, setQuizStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [showClue, setShowClue] = useState(false);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  if (!isOpen) return null;

  const total = sites.length;
  const visitedCount = visitedSiteIds.length;
  const progressPercentage = Math.round((visitedCount / total) * 100);

  // Badges calculation based on visit count
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

  // Current Quiz Question logic
  const currentQ = questions[currentQuizIdx] || {
    id: 'default',
    question: 'Tahun berapakah Menara Suar Banawa didirikan di Tanjung Batu Donggala?',
    options: ['1898', '1912', '1945', '1820'],
    correctIndex: 0,
    explanation: 'Menara Suar Banawa dibangun pada tahun 1898 di masa kolonial Hindia Belanda sebagai pemandu navigasi utama kapal-kapal niaga di Selat Makassar.'
  };

  const handleSelectQuizOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      const addedPoints = 100 + quizStreak * 20;
      setQuizScore(prev => prev + addedPoints);
      const newStreak = quizStreak + 1;
      setQuizStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
    } else {
      setQuizStreak(0);
    }
  };

  const handleNextQuiz = () => {
    if (currentQuizIdx < questions.length - 1) {
      setCurrentQuizIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowClue(false);
    } else {
      setIsQuizFinished(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 }
      });
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuizIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowClue(false);
    setQuizScore(0);
    setQuizStreak(0);
    setIsQuizFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-4xl bg-[#faf8f5] rounded-3xl border border-stone-300 shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        
        {/* =========================================================================
            HEADER MODAL: TANTANGAN PENJELAJAH
            ========================================================================= */}
        <div className="p-5 sm:p-6 bg-[#1b4332] text-white border-b border-[#ffd166]/30 flex-shrink-0">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#ffd166] text-[#13382c] flex items-center justify-center font-bold shadow-md">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold font-serif-heading tracking-wide">
                    Tantangan Penjelajah
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#ffd166]/20 text-[#ffd166] text-xs font-bold border border-[#ffd166]/40">
                    Kota Tua Donggala
                  </span>
                </div>
                <p className="text-xs text-[#ffd166]/90 font-light mt-0.5">
                  Buku Kunjungan Budaya, Misi Kuis Budaya, & Penghargaan Penjelajah
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/15">
            <button
              onClick={() => setActiveTab('buku')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'buku'
                  ? 'bg-[#ffd166] text-[#13382c] shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Buku Kunjungan Budaya</span>
              <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">
                {visitedCount}/{total}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('kuis')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'kuis'
                  ? 'bg-[#ffd166] text-[#13382c] shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Misi Kuis Budaya</span>
              {quizScore > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-900/30 text-[10px]">
                  {quizScore} Pts
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('sertifikat')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'sertifikat'
                  ? 'bg-[#ffd166] text-[#13382c] shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Sertifikat Penjelajah</span>
            </button>
          </div>

        </div>

        {/* =========================================================================
            CONTENT AREA ACCORDING TO ACTIVE SUB-TAB
            ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">

          {/* -----------------------------------------------------------------------
              TAB 1: BUKU KUNJUNGAN BUDAYA DIGITAL
              ----------------------------------------------------------------------- */}
          {activeTab === 'buku' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Progress Summary Card */}
              <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col items-center justify-center text-[#c85a32]">
                    <span className="text-xl font-bold font-serif-heading">{progressPercentage}%</span>
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">Tuntas</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      {isEditingName ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            defaultValue={explorerName}
                            onBlur={(e) => handleSaveName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveName(e.currentTarget.value);
                            }}
                            autoFocus
                            className="px-2 py-1 text-sm font-bold border border-amber-400 rounded-lg bg-amber-50/50 text-stone-900 focus:outline-none"
                          />
                        </div>
                      ) : (
                        <h3 
                          onClick={() => setIsEditingName(true)}
                          className="text-base font-bold text-stone-900 font-serif-heading hover:text-[#c85a32] cursor-pointer flex items-center gap-1.5"
                          title="Klik untuk mengubah nama penjelajah"
                        >
                          <span>{explorerName}</span>
                          <span className="text-[10px] text-stone-400 font-sans font-normal">(Ubah)</span>
                        </h3>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 font-light mt-0.5">
                      Telah mengumpulkan {visitedCount} dari 15 stempel cagar budaya Banawa di buku kunjungan budaya
                    </p>
                  </div>
                </div>

                <div className="w-full md:w-64 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-stone-600 font-medium">
                    <span>Progres Kunjungan</span>
                    <span className="font-bold text-[#1b4332]">{visitedCount} / {total} Situs</span>
                  </div>
                  <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200 p-0.5">
                    <div 
                      className="h-full bg-gradient-to-r from-[#c85a32] to-[#1b4332] rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* Grid 15 Stamped Sites */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-stone-900 font-serif-heading uppercase tracking-wider">
                    Jejak 15 Stempel Kunjungan Budaya
                  </h4>
                  <span className="text-xs text-stone-500">
                    Klik situs untuk membuka Tur 360°
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {sites.map((site, index) => {
                    const isVisited = visitedSiteIds.includes(site.id);
                    return (
                      <div
                        key={site.id}
                        onClick={() => {
                          onOpen360Tour(site);
                          onClose();
                        }}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 relative overflow-hidden group ${
                          isVisited
                            ? 'bg-white border-amber-200 shadow-sm hover:border-[#c85a32] hover:shadow-md'
                            : 'bg-stone-50/70 border-stone-200 opacity-75 hover:opacity-100'
                        }`}
                      >
                        {/* Status Watermark Stamp */}
                        {isVisited ? (
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-stone-200/80 text-stone-400 flex items-center justify-center flex-shrink-0">
                            <Lock className="w-4 h-4" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold text-[#c85a32]">#{index + 1}</span>
                              <span className="text-[10px] text-stone-400">• Th. {site.establishedYear}</span>
                            </div>
                            {isVisited ? (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                Sudah Dijelajahi
                              </span>
                            ) : (
                              <span className="text-[10px] text-stone-400">
                                Belum Dijelajahi
                              </span>
                            )}
                          </div>
                          <h5 className="text-xs font-bold text-stone-900 truncate font-serif-heading group-hover:text-[#c85a32] transition-colors mt-0.5">
                            {site.title}
                          </h5>
                          <p className="text-[10px] text-stone-500 truncate">
                            {site.kelurahan}
                          </p>
                        </div>

                        <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-[#c85a32] transition-transform group-hover:translate-x-0.5" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Badges of Honor */}
              <div className="space-y-3 pt-4 border-t border-stone-200">
                <h4 className="text-sm font-bold text-stone-900 font-serif-heading uppercase tracking-wider">
                  Lencana Prestasi Penjelajah
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {badges.map((b) => (
                    <div
                      key={b.id}
                      className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-all ${
                        b.unlocked
                          ? 'bg-amber-50/80 border-amber-300 shadow-xs'
                          : 'bg-stone-50 border-stone-200 opacity-60'
                      }`}
                    >
                      <div className="text-2xl p-1 rounded-xl bg-white shadow-xs border border-stone-100 flex-shrink-0">
                        {b.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-stone-900 truncate">
                            {b.title}
                          </h5>
                          {b.unlocked ? (
                            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                              Diraih
                            </span>
                          ) : (
                            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-stone-200 text-stone-600">
                              {b.required}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500 font-light mt-0.5 line-clamp-2">
                          {b.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* -----------------------------------------------------------------------
              TAB 2: MISI KUIS BUDAYA & TANTANGAN SEJARAH
              ----------------------------------------------------------------------- */}
          {activeTab === 'kuis' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {!isQuizFinished ? (
                <div className="space-y-5">
                  
                  {/* Quiz Score & Streak Banner */}
                  <div className="p-4 rounded-2xl bg-[#1b4332] text-white flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#ffd166] text-[#13382c] flex items-center justify-center font-bold">
                        #{currentQuizIdx + 1}
                      </div>
                      <div>
                        <span className="text-xs text-[#ffd166] font-semibold block">
                          Pertanyaan {currentQuizIdx + 1} dari {questions.length}
                        </span>
                        <h4 className="text-sm font-bold font-serif-heading">
                          Uji Wawasan Sejarah Donggala
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] text-stone-300 block uppercase">Skor Misi</span>
                        <span className="text-sm sm:text-base font-bold text-[#ffd166] font-mono">
                          {quizScore} Pts
                        </span>
                      </div>
                      {quizStreak > 1 && (
                        <div className="px-2.5 py-1 rounded-xl bg-orange-500/30 border border-orange-400/50 text-orange-200 text-xs font-bold flex items-center gap-1 animate-bounce">
                          <Flame className="w-3.5 h-3.5 text-orange-400" />
                          <span>{quizStreak}x Combo</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Question Card */}
                  <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4">
                    <h3 className="text-base sm:text-lg font-bold text-stone-900 font-serif-heading leading-relaxed">
                      {currentQ.question}
                    </h3>

                    {/* Options */}
                    <div className="grid grid-cols-1 gap-2.5 pt-2">
                      {currentQ.options.map((opt, oIdx) => {
                        let btnStyle = 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800';
                        
                        if (isAnswered) {
                          if (oIdx === currentQ.correctIndex) {
                            btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-500/20';
                          } else if (oIdx === selectedOption) {
                            btnStyle = 'bg-rose-50 border-rose-400 text-rose-900 font-medium';
                          } else {
                            btnStyle = 'bg-stone-50 border-stone-200 opacity-50 text-stone-400';
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={isAnswered}
                            onClick={() => handleSelectQuizOption(oIdx)}
                            className={`p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center font-bold text-xs">
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span>{opt}</span>
                            </div>
                            {isAnswered && oIdx === currentQ.correctIndex && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation Box */}
                    {isAnswered && (
                      <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-xs text-amber-900 space-y-1 animate-in fade-in">
                        <strong className="font-bold flex items-center gap-1.5 text-stone-900">
                          <Sparkles className="w-4 h-4 text-[#c85a32]" />
                          <span>Fakta Sejarah & Catatan Ahli:</span>
                        </strong>
                        <p className="leading-relaxed text-stone-700 font-light">
                          {currentQ.explanation}
                        </p>
                      </div>
                    )}

                    {/* Footer Controls */}
                    <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                      <button
                        onClick={() => setShowClue(prev => !prev)}
                        className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        <span>{showClue ? 'Sembunyikan Petunjuk' : 'Bantuan Petunjuk'}</span>
                      </button>

                      {isAnswered && (
                        <button
                          onClick={handleNextQuiz}
                          className="px-5 py-2.5 rounded-xl bg-[#c85a32] hover:bg-[#b8502a] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
                        >
                          <span>{currentQuizIdx < questions.length - 1 ? 'Pertanyaan Selanjutnya' : 'Lihat Hasil Akhir'}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {showClue && !isAnswered && (
                      <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900">
                        💡 <strong>Petunjuk:</strong> Pikirkan konteks sejarah abad ke-19 hingga awal abad ke-20 di masa keemasan niaga Donggala.
                      </div>
                    )}

                  </div>

                </div>
              ) : (
                /* Finished Quiz Celebration Screen */
                <div className="p-8 rounded-3xl bg-white border border-stone-200 text-center space-y-5">
                  <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center shadow-lg">
                    <Trophy className="w-10 h-10" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-stone-900 font-serif-heading">
                      Selamat! Misi Tantangan Selesai
                    </h3>
                    <p className="text-xs text-stone-500 font-light">
                      Kamu telah menyelesaikan seluruh tantangan wawasan cagar budaya Kota Tua Donggala.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 max-w-sm mx-auto flex items-center justify-around">
                    <div>
                      <span className="text-[10px] text-stone-500 uppercase block font-semibold">Total Poin</span>
                      <span className="text-xl font-bold text-[#c85a32] font-mono">{quizScore}</span>
                    </div>
                    <div className="h-8 w-px bg-amber-200" />
                    <div>
                      <span className="text-[10px] text-stone-500 uppercase block font-semibold">Kombo Maksimal</span>
                      <span className="text-xl font-bold text-[#1b4332] font-mono">{maxStreak}x</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={handleRestartQuiz}
                      className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-bold flex items-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Ulangi Kuis</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('sertifikat')}
                      className="px-6 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#13382c] text-[#ffd166] text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
                    >
                      <Award className="w-4 h-4" />
                      <span>Klaim Sertifikat</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* -----------------------------------------------------------------------
              TAB 3: SERTIFIKAT DIGITAL PENJELAJAH RESMI
              ----------------------------------------------------------------------- */}
          {activeTab === 'sertifikat' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Certificate Preview Frame */}
              <div className="p-6 sm:p-10 rounded-3xl bg-white border-4 border-[#c87d20] shadow-2xl relative overflow-hidden text-center space-y-6">
                
                {/* Traditional Corner Accents */}
                <div className="absolute top-2 left-2 text-[#c87d20] text-sm">✦</div>
                <div className="absolute top-2 right-2 text-[#c87d20] text-sm">✦</div>
                <div className="absolute bottom-2 left-2 text-[#c87d20] text-sm">✦</div>
                <div className="absolute bottom-2 right-2 text-[#c87d20] text-sm">✦</div>

                {/* Certificate Emblem */}
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b4332] text-[#ffd166] text-xs font-bold uppercase tracking-widest">
                    <span>★ FASILITASI PEMAJUAN KEBUDAYAAN 2026 ★</span>
                  </div>
                  <h2 className="text-xl sm:text-3xl font-extrabold text-stone-900 font-serif-heading tracking-wide">
                    SERTIFIKAT PENJELAJAH CAGAR BUDAYA
                  </h2>
                  <p className="text-xs text-stone-500 font-light italic">
                    Diberikan atas dedikasi dalam mempelajari & mengeksplorasi warisan sejarah Kota Tua Donggala
                  </p>
                </div>

                {/* Recipient Name */}
                <div className="py-4 border-y border-stone-200/80 max-w-md mx-auto space-y-1">
                  <span className="text-xs text-stone-400 uppercase tracking-widest block">Dianugerahkan Kepada:</span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#c85a32] font-serif-heading">
                    {explorerName}
                  </h3>
                  <p className="text-xs text-stone-600 font-light">
                    Telah menyelesaikan {visitedCount} dari 15 stempel cagar budaya di pesisir Selat Makassar
                  </p>
                </div>

                {/* Badges & Signatures */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 text-left max-w-lg mx-auto">
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                    <span className="text-[10px] text-stone-500 uppercase block font-semibold">Tingkat Penjelajah</span>
                    <span className="text-xs font-bold text-[#1b4332]">
                      {visitedCount === total ? 'Maestro Warisan' : visitedCount >= 7 ? 'Pengelana Maritim' : 'Penjelajah Muda'}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                    <span className="text-[10px] text-stone-500 uppercase block font-semibold">Skor Kuis</span>
                    <span className="text-xs font-bold text-[#c85a32] font-mono">
                      {quizScore} Poin
                    </span>
                  </div>

                  <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                    <span className="text-[10px] text-stone-500 uppercase block font-semibold">Wilayah Eksplorasi</span>
                    <span className="text-xs font-bold text-stone-800">4 Kelurahan Banawa</span>
                  </div>
                </div>

                {/* Print/Save CTA */}
                <div className="pt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="px-6 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#13382c] text-[#ffd166] text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Cetak Sertifikat</span>
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
