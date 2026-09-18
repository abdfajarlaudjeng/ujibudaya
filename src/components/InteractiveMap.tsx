import React, { useState, useEffect, useRef } from 'react';
import { HeritageSite } from '../types';
import { 
  Landmark, 
  MapPin, 
  Compass, 
  Search, 
  Share2, 
  Info, 
  X, 
  Check, 
  Copy, 
  Navigation, 
  Box, 
  ChevronRight, 
  Menu,
  CheckCircle2,
  Layers,
  Building2,
  Ship,
  Sparkles,
  Eye,
  History,
  ArrowLeftRight,
  Calendar,
  Camera,
  SlidersHorizontal,
  Plus
} from 'lucide-react';
import { 
  MapContainer, 
  TileLayer, 
  Marker as LeafletMarker, 
  Popup as LeafletPopup, 
  useMap as useLeafletMap 
} from 'react-leaflet';
import L from 'leaflet';
import { useAllVisitCounts, formatVisitCount } from '../utils/visitTracker';

// Helper controller component to synchronize camera with selected heritage site (Leaflet)
const LeafletMapController: React.FC<{ 
  centerPos: { lat: number; lng: number } | null;
  zoomLevel: number;
}> = ({ centerPos, zoomLevel }) => {
  const map = useLeafletMap();

  useEffect(() => {
    if (centerPos && map) {
      map.flyTo([centerPos.lat, centerPos.lng], zoomLevel, {
        duration: 1.2,
        easeLinearity: 0.25
      });
    }
  }, [centerPos, zoomLevel, map]);

  return null;
};

export type HeritageCategoryKey = 'all' | 'situs' | 'kawasan' | 'bangunan_struktur';
export type LanguageKey = 'id' | 'en';

// Exact 3 Categories for Indonesian Cagar Budaya in Banawa, Donggala
export const HERITAGE_CATEGORIES: Record<
  'situs' | 'kawasan' | 'bangunan_struktur',
  {
    id: HeritageCategoryKey;
    labelId: string;
    labelEn: string;
    color: string;
    bgSoft: string;
    border: string;
    iconEmoji: string;
  }
> = {
  situs: {
    id: 'situs',
    labelId: 'Situs Cagar Budaya',
    labelEn: 'Heritage Sites',
    color: '#d97706', // Warm Amber
    bgSoft: '#fef3c7',
    border: '#d97706',
    iconEmoji: '🏺'
  },
  kawasan: {
    id: 'kawasan',
    labelId: 'Kawasan Cagar Budaya',
    labelEn: 'Heritage Districts',
    color: '#0284c7', // Oceanic Blue
    bgSoft: '#e0f2fe',
    border: '#0284c7',
    iconEmoji: '🗺️'
  },
  bangunan_struktur: {
    id: 'bangunan_struktur',
    labelId: 'Bangunan & Struktur Cagar Budaya',
    labelEn: 'Buildings & Structures',
    color: '#c85a32', // Heritage Terracotta
    bgSoft: '#ffedd5',
    border: '#c85a32',
    iconEmoji: '🏛️'
  }
};

export const getSiteHeritageCategory = (site: HeritageSite): 'situs' | 'kawasan' | 'bangunan_struktur' => {
  // 1. Situs Cagar Budaya (Makam, Situs Alam & Arkeologi)
  if (
    site.id.includes('makam') || 
    site.title.toLowerCase().includes('makam') ||
    site.id.includes('situs') ||
    site.category?.toLowerCase().includes('makam') ||
    site.category?.toLowerCase().includes('arkeologi') ||
    site.category?.toLowerCase().includes('alam')
  ) {
    return 'situs';
  }

  // 2. Kawasan Cagar Budaya (Dermaga, Pelabuhan, Sentra Tenun)
  if (
    site.id.includes('dermaga') ||
    site.id.includes('pelabuhan') ||
    site.id.includes('tenun') ||
    site.id.includes('kawasan') ||
    site.title.toLowerCase().includes('dermaga') ||
    site.title.toLowerCase().includes('pelabuhan') ||
    site.title.toLowerCase().includes('sentra tenun') ||
    site.category?.toLowerCase().includes('kawasan')
  ) {
    return 'kawasan';
  }

  // 3. Bangunan & Struktur Cagar Budaya (Gedung Kolonial, Souraja, Mercusuar, Klenteng, Pos, Rumah Tua, Tugu)
  return 'bangunan_struktur';
};

