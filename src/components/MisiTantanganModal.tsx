import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { QuizQuestion } from '../types';
import { 
  X, 
  Target, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Award,
  HelpCircle,
  Zap,
  Flame,
  Trophy,
  Compass,
  Lightbulb
} from 'lucide-react';

interface MisiTantanganModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QuizQuestion[];
}

export const MisiTantanganModal: React.FC<MisiTantanganModalProps> = ({
  isOpen,
  onClose,
  questions
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [showClue, setShowClue] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ = questions[currentIdx] || {
    id: 'default',
    title: 'Misi Kota Tua',
    question: 'Tahun berapakah Menara Suar Banawa didirikan di Tanjung Batu Donggala?',
    options: ['1898', '1912', '1945', '1820'],
    correctIndex: 0,
    explanation: 'Menara Suar Banawa dibangun pada tahun 1898 di masa kolonial Hindia Belanda sebagai pemandu navigasi utama kapal-kapal niaga di Selat Makassar.',
    clue: 'Dibangun pada penghujung abad ke-19 sebelum KPM Office.',
    points: 100
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      const addedPoints = 100 + streak * 20;
      setScore(prev => prev + addedPoints);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowClue(false);
    } else {
      setIsFinished(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 }
      });
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowClue(false);
    setScore(0);
    setStreak(0);
    setIsFinished(false);
  };

  // Rank determination
  const totalQuestions = questions.length;
  const percentage = Math.round((score / (totalQuestions * 100)) * 100);
  let rankTitle = 'Kadet Penjelajah Banawa';
  let rankIcon = '🧭';
  let rankColor = 'text-amber-500 bg-amber-50 border-amber-200';

  if (percentage >= 60 && percentage < 85) {
    rankTitle = 'Arkeolog Sejarah Maritim';
    rankIcon = '📜';
    rankColor = 'text-sky-600 bg-sky-50 border-sky-200';
  } else if (percentage >= 85) {
    rankTitle = 'Maestro Cagar Budaya Donggala';
    rankIcon = '👑';
    rankColor = 'text-emerald-700 bg-emerald-50 border-emerald-300';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl bg-[#faf8f5] rounded-3xl overflow-hidden flex flex-col max-h-[92vh] shadow-2xl border border-stone-300">
        
        {/* Header Bar */}
        <div className="px-6 py-5 bg-[#0f4c81] text-white flex items-center justify-between border-b border-sky-400/30">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-white/10 border border-white/20 text-[#d4af37]">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-serif-heading text-[#f5efe6]">
                  Misi Tantangan Penjelajah
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">
                  Level Edukasi
                </span>
              </div>
              <p className="text-xs text-sky-200 font-light mt-0.5">
                Uji pemahaman & ketajaman observasi sejarah Kota Tua Donggala
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

        {/* Status Tracker: Score, Streak, Progress */}
        {!isFinished && (
          <div className="bg-white px-6 py-3 border-b border-stone-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-stone-500 font-medium">Tantangan:</span>
              <span className="font-bold text-stone-900 font-mono">
                {currentIdx + 1} / {totalQuestions}
              </span>
            </div>

            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 font-bold">
              <Flame className={`w-3.5 h-3.5 ${streak > 0 ? 'animate-bounce text-orange-500' : 'text-stone-400'}`} />
              <span>{streak}x Beruntun</span>
            </div>

            {/* Total Points */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span>{score} Poin</span>
            </div>
          </div>
        )}

        {/* Body Area */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 bg-[#faf8f5]">
          
          {!isFinished ? (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Question Box */}
              <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-md bg-[#0f4c81]/10 text-[#0f4c81] border border-[#0f4c81]/20">
                    Misi #{currentIdx + 1}
                  </span>
                  
                  {currentQ.clue && (
                    <button
                      onClick={() => setShowClue(!showClue)}
                      className="text-xs text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>{showClue ? 'Sembunyikan Petunjuk' : 'Lihat Petunjuk'}</span>
                    </button>
                  )}
                </div>

                {showClue && currentQ.clue && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 italic animate-in fade-in">
                    💡 Petunjuk: {currentQ.clue}
                  </div>
                )}

                <h4 className="text-base sm:text-lg font-bold text-stone-900 font-serif-heading leading-snug">
                  {currentQ.question}
                </h4>
              </div>

              {/* Options Grid */}
              <div className="space-y-3">
                {currentQ.options.map((option, idx) => {
                  let btnStyle = 'bg-white border-stone-200 text-stone-800 hover:border-[#0f4c81] hover:bg-sky-50/50';

                  if (isAnswered) {
                    if (idx === currentQ.correctIndex) {
                      btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/30';
                    } else if (idx === selectedOption) {
                      btnStyle = 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/30';
                    } else {
                      btnStyle = 'bg-stone-50 border-stone-200 text-stone-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 shadow-xs cursor-pointer ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-xs font-bold text-stone-600 font-mono">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>

                      {isAnswered && idx === currentQ.correctIndex && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      )}
                      {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                        <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Banner when answered */}
              {isAnswered && (
                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-950 space-y-1.5 animate-in fade-in">
                  <div className="font-bold flex items-center gap-1.5 text-[#0f4c81]">
                    <Sparkles className="w-4 h-4" />
                    <span>Fakta Sejarah di Balik Jawaban:</span>
                  </div>
                  <p className="leading-relaxed font-light">
                    {currentQ.explanation}
                  </p>
                </div>
              )}

              {/* Next Button */}
              {isAnswered && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 rounded-xl bg-[#0f4c81] hover:bg-[#09355c] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <span>{currentIdx < totalQuestions - 1 ? 'Misi Berikutnya' : 'Lihat Hasil Penjelajah'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          ) : (
            /* FINISHED STATE / RESULT SUMMARY */
            <div className="text-center space-y-6 py-4 animate-in zoom-in-95">
              
              <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-100 to-orange-100 border-2 border-[#d4af37] flex items-center justify-center text-4xl shadow-lg">
                {rankIcon}
              </div>

              <div className="space-y-1.5">
                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold border mb-2 uppercase tracking-wide">
                  Misi Selesai!
                </div>
                <h3 className="text-2xl font-bold text-stone-900 font-serif-heading">
                  Gelar Penjelajah: {rankTitle}
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto font-light">
                  Anda telah menyelesaikan seluruh rangkaian tantangan sejarah cagar budaya Kota Tua Donggala.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto p-4 bg-white rounded-2xl border border-stone-200 text-stone-800 shadow-sm">
                <div>
                  <div className="text-[10px] text-stone-500">Skor Akhir</div>
                  <div className="text-lg font-bold text-[#0f4c81] font-mono">{score}</div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-500">Streak Terbaik</div>
                  <div className="text-lg font-bold text-orange-600 font-mono">{maxStreak}x</div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-500">Akurasi</div>
                  <div className="text-lg font-bold text-emerald-600 font-mono">{percentage}%</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center gap-3 pt-4">
                <button
                  onClick={handleRestart}
                  className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-2 border border-stone-200 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ulangi Misi</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[#0f4c81] hover:bg-[#09355c] text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Selesai & Tutup</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
