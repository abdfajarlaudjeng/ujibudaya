import React, { useState } from 'react';
import { ProjectDetails } from '../types';
import { 
  X, 
  ShieldCheck, 
  Users, 
  Building2, 
  CheckCircle2, 
  Award, 
  BookOpen, 
  Sparkles, 
  MapPin,
  HeartHandshake,
  FileCheck,
  Compass,
  Cpu,
  Palette,
  Code,
  FileText,
  Video,
  Music,
  Mic,
  Truck,
  Wrench,
  Utensils,
  Clock
} from 'lucide-react';

interface AboutProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: ProjectDetails;
}

export const AboutProjectModal: React.FC<AboutProjectModalProps> = ({
  isOpen,
  onClose,
  details
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'team' | 'partnerships' | 'background'>('team');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-4xl bg-[#13171B] border-2 border-[#D4AF37]/50 rounded-3xl overflow-hidden flex flex-col max-h-[92vh] shadow-2xl text-stone-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#0C1014] border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#C85A32] border border-[#D4AF37] flex items-center justify-center text-white font-serif-heading font-bold text-xl shadow-lg">
              <Users className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-serif-heading">
                Tentang Kami & Kemitraan
              </h3>
              <p className="text-xs text-stone-400 font-light mt-0.5">
                {details.title} — {details.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="px-6 py-3 bg-[#171D22] border-b border-stone-800/80 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('team')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'team'
                ? 'bg-[#C85A32] text-white shadow-md'
                : 'bg-stone-800/60 text-stone-300 hover:bg-stone-700/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Tim Kerja & Pengembang</span>
          </button>

          <button
            onClick={() => setActiveSubTab('partnerships')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'partnerships'
                ? 'bg-[#0F4C81] text-white shadow-md'
                : 'bg-stone-800/60 text-stone-300 hover:bg-stone-700/60'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Kolaborasi & Kemitraan</span>
          </button>

          <button
            onClick={() => setActiveSubTab('background')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'background'
                ? 'bg-[#1B4332] text-[#ffd166] shadow-md'
                : 'bg-stone-800/60 text-stone-300 hover:bg-stone-700/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Visi Proyek & 15 Cagar Budaya</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-stone-300 text-xs sm:text-sm leading-relaxed font-light">
          
          {/* TAB 1: TIM KERJA & PENGEMBANG */}
          {activeSubTab === 'team' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* 1. Pimpinan Tim Pengusul & Penasihat */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider font-serif-heading flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>Pimpinan Tim Pengusul & Tenaga Ahli:</span>
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Ketua Tim Pengusul */}
                  <div className="p-4 rounded-2xl bg-stone-900/90 border border-[#C85A32]/50 space-y-1.5 shadow-sm">
                    <div className="text-[10px] font-bold text-[#C85A32] uppercase tracking-wider">
                      Ketua Tim Pengusul
                    </div>
                    <h4 className="text-sm font-bold text-white font-serif-heading">
                      Ian Dwi Putera
                    </h4>
                    <p className="text-[11px] text-stone-400 font-light leading-snug">
                      Inisiator digitalisasi situs sejarah.
                    </p>
                  </div>

                  {/* Sekretaris */}
                  <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-1.5 shadow-sm">
                    <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                      Sekretaris
                    </div>
                    <h4 className="text-sm font-bold text-white font-serif-heading">
                      Andi Hendrawan
                    </h4>
                    <p className="text-[11px] text-stone-400 font-light leading-snug">
                      Manajemen administrasi program dan korespondensi.
                    </p>
                  </div>

                  {/* Bendahara */}
                  <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-1.5 shadow-sm">
                    <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      Bendahara
                    </div>
                    <h4 className="text-sm font-bold text-white font-serif-heading">
                      Annisa
                    </h4>
                    <p className="text-[11px] text-stone-400 font-light leading-snug">
                      Pengelolaan keuangan, akuntabilitas anggaran, dan pembukuan kegiatan.
                    </p>
                  </div>
                </div>

                {/* Tenaga Ahli Sejarah & Budayawan */}
                <div className="p-4 rounded-2xl bg-stone-900/80 border border-[#D4AF37]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Award className="w-5 h-5 text-amber-300" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
                        Tenaga Ahli Sejarah & Budayawan
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-white font-serif-heading">
                        {details.expertAdvisor}
                      </h4>
                      <p className="text-xs text-stone-300 font-light leading-snug">
                        {details.expertAdvisorDesc || 'Tim Ahli Cagar Budaya Kab Donggala dan Tokoh Budaya Kabupaten Donggala'}
                      </p>
                    </div>
                  </div>
                  <span className="self-start sm:self-center text-[10px] px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 whitespace-nowrap font-medium">
                    Verifikator Data
                  </span>
                </div>
              </div>

              {/* 2. Tim Kreatif, Produksi Media & Pengisi Suara */}
              <div className="p-5 rounded-2xl bg-stone-900/70 border border-stone-800 space-y-3">
                <h5 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider font-serif-heading flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#D4AF37]" />
                  <span>Tim Kreatif, Produksi Media & Pengisi Suara:</span>
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Editor konten 360° */}
                  <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700/70 space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-300 text-[10px] font-bold uppercase">
                      <Video className="w-3.5 h-3.5" />
                      <span>Editor Konten 360°</span>
                    </div>
                    <div className="text-xs font-bold text-white">
                      Zulkarnain
                    </div>
                    <p className="text-[11px] text-stone-400 font-light leading-tight">
                      Pengolah citra panorama 360° dan penataan visual equirectangular.
                    </p>
                  </div>

                  {/* Perancang Audio & Musik Latar */}
                  <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700/70 space-y-1">
                    <div className="flex items-center gap-1.5 text-purple-400 text-[10px] font-bold uppercase">
                      <Music className="w-3.5 h-3.5" />
                      <span>Perancang Audio & Musik Latar</span>
                    </div>
                    <div className="text-xs font-bold text-white">
                      Renal
                    </div>
                    <p className="text-[11px] text-stone-400 font-light leading-tight">
                      Komposisi musik latar dan mastering audio.
                    </p>
                  </div>

                  {/* Tim Narator */}
                  <div className="p-3.5 rounded-xl bg-stone-800/80 border border-dashed border-stone-700/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-stone-400 text-[10px] font-bold uppercase">
                      <Mic className="w-3.5 h-3.5 text-stone-500" />
                      <span>Tim Narator</span>
                    </div>
                    <div className="text-xs font-medium text-stone-400 italic">
                      (Nama dikosongkan)
                    </div>
                    <p className="text-[11px] text-stone-500 font-light leading-tight">
                      Pengisi suara narasi sejarah dan penutur audio cagar budaya.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Operasional & Pendukung Lapangan */}
              <div className="p-5 rounded-2xl bg-stone-900/70 border border-stone-800 space-y-3">
                <h5 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider font-serif-heading flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Operasional & Pendukung Lapangan:</span>
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Divisi Dokumentasi & Transportasi */}
                  <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700/70 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-bold uppercase">
                      <Truck className="w-3.5 h-3.5" />
                      <span>Divisi Dokumentasi & Transportasi</span>
                    </div>
                    <div className="text-xs font-bold text-white">
                      Afid A
                    </div>
                    <p className="text-[11px] text-stone-400 font-light leading-tight">
                      Logistik mobilisasi survei ke 15 objek cagar budaya dan dokumentasi lapangan.
                    </p>
                  </div>

                  {/* Divisi Perlengkapan */}
                  <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700/70 space-y-1">
                    <div className="flex items-center gap-1.5 text-orange-400 text-[10px] font-bold uppercase">
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Divisi Perlengkapan</span>
                    </div>
                    <div className="text-xs font-bold text-white">
                      Razya Saputra
                    </div>
                    <p className="text-[11px] text-stone-400 font-light leading-tight">
                      Kesiapan perangkat perekaman 360°, perlengkapan teknis penjelajahan, dan instalasi perlengkapan.
                    </p>
                  </div>

                  {/* Divisi Konsumsi & Akomodasi */}
                  <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700/70 space-y-1">
                    <div className="flex items-center gap-1.5 text-pink-400 text-[10px] font-bold uppercase">
                      <Utensils className="w-3.5 h-3.5" />
                      <span>Divisi Konsumsi & Akomodasi</span>
                    </div>
                    <div className="text-xs font-bold text-white">
                      Arya Ananta & Bahrul Ulum
                    </div>
                    <p className="text-[11px] text-stone-400 font-light leading-tight">
                      Penyediaan akomodasi tim kerja dan logistik konsumsi selama kegiatan riset lapangan berlangsung.
                    </p>
                  </div>
                </div>
              </div>

              {/* 4. Perancang Desain Antarmuka, Pengembang Web & Penulis Skrip */}
              <div className="p-5 rounded-2xl bg-stone-900/70 border border-stone-800 space-y-3">
                <h5 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider font-serif-heading flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#D4AF37]" />
                  <span>Teknologi, Desain Antarmuka & Penulisan Naskah:</span>
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* UI/UX Designer & Integrasi Konten */}
                  <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700/70 space-y-1">
                    <div className="flex items-center gap-1.5 text-[#C85A32] text-[10px] font-bold uppercase">
                      <Palette className="w-3.5 h-3.5" />
                      <span>UI/UX Designer & Integrasi Konten</span>
                    </div>
                    <div className="text-xs font-bold text-white">
                      Ian Dwi Putera
                    </div>
                    <p className="text-[11px] text-stone-400 font-light leading-tight">
                      Perancangan desain antarmuka responsif, tata letak etnik, dan integrasi aset visual cagar budaya.
                    </p>
                  </div>

                  {/* Pengembang Web */}
                  <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700/70 space-y-1">
                    <div className="flex items-center gap-1.5 text-sky-400 text-[10px] font-bold uppercase">
                      <Code className="w-3.5 h-3.5" />
                      <span>Pengembang Web (Web Programmer)</span>
                    </div>
                    <div className="text-xs font-bold text-white">
                      Abdul Fajar Laudjeng
                    </div>
                    <p className="text-[11px] text-stone-400 font-light leading-tight">
                      Arsitektur kode web dan performa aplikasi.
                    </p>
                  </div>

                  {/* Penulis Skrip */}
                  <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700/70 space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-300 text-[10px] font-bold uppercase">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Penulis Skrip</span>
                    </div>
                    <div className="text-xs font-bold text-white">
                      Andi Hendrawan
                    </div>
                    <p className="text-[11px] text-stone-400 font-light leading-tight">
                      Penyusunan naskah narasi sejarah, konten kurasi arsip masa lampau, dan skrip audio guide.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: KOLABORASI & KEMITRAAN */}
          {activeSubTab === 'partnerships' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              
              {/* Rekomendasi & Dukungan Pembina Kebudayaan */}
              <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider font-serif-heading">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Rekomendasi & Dukungan Pembina Kebudayaan</span>
                </div>

                <div className="p-4 rounded-xl bg-stone-800/80 border border-stone-700 flex items-start gap-3">
                  <Building2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h5 className="text-sm font-bold text-white font-serif-heading">
                      {details.recommendingInstitution}
                    </h5>
                    <p className="text-xs text-stone-300 font-light">
                      Memberikan rekomendasi teknis resmi dalam pemanfaatan data objek cagar budaya dan pengarsipan digital arsitektur kolonial serta rumah panggung Kaili di Donggala.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-800/80 border border-stone-700 flex items-start gap-3">
                  <Award className="w-6 h-6 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h5 className="text-sm font-bold text-white font-serif-heading">
                      {details.fundingProgram}
                    </h5>
                    <p className="text-xs text-stone-300 font-light">
                      Kementerian Pendidikan Dasar dan Menengah RI — Kategori {details.fundingCategory}.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mitra Strategis & Komunitas Lokal (Dikosongkan Sementara) */}
              <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h5 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider font-serif-heading flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-[#D4AF37]" />
                    <span>Mitra Strategis & Komunitas Lokal:</span>
                  </h5>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-stone-800 text-stone-400 border border-stone-700 font-mono">
                    Dikosongkan sementara
                  </span>
                </div>

                <div className="p-6 rounded-2xl bg-stone-800/30 border border-dashed border-stone-700/80 text-center space-y-1.5">
                  <div className="w-10 h-10 rounded-full bg-stone-800/80 border border-stone-700 mx-auto flex items-center justify-center text-stone-500 mb-2">
                    <Clock className="w-5 h-5 text-stone-400" />
                  </div>
                  <p className="text-xs font-semibold text-stone-300">
                    (Dikosongkan sementara)
                  </p>
                  <p className="text-[11px] text-stone-400 font-light max-w-md mx-auto leading-relaxed">
                    Daftar mitra strategis, jejaring komunitas lokal, dan pemangku kepentingan kebudayaan Donggala sedang dalam tahap pemutakhiran koordinasi.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: VISI PROYEK & 15 CAGAR BUDAYA */}
          {activeSubTab === 'background' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-2">
                <h5 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider font-serif-heading flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                  <span>Urgensi Digitalisasi Sejarah Maritim Donggala</span>
                </h5>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
                  {details.background}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3">
                <h5 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider font-serif-heading flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C85A32]" />
                  <span>15 Objek Cagar Budaya Terinventarisasi di 4 Kelurahan:</span>
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {details.targetSitesList.map((st, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-800/60 border border-stone-700/60">
                      <div className="w-5 h-5 rounded-md bg-[#C85A32]/30 text-[#C85A32] font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </div>
                      <span className="text-stone-200 font-light truncate">{st}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#0C1014] border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
          <span className="font-light">
            Hak Cipta Digital © 2026 Menghidupkan Donggala
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