// SVG Icon Generator for the 3 Cultural Heritage Categories
export const getHeritageCategorySvg = (
  catKey: 'situs' | 'kawasan' | 'bangunan_struktur',
  iconSize: number = 18
): string => {
  if (catKey === 'situs') {
    // Situs Cagar Budaya: Archaeological Relic / Ancient Amphora Urn (Makam & Purbakala)
    return `
      <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 3h8" />
        <path d="M9 3v2a3 3 0 0 0 6 0V3" />
        <path d="M6 7h12c1 0 2 1 2 2 0 4.5-2.5 7.5-7.5 8.5V20h3v2H8.5v-2h3v-2.5C6.5 16.5 4 13.5 4 9c0-1 1-2 2-2z" />
        <path d="M4 11c-1 0-2 1-2 2s1 2 2 2" />
        <path d="M20 11c1 0 2 1 2 2s-1 2-2 2" />
      </svg>
    `;
  }
  if (catKey === 'kawasan') {
    // Kawasan Cagar Budaya: Heritage Precinct / Maritime Harbor District Map (Pelabuhan, Pesisir & Tenun)
    return `
      <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
        <line x1="9" y1="3" x2="9" y2="18" />
        <line x1="15" y1="6" x2="15" y2="21" />
      </svg>
    `;
  }
  // bangunan_struktur: Bangunan & Struktur Cagar Budaya (Classical Architecture / Colonial Landmark)
  return `
    <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="3" y1="22" x2="21" y2="22" />
      <line x1="6" y1="18" x2="6" y2="11" />
      <line x1="10" y1="18" x2="10" y2="11" />
      <line x1="14" y1="18" x2="14" y2="11" />
      <line x1="18" y1="18" x2="18" y2="11" />
      <polygon points="12 2 20 7 4 7" />
      <line x1="2" y1="7" x2="22" y2="7" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  `;
};

// Leaflet DivIcon Generator with Flat 2D Category Heritage Icon (No Numbers)
const createHeritagePinIcon = (
  catKey: 'situs' | 'kawasan' | 'bangunan_struktur', 
  isSelected: boolean
) => {
  const catCfg = HERITAGE_CATEGORIES[catKey];
  const size = isSelected ? 40 : 34;
  const iconSize = isSelected ? 22 : 18;
  const svgContent = getHeritageCategorySvg(catKey, iconSize);

  // Crisp, 2D flat point marker with cultural heritage icon (no numbers)
  const html = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transform: translate(-50%, -50%); user-select: none;">
      ${isSelected ? `
        <div style="position: absolute; width: ${size + 12}px; height: ${size + 12}px; border-radius: 50%; border: 2.5px solid ${catCfg.color}; opacity: 0.85; pointer-events: none;"></div>
      ` : ''}
      <div style="
        position: relative; 
        width: ${size}px; 
        height: ${size}px; 
        border-radius: 50%; 
        background-color: ${catCfg.color}; 
        border: ${isSelected ? '2.5px solid #1c1917' : '2px solid #ffffff'}; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        color: #ffffff; 
        transform: ${isSelected ? 'scale(1.1)' : 'scale(1)'};
        transition: transform 0.2s ease;
      ">
        ${svgContent}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'donggala-heritage-marker-2d',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
};

