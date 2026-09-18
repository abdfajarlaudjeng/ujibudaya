import React from 'react';
import { TimelineEvent } from '../types';
import { Sparkles, Calendar, MapPin, ArrowRight, BookOpen, Compass } from 'lucide-react';

interface TimelineSectionProps {
  timelineEvents: TimelineEvent[];
  onSelectSiteId?: (siteId: string) => void;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({
  timelineEvents,
  onSelectSiteId
}) => {
  return (
    <div className="w-full space-y-8">
      
      {/* Header Introduction */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Rekam Jejak Sejarah Abad ke-15 hingga Era Digital 2026</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold text-white font-serif-heading">
          Linimasa Kejayaan Maritim Donggala
        </h2>
        <p className="text-sm sm:text-base text-stone-300">
          Dari pelabuhan transit jalur rempah nusantara di Selat Makassar, pusat niaga kopra dunia, hingga ikhtiar pelestarian digital cagar budaya untuk generasi masa depan.
        </p>
      </div>

      {/* Chronological Vertical Timeline */}
      <div className="relative max-w-4xl mx-auto pt-6 pb-12">
        
        {/* Central Vertical Golden Line */}
        <div className="absolute left-4 sm:left-1/2 top-8 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 via-amber-400/40 to-stone-800 -translate-x-1/2" />

        <div className="space-y-12">
          {timelineEvents.map((evt, idx) => {
            const isEven = idx % 2 === 0;

            return (
              <div 
                key={evt.id}
                className={`relative flex flex-col sm:flex-row items-start sm:items-center gap-6 ${
                  isEven ? 'sm:flex-row-reverse' : ''
                }`}
              >
                {/* Center Node Year Badge */}
                <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-10 h-10 rounded-2xl bg-stone-950 border-2 border-amber-500 shadow-xl shadow-amber-950/60 flex items-center justify-center text-amber-400 font-bold text-xs z-10">
                  <span className="font-mono">{idx + 1}</span>
                </div>

                {/* Event Card Container */}
                <div className="ml-12 sm:ml-0 sm:w-1/2 sm:px-6">
                  <div className="p-5 sm:p-6 rounded-3xl bg-stone-900/90 hover:bg-stone-900 border border-stone-800 hover:border-amber-500/40 transition-all shadow-xl space-y-3 group">
                    
                    {/* Year Tag & Category */}
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30 flex items-center gap-1.5 font-mono">
                        <Calendar className="w-3.5 h-3.5" />
                        {evt.year}
                      </span>

                      <span className="text-[11px] text-stone-400 font-medium">
                        {evt.era}
                      </span>
                    </div>

                    {/* Image if available */}
                    {evt.image && (
                      <div className="relative h-36 w-full rounded-2xl overflow-hidden bg-stone-950">
                        <img
                          src={evt.image}
                          alt={evt.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent" />
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-bold text-white font-serif-heading group-hover:text-amber-300 transition-colors">
                      {evt.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                      {evt.description}
                    </p>

                    {/* Associated Site Trigger */}
                    {evt.siteId && onSelectSiteId && (
                      <button
                        onClick={() => onSelectSiteId(evt.siteId!)}
                        className="mt-2 flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold"
                      >
                        <span>Lihat Situs Terkait</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
