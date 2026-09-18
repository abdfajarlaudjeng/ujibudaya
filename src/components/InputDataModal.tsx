import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Database, 
  FileSpreadsheet, 
  Link as LinkIcon, 
  Copy, 
  Check, 
  ExternalLink, 
  MapPin, 
  Trash2, 
  Edit3, 
  UploadCloud, 
  Download, 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Camera,
  Video,
  Image as ImageIcon,
  Compass,
  FileText
} from 'lucide-react';
import { HeritageSite } from '../types';
import { 
  RawCulturalObjectInput, 
  rawInputToHeritageSite, 
  heritageSiteToRawInput, 
  parseCulturalCSV, 
  exportSitesToCSV, 
  generateSiteShareLink 
} from '../utils/siteDataHelper';

interface InputDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  sites: HeritageSite[];
  onSaveSite: (site: HeritageSite) => void;
  onBatchImportSites: (newSites: HeritageSite[]) => void;
  onDeleteSite: (siteId: string) => void;
  onSelectAndOpenSite?: (site: HeritageSite) => void;
}

const DEFAULT_EXAMPLE_CSV = `ID,Nama_Objek,Kategori,Deskripsi,Latitude,Longitude,URL_Gambar,URL_Gambar_360,URL_Video,Gambar_Lama,Gambar_Baru
BUDAYA-352,pusentasi,Situs,"Pusentasi (pusat Laut) adalah Sumur Raksasa yang terbentuk secara alami berdiameter 10 meter dan mempunyai kedalaman 7 meter. Nama Pusentasi dalam bahasa Kaili (suku asli Sulawesi Tengah) berasal dari kata ""Pusen"" berarti Pusat dan ""Tasi"" berarti Laut. Air di dalamnya berasa asin seperti air laut dan berwarna jernih kebiru-biruan. Diduga ada sebuah lubang yang menghubungkan antara pantai dan pusentasi, karenanya jaraknya sekitar 300 meter. Keunikan pusentasi airnya tidak pernah keruh dan akan mengalami pasang apabila air laut sedang surut dan demikian pula sebaliknya. Memiliki legenda cerita rakyat yang oleh Jamrin Abubakar seorang wartawan di Donggala telah menulisnya dalam sebuah buku berjudul Pusentasi Cerita Rakyat Kabupaten Donggala.",-0.7101073,119.6638642,https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlfH06gTE6NxCKLfyPO5y1WUmqfqCivx76S_jFkUcksheiTQzsxHUQXp1DyKPS0kvpgo4WjUjxsb0ugjcUeQApIPSZXlocAXk2PgxqrQ-hjA05LfBih0lLBhGdWr7kkYGQOCJ5tPg=s680-w680-h510-rw,https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlfH06gTE6NxCKLfyPO5y1WUmqfqCivx76S_jFkUcksheiTQzsxHUQXp1DyKPS0kvpgo4WjUjxsb0ugjcUeQApIPSZXlocAXk2PgxqrQ-hjA05LfBih0lLBhGdWr7kkYGQOCJ5tPg=s680-w680-h510-rw,https://www.youtube.com/watch?v=zgKjAvmdY5o,https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlfH06gTE6NxCKLfyPO5y1WUmqfqCivx76S_jFkUcksheiTQzsxHUQXp1DyKPS0kvpgo4WjUjxsb0ugjcUeQApIPSZXlocAXk2PgxqrQ-hjA05LfBih0lLBhGdWr7kkYGQOCJ5tPg=s680-w680-h510-rw,https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlfH06gTE6NxCKLfyPO5y1WUmqfqCivx76S_jFkUcksheiTQzsxHUQXp1DyKPS0kvpgo4WjUjxsb0ugjcUeQApIPSZXlocAXk2PgxqrQ-hjA05LfBih0lLBhGdWr7kkYGQOCJ5tPg=s680-w680-h510-rw
gedung-bioskop,gedung bioskop,Kawasan,bioskop donggala,-0.6683706,119.7385271,https://assets-a2.kompasiana.com/items/album/2025/06/19/dua-bekas-loket-pertama-di-gedung-gembira-theater-yang-sangat-lama-digunakan-foto-jamrin-ab-6853f963ed641537973f6932.jpg?t=o&v=770,https://assets-a2.kompasiana.com/items/album/2025/06/19/dua-bekas-loket-pertama-di-gedung-gembira-theater-yang-sangat-lama-digunakan-foto-jamrin-ab-6853f963ed641537973f6932.jpg?t=o&v=770,https://www.youtube.com/watch?v=zgKjAvmdY5o,,`;

