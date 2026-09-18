import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { QuizQuestion } from '../types';
import { 
  X, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Award 
} from 'lucide-react';

interface HeritageQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QuizQuestion[];
}

export const HeritageQuizModal: React.FC<HeritageQuizModalProps> = ({
  isOpen,
  onClose,
  questions
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ = questions[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      setScore(prev => prev + 1);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl glass-modal overflow-hidden flex flex-col max-h-[90vh] shadow-2xl">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-[#0d0c0b]/90 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#d4a373]/15 border border-[#d4a373]/30 text-[#d4a373]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-serif-heading">
                Kuis Sejarah Kota Tua Donggala
              </h3>
              <p className="text-xs text-stone-400 font-light">
                Uji wawasan Anda mengenai kejayaan maritim dan cagar budaya Banawa
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

        {/* Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 font-light">
          
          {!isFinished ? (
            <div className="space-y-6">
              
              {/* Progress counter */}
              <div className="flex items-center justify-between text-xs font-semibold text-stone-400">
                <span>Pertanyaan {currentIdx + 1} dari {questions.length}</span>
                <span className="text-[#d4a373]">Skor: {score}</span>
              </div>

              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div 
                  className="h-full bg-[#d4a373] transition-all duration-300 rounded-full"
                  style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <h4 className="text-base sm:text-lg font-bold text-white font-serif-heading leading-relaxed">
                {currentQ.question}
              </h4>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((option, optIdx) => {
                  let optStyle = 'glass-panel text-stone-200 hover:bg-white/10 hover:border-white/20';
                  
                  if (isAnswered) {
                    if (optIdx === currentQ.correctIndex) {
                      optStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                    } else if (optIdx === selectedOption) {
                      optStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                    } else {
                      optStyle = 'glass-panel text-stone-500 opacity-40';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-4 sm:p-5 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${optStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-xl bg-white/[0.08] flex items-center justify-center font-bold text-xs text-[#d4a373] border border-white/10">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="font-light">{option}</span>
                      </div>

                      {isAnswered && optIdx === currentQ.correctIndex && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      )}

                      {isAnswered && optIdx === selectedOption && optIdx !== currentQ.correctIndex && (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box when answered */}
              {isAnswered && (
                <div className="p-5 rounded-3xl bg-[#d4a373]/10 border border-[#d4a373]/40 space-y-2 animate-in fade-in shadow-lg">
                  <div className="text-xs font-bold text-[#d4a373] flex items-center gap-1.5 font-serif-heading">
                    <Sparkles className="w-3.5 h-3.5 text-[#d4a373]" />
                    Penjelasan Sejarah:
                  </div>
                  <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-light">
                    {currentQ.explanation}
                  </p>
                </div>
              )}

              {/* Next Button */}
              {isAnswered && (
                <div className="flex justify-end">
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#d4a373] hover:bg-[#e2b98f] text-[#0d0c0b] font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
                  >
                    <span>{currentIdx < questions.length - 1 ? 'Pertanyaan Selanjutnya' : 'Lihat Hasil Kuis'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div className="text-center py-8 space-y-6 animate-in zoom-in-95">
              <div className="w-20 h-20 rounded-3xl bg-[#d4a373]/20 border border-[#d4a373]/40 flex items-center justify-center text-[#d4a373] text-4xl mx-auto shadow-xl">
                <Award className="w-10 h-10 text-[#d4a373]" />
              </div>

              <div className="space-y-2">
                <h4 className="text-2xl font-bold text-white font-serif-heading">
                  Hasil Kuis Anda Selesai!
                </h4>
                <p className="text-stone-300 text-sm font-light">
                  Anda berhasil menjawab benar <strong className="text-white">{score}</strong> dari <strong className="text-white">{questions.length}</strong> pertanyaan sejarah.
                </p>
              </div>

              <div className="p-5 rounded-3xl glass-panel max-w-sm mx-auto text-xs text-stone-300 font-light">
                {score === questions.length ? (
                  <span className="text-emerald-400 font-bold">Luar biasa! Pengetahuan sejarah Donggala Anda sangat mendalam!</span>
                ) : score >= 3 ? (
                  <span className="text-[#d4a373] font-medium">Bagus sekali! Anda memahami poin-poin utama kejayaan Banawa.</span>
                ) : (
                  <span className="text-stone-400">Jelajahi kembali tur 360° dan Talking Tour AI untuk mendalami kisahnya.</span>
                )}
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleRestart}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/10 text-stone-200 text-xs font-semibold border border-white/10 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ulangi Kuis</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-2xl bg-[#d4a373] hover:bg-[#e2b98f] text-[#0d0c0b] font-bold text-xs cursor-pointer"
                >
                  Selesai
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