interface InteractiveMapProps {
  sites: HeritageSite[];
  selectedSite?: HeritageSite | null;
  visitedSiteIds?: string[];
  onSelectSite: (site: HeritageSite) => void;
  onOpen360Tour: (site: HeritageSite) => void;
  onOpenTimeSlider?: (site: HeritageSite) => void;
  onOpenInputData?: () => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  sites,
  selectedSite,
  visitedSiteIds = [],
  onSelectSite,
  onOpen360Tour,
  onOpenTimeSlider,
  onOpenInputData
}) => {
  const visitCounts = useAllVisitCounts();
  const [language, setLanguage] = useState<LanguageKey>('id');
  const [activeCategory, setActiveCategory] = useState<HeritageCategoryKey>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  
  // Explicitly clicked site state: Defaults to NULL so NO popup shows when not clicked!
  const [clickedSite, setClickedSite] = useState<HeritageSite | null>(null);

  // Timeline (Linimasa Komparasi Foto Masa Lampau & Masa Kini)
  const [isTimelineOpen, setIsTimelineOpen] = useState<boolean>(false);
  const [timelineSite, setTimelineSite] = useState<HeritageSite | null>(null);
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0-100
  const [comparisonMode, setComparisonMode] = useState<'slider' | 'side-by-side'>('slider');
  const [sliderContainerWidth, setSliderContainerWidth] = useState<number>(800);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingSliderRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isTimelineOpen) return;
    const updateWidth = () => {
      if (sliderContainerRef.current) {
        setSliderContainerWidth(sliderContainerRef.current.clientWidth);
      }
    };
    const timer = setTimeout(updateWidth, 50);
    window.addEventListener('resize', updateWidth);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateWidth);
    };
  }, [isTimelineOpen, comparisonMode]);

  const handleSliderPointerDown = () => {
    isDraggingSliderRef.current = true;
  };

  const handleSliderPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingSliderRef.current || !sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleSliderPointerUp = () => {
    isDraggingSliderRef.current = false;
  };

  // Modals
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Camera Pan/Zoom state (centered on Donggala Town & Port)
  const [cameraCenter, setCameraCenter] = useState<{ lat: number; lng: number } | null>({
    lat: -0.6728,
    lng: 119.7423
  });
  const [zoomLevel, setZoomLevel] = useState<number>(15);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter sites by category and search query
  const filteredSites = sites.filter(site => {
    const siteCat = getSiteHeritageCategory(site);
    const matchesCategory = activeCategory === 'all' || siteCat === activeCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      site.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.kelurahan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.locationDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (site.localName && site.localName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const handleMarkerClick = (site: HeritageSite) => {
    setClickedSite(site);
    onSelectSite(site);
    setCameraCenter({ lat: site.coordinates.lat, lng: site.coordinates.lng });
    setZoomLevel(17);
    setIsSearchOpen(false);
  };

  const handleResetCenter = () => {
    setClickedSite(null);
    setCameraCenter({ lat: -0.6728, lng: 119.7423 });
    setZoomLevel(15);
    setActiveCategory('all');
    setSearchQuery('');
  };

  const handleCopyShareLink = () => {
    const targetSite = clickedSite || sites[0];
    const shareUrl = `${window.location.origin}/?tab=map&site=${targetSite.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    });
  };

  const activeSiteForInfo = clickedSite || sites[0];
  const activeSiteIndex = clickedSite ? sites.findIndex(s => s.id === clickedSite.id) + 1 : 1;
  const activeSiteCatKey = clickedSite ? getSiteHeritageCategory(clickedSite) : 'bangunan_struktur';
  const activeSiteCatCfg = HERITAGE_CATEGORIES[activeSiteCatKey];

  return (
    <div className="w-full relative select-none">
      
      {/* =========================================================================
          MAIN STAGE CONTAINER: Google Satellite Map with Cultural Border Accent
          ========================================================================= */}
      <div className="relative w-full h-[620px] sm:h-[720px] lg:h-[780px] rounded-3xl overflow-hidden shadow-2xl border-4 sm:border-[6px] border-[#c87d20] bg-stone-900">
        
        {/* =======================================================================
            ORNAMENTAL BORDER ACCENT (Donggala Tenun Motif)
            ======================================================================= */}
        {/* Top Ornate Band */}
        <div className="absolute top-0 left-0 right-0 h-4 z-20 pointer-events-none overflow-hidden bg-[#e08e28] flex items-center justify-center border-b border-[#96540c]/40 shadow-xs">
          <svg className="w-full h-full" preserveAspectRatio="repeat-x" viewBox="0 0 200 16">
            <defs>
              <pattern id="ethnicPatternTop" width="28" height="16" patternUnits="userSpaceOnUse">
                <rect width="28" height="16" fill="#e08e28" />
                <polygon points="14,1 27,8 14,15 1,8" fill="#9e3d1b" stroke="#fce4a6" strokeWidth="0.8" />
                <polygon points="14,3 22,8 14,13 6,8" fill="#1b4332" />
                <circle cx="14" cy="8" r="1.8" fill="#ffd166" />
              </pattern>
            </defs>
            <rect width="100%" height="16" fill="url(#ethnicPatternTop)" />
          </svg>
        </div>

        {/* Bottom Ornate Band */}
        <div className="absolute bottom-0 left-0 right-0 h-4 z-20 pointer-events-none overflow-hidden bg-[#e08e28] flex items-center justify-center border-t border-[#96540c]/40 shadow-xs">
          <svg className="w-full h-full" preserveAspectRatio="repeat-x" viewBox="0 0 200 16">
            <rect width="100%" height="16" fill="url(#ethnicPatternTop)" />
          </svg>
        </div>

        {/* Left Ornate Band */}
        <div className="absolute top-4 bottom-4 left-0 w-3.5 z-20 pointer-events-none overflow-hidden bg-[#e08e28] border-r border-[#96540c]/40">
          <svg className="w-full h-full" preserveAspectRatio="repeat-y" viewBox="0 0 14 200">
            <defs>
              <pattern id="ethnicPatternSide" width="14" height="28" patternUnits="userSpaceOnUse">
                <rect width="14" height="28" fill="#e08e28" />
                <polygon points="1,14 7,1 13,14 7,27" fill="#9e3d1b" stroke="#fce4a6" strokeWidth="0.8" />
                <circle cx="7" cy="14" r="1.5" fill="#ffd166" />
              </pattern>
            </defs>
            <rect width="14" height="100%" fill="url(#ethnicPatternSide)" />
          </svg>
        </div>

        {/* Right Ornate Band */}
        <div className="absolute top-4 bottom-4 right-0 w-3.5 z-20 pointer-events-none overflow-hidden bg-[#e08e28] border-l border-[#96540c]/40">
          <svg className="w-full h-full" preserveAspectRatio="repeat-y" viewBox="0 0 14 200">
            <rect width="14" height="100%" fill="url(#ethnicPatternSide)" />
          </svg>
        </div>

        {/* Four Traditional Golden Corner Badges */}
        <div className="absolute top-0 left-0 w-9 h-9 z-30 pointer-events-none bg-[#9e3d1b] border-r-2 border-b-2 border-[#ffd166] flex items-center justify-center shadow-lg">
          <span className="text-[#ffd166] text-xs font-bold">✦</span>
        </div>
        <div className="absolute top-0 right-0 w-9 h-9 z-30 pointer-events-none bg-[#9e3d1b] border-l-2 border-b-2 border-[#ffd166] flex items-center justify-center shadow-lg">
          <span className="text-[#ffd166] text-xs font-bold">✦</span>
        </div>
        <div className="absolute bottom-0 left-0 w-9 h-9 z-30 pointer-events-none bg-[#9e3d1b] border-r-2 border-t-2 border-[#ffd166] flex items-center justify-center shadow-lg">
          <span className="text-[#ffd166] text-xs font-bold">✦</span>
        </div>
        <div className="absolute bottom-0 right-0 w-9 h-9 z-30 pointer-events-none bg-[#9e3d1b] border-l-2 border-t-2 border-[#ffd166] flex items-center justify-center shadow-lg">
          <span className="text-[#ffd166] text-xs font-bold">✦</span>
        </div>

        {/* =======================================================================
            TOP-LEFT: FLOATING SEARCH BUTTON 🔍
            ======================================================================= */}
        <div className="absolute top-6 left-6 z-30 flex items-center gap-2.5">
          {/* Search Button */}
          <button
            id="btn-map-search-toggle"
            onClick={() => setIsSearchOpen(prev => !prev)}
            title="Cari Objek Cagar Budaya"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#fdfbf7]/95 hover:bg-white text-stone-800 border border-stone-300 shadow-xl flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
          >
            <Search className="w-5 h-5 text-stone-700" />
          </button>

          {/* Quick Input Data Objek Budaya Button */}
          {onOpenInputData && (
            <button
              id="btn-map-input-data"
              onClick={onOpenInputData}
              title="Input Objek Budaya Baru (Tersimpan Otomatis)"
              className="h-10 sm:h-11 px-3.5 rounded-full bg-[#c85a32] hover:bg-[#b8502a] text-white border border-[#c85a32]/80 shadow-xl flex items-center gap-1.5 transition-all transform hover:scale-105 active:scale-95 cursor-pointer text-xs font-semibold"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Input Data Objek</span>
              <span className="sm:hidden">Input</span>
            </button>
          )}

          {/* Expandable Search Input Bar */}
          {isSearchOpen && (
            <div className="relative animate-in fade-in slide-in-from-left-4 duration-200">
              <div className="flex items-center bg-[#fdfbf7] rounded-full border border-stone-300 shadow-2xl pl-4 pr-2 py-1.5 w-64 sm:w-80">
                <input
                  ref={searchInputRef}
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari situs, kelurahan, tahun..."
                  className="w-full bg-transparent text-xs text-stone-800 placeholder-stone-400 focus:outline-none font-medium"
                />
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }}
                  className="p-1 rounded-full hover:bg-stone-200 text-stone-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Floating Quick Search Results */}
              {searchQuery.trim() !== '' && (
                <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 max-h-60 overflow-y-auto bg-white rounded-2xl border border-stone-200 shadow-2xl divide-y divide-stone-100 z-50">
                  {filteredSites.length > 0 ? (
                    filteredSites.map((s) => {
                      const catKey = getSiteHeritageCategory(s);
                      const catCfg = HERITAGE_CATEGORIES[catKey];
                      return (
                        <div
                          key={s.id}
                          onClick={() => handleMarkerClick(s)}
                          className="p-2.5 hover:bg-amber-50/70 transition-colors cursor-pointer flex items-center gap-2.5"
                        >
                          <div 
                            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 shadow-xs border border-white text-white p-1"
                            style={{ backgroundColor: catCfg.color }}
                            dangerouslySetInnerHTML={{ __html: getHeritageCategorySvg(catKey, 14) }}
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold text-stone-900 truncate font-serif-heading">
                              {s.title}
                            </h5>
                            <p className="text-[10px] text-stone-500 truncate">
                              {catCfg.iconEmoji} {s.kelurahan} • Th. {s.establishedYear}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-xs text-stone-500">
                      Tidak ada objek cagar budaya ditemukan.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

        {/* =======================================================================
            TOP-RIGHT: RESET VIEW BUTTON (✕)
            ======================================================================= */}
        <div className="absolute top-6 right-6 z-30">
          <button
            id="btn-map-reset-close"
            onClick={handleResetCenter}
            title="Pusatkan Kembali & Tutup Pilihan"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#fdfbf7]/95 hover:bg-white text-stone-800 border border-stone-300 shadow-xl flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
          >
            <X className="w-5 h-5 text-stone-700" />
          </button>
        </div>

        {/* =======================================================================
            MAP CANVAS: GOOGLE MAPS DEFAULT ROADMAP (STANDARD VECTOR VIEW)
            ======================================================================= */}
        <div className="w-full h-full relative z-0">
          <MapContainer
            center={[-0.6728, 119.7423]}
            zoom={zoomLevel}
            scrollWheelZoom={true}
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
            zoomControl={false}
          >
            {/* Google Maps Default Vector Roadmap Layer */}
            <TileLayer
              attribution='&copy; Google Maps'
              url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
              maxZoom={20}
              subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            />

            {/* Synchronized Camera Controller */}
            <LeafletMapController 
              centerPos={cameraCenter}
              zoomLevel={zoomLevel}
            />

            {/* 15 Satellite Pin Markers */}
            {filteredSites.map((siteItem) => {
              const isSelected = clickedSite?.id === siteItem.id;
              const catKey = getSiteHeritageCategory(siteItem);
              const icon = createHeritagePinIcon(catKey, isSelected);

              return (
                <LeafletMarker
                  key={siteItem.id}
                  position={[siteItem.coordinates.lat, siteItem.coordinates.lng]}
                  icon={icon}
                  eventHandlers={{
                    click: () => handleMarkerClick(siteItem)
                  }}
                />
              );
            })}
          </MapContainer>
        </div>

        {/* =======================================================================
            BOTTOM-LEFT: LANGUAGE TOGGLE CAPSULE (ID | EN)
            ======================================================================= */}
        <div className="absolute bottom-6 left-6 z-30">
          <div className="bg-[#fdfbf7]/95 backdrop-blur-md px-2 py-1.5 rounded-full border border-stone-300 shadow-xl flex items-center gap-1">
            <button
              id="lang-toggle-id"
              onClick={() => setLanguage('id')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                language === 'id'
                  ? 'bg-[#1c1917] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              ID
            </button>
            <button
              id="lang-toggle-en"
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-[#1c1917] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* =======================================================================
            BOTTOM-CENTER: 3 OFFICIAL INDONESIAN HERITAGE CATEGORIES FILTER PILL
            [ Semua (15) ] [ 🏺 Situs Cagar Budaya ] [ 🗺️ Kawasan Cagar Budaya ] [ 🏛️ Bangunan & Struktur ]
            ======================================================================= */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 max-w-[94%] sm:max-w-none">
          <div className="bg-[#fdfbf7]/95 backdrop-blur-md p-1.5 sm:p-2 rounded-full border border-stone-300 shadow-2xl flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            
            {/* Filter: Semua */}
            <button
              id="filter-pill-all"
              onClick={() => setActiveCategory('all')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-[#1c1917] text-white shadow-md'
                  : 'text-stone-700 hover:bg-stone-200/70'
              }`}
            >
              <span>{language === 'en' ? 'All' : 'Semua'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white font-mono">
                {sites.length}
              </span>
            </button>

            {/* Filter 1: Situs Cagar Budaya (🏺) */}
            <button
              id="filter-pill-situs"
              onClick={() => setActiveCategory('situs')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === 'situs'
                  ? 'bg-[#d97706] text-white shadow-md'
                  : 'text-stone-700 hover:bg-stone-200/70'
              }`}
            >
              <span className="text-sm">🏺</span>
              <span>
                {language === 'en' ? HERITAGE_CATEGORIES.situs.labelEn : HERITAGE_CATEGORIES.situs.labelId}
              </span>
            </button>

            {/* Filter 2: Kawasan Cagar Budaya (🗺️) */}
            <button
              id="filter-pill-kawasan"
              onClick={() => setActiveCategory('kawasan')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === 'kawasan'
                  ? 'bg-[#0284c7] text-white shadow-md'
                  : 'text-stone-700 hover:bg-stone-200/70'
              }`}
            >
              <span className="text-sm">🗺️</span>
              <span>
                {language === 'en' ? HERITAGE_CATEGORIES.kawasan.labelEn : HERITAGE_CATEGORIES.kawasan.labelId}
              </span>
            </button>

            {/* Filter 3: Bangunan & Struktur Cagar Budaya (🏛️) */}
            <button
              id="filter-pill-bangunan-struktur"
              onClick={() => setActiveCategory('bangunan_struktur')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === 'bangunan_struktur'
                  ? 'bg-[#c85a32] text-white shadow-md'
                  : 'text-stone-700 hover:bg-stone-200/70'
              }`}
            >
              <span className="text-sm">🏛️</span>
              <span>
                {language === 'en' ? HERITAGE_CATEGORIES.bangunan_struktur.labelEn : HERITAGE_CATEGORIES.bangunan_struktur.labelId}
              </span>
            </button>

          </div>
        </div>

        {/* =======================================================================
            BOTTOM-RIGHT: SHARE & INFO FLOATING CIRCULAR BUTTONS
            ======================================================================= */}
        <div className="absolute bottom-6 right-6 z-30 flex items-center gap-2.5">
          
          {/* Share Button */}
          <button
            id="btn-map-share"
            onClick={() => setIsShareModalOpen(true)}
            title="Bagikan Tautan Peta"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#fdfbf7]/95 hover:bg-white text-stone-800 border border-stone-300 shadow-xl flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
          >
            <Share2 className="w-5 h-5 text-stone-700" />
          </button>

          {/* Info Button */}
          <button
            id="btn-map-info"
            onClick={() => setIsInfoModalOpen(true)}
            title="Informasi & Legenda 3 Kategori Cagar Budaya"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#fdfbf7]/95 hover:bg-white text-stone-800 border border-stone-300 shadow-xl flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 cursor-pointer"
          >
            <Info className="w-5 h-5 text-stone-700" />
          </button>

        </div>

        {/* =======================================================================
            POP-UP / INSPECTOR CARD: ONLY DISPLAYED WHEN A LOCATION PIN IS CLICKED
            Shows: Nama Objek + Pilihan Tur 360 + Linimasa + Rute
            ======================================================================= */}
        {clickedSite && (
          <div className="absolute top-20 right-6 max-w-sm w-[90%] sm:w-80 bg-[#fdfbf7]/98 backdrop-blur-xl rounded-3xl shadow-2xl p-4 z-30 border border-stone-300 animate-in fade-in slide-in-from-top-4">
            
            {/* Header with Close Button */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span 
                  className="text-[10px] px-2 py-0.5 rounded-full font-bold text-white shadow-xs"
                  style={{ backgroundColor: activeSiteCatCfg.color }}
                >
                  {activeSiteCatCfg.iconEmoji} {activeSiteCatCfg.labelId}
                </span>
                <span className="text-[10px] text-stone-500 font-semibold">
                  Th. {clickedSite.establishedYear}
                </span>
                {visitedSiteIds.includes(clickedSite.id) ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-600/95 text-white flex items-center gap-1 shadow-xs">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Sudah Dijelajahi</span>
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-stone-200 text-stone-600">
                    Belum Dijelajahi
                  </span>
                )}
                <span className="text-[10px] text-stone-500 flex items-center gap-1 font-medium bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">
                  <Eye className="w-3 h-3 text-stone-400" />
                  <span>{formatVisitCount(visitCounts[clickedSite.id] || 0)} kunjungan</span>
                </span>
              </div>

              <button
                onClick={() => setClickedSite(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-200/60 transition-colors cursor-pointer"
                title="Tutup Kartu Objek"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail + Site Title */}
            <div className="flex items-start gap-3 mt-2.5">
              <div className="relative flex-shrink-0">
                <img
                  src={clickedSite.thumbnail || clickedSite.image}
                  alt={clickedSite.title}
                  className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <div 
                  className="absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-md border border-white p-1"
                  style={{ backgroundColor: activeSiteCatCfg.color }}
                  dangerouslySetInnerHTML={{ __html: getHeritageCategorySvg(activeSiteCatKey, 14) }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-stone-900 font-serif-heading leading-snug">
                  {clickedSite.title}
                </h4>
                <p className="text-[11px] text-stone-500 truncate mt-0.5">
                  {clickedSite.kelurahan}
                </p>
                {clickedSite.localName && (
                  <p className="text-[10px] text-stone-400 italic truncate">
                    "{clickedSite.localName}"
                  </p>
                )}
              </div>
            </div>

            <p className="mt-2.5 text-[11px] text-stone-600 line-clamp-2 leading-relaxed font-light">
              {clickedSite.briefDescription}
            </p>

            {/* 3 Primary Actions: Tur 360°, Linimasa Foto, Rute */}
            <div className="mt-3.5 grid grid-cols-3 gap-1.5">
              {/* 1. Tur 360 */}
              <button
                id="btn-popup-open-360"
                onClick={() => onOpen360Tour(clickedSite)}
                className="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl bg-[#c85a32] hover:bg-[#b8502a] text-white font-bold text-[11px] shadow-sm transition-all transform hover:scale-[1.02] cursor-pointer"
                title="Buka Penjelajahan Panorama 360°"
              >
                <Box className="w-3.5 h-3.5 flex-shrink-0 text-amber-200" />
                <span>Tur 360°</span>
              </button>

              {/* 2. Linimasa Foto */}
              <button
                id="btn-popup-open-timeline"
                onClick={() => {
                  setTimelineSite(clickedSite);
                  setSliderPosition(50);
                  setIsTimelineOpen(true);
                }}
                className="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-[11px] shadow-sm transition-all transform hover:scale-[1.02] cursor-pointer"
                title="Lihat Perbandingan Foto Masa Lampau & Masa Kini"
              >
                <History className="w-3.5 h-3.5 flex-shrink-0 text-amber-100" />
                <span>Linimasa</span>
              </button>

              {/* 3. Rute */}
              <a
                id="btn-popup-open-route"
                href={`https://www.google.com/maps/dir/?api=1&destination=${clickedSite.coordinates.lat},${clickedSite.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl bg-[#1b4332] hover:bg-[#13382c] text-[#ffd166] font-bold text-[11px] border border-[#ffd166]/40 shadow-sm transition-all transform hover:scale-[1.02] cursor-pointer"
                title="Petunjuk Arah Navigasi Rute Google Maps"
              >
                <Navigation className="w-3.5 h-3.5 flex-shrink-0 text-[#ffd166]" />
                <span>Rute</span>
              </a>
            </div>

          </div>
        )}

      </div>

      {/* =========================================================================
          MODAL 1: SHARE POPUP
          ========================================================================= */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-[#fdfbf7] rounded-3xl border border-stone-300 shadow-2xl max-w-md w-full p-6 space-y-4 relative">
            <button
              onClick={() => setIsShareModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#c85a32]/10 border border-[#c85a32]/25 flex items-center justify-center text-[#c85a32]">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 font-serif-heading">
                  Bagikan Peta Interaktif Satelit
                </h3>
                <p className="text-xs text-stone-500 font-light">
                  {activeSiteForInfo.title} • Kota Tua Donggala
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed font-light">
              Bagikan tautan jelajah cagar budaya Kota Tua Donggala kepada rekan atau wisatawan:
            </p>

            <div className="flex items-center gap-2 p-2 rounded-2xl bg-white border border-stone-300">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/?tab=map&site=${activeSiteForInfo.id}`}
                className="w-full text-xs text-stone-700 bg-transparent focus:outline-none font-mono"
              />
              <button
                onClick={handleCopyShareLink}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isCopied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#c85a32] text-white hover:bg-[#b8502a]'
                }`}
              >
                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>

            {isCopied && (
              <div className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Tautan peta berhasil disalin ke papan klip!</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: INFO & LEGENDA 3 KATEGORI CAGAR BUDAYA
          ========================================================================= */}
      {isInfoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-[#fdfbf7] rounded-3xl border border-stone-300 shadow-2xl max-w-lg w-full p-6 space-y-5 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsInfoModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#1b4332]/10 border border-[#1b4332]/30 flex items-center justify-center text-[#1b4332]">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 font-serif-heading">
                  Legenda 3 Kategori Cagar Budaya
                </h3>
                <p className="text-xs text-stone-500 font-light">
                  Kawasan Pusaka Kota Tua Donggala • FPK 2026
                </p>
              </div>
            </div>

            {/* 3 Categories Explanation */}
            <div className="space-y-3">
              {/* Category 1: Situs */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[#d97706] text-white flex items-center justify-center text-base flex-shrink-0 shadow-xs">
                  🏺
                </div>
                <div>
                  <strong className="text-stone-900 font-bold text-xs block">
                    1. Situs Cagar Budaya
                  </strong>
                  <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed font-light">
                    Lokasi yang mengandung benda, bangunan, dan/atau struktur cagar budaya sebagai hasil kegiatan manusia atau bukti peristiwa masa lalu (contoh: Kompleks Makam Raja Banawa & Lamarauna).
                  </p>
                </div>
              </div>

              {/* Category 2: Kawasan */}
              <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[#0284c7] text-white flex items-center justify-center text-base flex-shrink-0 shadow-xs">
                  🗺️
                </div>
                <div>
                  <strong className="text-stone-900 font-bold text-xs block">
                    2. Kawasan Cagar Budaya
                  </strong>
                  <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed font-light">
                    Satuan ruang geografis yang memiliki dua situs cagar budaya atau lebih yang letaknya berdekatan dan/atau memperlihatkan ciri tata ruang yang khas (contoh: Kawasan Pelabuhan Tua Boya, Kawasan Sentra Tenun Tradisional Labuan Bajo).
                  </p>
                </div>
              </div>

              {/* Category 3: Bangunan & Struktur */}
              <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[#c85a32] text-white flex items-center justify-center text-base flex-shrink-0 shadow-xs">
                  🏛️
                </div>
                <div>
                  <strong className="text-stone-900 font-bold text-xs block">
                    3. Bangunan & Struktur Cagar Budaya
                  </strong>
                  <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed font-light">
                    Susunan binaan dari batu, kayu, atau bata yang berumur sekurang-kurangnya 50 tahun dan mewakili masa gaya atau teknologi sejarah (contoh: Kantor KPM 1912, Souraja 1892, Mercusuar 1898, Rumah Asisten Residen 1905, Klenteng Jin De Yuan 1885).
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-stone-100 text-stone-600 text-xs text-center font-light">
              Peta ini dicitrakan dengan Google Maps dan divalidasi bersama Balai Pelestarian Kebudayaan Wilayah XVIII.
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: FITUR LINIMASA (KOMPARASI FOTO MASA LAMPAU VS MASA KINI)
          Menampilkan perbedaan gambar foto masa lampau dan masa kini
          ========================================================================= */}
      {isTimelineOpen && timelineSite && (
        <div 
          onPointerUp={handleSliderPointerUp}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-4xl bg-[#18181b] text-white rounded-3xl border border-stone-700 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-5 sm:px-6 py-4 bg-[#141416] border-b border-stone-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-2xl bg-[#c85a32]/20 border border-[#c85a32]/40 text-[#c85a32] flex-shrink-0">
                  <History className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base sm:text-lg font-bold text-white font-serif-heading truncate">
                      Linimasa: {timelineSite.title}
                    </h3>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                      Tahun {timelineSite.pastPhoto.year || timelineSite.establishedYear} ⇄ Masa Kini
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 font-light truncate">
                    {timelineSite.kelurahan} • {timelineSite.period}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {/* View Mode Toggle */}
                <div className="hidden sm:flex items-center bg-stone-800/80 p-1 rounded-xl border border-stone-700 text-xs">
                  <button
                    onClick={() => setComparisonMode('slider')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      comparisonMode === 'slider'
                        ? 'bg-[#c85a32] text-white'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    Geser Slider
                  </button>
                  <button
                    onClick={() => setComparisonMode('side-by-side')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      comparisonMode === 'side-by-side'
                        ? 'bg-[#c85a32] text-white'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    Berdampingan
                  </button>
                </div>

                <button
                  onClick={() => setIsTimelineOpen(false)}
                  className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
                  title="Tutup Linimasa"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
              
              {/* Site selector inside modal if visitor wants to inspect other sites */}
              <div className="flex items-center justify-between gap-2 flex-wrap bg-stone-900/90 p-2.5 rounded-2xl border border-stone-800 text-xs">
                <span className="text-stone-400 font-medium flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pilih Objek Cagar Budaya untuk Komparasi Linimasa:</span>
                </span>
                <select
                  value={timelineSite.id}
                  onChange={(e) => {
                    const found = sites.find(s => s.id === e.target.value);
                    if (found) setTimelineSite(found);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-stone-800 text-white text-xs font-semibold border border-stone-700 focus:outline-none focus:border-[#c85a32]"
                >
                  {sites.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.kelurahan.replace('Kelurahan ', '')})
                    </option>
                  ))}
                </select>
              </div>

              {/* Mode 1: Interactive Split Comparison Slider */}
              {comparisonMode === 'slider' ? (
                <div className="space-y-2">
                  <div 
                    ref={sliderContainerRef}
                    onPointerDown={handleSliderPointerDown}
                    onPointerMove={handleSliderPointerMove}
                    className="relative w-full h-[300px] sm:h-[400px] rounded-2xl overflow-hidden select-none cursor-ew-resize border border-stone-700 shadow-2xl bg-black"
                  >
                    {/* Background Layer: Foto Masa Kini */}
                    <div className="absolute inset-0 w-full h-full">
                      <img
                        src={timelineSite.currentPhoto.url}
                        alt={`Foto Masa Kini - ${timelineSite.title}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-3 right-3 bg-stone-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-stone-200 text-xs font-semibold flex items-center gap-1.5 border border-emerald-500/30">
                        <Camera className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Masa Kini: {timelineSite.currentPhoto.conditionStatus}</span>
                      </div>
                    </div>

                    {/* Foreground Layer: Foto Masa Lampau (Clipped by slider position) */}
                    <div 
                      className="absolute inset-0 h-full overflow-hidden border-r-2 border-[#d4af37] shadow-2xl"
                      style={{ width: `${sliderPosition}%` }}
                    >
                      <div 
                        className="relative w-full h-full min-w-[300px]" 
                        style={{ width: sliderContainerWidth > 0 ? `${sliderContainerWidth}px` : (sliderContainerRef.current ? `${sliderContainerRef.current.clientWidth}px` : '100%') }}
                      >
                        <img
                          src={timelineSite.pastPhoto.url}
                          alt={`Foto Masa Lampau - ${timelineSite.title}`}
                          className="w-full h-full object-cover filter grayscale contrast-125 sepia-[0.25]"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute bottom-3 left-3 bg-stone-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-amber-300 text-xs font-semibold flex items-center gap-1.5 border border-amber-500/40">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          <span>Masa Lampau ({timelineSite.pastPhoto.year || timelineSite.establishedYear})</span>
                        </div>
                      </div>
                    </div>

                    {/* Draggable Divider Handle */}
                    <div 
                      className="absolute top-0 bottom-0 w-1 bg-[#d4af37] pointer-events-none"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#d4af37] border-2 border-[#18181b] shadow-2xl flex items-center justify-center text-stone-900 font-bold">
                        <ArrowLeftRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Helpful drag instruction */}
                  <div className="text-center text-xs text-stone-400 flex items-center justify-center gap-1.5 pt-1">
                    <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" />
                    <span>Geser garis pembatas ke kiri dan kanan untuk melihat perbedaan foto masa lampau dan masa kini.</span>
                  </div>
                </div>
              ) : (
                /* Mode 2: Side-by-Side Comparison */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Past Photo Card */}
                  <div className="space-y-2">
                    <div className="relative h-[260px] sm:h-[320px] rounded-2xl overflow-hidden border border-amber-500/30 bg-black">
                      <img
                        src={timelineSite.pastPhoto.url}
                        alt={`Foto Masa Lampau - ${timelineSite.title}`}
                        className="w-full h-full object-cover filter grayscale contrast-125 sepia-[0.25]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md px-3 py-1 rounded-xl text-amber-300 text-xs font-bold border border-amber-500/40">
                        Masa Lampau ({timelineSite.pastPhoto.year || timelineSite.establishedYear})
                      </div>
                    </div>
                  </div>

                  {/* Current Photo Card */}
                  <div className="space-y-2">
                    <div className="relative h-[260px] sm:h-[320px] rounded-2xl overflow-hidden border border-emerald-500/30 bg-black">
                      <img
                        src={timelineSite.currentPhoto.url}
                        alt={`Foto Masa Kini - ${timelineSite.title}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md px-3 py-1 rounded-xl text-emerald-300 text-xs font-bold border border-emerald-500/40">
                        Masa Kini (Terkini)
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Informative Comparison Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                
                {/* Past Photo Description */}
                <div className="p-4 rounded-2xl bg-stone-900 border border-amber-500/20 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs font-serif-heading">
                    <Calendar className="w-4 h-4" />
                    <span>Catatan Sejarah Masa Lampau ({timelineSite.pastPhoto.year || timelineSite.establishedYear})</span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed font-light">
                    {timelineSite.pastPhoto.caption}
                  </p>
                  <div className="text-[10px] text-stone-400 pt-2 border-t border-stone-800">
                    <span className="font-semibold text-stone-300">Sumber Arsip:</span> {timelineSite.pastPhoto.source}
                  </div>
                </div>

                {/* Present Photo Description */}
                <div className="p-4 rounded-2xl bg-stone-900 border border-emerald-500/20 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-serif-heading">
                    <Camera className="w-4 h-4" />
                    <span>Dokumentasi Kondisi Masa Kini</span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed font-light">
                    {timelineSite.currentPhoto.caption}
                  </p>
                  <div className="text-[10px] text-stone-400 pt-2 border-t border-stone-800 flex items-center justify-between">
                    <span><span className="font-semibold text-stone-300">Status Kelestarian:</span> {timelineSite.currentPhoto.conditionStatus}</span>
                    <span className="text-emerald-400 font-mono">Terdata 2026</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