export const InputDataModal: React.FC<InputDataModalProps> = ({
  isOpen,
  onClose,
  sites,
  onSaveSite,
  onBatchImportSites,
  onDeleteSite,
  onSelectAndOpenSite
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'csv' | 'list'>('form');

  // Form Fields State
  const [formData, setFormData] = useState<RawCulturalObjectInput>({
    ID: '',
    Nama_Objek: '',
    Kategori: 'Situs',
    Deskripsi: '',
    Latitude: '-0.7101073',
    Longitude: '119.6638642',
    URL_Gambar: '',
    URL_Gambar_360: '',
    URL_Video: '',
    Gambar_Lama: '',
    Gambar_Baru: ''
  });

  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // CSV Import State
  const [csvText, setCsvText] = useState(DEFAULT_EXAMPLE_CSV);
  const [parsedCsvCount, setParsedCsvCount] = useState<number>(2);
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Search in List State
  const [searchQuery, setSearchQuery] = useState('');

  // Update parsed CSV count when text changes
  useEffect(() => {
    try {
      const items = parseCulturalCSV(csvText);
      setParsedCsvCount(items.length);
    } catch {
      setParsedCsvCount(0);
    }
  }, [csvText]);

  if (!isOpen) return null;

  // Auto-generate ID if user wants
  const handleAutoGenerateId = () => {
    const nextNum = Math.floor(100 + Math.random() * 900);
    setFormData(prev => ({
      ...prev,
      ID: `BUDAYA-${nextNum}`
    }));
  };

  // Quick Preset Coordinates
  const handleSetPresetLocation = (type: 'pusentasi' | 'donggala_kota' | 'tanjung_batu') => {
    if (type === 'pusentasi') {
      setFormData(prev => ({ ...prev, Latitude: '-0.7101073', Longitude: '119.6638642' }));
    } else if (type === 'donggala_kota') {
      setFormData(prev => ({ ...prev, Latitude: '-0.6728000', Longitude: '119.7423000' }));
    } else {
      setFormData(prev => ({ ...prev, Latitude: '-0.6654000', Longitude: '119.7495000' }));
    }
  };

  // Submit Single Form
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.Nama_Objek.trim()) {
      alert('Mohon masukkan Nama Objek Budaya.');
      return;
    }

    const cleanId = formData.ID && formData.ID.trim() 
      ? formData.ID.trim() 
      : `BUDAYA-${Date.now().toString().slice(-4)}`;

    const preparedInput: RawCulturalObjectInput = {
      ...formData,
      ID: cleanId
    };

    const newHeritageSite = rawInputToHeritageSite(preparedInput);
    onSaveSite(newHeritageSite);

    const directLink = generateSiteShareLink(cleanId);
    setSaveSuccessMsg(`Data "${newHeritageSite.title}" berhasil disimpan otomatis! Tautan aktif: ${directLink}`);

    // Persist to server API as well
    fetch('/api/sites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preparedInput)
    }).catch(err => console.warn('Server sync error:', err));

    setIsEditing(false);
  };

  // Load a site into the form for editing
  const handleEditSite = (site: HeritageSite) => {
    const raw = heritageSiteToRawInput(site);
    setFormData(raw);
    setIsEditing(true);
    setActiveTab('form');
    setSaveSuccessMsg(null);
  };

  // Copy Link Helper
  const handleCopyLink = (siteId: string) => {
    const link = generateSiteShareLink(siteId);
    navigator.clipboard.writeText(link);
    setCopiedLink(siteId);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  // Handle CSV Import
  const handleExecuteImport = async () => {
    try {
      const rawList = parseCulturalCSV(csvText);
      if (rawList.length === 0) {
        setImportStatus({ type: 'error', text: 'Tidak ada baris data valid yang ditemukan dalam CSV.' });
        return;
      }

      const newHeritageList = rawList.map(rawInputToHeritageSite);
      onBatchImportSites(newHeritageList);

      // Also persist to server batch API
      fetch('/api/sites/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sites: rawList })
      }).catch(err => console.warn('Server batch sync error:', err));

      setImportStatus({
        type: 'success',
        text: `Berhasil mengimpor ${newHeritageList.length} objek cagar budaya ke aplikasi dan peta!`
      });
      setActiveTab('list');
    } catch (err: any) {
      setImportStatus({ type: 'error', text: `Gagal memproses CSV: ${err.message}` });
    }
  };

  // Handle CSV Export
  const handleDownloadCSV = () => {
    const csvContent = exportSitesToCSV(sites);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Donggala_Cagar_Budaya_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered sites in List tab
  const filteredSites = sites.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentGeneratedLink = formData.ID ? generateSiteShareLink(formData.ID) : `${window.location.origin}/?tab=map&site=BUDAYA-352`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div 
        className="relative w-full max-w-5xl bg-[#faf8f5] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* =====================================================================
            MODAL HEADER
            ===================================================================== */}
        <div className="px-6 py-5 bg-white border-b border-stone-200/90 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#c85a32]/10 border border-[#c85a32]/25 flex items-center justify-center text-[#c85a32]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-serif-heading text-[#1c1917]">
                  Input & Kelola Data Objek Budaya
                </h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Tersimpan Otomatis di Link
                </span>
              </div>
              <p className="text-xs text-stone-500 font-light">
                ID, Nama Objek, Kategori, Koordinat, Panorama 360, Video & Foto Otomatis Tersimpan ke Tautan Permanen
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/download-html"
              download="dijelajah-donggala-cagar-budaya.html"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold transition-all"
              title="Unduh satu file HTML lengkap untuk dibuka mandiri tanpa server"
            >
              <Download className="w-3.5 h-3.5 text-amber-700" />
              <span>Unduh File HTML</span>
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =====================================================================
            TAB NAVIGATION
            ===================================================================== */}
        <div className="px-6 pt-3 bg-white border-b border-stone-200 flex items-center gap-2">
          <button
            onClick={() => { setActiveTab('form'); setSaveSuccessMsg(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'form'
                ? 'border-[#c85a32] text-[#c85a32] bg-[#faf8f5]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{isEditing ? 'Edit Objek Budaya' : 'Form Input Objek Baru'}</span>
          </button>

          <button
            onClick={() => setActiveTab('csv')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'csv'
                ? 'border-[#c85a32] text-[#c85a32] bg-[#faf8f5]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Impor & Ekspor CSV Batch</span>
            {parsedCsvCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-700">
                {parsedCsvCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'list'
                ? 'border-[#c85a32] text-[#c85a32] bg-[#faf8f5]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>Daftar Objek & Link ({sites.length})</span>
          </button>
        </div>

        {/* =====================================================================
            MODAL CONTENT BODY
            ===================================================================== */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* SUCCESS NOTIFICATION BANNER */}
          {saveSuccessMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start justify-between gap-3 text-xs animate-fade-in">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold mb-1">Penyimpanan Otomatis Berhasil!</div>
                  <p className="text-stone-700 leading-relaxed">{saveSuccessMsg}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => handleCopyLink(formData.ID || 'BUDAYA-352')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      {copiedLink === (formData.ID || 'BUDAYA-352') ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Link Otomatis</span>
                        </>
                      )}
                    </button>
                    <a
                      href={generateSiteShareLink(formData.ID || 'BUDAYA-352')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Buka Tautan di Tab Baru</span>
                    </a>
                  </div>
                </div>
              </div>
              <button onClick={() => setSaveSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-800">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ===================================================================
              TAB 1: FORM INPUT OBJEK BUDAYA
              =================================================================== */}
          {activeTab === 'form' && (
            <form onSubmit={handleSubmitForm} className="space-y-6">
              
              {/* Top Banner: Auto-save Link Explainer */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-[#1c1917] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-amber-900">Fitur Simpan Otomatis di Tautan Link:</span>
                    <span className="text-stone-700 ml-1">
                      Setiap data yang Anda masukkan langsung memiliki link akses langsung instan.
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-[11px] font-mono bg-white/90 px-2 py-1 rounded border border-amber-300 text-amber-900 truncate max-w-[200px]">
                    {formData.ID ? `?site=${formData.ID}` : '?site=BUDAYA-352'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyLink(formData.ID || 'BUDAYA-352')}
                    className="p-1.5 rounded-lg bg-white hover:bg-amber-100 border border-amber-300 text-amber-800 cursor-pointer flex-shrink-0"
                    title="Salin Tautan"
                  >
                    {copiedLink === (formData.ID || 'BUDAYA-352') ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Grid 1: Identitas Objek & Kategori */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-4 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#c85a32]" />
                  <span>1. Identitas & Klasifikasi Objek Budaya</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* ID */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-stone-700">
                        ID Objek <span className="text-stone-400 font-normal">(Contoh: BUDAYA-352)</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleAutoGenerateId}
                        className="text-[10px] text-[#c85a32] hover:underline cursor-pointer"
                      >
                        Generate ID
                      </button>
                    </div>
                    <input
                      type="text"
                      value={formData.ID}
                      onChange={(e) => setFormData({ ...formData, ID: e.target.value })}
                      placeholder="BUDAYA-352"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-mono focus:border-[#c85a32] focus:ring-1 focus:ring-[#c85a32] outline-none"
                    />
                  </div>

                  {/* Nama_Objek */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Nama_Objek <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.Nama_Objek}
                      onChange={(e) => setFormData({ ...formData, Nama_Objek: e.target.value })}
                      placeholder="pusentasi / gedung bioskop"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:border-[#c85a32] focus:ring-1 focus:ring-[#c85a32] outline-none"
                    />
                  </div>

                  {/* Kategori */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Kategori <span className="text-stone-400 font-normal">(Situs, Kawasan, Bangunan)</span>
                    </label>
                    <select
                      value={formData.Kategori}
                      onChange={(e) => setFormData({ ...formData, Kategori: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:border-[#c85a32] focus:ring-1 focus:ring-[#c85a32] outline-none bg-white cursor-pointer"
                    >
                      <option value="Situs">Situs (Situs Cagar Budaya / Alam)</option>
                      <option value="Kawasan">Kawasan (Kawasan Cagar Budaya / Pelabuhan)</option>
                      <option value="Bangunan & Struktur">Bangunan & Struktur Cagar Budaya</option>
                      <option value="Maritim & Pelabuhan">Maritim & Pelabuhan</option>
                      <option value="Kolonial & Pemerintahan">Kolonial & Pemerintahan</option>
                      <option value="Arsitektur & Rumah Adat">Arsitektur & Rumah Adat</option>
                    </select>
                  </div>
                </div>

                {/* Deskripsi */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Deskripsi Sejarah & Narasi Budaya
                  </label>
                  <textarea
                    rows={3}
                    value={formData.Deskripsi}
                    onChange={(e) => setFormData({ ...formData, Deskripsi: e.target.value })}
                    placeholder="Tuliskan catatan sejarah, legenda rakyat, keunikan arsitektural, atau informasi penting objek budaya ini..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs leading-relaxed focus:border-[#c85a32] focus:ring-1 focus:ring-[#c85a32] outline-none"
                  />
                </div>
              </div>

              {/* Grid 2: Koordinat Geografis */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#0f4c81]" />
                    <span>2. Koordinat Geospasial (Latitude & Longitude)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-stone-500">Preset Lokasi:</span>
                    <button
                      type="button"
                      onClick={() => handleSetPresetLocation('pusentasi')}
                      className="px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-[10px] text-stone-700 cursor-pointer"
                    >
                      Pusentasi
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetPresetLocation('donggala_kota')}
                      className="px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-[10px] text-stone-700 cursor-pointer"
                    >
                      Kota Tua
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Latitude */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Latitude <span className="text-stone-400 font-normal">(-0.7101073)</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.Latitude}
                      onChange={(e) => setFormData({ ...formData, Latitude: e.target.value })}
                      placeholder="-0.7101073"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-mono focus:border-[#0f4c81] focus:ring-1 focus:ring-[#0f4c81] outline-none"
                    />
                  </div>

                  {/* Longitude */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Longitude <span className="text-stone-400 font-normal">(119.6638642)</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.Longitude}
                      onChange={(e) => setFormData({ ...formData, Longitude: e.target.value })}
                      placeholder="119.6638642"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-mono focus:border-[#0f4c81] focus:ring-1 focus:ring-[#0f4c81] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Grid 3: URL Media & Visual Interaktif */}
              <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-4 shadow-xs">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#c85a32]" />
                  <span>3. Media Visual, Panorama 360 & Video</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* URL_Gambar (Foto Utama) */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      URL_Gambar <span className="text-stone-400 font-normal">(Foto Utama)</span>
                    </label>
                    <input
                      type="url"
                      value={formData.URL_Gambar}
                      onChange={(e) => setFormData({ ...formData, URL_Gambar: e.target.value })}
                      placeholder="https://lh3.googleusercontent.com/..."
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:border-[#c85a32] focus:ring-1 focus:ring-[#c85a32] outline-none"
                    />
                    {formData.URL_Gambar && (
                      <div className="mt-2 h-24 rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                        <img 
                          src={formData.URL_Gambar} 
                          alt="Preview Gambar" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}
                  </div>

                  {/* URL_Gambar_360 (Visual Panorama 360) */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      URL_Gambar_360 <span className="text-stone-400 font-normal">(Panorama Equirectangular)</span>
                    </label>
                    <input
                      type="url"
                      value={formData.URL_Gambar_360}
                      onChange={(e) => setFormData({ ...formData, URL_Gambar_360: e.target.value })}
                      placeholder="https://... 360 panorama"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:border-[#c85a32] focus:ring-1 focus:ring-[#c85a32] outline-none"
                    />
                    {formData.URL_Gambar_360 && (
                      <div className="mt-2 h-24 rounded-xl overflow-hidden border border-stone-200 bg-stone-100 relative">
                        <img 
                          src={formData.URL_Gambar_360} 
                          alt="Preview 360" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-bold">
                          360°
                        </span>
                      </div>
                    )}
                  </div>

                  {/* URL_Video (Dokumenter / YouTube) */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      URL_Video <span className="text-stone-400 font-normal">(YouTube / MP4)</span>
                    </label>
                    <input
                      type="url"
                      value={formData.URL_Video}
                      onChange={(e) => setFormData({ ...formData, URL_Video: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:border-[#c85a32] focus:ring-1 focus:ring-[#c85a32] outline-none"
                    />
                    <p className="text-[10px] text-stone-500 mt-1">
                      Mendukung tautan YouTube atau berkas MP4 video dokumenter.
                    </p>
                  </div>
                </div>

                {/* Grid 4: Komparasi Foto Lama vs Baru */}
                <div className="pt-3 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Gambar_Lama */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Gambar_Lama <span className="text-stone-400 font-normal">(Arsip Era Kolonial/Klasik)</span>
                    </label>
                    <input
                      type="url"
                      value={formData.Gambar_Lama}
                      onChange={(e) => setFormData({ ...formData, Gambar_Lama: e.target.value })}
                      placeholder="URL arsip foto era dulu..."
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:border-[#c85a32] focus:ring-1 focus:ring-[#c85a32] outline-none"
                    />
                  </div>

                  {/* Gambar_Baru */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Gambar_Baru <span className="text-stone-400 font-normal">(Dokumentasi Kondisi Terkini)</span>
                    </label>
                    <input
                      type="url"
                      value={formData.Gambar_Baru}
                      onChange={(e) => setFormData({ ...formData, Gambar_Baru: e.target.value })}
                      placeholder="URL foto masa sekarang..."
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:border-[#c85a32] focus:ring-1 focus:ring-[#c85a32] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-stone-200">
                <div className="text-xs text-stone-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Data akan tersimpan secara otomatis ke memori lokal & link akses langsung.</span>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({
                        ID: '',
                        Nama_Objek: '',
                        Kategori: 'Situs',
                        Deskripsi: '',
                        Latitude: '-0.7101073',
                        Longitude: '119.6638642',
                        URL_Gambar: '',
                        URL_Gambar_360: '',
                        URL_Video: '',
                        Gambar_Lama: '',
                        Gambar_Baru: ''
                      });
                      setIsEditing(false);
                      setSaveSuccessMsg(null);
                    }}
                    className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer"
                  >
                    Reset Form
                  </button>

                  <button
                    type="submit"
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#c85a32] hover:bg-[#b8502a] text-white text-xs font-bold shadow-md shadow-[#c85a32]/20 hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isEditing ? 'Perbarui Objek Budaya' : 'Simpan Objek & Buat Link Otomatis'}</span>
                  </button>
                </div>
              </div>

            </form>
          )}

          {/* ===================================================================
              TAB 2: IMPOR & EKSPOR CSV BATCH
              =================================================================== */}
          {activeTab === 'csv' && (
            <div className="space-y-6">
              
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-xs font-bold text-stone-800">
                    Format Kolom CSV yang Didukung:
                  </div>
                  <button
                    type="button"
                    onClick={() => setCsvText(DEFAULT_EXAMPLE_CSV)}
                    className="text-xs text-[#c85a32] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Muat Contoh CSV (Pusentasi & Gedung Bioskop)</span>
                  </button>
                </div>
                
                <div className="p-3 rounded-xl bg-stone-100 font-mono text-[11px] text-stone-700 overflow-x-auto select-all border border-stone-200/80">
                  ID,Nama_Objek,Kategori,Deskripsi,Latitude,Longitude,URL_Gambar,URL_Gambar_360,URL_Video,Gambar_Lama,Gambar_Baru
                </div>
                
                <p className="text-xs text-stone-500 font-light">
                  Anda dapat menyalin data CSV langsung dari spreadsheet (Google Sheets / Excel) dan menempelkannya di bawah ini.
                </p>
              </div>

              {/* Textarea for CSV */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-700">
                    Tempel Data CSV Teks:
                  </label>
                  <span className="text-xs font-medium text-emerald-700">
                    {parsedCsvCount} baris data terdeteksi
                  </span>
                </div>
                <textarea
                  rows={8}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  className="w-full p-4 rounded-2xl border border-stone-300 font-mono text-xs leading-relaxed focus:border-[#c85a32] focus:ring-1 focus:ring-[#c85a32] outline-none bg-white"
                  placeholder="ID,Nama_Objek,Kategori,Deskripsi,Latitude,Longitude,URL_Gambar,URL_Gambar_360,URL_Video,Gambar_Lama,Gambar_Baru..."
                />
              </div>

              {/* Status Message */}
              {importStatus && (
                <div className={`p-4 rounded-2xl border text-xs flex items-center gap-2.5 ${
                  importStatus.type === 'success' 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}>
                  {importStatus.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  )}
                  <span>{importStatus.text}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-stone-200">
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleDownloadCSV}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-100 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh CSV (11 Kolom)</span>
                  </button>

                  <a
                    href="/download-html"
                    download="dijelajah-donggala-cagar-budaya.html"
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-xs font-semibold text-amber-900 flex items-center justify-center gap-2 cursor-pointer transition-all"
                    title="Unduh satu file HTML lengkap tanpa dependensi"
                  >
                    <Download className="w-4 h-4 text-amber-700" />
                    <span>Unduh File HTML Lengkap</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={handleExecuteImport}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#c85a32] hover:bg-[#b8502a] text-white text-xs font-bold shadow-md shadow-[#c85a32]/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Impor Semua ({parsedCsvCount}) Data ke Aplikasi & Peta</span>
                </button>
              </div>

            </div>
          )}

          {/* ===================================================================
              TAB 3: DAFTAR OBJEK & LINK OTOMATIS
              =================================================================== */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              
              {/* Search Box */}
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari berdasarkan nama objek, ID, atau kategori..."
                  className="flex-1 px-4 py-2.5 rounded-2xl border border-stone-300 text-xs focus:border-[#c85a32] outline-none bg-white"
                />
                <button
                  onClick={handleDownloadCSV}
                  className="px-3.5 py-2.5 rounded-2xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-medium flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Ekspor CSV</span>
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                {filteredSites.map((site) => {
                  const siteLink = generateSiteShareLink(site.id);
                  const isCopied = copiedLink === site.id;

                  return (
                    <div 
                      key={site.id} 
                      className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-[#c85a32]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <img
                          src={site.thumbnail}
                          alt={site.title}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-xl object-cover border border-stone-200 flex-shrink-0"
                          onError={(e) => {
                            (e.target as any).src = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
                              {site.id}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#c85a32]/10 text-[#c85a32] font-semibold">
                              {site.category}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-[#1c1917] truncate font-serif-heading">
                            {site.title}
                          </h4>
                          <p className="text-[11px] text-stone-500 truncate max-w-md">
                            {site.coordinates.lat.toFixed(5)}, {site.coordinates.lng.toFixed(5)} • {site.briefDescription}
                          </p>
                        </div>
                      </div>

                      {/* Link & Control Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                        <button
                          onClick={() => handleCopyLink(site.id)}
                          title="Salin Tautan Akses Langsung"
                          className="px-2.5 py-1.5 rounded-xl border border-stone-200 hover:border-stone-300 text-stone-700 bg-stone-50 hover:bg-stone-100 text-xs font-medium flex items-center gap-1 cursor-pointer transition-all"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Tersalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Salin Link</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            if (onSelectAndOpenSite) {
                              onSelectAndOpenSite(site);
                              onClose();
                            } else {
                              window.location.href = siteLink;
                            }
                          }}
                          title="Lihat di Peta Interaktif"
                          className="px-2.5 py-1.5 rounded-xl bg-[#0f4c81] hover:bg-[#0a3962] text-white text-xs font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Peta</span>
                        </button>

                        <button
                          onClick={() => handleEditSite(site)}
                          title="Edit Objek"
                          className="p-1.5 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Hapus objek "${site.title}" (${site.id})?`)) {
                              onDeleteSite(site.id);
                            }
                          }}
                          title="Hapus Objek"
                          className="p-1.5 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>

        {/* =====================================================================
            MODAL FOOTER
            ===================================================================== */}
        <div className="px-6 py-4 bg-stone-100/80 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Tersimpan di Memori Lokal &amp; API Server Donggala</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
