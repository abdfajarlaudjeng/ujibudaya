import React, { useState, useEffect } from 'react';
import { heritageSites, quizQuestions, projectDetails } from './data/heritageSites';
import { HeritageSite } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { Panorama360Viewer } from './components/Panorama360Viewer';
import { TalkingTourModal } from './components/TalkingTourModal';
import { TimeSliderModal } from './components/TimeSliderModal';
import { SiteDetailsModal } from './components/SiteDetailsModal';
import { InteractiveMap } from './components/InteractiveMap';
import { FeaturesShowcase } from './components/FeaturesShowcase';
import { TantanganPenjelajahModal } from './components/TantanganPenjelajahModal';
import { AboutProjectModal } from './components/AboutProjectModal';
import { GoogleWorkspaceModal } from './components/GoogleWorkspaceModal';
import { AdminAccessModal } from './components/AdminAccessModal';
import { InputDataModal } from './components/InputDataModal';
import { 
  parsePortableSiteFromURL, 
  rawInputToHeritageSite, 
  generateSiteShareLink 
} from './utils/siteDataHelper';
import { soundscape } from './services/soundscape';
import { getSiteVisitCount, recordSiteVisit, formatVisitCount } from './utils/visitTracker';
import { initAuth } from './services/googleAuth';
import { GoogleSpreadsheetInfo } from './services/googleSheets';
import { User } from 'firebase/auth';
import { 
  Compass, 
  Box, 
  Map, 
  Sparkles, 
  ChevronRight, 
  Trophy,
  ArrowLeft,
  Eye,
  Lock,
  Plus,
  Database
} from 'lucide-react';

export function App() {
  // Dynamic sites data (synced with Google Sheets or default 15 heritage sites)
  const [sitesData, setSitesData] = useState<HeritageSite[]>(() => {
    try {
      const saved = localStorage.getItem('donggala_custom_sites');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load custom sites', e);
    }
    return heritageSites;
  });

  // Navigation states: 'sites' (Beranda) & 'map' (Peta Interaktif)
  // 'tour360' is accessed when visitors launch a 360 virtual tour from the map pins or catalog
  const [activeTab, setActiveTab] = useState<'sites' | 'map' | 'tour360'>('sites');
  const [selectedSite, setSelectedSite] = useState<HeritageSite>(sitesData[0]);

  // Google Workspace Integration State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isGoogleWorkspaceOpen, setIsGoogleWorkspaceOpen] = useState(false);
  const [activeSpreadsheet, setActiveSpreadsheet] = useState<GoogleSpreadsheetInfo | null>(() => {
    try {
      const saved = localStorage.getItem('donggala_active_spreadsheet');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleSetActiveSpreadsheet = (sheet: GoogleSpreadsheetInfo | null) => {
    setActiveSpreadsheet(sheet);
    try {
      if (sheet) {
        localStorage.setItem('donggala_active_spreadsheet', JSON.stringify(sheet));
      } else {
        localStorage.removeItem('donggala_active_spreadsheet');
      }
    } catch (e) {
      console.warn(e);
    }
  };

  // Auth listener for Google Workspace
  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => setCurrentUser(user),
      () => setCurrentUser(null)
    );
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Update sites from Google Sheets handler
  const handleUpdateSitesFromSheets = (newSites: HeritageSite[]) => {
    setSitesData(newSites);
    try {
      localStorage.setItem('donggala_custom_sites', JSON.stringify(newSites));
    } catch (e) {
      console.warn(e);
    }
    const updatedSelected = newSites.find((s) => s.id === selectedSite.id) || newSites[0];
    if (updatedSelected) {
      setSelectedSite(updatedSelected);
    }
  };

  // Reset to original data
  const handleResetToDefaultSites = () => {
    if (window.confirm('Kembalikan data situs ke versi default awal?')) {
      setSitesData(heritageSites);
      localStorage.removeItem('donggala_custom_sites');
      setSelectedSite(heritageSites[0]);
    }
  };

  const isCustomDataActive = sitesData !== heritageSites;

  // State for Input Data Objek Budaya Modal
  const [isInputDataModalOpen, setIsInputDataModalOpen] = useState(false);

  // Sync with Server Custom Sites & Portable Link on Mount
  useEffect(() => {
    // 1. Check for portable encoded site in URL
    const portableSite = parsePortableSiteFromURL();
    if (portableSite) {
      setSitesData(prev => {
        const exists = prev.some(s => s.id === portableSite.id);
        const updated = exists ? prev.map(s => s.id === portableSite.id ? portableSite : s) : [portableSite, ...prev];
        try {
          localStorage.setItem('donggala_custom_sites', JSON.stringify(updated));
        } catch (e) {
          console.warn(e);
        }
        return updated;
      });
      setSelectedSite(portableSite);
      setActiveTab('map');
      recordSiteVisit(portableSite.id);
    }

    // 2. Fetch server persisted sites from /api/sites
    fetch('/api/sites')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.sites) && data.sites.length > 0) {
          const serverHeritageSites = data.sites.map(rawInputToHeritageSite);
          setSitesData(prev => {
            const merged = [...prev];
            for (const sSite of serverHeritageSites) {
              const idx = merged.findIndex(s => s.id === sSite.id);
              if (idx >= 0) {
                merged[idx] = sSite;
              } else {
                merged.push(sSite);
              }
            }
            return merged;
          });
        }
      })
      .catch(err => console.warn('Fetch server sites failed:', err));
  }, []);

  // Save / Update Cultural Site Handler (Automatic Link & Storage)
  const handleSaveCulturalSite = (newSite: HeritageSite) => {
    setSitesData(prev => {
      const existingIdx = prev.findIndex(s => s.id === newSite.id);
      let updated: HeritageSite[];
      if (existingIdx >= 0) {
        updated = [...prev];
        updated[existingIdx] = newSite;
      } else {
        updated = [newSite, ...prev];
      }
      try {
        localStorage.setItem('donggala_custom_sites', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
    setSelectedSite(newSite);
    
    // Automatically update browser URL without reload so the link is immediately shareable
    const directUrl = `?tab=map&site=${encodeURIComponent(newSite.id)}`;
    window.history.replaceState(null, '', directUrl);
  };

  // Batch Import Cultural Sites Handler
  const handleBatchImportCulturalSites = (importedList: HeritageSite[]) => {
    setSitesData(prev => {
      const merged = [...prev];
      for (const item of importedList) {
        const idx = merged.findIndex(s => s.id === item.id);
        if (idx >= 0) {
          merged[idx] = item;
        } else {
          merged.push(item);
        }
      }
      try {
        localStorage.setItem('donggala_custom_sites', JSON.stringify(merged));
      } catch (e) {
        console.warn(e);
      }
      return merged;
    });

    if (importedList.length > 0) {
      setSelectedSite(importedList[0]);
      const directUrl = `?tab=map&site=${encodeURIComponent(importedList[0].id)}`;
      window.history.replaceState(null, '', directUrl);
    }
  };

  // Delete Cultural Site Handler
  const handleDeleteCulturalSite = (siteId: string) => {
    setSitesData(prev => {
      const updated = prev.filter(s => s.id !== siteId);
      try {
        localStorage.setItem('donggala_custom_sites', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });

    fetch(`/api/sites/${encodeURIComponent(siteId)}`, { method: 'DELETE' })
      .catch(e => console.warn('Delete site server error:', e));

    if (selectedSite.id === siteId && sitesData.length > 1) {
      const nextSite = sitesData.find(s => s.id !== siteId) || heritageSites[0];
      setSelectedSite(nextSite);
    }
  };

  // Support direct query param routing (?tab=map&site=kpm-office-donggala)
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      const siteParam = urlParams.get('site');

      if (tabParam && ['sites', 'map', 'tour360'].includes(tabParam)) {
        setActiveTab(tabParam as any);
      }

      if (siteParam) {
        const found = sitesData.find(s => s.id === siteParam);
        if (found) {
          setSelectedSite(found);
          recordSiteVisit(found.id);
        }
      }
    } catch (e) {
      console.warn('URL params parsing failed', e);
    }
  }, [sitesData]);
  
  // Interactive Modals State
  const [isTantanganPenjelajahOpen, setIsTantanganPenjelajahOpen] = useState(false);
  const [isTalkingTourOpen, setIsTalkingTourOpen] = useState(false);
  const [isTimeSliderOpen, setIsTimeSliderOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Administrator Protection & Access Code State
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [isAdminAccessModalOpen, setIsAdminAccessModalOpen] = useState(false);

  // Audio Ambient / Musik Latar State
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(() => soundscape.getIsPlaying());

  // Keep ambient playing state in sync with Soundscape singleton
  useEffect(() => {
    const unsubscribe = soundscape.subscribe((playing) => {
      setIsAmbientPlaying(playing);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenAdminPanel = () => {
    if (isAdminUnlocked) {
      setIsGoogleWorkspaceOpen(true);
    } else {
      setIsAdminAccessModalOpen(true);
    }
  };

  const handleAdminUnlockSuccess = () => {
    setIsAdminUnlocked(true);
    setIsAdminAccessModalOpen(false);
    setIsGoogleWorkspaceOpen(true);
  };

  const handleLockAdmin = () => {
    setIsAdminUnlocked(false);
    setIsGoogleWorkspaceOpen(false);
  };

  // Persistent Progress for Visited Sites & Exploration (clean start: 0 until user explores)
  const [visitedSiteIds, setVisitedSiteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('donggala_visited_sites_v2');
      if (saved) return JSON.parse(saved);
      return [];
    } catch {
      return [];
    }
  });

  // Record site exploration: marks as visited AND increments the visit count
  const recordVisit = (siteId: string) => {
    setVisitedSiteIds((prev) => {
      if (!prev.includes(siteId)) {
        const next = [...prev, siteId];
        try {
          localStorage.setItem('donggala_visited_sites_v2', JSON.stringify(next));
        } catch (e) {
          console.warn(e);
        }
        return next;
      }
      return prev;
    });

    // Increment site exploration visit count
    recordSiteVisit(siteId);
  };

  const handleToggleAmbient = () => {
    const isNowPlaying = soundscape.toggle();
    setIsAmbientPlaying(isNowPlaying);
  };

  const handleOpen360 = (site: HeritageSite) => {
    setSelectedSite(site);
    recordVisit(site.id);
    setActiveTab('tour360');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenTalkingTour = (site: HeritageSite) => {
    setSelectedSite(site);
    recordVisit(site.id);
    setIsTalkingTourOpen(true);
  };

  const handleOpenTimeSlider = (site: HeritageSite) => {
    setSelectedSite(site);
    recordVisit(site.id);
    setIsTimeSliderOpen(true);
  };

  const handleOpenDetails = (site: HeritageSite) => {
    setSelectedSite(site);
    recordVisit(site.id);
    setIsDetailsOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F3EF] text-[#1C1917] flex flex-col selection:bg-[#C85A32] selection:text-white font-sans">
      
      {/* Top Main Navigation Bar (Shows Beranda & Peta Interaktif + Tentang Kami + Musik Latar) */}
      <Navbar
        activeTab={activeTab === 'tour360' ? 'map' : activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenTantanganPenjelajah={() => setIsTantanganPenjelajahOpen(true)}
        onOpenAboutUs={() => setIsAboutOpen(true)}
        onOpenInputData={() => setIsInputDataModalOpen(true)}
        visitedCount={visitedSiteIds.length}
        totalSites={sitesData.length}
        isAmbientPlaying={isAmbientPlaying}
        onToggleAmbient={handleToggleAmbient}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20">
        
        {/* =======================================================================
            HALAMAN 1: LANDING PAGE (BERANDA)
            ======================================================================= */}
        {activeTab === 'sites' && (
          <div>
            {/* Hero Section */}
            <HeroSection
              onStart360Tour={(site) => {
                const target = site || selectedSite;
                handleOpen360(target);
              }}
              onOpenMap={() => {
                setActiveTab('map');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenTantanganPenjelajah={() => setIsTantanganPenjelajahOpen(true)}
              onOpenTimeSlider={(site) => handleOpenTimeSlider(site)}
            />

            {/* Showcase 2 Fitur Utama: Peta Interaktif & Tur Panorama 360° */}
            <FeaturesShowcase
              onOpenMap={() => {
                setActiveTab('map');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onStart360Tour={(site) => {
                const target = site || selectedSite;
                handleOpen360(target);
              }}
              featuredSite={selectedSite}
            />

            {/* Tantangan Penjelajah Banner */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pb-16">
              <div className="p-8 rounded-3xl bg-gradient-to-r from-orange-50 via-white to-sky-50 border border-stone-200/90 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-bold border border-[#0F4C81]/20">
                    <Sparkles className="w-3.5 h-3.5 text-[#C85A32]" />
                    <span>Inovasi Digital Pemajuan Kebudayaan</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1C1917] font-serif-heading">
                    klaim sertifikat jelajah !
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 max-w-2xl font-light leading-relaxed">
                    Kumpulkan seluruh lencana jelajah di buku kunjungan budaya dan taklukkan kuis sejarah untuk mencetak sertifikat penjelajah.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsTantanganPenjelajahOpen(true)}
                    className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#1B4332] hover:bg-[#13382C] text-[#ffd166] font-bold text-sm shadow-md transition-all whitespace-nowrap cursor-pointer"
                  >
                    <Trophy className="w-4 h-4 text-[#ffd166]" />
                    <span>Buka Tantangan Penjelajah</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =======================================================================
            HALAMAN 2: PETA INTERAKTIF GOOGLE MAPS
            - Fokus penuh pada bingkai peta tanpa gangguan judul dan deskripsi
            - Tombol Tantangan Penjelajah ditempatkan rapi di bawah bingkai peta
            ======================================================================= */}
        {activeTab === 'map' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6 space-y-4">
            {/* Bingkai Peta Interaktif Utama */}
            <InteractiveMap
              sites={sitesData}
              selectedSite={selectedSite}
              visitedSiteIds={visitedSiteIds}
              onSelectSite={(s) => {
                setSelectedSite(s);
                recordVisit(s.id);
              }}
              onOpen360Tour={(s) => handleOpen360(s)}
              onOpenInputData={() => setIsInputDataModalOpen(true)}
            />

            {/* Bagian Bawah Bingkai Peta: Keterangan Singkat & Tombol Tantangan Penjelajah */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 pb-4">
              <p className="text-xs text-stone-500 font-light flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block flex-shrink-0"></span>
                <span>Klik titik cagar budaya pada peta untuk membuka tur 360°, rute navigasi, dan linimasa komparasi foto.</span>
              </p>

              <button
                id="btn-bottom-explorer-challenge"
                onClick={() => setIsTantanganPenjelajahOpen(true)}
                className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-[#1B4332] text-[#ffd166] text-xs font-bold flex items-center gap-2 shadow-sm hover:bg-[#13382C] transition-colors cursor-pointer border border-[#ffd166]/30 whitespace-nowrap"
              >
                <Trophy className="w-4 h-4 text-[#ffd166]" />
                <span>Tantangan Penjelajah ({visitedSiteIds.length}/{sitesData.length} Terjelajah)</span>
              </button>
            </div>
          </div>
        )}

        {/* =======================================================================
            HALAMAN 3: VIRTUAL TOUR 360° (DAPAT DIAKSES DARI PETA & BERANDA)
            ======================================================================= */}
        {activeTab === 'tour360' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
            
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveTab('map')}
                  className="px-3.5 py-2 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali ke Peta</span>
                </button>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#1C1917] font-serif-heading flex items-center gap-2.5">
                    <Box className="w-6 h-6 text-[#C85A32]" />
                    <span>Tur Panorama 360°: {selectedSite.title}</span>
                  </h2>
                  <p className="text-xs text-stone-500 font-light">
                    {selectedSite.kelurahan} • Tahun {selectedSite.establishedYear}
                  </p>
                </div>
              </div>

              {/* Quick Site Picker Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-600 font-medium hidden sm:inline">Pindah Objek:</span>
                <select
                  value={selectedSite.id}
                  onChange={(e) => {
                    const found = sitesData.find(s => s.id === e.target.value);
                    if (found) {
                      setSelectedSite(found);
                      recordVisit(found.id);
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-stone-800 text-xs font-semibold focus:outline-none focus:border-[#C85A32] shadow-sm"
                >
                  {sitesData.map((s, idx) => (
                    <option key={s.id} value={s.id}>
                      {idx + 1}. {s.title} ({s.kelurahan.replace('Kelurahan ', '')})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Full 360 Panorama Component */}
            <Panorama360Viewer
              site={selectedSite}
              allSites={sitesData}
              onSelectSite={(s) => {
                setSelectedSite(s);
                recordVisit(s.id);
              }}
              onBackToMap={() => {
                setActiveTab('map');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenTalkingTour={(s) => handleOpenTalkingTour(s)}
              onOpenTimeSlider={(s) => handleOpenTimeSlider(s)}
              onOpenDetails={(s) => handleOpenDetails(s)}
            />

            {/* Quick Sites Thumbnails Row */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-stone-600 uppercase tracking-wider">
                Daftar {sitesData.length} Ruang 360° Kota Tua:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {sitesData.map((s, idx) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setSelectedSite(s);
                      recordVisit(s.id);
                    }}
                    className={`cursor-pointer rounded-2xl overflow-hidden border p-2.5 transition-all flex items-center gap-2.5 shadow-xs ${
                      s.id === selectedSite.id
                        ? 'bg-orange-50/90 border-[#C85A32] ring-2 ring-[#C85A32]/40'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <img
                      src={s.thumbnail}
                      alt={s.title}
                      className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-stone-900 truncate font-serif-heading">
                        {idx + 1}. {s.title.replace('Kantor Dagang ', '').replace('Rumah Tradisional ', '')}
                      </div>
                      <div className="text-[10px] text-[#C85A32] font-semibold truncate">
                        Tahun {s.establishedYear}
                      </div>
                      <div className="flex items-center gap-1 text-[9px] text-stone-500 truncate mt-0.5">
                        <Eye className="w-2.5 h-2.5 text-stone-400" />
                        <span>{formatVisitCount(getSiteVisitCount(s.id))} kunjungan</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer: Ditampilkan hanya di menu Beranda agar menu Peta Interaktif & Tur 360 bersih & maksimal di semua device */}
      {activeTab === 'sites' && (
        <footer className="bg-[#1C1917] text-stone-300 border-t border-stone-800 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Brand */}
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#C85A32] flex items-center justify-center font-bold text-white font-serif-heading">
                  D
                </div>
                <span className="text-lg font-bold text-white font-serif-heading">
                  DIJELAJAH DONGGALA
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-400 max-w-md leading-relaxed font-light">
                Eksplorasi situs bersejarah Kota Tua Donggala melalui peta interaktif, panorama visual 360 derajat, audio transkripsi sejarah, linimasa serta media pembelajaran budaya lokal.
              </p>
              <div className="text-xs text-amber-300 font-semibold">
                Bantuan Pemerintah Fasilitasi Pemajuan Kebudayaan (FPK) 2026
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-2 text-xs">
              <div className="font-bold text-white uppercase tracking-wider mb-2 font-serif-heading">
                Fitur Utama
              </div>
              <div className="space-y-2 text-stone-400">
                <div onClick={() => setActiveTab('sites')} className="hover:text-white cursor-pointer">15 Objek Cagar Budaya</div>
                <div onClick={() => setActiveTab('map')} className="hover:text-white cursor-pointer">Peta Interaktif Google Maps</div>
                <div onClick={() => setIsTantanganPenjelajahOpen(true)} className="hover:text-white cursor-pointer">Tantangan Penjelajah ({visitedSiteIds.length}/15)</div>
                <div onClick={() => setIsAboutOpen(true)} className="hover:text-white cursor-pointer">Tentang Proyek FPK 2026</div>
              </div>
            </div>

            {/* Institutions */}
            <div className="space-y-2 text-xs">
              <div className="font-bold text-white uppercase tracking-wider mb-2 font-serif-heading">
                Kolaborasi & Kemitraan
              </div>
              <div className="space-y-1.5 text-stone-400">
                <div>Balai Pelestarian Kebudayaan (BPK) Wilayah XVIII</div>
                <div>Kemendikdasmen RI</div>
                <div>Pemerintah Kabupaten Donggala</div>
                <div className="text-stone-500 italic text-[11px]">(Mitra komunitas dalam tahap pemutakhiran)</div>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
            <div className="flex items-center gap-2">
              <span>© 2026 Digitalisasi Situs Sejarah Kota Tua Donggala. Seluruh hak cipta dilindungi.</span>
              {/* Discreet Administrator Access icon button */}
              <button
                id="btn-footer-admin-access"
                onClick={handleOpenAdminPanel}
                title={isAdminUnlocked ? "Panel Administrator (Terbuka)" : "Panel Administrator"}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 text-[11px] ${
                  isAdminUnlocked 
                    ? 'text-amber-400 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-800/40' 
                    : 'text-stone-600 hover:text-stone-400 hover:bg-stone-900'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="sr-only sm:not-sr-only opacity-60 hover:opacity-100">
                  {isAdminUnlocked ? 'Admin Aktif' : 'Admin'}
                </span>
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button 
                id="btn-footer-input-data"
                onClick={() => setIsInputDataModalOpen(true)} 
                className="hover:text-white cursor-pointer flex items-center gap-1 text-amber-400 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Input Data Objek</span>
              </button>
              <span>•</span>
              <button onClick={() => setIsAboutOpen(true)} className="hover:text-white cursor-pointer">
                Proposal & Tim FPK 2026
              </button>
              <span>•</span>
              <button onClick={() => setIsTantanganPenjelajahOpen(true)} className="hover:text-white cursor-pointer">
                Tantangan Penjelajah
              </button>
            </div>
          </div>

        </div>
      </footer>
      )}

      {/* =========================================================================
          INTERACTIVE MODALS
          ========================================================================= */}
      
      {/* 1. Tantangan Penjelajah Modal (Combined: Buku Paspor, Kuis Misi & Sertifikat) */}
      <TantanganPenjelajahModal
        isOpen={isTantanganPenjelajahOpen}
        onClose={() => setIsTantanganPenjelajahOpen(false)}
        sites={sitesData}
        visitedSiteIds={visitedSiteIds}
        questions={quizQuestions}
        onSelectSite={(s) => {
          handleOpen360(s);
        }}
        onOpen360Tour={(s) => handleOpen360(s)}
      />

      {/* 2. Talking Tour Modal (AI Persona Dialog) */}
      <TalkingTourModal
        site={selectedSite}
        allSites={sitesData}
        isOpen={isTalkingTourOpen}
        onClose={() => setIsTalkingTourOpen(false)}
        onSelectSite={(s) => {
          setSelectedSite(s);
          recordVisit(s.id);
        }}
      />

      {/* 3. Time Slider Modal (Kolonial vs Modern Photo Comparison) */}
      <TimeSliderModal
        site={selectedSite}
        isOpen={isTimeSliderOpen}
        onClose={() => setIsTimeSliderOpen(false)}
      />

      {/* 4. Site Details Modal (Inventarisasi & Full Archive) */}
      <SiteDetailsModal
        site={selectedSite}
        isVisited={visitedSiteIds.includes(selectedSite.id)}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onOpen360={(s) => handleOpen360(s)}
        onOpenTalkingTour={(s) => handleOpenTalkingTour(s)}
        onOpenTimeSlider={(s) => handleOpenTimeSlider(s)}
      />

      {/* 5. About Project & Proposal FPK 2026 Modal */}
      <AboutProjectModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        details={projectDetails}
      />

      {/* 6. Admin Access Code Gatekeeper Modal */}
      <AdminAccessModal
        isOpen={isAdminAccessModalOpen}
        onClose={() => setIsAdminAccessModalOpen(false)}
        onUnlockSuccess={handleAdminUnlockSuccess}
      />

      {/* 7. Administrator Panel (Google Workspace, Sheets, Drive & Musik Latar) */}
      <GoogleWorkspaceModal
        isOpen={isGoogleWorkspaceOpen}
        onClose={() => setIsGoogleWorkspaceOpen(false)}
        onLockAdmin={handleLockAdmin}
        currentUser={currentUser}
        currentSites={sitesData}
        onUpdateSitesFromSheets={handleUpdateSitesFromSheets}
        activeSpreadsheet={activeSpreadsheet}
        setActiveSpreadsheet={handleSetActiveSpreadsheet}
      />

      {/* 8. Input & Manajemen Data Objek Budaya (Tersimpan Otomatis di Link) */}
      <InputDataModal
        isOpen={isInputDataModalOpen}
        onClose={() => setIsInputDataModalOpen(false)}
        sites={sitesData}
        onSaveSite={handleSaveCulturalSite}
        onBatchImportSites={handleBatchImportCulturalSites}
        onDeleteSite={handleDeleteCulturalSite}
        onSelectAndOpenSite={(site) => {
          setSelectedSite(site);
          setActiveTab('map');
          recordSiteVisit(site.id);
        }}
      />

    </div>
  );
}

export default App;
