import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { HeritageSite, HotspotPOI } from '../types';
import { 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  Compass, 
  MapPin, 
  Volume2, 
  VolumeX, 
  Info, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Share2,
  FileText,
  Headphones,
  Check,
  Copy,
  X,
  Play,
  Pause,
  ArrowLeft,
  Calendar,
  Layers,
  MessageSquareQuote,
  Eye,
  ExternalLink,
  BookOpen,
  ShieldCheck,
  Camera,
  Video,
  Film,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { VoiceNarrator } from '../services/api';
import { Soundscape } from '../services/soundscape';
import { VIRTUAL_GUIDE_DATA, VirtualGuideNarration } from '../data/virtualTourData';
import { useSiteVisitCount, formatVisitCount } from '../utils/visitTracker';
import { TalkingTourModal } from './TalkingTourModal';
import { getSiteTranscript } from '../utils/heritageBilingual';

interface Panorama360ViewerProps {
  site: HeritageSite;
  allSites: HeritageSite[];
  onSelectSite: (site: HeritageSite) => void;
  onBackToMap: () => void;
  onOpenTalkingTour?: (site: HeritageSite) => void;
  onOpenTimeSlider?: (site: HeritageSite) => void;
  onOpenDetails?: (site: HeritageSite) => void;
}

export const Panorama360Viewer: React.FC<Panorama360ViewerProps> = ({
  site,
  allSites,
  onSelectSite,
  onBackToMap,
  onOpenTalkingTour,
  onOpenTimeSlider,
  onOpenDetails
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [activeYaw, setActiveYaw] = useState(0);
  const visitCount = useSiteVisitCount(site.id);

  // Media Mode: Foto 360° vs Video 360°
  const [mediaMode, setMediaMode] = useState<'photo' | 'video'>('photo');
  const rawVideo360Url = site.video360?.url || site.panorama360?.videoUrl || '';
  const [demoVideoFallback, setDemoVideoFallback] = useState(false);
  const effectiveVideo360Url = rawVideo360Url || (demoVideoFallback ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' : '');
  const hasVideo360 = Boolean(rawVideo360Url);

  // YouTube 360 URL helper
  const getYouTubeEmbedUrl = (url?: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0&showinfo=0&modestbranding=1&enablejsapi=1`;
    }
    return null;
  };
  const youtubeEmbedUrl = getYouTubeEmbedUrl(effectiveVideo360Url);
  const isYouTubeVideo = Boolean(youtubeEmbedUrl);

  // Video 360 playback state & refs
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const videoTextureRef = useRef<THREE.VideoTexture | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [videoPlaybackRate, setVideoPlaybackRate] = useState(1);

  // Reset demo video fallback when switching site
  useEffect(() => {
    setDemoVideoFallback(false);
  }, [site.id]);

  // Video 360 Control Handlers
  const handleTogglePlayVideo = () => {
    if (!videoElementRef.current) return;
    if (videoElementRef.current.paused) {
      videoElementRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {});
    } else {
      videoElementRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  const handleSeekVideo = (time: number) => {
    if (!videoElementRef.current) return;
    videoElementRef.current.currentTime = time;
    setVideoCurrentTime(time);
  };

  const handleToggleVideoMute = () => {
    if (!videoElementRef.current) return;
    const next = !isVideoMuted;
    videoElementRef.current.muted = next;
    setIsVideoMuted(next);
  };

  const handleChangePlaybackRate = () => {
    if (!videoElementRef.current) return;
    const rates = [1, 1.25, 1.5, 2];
    const nextIdx = (rates.indexOf(videoPlaybackRate) + 1) % rates.length;
    const nextRate = rates[nextIdx];
    videoElementRef.current.playbackRate = nextRate;
    setVideoPlaybackRate(nextRate);
  };

  const formatVideoTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Soundscape & Audio Voice State
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [isSpeakingVoice, setIsSpeakingVoice] = useState(false);
  const [guideLanguage, setGuideLanguage] = useState<'id' | 'kaili'>('id');

  // Bilingual Feature State (IND / ENG) for Tanya & Jawab, Transkripsi, and Audio Transkripsi
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const [isTanyaJawabOpen, setIsTanyaJawabOpen] = useState(false);
  const [isSpeakingAudioTranscript, setIsSpeakingAudioTranscript] = useState(false);

  // Modals & Panels
  const [isVirtualGuideOpen, setIsVirtualGuideOpen] = useState(false);
  const [isTranscriptModalOpen, setIsTranscriptModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Stop voice speech on site change
  useEffect(() => {
    VoiceNarrator.stop();
    setIsSpeakingVoice(false);
    setIsSpeakingAudioTranscript(false);
  }, [site.id]);

  const handleLanguageChange = (newLang: 'id' | 'en') => {
    if (newLang === lang) return;
    setLang(newLang);
    if (isSpeakingAudioTranscript) {
      VoiceNarrator.stop();
      const transcriptInfo = getSiteTranscript(site, newLang);
      VoiceNarrator.speak(
        transcriptInfo.transcript,
        () => setIsSpeakingAudioTranscript(true),
        () => setIsSpeakingAudioTranscript(false),
        () => setIsSpeakingAudioTranscript(false),
        newLang
      );
    }
  };

  const handleToggleAudioTranscript = () => {
    if (isSpeakingAudioTranscript) {
      VoiceNarrator.stop();
      setIsSpeakingAudioTranscript(false);
    } else {
      VoiceNarrator.stop();
      setIsSpeakingVoice(false);
      const transcriptInfo = getSiteTranscript(site, lang);
      VoiceNarrator.speak(
        transcriptInfo.transcript,
        () => setIsSpeakingAudioTranscript(true),
        () => setIsSpeakingAudioTranscript(false),
        () => setIsSpeakingAudioTranscript(false),
        lang
      );
    }
  };

  // Three.js instance refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sphereMeshRef = useRef<THREE.Mesh | null>(null);
  const isUserInteractingRef = useRef(false);
  const onPointerDownPointerXRef = useRef(0);
  const onPointerDownPointerYRef = useRef(0);
  const onPointerDownLonRef = useRef(0);
  const onPointerDownLatRef = useRef(0);
  const lonRef = useRef(site.panorama360?.initialYaw || 0);
  const latRef = useRef(site.panorama360?.initialPitch || 0);
  const fovRef = useRef(75);

  // Virtual Guide narration data for current site
  const guideData: VirtualGuideNarration = VIRTUAL_GUIDE_DATA[site.id] || {
    siteId: site.id,
    idTitle: site.title,
    idGuide: 'Pemandu Sejarah Banawa',
    idTranscript: site.audioNarration?.transcript || site.briefDescription,
    kailiTitle: site.localName || site.title,
    kailiGuide: 'Toris Ntotua Banawa (Adat Kaili)',
    kailiTranscript: `Tabe! Kita nandoo ri ${site.localName || site.title}, panggagana karamat ri tana Banawa nte panggagana ntotua mbana ri Selat Makassar.`
  };

  // Initialize and play ambient soundscape (coastal breeze & waves) on component mount
  useEffect(() => {
    Soundscape.setMute(isSoundMuted);
    if (!isSoundMuted) {
      Soundscape.play();
    }
    return () => {
      Soundscape.pause();
      VoiceNarrator.stop();
    };
  }, []);

  // Sync mute state with soundscape manager
  const handleToggleSoundMute = () => {
    const nextMute = !isSoundMuted;
    setIsSoundMuted(nextMute);
    Soundscape.setMute(nextMute);
    if (nextMute && isSpeakingVoice) {
      VoiceNarrator.stop();
      setIsSpeakingVoice(false);
    }
  };

  // Setup Three.js 360 Panorama Viewport
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    lonRef.current = site.panorama360?.initialYaw || 0;
    latRef.current = site.panorama360?.initialPitch || 0;
    fovRef.current = 75;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    const camera = new THREE.PerspectiveCamera(fovRef.current, width / height, 1, 1100);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const geometry = new THREE.SphereGeometry(500, 64, 48);
    geometry.scale(-1, 1, 1);

    // Dynamic rich panoramic atmosphere generator with authentic Donggala architectural and coastal aesthetics
    const createPanoramicAtmosphere = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Dramatic dusk sky & golden hour glow over Makassar Strait
        const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.55);
        skyGrad.addColorStop(0, '#0c1a2e'); // Midnight maritime navy
        skyGrad.addColorStop(0.3, '#1a365d'); // Coastal twilight blue
        skyGrad.addColorStop(0.55, '#c85a32'); // Warm terracotta horizon
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height * 0.55);

        // Water & coastal reflection gradient
        const seaGrad = ctx.createLinearGradient(0, canvas.height * 0.55, 0, canvas.height);
        seaGrad.addColorStop(0, '#0f2942'); // Shallow coastal turquoise-blue
        seaGrad.addColorStop(0.2, '#081726'); // Deep Selat Makassar
        seaGrad.addColorStop(1, '#1c1917'); // Dark wooden dock floor / stone ground
        ctx.fillStyle = seaGrad;
        ctx.fillRect(0, canvas.height * 0.55, canvas.width, canvas.height * 0.45);

        // Distant hills of Tanjung Batu & Kaap Banawa Peninsula
        ctx.fillStyle = '#081420';
        ctx.beginPath();
        ctx.moveTo(0, canvas.height * 0.55);
        for (let x = 0; x <= canvas.width; x += 20) {
          const h = canvas.height * 0.55 - (Math.sin(x * 0.008) * 45 + Math.cos(x * 0.015) * 25 + 20);
          ctx.lineTo(x, h);
        }
        ctx.lineTo(canvas.width, canvas.height * 0.55);
        ctx.fill();

        // Architectural Silhouettes & Traditional Timber/Colonial Rooflines
        ctx.fillStyle = '#050c14';
        // Traditional Souraja & Colonial Gable roofs
        ctx.beginPath();
        ctx.moveTo(120, canvas.height * 0.55);
        ctx.lineTo(200, canvas.height * 0.42);
        ctx.lineTo(280, canvas.height * 0.55);
        ctx.fill();

        // Lighthouse tower silhouette
        ctx.fillRect(850, canvas.height * 0.35, 30, canvas.height * 0.2);
        ctx.beginPath();
        ctx.arc(865, canvas.height * 0.35, 22, Math.PI, 0);
        ctx.fill();

        // Historic harbor wooden pier / Jetty pillars
        ctx.fillStyle = '#171412';
        for (let x = 0; x < canvas.width; x += 80) {
          ctx.fillRect(x, canvas.height * 0.7, 14, canvas.height * 0.3);
        }
        ctx.fillRect(0, canvas.height * 0.7, canvas.width, 24);

        // Atmospheric Stars & Evening Lanterns
        ctx.fillStyle = '#fbbf24';
        for (let i = 0; i < 180; i++) {
          const sx = (i * 137.5) % canvas.width;
          const sy = (i * 93.3) % (canvas.height * 0.4);
          ctx.beginPath();
          ctx.arc(sx, sy, (i % 3 === 0 ? 1.8 : 1.0), 0, Math.PI * 2);
          ctx.fill();
        }

        // Title watermark text on sphere
        ctx.font = 'bold 32px "Playfair Display", Georgia, serif';
        ctx.fillStyle = 'rgba(212, 175, 55, 0.45)';
        ctx.textAlign = 'center';
        ctx.fillText(`Panorama 360° • ${site.title} (${site.kelurahan})`, canvas.width / 2, canvas.height * 0.5);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const textureLoader = new THREE.TextureLoader();
    let material: THREE.MeshBasicMaterial;

    if (mediaMode === 'video' && !isYouTubeVideo && effectiveVideo360Url) {
      // 360 Video equirectangular spherical playback
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.playsInline = true;
      video.loop = true;
      video.muted = isVideoMuted;
      video.src = effectiveVideo360Url;
      video.autoplay = true;
      videoElementRef.current = video;

      const videoTexture = new THREE.VideoTexture(video);
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;
      videoTexture.format = THREE.RGBAFormat;
      videoTextureRef.current = videoTexture;

      material = new THREE.MeshBasicMaterial({ map: videoTexture });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      sphereMeshRef.current = mesh;

      video.play().then(() => {
        setIsVideoPlaying(true);
      }).catch((e) => {
        console.warn('Autoplay video 360 ditahan oleh browser:', e);
        setIsVideoPlaying(false);
      });

      const onTimeUpdate = () => {
        setVideoCurrentTime(video.currentTime);
        setVideoDuration(video.duration || 0);
      };
      video.addEventListener('timeupdate', onTimeUpdate);
      video.addEventListener('loadedmetadata', () => {
        setVideoDuration(video.duration || 0);
      });
      video.addEventListener('play', () => setIsVideoPlaying(true));
      video.addEventListener('pause', () => setIsVideoPlaying(false));
    } else {
      // 360 Photo standard texture
      const texture = textureLoader.load(
        site.panorama360?.url || site.bannerImage,
        () => {
          renderer.render(scene, camera);
        },
        undefined,
        () => {
          if (sphereMeshRef.current) {
            sphereMeshRef.current.material = new THREE.MeshBasicMaterial({
              map: createPanoramicAtmosphere()
            });
          }
        }
      );

      material = new THREE.MeshBasicMaterial({ map: texture });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      sphereMeshRef.current = mesh;
    }

    // Pointer Interaction Handlers
    const onPointerDown = (event: PointerEvent) => {
      if (event.isPrimary === false) return;
      isUserInteractingRef.current = true;
      onPointerDownPointerXRef.current = event.clientX;
      onPointerDownPointerYRef.current = event.clientY;
      onPointerDownLonRef.current = lonRef.current;
      onPointerDownLatRef.current = latRef.current;
      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.isPrimary === false) return;
      lonRef.current = (onPointerDownPointerXRef.current - event.clientX) * 0.15 + onPointerDownLonRef.current;
      latRef.current = (event.clientY - onPointerDownPointerYRef.current) * 0.15 + onPointerDownLatRef.current;
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.isPrimary === false) return;
      isUserInteractingRef.current = false;
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      fovRef.current = Math.max(30, Math.min(100, fovRef.current + event.deltaY * 0.05));
      if (cameraRef.current) {
        cameraRef.current.fov = fovRef.current;
        cameraRef.current.updateProjectionMatrix();
      }
    };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    });
    resizeObserver.observe(container);

    // Animation Render Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isUserInteractingRef.current && isAutoRotate) {
        lonRef.current += 0.07;
      }

      latRef.current = Math.max(-85, Math.min(85, latRef.current));
      const phi = THREE.MathUtils.degToRad(90 - latRef.current);
      const theta = THREE.MathUtils.degToRad(lonRef.current);

      const targetX = 500 * Math.sin(phi) * Math.cos(theta);
      const targetY = 500 * Math.cos(phi);
      const targetZ = 500 * Math.sin(phi) * Math.sin(theta);

      if (cameraRef.current) {
        cameraRef.current.lookAt(targetX, targetY, targetZ);
        rendererRef.current?.render(scene, cameraRef.current);
      }

      setActiveYaw(Math.round(((lonRef.current % 360) + 360) % 360));
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('wheel', onWheel);
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
      if (videoElementRef.current) {
        videoElementRef.current.pause();
        videoElementRef.current.removeAttribute('src');
        videoElementRef.current.load();
        videoElementRef.current = null;
      }
      if (videoTextureRef.current) {
        videoTextureRef.current.dispose();
        videoTextureRef.current = null;
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [site, isAutoRotate, mediaMode, effectiveVideo360Url, isYouTubeVideo]);

  // Fullscreen Handler
  const toggleFullscreen = () => {
    if (!containerRef.current?.parentElement) return;
    if (!document.fullscreenElement) {
      containerRef.current.parentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Zoom Handler
  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    fovRef.current = Math.max(30, Math.min(100, fovRef.current + (direction === 'in' ? -12 : 12)));
    cameraRef.current.fov = fovRef.current;
    cameraRef.current.updateProjectionMatrix();
  };

  // Virtual Guide Audio Narration Handler
  const handleToggleVoiceNarration = () => {
    if (isSpeakingVoice) {
      VoiceNarrator.stop();
      setIsSpeakingVoice(false);
    } else {
      // If authentic audio file is specified from Google Sheets/Drive, play it
      if (site.audioNarration?.audioUrl) {
        const audio = new Audio(site.audioNarration.audioUrl);
        audio.play().then(() => {
          setIsSpeakingVoice(true);
        }).catch(() => {
          const textToSpeak = guideLanguage === 'id' ? guideData.idTranscript : guideData.kailiTranscript;
          VoiceNarrator.speak(
            textToSpeak,
            () => setIsSpeakingVoice(true),
            () => setIsSpeakingVoice(false),
            () => setIsSpeakingVoice(false),
            'id'
          );
        });
        audio.onended = () => setIsSpeakingVoice(false);
        return;
      }

      const textToSpeak = guideLanguage === 'id' ? guideData.idTranscript : guideData.kailiTranscript;
      VoiceNarrator.speak(
        textToSpeak,
        () => setIsSpeakingVoice(true),
        () => setIsSpeakingVoice(false),
        () => setIsSpeakingVoice(false),
        'id'
      );
    }
  };

  // Share Link Handler
  const handleCopyShareLink = () => {
    const url = `${window.location.origin}/?tab=tour360&site=${site.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    });
  };

  const currentIndex = allSites.findIndex(s => s.id === site.id);
  const prevSite = allSites[(currentIndex - 1 + allSites.length) % allSites.length];
  const nextSite = allSites[(currentIndex + 1) % allSites.length];

  return (
    <div className="relative w-full h-[640px] sm:h-[720px] lg:h-[780px] bg-[#0c0d0e] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#1b4332] select-none flex flex-col">
      
      {/* =========================================================================
          BINGKAI ETNIK: Motif Khas Tenun Donggala (Buya Sabe / Suba Motif)
          ========================================================================= */}
      {/* Top Border Ribbon */}
      <div className="absolute top-0 left-0 right-0 h-3.5 z-30 pointer-events-none overflow-hidden bg-[#1b4332] flex items-center justify-center border-b border-[#d4af37]/40 shadow-xs">
        <svg className="w-full h-full" preserveAspectRatio="repeat-x" viewBox="0 0 200 14">
          <defs>
            <pattern id="tenunPanoTop" width="24" height="14" patternUnits="userSpaceOnUse">
              <polygon points="12,1 23,7 12,13 1,7" fill="#c85a32" stroke="#d4af37" strokeWidth="0.75" />
              <polygon points="12,3 19,7 12,11 5,7" fill="#1b4332" />
              <circle cx="12" cy="7" r="1.5" fill="#d4af37" />
              <polygon points="0,0 3,7 0,14" fill="#d4af37" opacity="0.6" />
              <polygon points="24,0 21,7 24,14" fill="#d4af37" opacity="0.6" />
            </pattern>
          </defs>
          <rect width="100%" height="14" fill="url(#tenunPanoTop)" />
        </svg>
      </div>

      {/* Bottom Border Ribbon */}
      <div className="absolute bottom-0 left-0 right-0 h-3.5 z-30 pointer-events-none overflow-hidden bg-[#1b4332] flex items-center justify-center border-t border-[#d4af37]/40 shadow-xs">
        <svg className="w-full h-full" preserveAspectRatio="repeat-x" viewBox="0 0 200 14">
          <rect width="100%" height="14" fill="url(#tenunPanoTop)" />
        </svg>
      </div>

      {/* Left Border */}
      <div className="absolute top-3.5 bottom-3.5 left-0 w-3 z-30 pointer-events-none overflow-hidden bg-[#1b4332] border-r border-[#d4af37]/40">
        <svg className="w-full h-full" preserveAspectRatio="repeat-y" viewBox="0 0 12 200">
          <defs>
            <pattern id="tenunPanoSide" width="12" height="24" patternUnits="userSpaceOnUse">
              <polygon points="1,12 6,1 11,12 6,23" fill="#c85a32" stroke="#d4af37" strokeWidth="0.75" />
              <circle cx="6" cy="12" r="1.2" fill="#d4af37" />
            </pattern>
          </defs>
          <rect width="12" height="100%" fill="url(#tenunPanoSide)" />
        </svg>
      </div>

      {/* Right Border */}
      <div className="absolute top-3.5 bottom-3.5 right-0 w-3 z-30 pointer-events-none overflow-hidden bg-[#1b4332] border-l border-[#d4af37]/40">
        <svg className="w-full h-full" preserveAspectRatio="repeat-y" viewBox="0 0 12 200">
          <rect width="12" height="100%" fill="url(#tenunPanoSide)" />
        </svg>
      </div>

      {/* Four Tenun Gold Rosettes (Tumpal Sudut Emas) */}
      <div className="absolute top-0 left-0 w-9 h-9 z-40 pointer-events-none bg-[#13382c] border-r-2 border-b-2 border-[#d4af37] flex items-center justify-center shadow-md">
        <span className="text-[#d4af37] text-xs font-bold">◈</span>
      </div>
      <div className="absolute top-0 right-0 w-9 h-9 z-40 pointer-events-none bg-[#13382c] border-l-2 border-b-2 border-[#d4af37] flex items-center justify-center shadow-md">
        <span className="text-[#d4af37] text-xs font-bold">◈</span>
      </div>
      <div className="absolute bottom-0 left-0 w-9 h-9 z-40 pointer-events-none bg-[#13382c] border-r-2 border-t-2 border-[#d4af37] flex items-center justify-center shadow-md">
        <span className="text-[#d4af37] text-xs font-bold">◈</span>
      </div>
      <div className="absolute bottom-0 right-0 w-9 h-9 z-40 pointer-events-none bg-[#13382c] border-l-2 border-t-2 border-[#d4af37] flex items-center justify-center shadow-md">
        <span className="text-[#d4af37] text-xs font-bold">◈</span>
      </div>

      {/* =========================================================================
          360 WEBGL THREE.JS CANVAS CONTAINER
          ========================================================================= */}
      <div 
        ref={containerRef} 
        className={`w-full flex-1 cursor-grab active:cursor-grabbing relative ${
          mediaMode === 'video' && isYouTubeVideo ? 'hidden' : ''
        }`}
      />

      {/* YouTube 360 Video Player (Ketika tautan YouTube 360 terdeteksi) */}
      {mediaMode === 'video' && isYouTubeVideo && (
        <div className="absolute inset-0 z-20 bg-black flex flex-col">
          <iframe
            src={youtubeEmbedUrl!}
            title={`Tur Video 360 ${site.title}`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; vr"
            allowFullScreen
          />
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none bg-[#13382c]/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#d4af37]/50 shadow-xl flex items-center gap-2 text-xs text-[#ffd166]">
            <RotateCw className="w-3.5 h-3.5 animate-spin text-[#d4af37]" />
            <span className="font-semibold">Format Video 360° YouTube: Geser mouse atau layar untuk melihat sekeliling!</span>
          </div>
        </div>
      )}

      {/* Video 360 Empty State (Ketika belum ada URL video) */}
      {mediaMode === 'video' && !effectiveVideo360Url && (
        <div className="absolute inset-0 z-20 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 text-center">
          <div className="max-w-md p-6 sm:p-8 rounded-3xl bg-[#13382c]/95 border-2 border-[#d4af37]/60 shadow-2xl space-y-4 text-stone-200">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto shadow-inner">
              <Video className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white font-serif-heading">
                Video 360° Belum Ditambahkan
              </h3>
              <p className="text-xs text-stone-300 mt-1.5 leading-relaxed">
                Situs <strong className="text-[#ffd166]">{site.title}</strong> belum memiliki tautan Video 360 pada database Google Sheets.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-[#d4af37]/30 text-[11px] text-stone-300 text-left space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-emerald-400">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Cara Memperbarui via Google Sheets:</span>
              </div>
              <p className="text-stone-400 leading-relaxed">
                Buka tab <strong className="text-stone-200">Situs_Cagar_Budaya</strong> di Google Sheets, lalu isi kolom <code className="text-[#ffd166] bg-stone-900 px-1.5 py-0.5 rounded font-mono">video360_url</code> dengan tautan video MP4 360 atau YouTube 360.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <button
                id="btn-sample-video-360"
                onClick={() => setDemoVideoFallback(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Putar Video 360° Sampel</span>
              </button>
              <button
                onClick={() => setMediaMode('photo')}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 text-xs font-semibold transition-all border border-white/20 cursor-pointer"
              >
                Kembali ke Foto 360°
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          NAVIGASI: TOMBOL '< KEMBALI KE PETA' (POJOK KIRI ATAS)
          ========================================================================= */}
      <div className="absolute top-6 left-6 z-30 pointer-events-auto">
        <button
          id="btn-back-to-map"
          onClick={onBackToMap}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 hover:bg-white text-stone-800 hover:text-[#c85a32] text-xs font-bold shadow-xl border border-stone-300/80 backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#c85a32] transition-transform group-hover:-translate-x-1" />
          <span className="tracking-wide uppercase text-[11px] font-extrabold">&lt; KEMBALI KE PETA</span>
        </button>
      </div>

      {/* =========================================================================
          TOP-CENTER MEDIA SWITCHER: FOTO 360° ↔ VIDEO 360°
          ========================================================================= */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
        <div className="flex items-center p-1 rounded-full bg-[#13382c]/95 backdrop-blur-md border-2 border-[#d4af37]/70 shadow-2xl">
          <button
            id="btn-mode-photo-360"
            onClick={() => setMediaMode('photo')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              mediaMode === 'photo'
                ? 'bg-[#c85a32] text-white shadow-lg border border-[#d4af37]/50'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Foto 360°</span>
          </button>

          <button
            id="btn-mode-video-360"
            onClick={() => setMediaMode('video')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              mediaMode === 'video'
                ? 'bg-rose-600 text-white shadow-lg border border-rose-400/50'
                : 'text-stone-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Video 360°</span>
            {hasVideo360 ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" title="Video 360 Tersedia di Database" />
            ) : (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Sheets
              </span>
            )}
          </button>
        </div>
      </div>

      {/* =========================================================================
          TOP-RIGHT CONTROLS: Camera Tools & Quick Modals
          ========================================================================= */}
      <div className="absolute top-6 right-6 z-30 flex items-center gap-2 pointer-events-auto">
        
        {/* Auto-Rotate Toggle */}
        <button
          onClick={() => setIsAutoRotate(!isAutoRotate)}
          className={`p-2.5 rounded-xl border backdrop-blur-md transition-all cursor-pointer shadow-md ${
            isAutoRotate
              ? 'bg-[#1b4332] text-[#d4af37] border-[#d4af37]'
              : 'bg-black/60 text-stone-300 border-white/15 hover:bg-black/80'
          }`}
          title={isAutoRotate ? 'Jeda Putaran Otomatis' : 'Aktifkan Putaran Otomatis 360°'}
        >
          <RotateCw className={`w-4 h-4 ${isAutoRotate ? 'animate-spin' : ''}`} />
        </button>

        {/* Zoom In & Out */}
        <div className="hidden sm:flex items-center bg-black/60 backdrop-blur-md rounded-xl border border-white/15 p-1 shadow-md">
          <button
            onClick={() => handleZoom('in')}
            className="p-1.5 text-stone-200 hover:text-[#d4af37] transition-colors cursor-pointer"
            title="Perbesar Pandangan"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="w-[1px] h-4 bg-white/20" />
          <button
            onClick={() => handleZoom('out')}
            className="p-1.5 text-stone-200 hover:text-[#d4af37] transition-colors cursor-pointer"
            title="Perkecil Pandangan"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Compass Angle Yaw */}
        <div className="hidden sm:flex items-center gap-1 px-3 py-2 rounded-xl bg-black/60 border border-white/15 backdrop-blur-md text-[#d4af37] text-xs font-mono shadow-md">
          <Compass className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>{activeYaw}°</span>
        </div>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-2.5 rounded-xl bg-black/60 hover:bg-black/80 text-stone-200 border border-white/15 backdrop-blur-md transition-all cursor-pointer shadow-md"
          title="Layar Penuh"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

      </div>

      {/* =========================================================================
          FLOATING VIDEO 360 CONTROLLER (KETIKA MODE VIDEO 360 AKTIF)
          ========================================================================= */}
      {mediaMode === 'video' && !isYouTubeVideo && effectiveVideo360Url && (
        <div className="absolute bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto max-w-[95%] sm:max-w-xl w-full px-3">
          <div className="bg-[#13382c]/95 backdrop-blur-xl p-3 sm:p-4 rounded-3xl border-2 border-[#d4af37]/70 shadow-2xl space-y-2.5 text-white">
            
            {/* Top row: Title & Duration */}
            <div className="flex items-center justify-between text-xs gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping flex-shrink-0" />
                <span className="font-bold text-[#ffd166] truncate font-serif-heading">
                  {site.video360?.title || `Tur Video 360° • ${site.title}`}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-stone-300 font-mono flex-shrink-0">
                {formatVideoTime(videoCurrentTime)} / {formatVideoTime(videoDuration)}
              </span>
            </div>

            {/* Timeline Progress Bar / Scrubber */}
            <div className="relative flex items-center">
              <input
                type="range"
                min="0"
                max={videoDuration || 100}
                step="0.1"
                value={videoCurrentTime}
                onChange={(e) => handleSeekVideo(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-rose-500 focus:outline-hidden"
              />
            </div>

            {/* Controls Bar: Play, Seek, Volume, Speed, Reset Yaw */}
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  id="btn-video-play-pause"
                  onClick={handleTogglePlayVideo}
                  className="w-9 h-9 rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer"
                  title={isVideoPlaying ? 'Jeda Video 360' : 'Putar Video 360'}
                >
                  {isVideoPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                </button>

                <button
                  id="btn-video-mute-toggle"
                  onClick={handleToggleVideoMute}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 flex items-center justify-center transition-all cursor-pointer"
                  title={isVideoMuted ? 'Bunyikan Audio Video' : 'Bisukan Audio Video'}
                >
                  {isVideoMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-stone-200" />}
                </button>

                <button
                  id="btn-video-speed"
                  onClick={handleChangePlaybackRate}
                  className="px-2.5 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 text-xs font-mono font-bold transition-all cursor-pointer"
                  title="Kecepatan Pemutaran Video"
                >
                  {videoPlaybackRate}x
                </button>
              </div>

              {/* 360 Orientation Helper & Reset View */}
              <div className="flex items-center gap-2">
                <span className="hidden md:inline text-[11px] text-[#d4af37] italic">
                  Geser kursor untuk sudut 360°
                </span>
                <button
                  id="btn-video-reset-view"
                  onClick={() => {
                    lonRef.current = site.panorama360?.initialYaw || 0;
                    latRef.current = site.panorama360?.initialPitch || 0;
                    setActiveYaw(lonRef.current);
                  }}
                  className="px-3 h-9 rounded-xl bg-[#c85a32]/80 hover:bg-[#c85a32] text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-[#d4af37]/40 cursor-pointer shadow-md"
                  title="Reset Sudut Pandang ke Arah Depan (0°)"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset Sudut</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          BOTTOM-LEFT: Navigasi Carousel Antar 15 Situs Kota Tua
          ========================================================================= */}
      <div className="absolute bottom-6 left-6 z-30 pointer-events-auto hidden sm:flex items-center gap-2 bg-[#13382c]/90 backdrop-blur-md p-1.5 rounded-2xl border border-[#d4af37]/40 shadow-2xl">
        <button
          onClick={() => onSelectSite(prevSite)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#f5efe6] text-xs font-medium transition-colors cursor-pointer"
          title={`Sebelumnya: ${prevSite.title}`}
        >
          <ChevronLeft className="w-4 h-4 text-[#d4af37]" />
          <span className="hidden lg:inline">{prevSite.title.slice(0, 14)}...</span>
        </button>

        <span className="text-xs text-[#d4af37] px-2 font-mono font-bold">
          {currentIndex + 1} / {allSites.length}
        </span>

        <button
          onClick={() => onSelectSite(nextSite)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#f5efe6] text-xs font-medium transition-colors cursor-pointer"
          title={`Selanjutnya: ${nextSite.title}`}
        >
          <span className="hidden lg:inline">{nextSite.title.slice(0, 14)}...</span>
          <ChevronRight className="w-4 h-4 text-[#d4af37]" />
        </button>
      </div>

      {/* =========================================================================
          KONSOL FITUR BINGKAI 360 (MELAYANG DI KANAN BAWAH)
          Fitur Utama:
          - Pilihan Bahasa: [ IND | ENG ]
          - Ikon 1: Tanya & Jawab
          - Ikon 2: Transkripsi
          - Ikon 3: Audio Transkripsi
          - Ikon 4: Bagikan
          ========================================================================= */}
      <div className="absolute bottom-6 right-6 z-30 pointer-events-auto flex items-center gap-2 sm:gap-2.5 bg-[#0d1f19]/95 backdrop-blur-md p-2 rounded-full border-2 border-[#d4af37]/70 shadow-2xl">
        
        {/* Pilihan Bahasa: IND & ENG */}
        <div className="flex items-center p-0.5 rounded-full bg-black/50 border border-white/15">
          <button
            id="btn-lang-ind"
            onClick={() => handleLanguageChange('id')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              lang === 'id'
                ? 'bg-[#c85a32] text-white shadow-xs'
                : 'text-stone-300 hover:text-white'
            }`}
            title="Pilih Bahasa Indonesia (IND)"
          >
            IND
          </button>
          <button
            id="btn-lang-eng"
            onClick={() => handleLanguageChange('en')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              lang === 'en'
                ? 'bg-[#0f4c81] text-white shadow-xs'
                : 'text-stone-300 hover:text-white'
            }`}
            title="Select English Language (ENG)"
          >
            ENG
          </button>
        </div>

        <div className="w-[1px] h-6 bg-white/20" />

        {/* 1. Ikon Tanya & Jawab */}
        <div className="relative group">
          <button
            id="btn-tanya-jawab-360"
            onClick={() => setIsTanyaJawabOpen(true)}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white shadow-lg border-2 transition-all duration-300 cursor-pointer ${
              isTanyaJawabOpen
                ? 'bg-[#c85a32] border-[#ffd166] ring-4 ring-[#c85a32]/40 scale-105'
                : 'bg-[#1b4332] hover:bg-[#13382c] border-[#d4af37] hover:scale-105'
            }`}
            title={lang === 'id' ? 'Tanya & Jawab' : 'Q & A'}
          >
            <HelpCircle className="w-5 h-5 text-[#ffd166]" />
          </button>
          
          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-stone-900/95 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-lg border border-stone-700 pointer-events-none">
            {lang === 'id' ? 'Tanya & Jawab' : 'Q & A'}
          </div>
        </div>

        {/* 2. Ikon Transkripsi */}
        <div className="relative group">
          <button
            id="btn-transkripsi-360"
            onClick={() => setIsTranscriptModalOpen(true)}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white shadow-lg border-2 transition-all duration-300 cursor-pointer ${
              isTranscriptModalOpen
                ? 'bg-[#c85a32] border-[#ffd166] ring-4 ring-[#c85a32]/40 scale-105'
                : 'bg-[#1b4332] hover:bg-[#13382c] border-[#d4af37] hover:scale-105'
            }`}
            title={lang === 'id' ? 'Transkripsi' : 'Transcript'}
          >
            <FileText className="w-5 h-5 text-[#d4af37]" />
          </button>

          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-stone-900/95 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-lg border border-stone-700 pointer-events-none">
            {lang === 'id' ? 'Transkripsi' : 'Transcript'}
          </div>
        </div>

        {/* 3. Ikon Audio Transkripsi */}
        <div className="relative group">
          <button
            id="btn-audio-transkripsi-360"
            onClick={handleToggleAudioTranscript}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white shadow-lg border-2 transition-all duration-300 cursor-pointer ${
              isSpeakingAudioTranscript
                ? 'bg-[#c85a32] border-[#ffd166] ring-4 ring-[#c85a32]/50 scale-105'
                : 'bg-[#1b4332] hover:bg-[#13382c] border-[#d4af37] hover:scale-105'
            }`}
            title={
              isSpeakingAudioTranscript
                ? (lang === 'id' ? 'Hentikan Audio Transkripsi' : 'Pause Audio Transcript')
                : (lang === 'id' ? 'Putar Audio Transkripsi' : 'Play Audio Transcript')
            }
          >
            {isSpeakingAudioTranscript ? (
              <Pause className="w-5 h-5 text-white animate-pulse" />
            ) : (
              <Headphones className="w-5 h-5 text-[#d4af37]" />
            )}
          </button>

          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-stone-900/95 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-lg border border-stone-700 pointer-events-none">
            {lang === 'id' ? 'Audio Transkripsi' : 'Audio Transcript'} ({lang.toUpperCase()})
          </div>
        </div>

        {/* 4. Ikon Bagikan */}
        <div className="relative group">
          <button
            id="btn-bagikan-360"
            onClick={() => setIsShareModalOpen(true)}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1b4332] hover:bg-[#13382c] flex items-center justify-center text-white shadow-lg border-2 border-[#d4af37] hover:scale-105 transition-all duration-300 cursor-pointer"
            title={lang === 'id' ? 'Bagikan' : 'Share'}
          >
            <Share2 className="w-5 h-5 text-[#d4af37]" />
          </button>

          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-stone-900/95 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-lg border border-stone-700 pointer-events-none">
            {lang === 'id' ? 'Bagikan' : 'Share'}
          </div>
        </div>

      </div>

      {/* =========================================================================
          POPUP MODAL: TRANSKRIPSI SEJARAH (Dwibahasa: IND & ENG)
          ========================================================================= */}
      {isTranscriptModalOpen && (() => {
        const transcriptInfo = getSiteTranscript(site, lang);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in text-stone-900">
            <div className="w-full max-w-2xl max-h-[88vh] overflow-y-auto bg-[#faf8f5] rounded-3xl border-4 border-[#1b4332] shadow-2xl p-6 sm:p-8 relative">
              
              {/* Close Button */}
              <button
                onClick={() => setIsTranscriptModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header Badge & Language Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pr-10">
                <div className="flex items-center gap-2 text-xs text-[#0f4c81] font-bold uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-[#c85a32]" />
                  <span>
                    {lang === 'id' 
                      ? 'Arsip Transkripsi Sejarah Donggala' 
                      : 'Historical Transcript of Donggala'}
                  </span>
                </div>

                {/* Inline Language Selector */}
                <div className="flex items-center p-0.5 rounded-xl bg-stone-200 border border-stone-300 text-xs">
                  <button
                    onClick={() => handleLanguageChange('id')}
                    className={`px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                      lang === 'id' ? 'bg-[#c85a32] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    IND
                  </button>
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                      lang === 'en' ? 'bg-[#0f4c81] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    ENG
                  </button>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold font-serif-heading text-[#1c1917]">
                {site.title}
              </h2>
              
              <p className="text-xs text-[#c85a32] font-semibold mt-0.5">
                {site.localName ? `Nama Lokal: ${site.localName} • ` : ''}
                {lang === 'id' ? 'Tahun Pendirian' : 'Established'}: {site.establishedYear} • {site.kelurahan}
              </p>

              {/* Audio Transcript Highlight Card */}
              <div className="mt-4 p-4 rounded-2xl bg-[#13382c] border-2 border-[#d4af37]/60 text-stone-100 shadow-md space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-bold text-[#ffd166] font-serif-heading">
                    <Headphones className="w-4 h-4 text-[#d4af37]" />
                    <span>{transcriptInfo.speaker}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#d4af37] font-mono font-semibold">
                    {transcriptInfo.duration}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-100 italic leading-relaxed font-light">
                  "{transcriptInfo.transcript}"
                </p>
              </div>

              {/* Full Context Story */}
              <div className="mt-5 space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
                <div>
                  <h4 className="font-bold text-stone-900 font-serif-heading text-sm mb-1.5 text-[#0f4c81]">
                    {lang === 'id' ? 'Signifikansi Sejarah:' : 'Historical Significance:'}
                  </h4>
                  <p>{site.historicalSignificance}</p>
                </div>

                <div>
                  <h4 className="font-bold text-stone-900 font-serif-heading text-sm mb-1.5 text-[#15803d]">
                    {lang === 'id' ? 'Karakter Arsitektur & Material:' : 'Architectural Style & Materials:'}
                  </h4>
                  <p>{site.architecturalStyle}</p>
                </div>

                <div>
                  <h4 className="font-bold text-stone-900 font-serif-heading text-sm mb-1.5 text-[#c85a32]">
                    {lang === 'id' ? 'Peran Maritim Selat Makassar:' : 'Makassar Strait Maritime Role:'}
                  </h4>
                  <p>{site.maritimeRelevance}</p>
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-6 pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleToggleAudioTranscript}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs cursor-pointer shadow-md transition-all ${
                      isSpeakingAudioTranscript
                        ? 'bg-[#c85a32] text-white ring-2 ring-[#ffd166]'
                        : 'bg-[#1b4332] hover:bg-[#13382c] text-white'
                    }`}
                  >
                    {isSpeakingAudioTranscript ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>{lang === 'id' ? 'Hentikan Audio' : 'Pause Audio Transcript'}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-[#ffd166]" />
                        <span>
                          {lang === 'id' 
                            ? 'Dengarkan Audio Transkripsi' 
                            : `Listen to Audio Transcript (${lang.toUpperCase()})`}
                        </span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={() => setIsTranscriptModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold cursor-pointer"
                >
                  {lang === 'id' ? 'Tutup' : 'Close'}
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* =========================================================================
          POPUP MODAL: TANYA & JAWAB (Dwibahasa: IND & ENG, Topik Terkurasi)
          ========================================================================= */}
      <TalkingTourModal
        site={site}
        allSites={allSites}
        isOpen={isTanyaJawabOpen}
        onClose={() => setIsTanyaJawabOpen(false)}
        onSelectSite={onSelectSite}
        initialLang={lang}
      />

      {/* =========================================================================
          POPUP MODAL 4: BAGIKAN KE MEDIA SOSIAL (Social Media Share Dialog)
          ========================================================================= */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl border-4 border-[#1b4332] shadow-2xl p-6 relative text-stone-900">
            
            <button
              onClick={() => setIsShareModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs text-[#c85a32] font-bold uppercase tracking-wider mb-1">
              <Share2 className="w-4 h-4" />
              <span>Bagikan Situs Sejarah</span>
            </div>

            <h3 className="text-lg font-bold font-serif-heading text-[#1c1917]">
              {site.title}
            </h3>

            <p className="text-xs text-stone-600 mt-1">
              Ajak sahabat, peneliti, dan wisatawan menjelajah panorama 360° cagar budaya Kota Tua Donggala:
            </p>

            {/* URL Copy Field */}
            <div className="mt-4 flex items-center gap-2 p-2 bg-stone-100 rounded-xl border border-stone-200">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/?tab=tour360&site=${site.id}`}
                className="flex-1 bg-transparent text-xs text-stone-800 font-mono focus:outline-none truncate"
              />
              <button
                onClick={handleCopyShareLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#c85a32] hover:bg-[#b8502a] text-white text-xs font-bold cursor-pointer shadow-xs transition-colors"
              >
                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>

            {/* Social Share Buttons */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
              
              {/* WhatsApp */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Jelajahi panorama 360° ${site.title} di Kota Tua Donggala, Banawa: ${window.location.origin}/?tab=tour360&site=${site.id}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors"
              >
                <span className="text-lg">💬</span>
                <span className="text-[11px] font-bold mt-1">WhatsApp</span>
              </a>

              {/* Twitter / X */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Jelajahi cagar budaya ${site.title} di Kota Tua Donggala: `)}&url=${encodeURIComponent(`${window.location.origin}/?tab=tour360&site=${site.id}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition-colors"
              >
                <span className="text-lg">🐦</span>
                <span className="text-[11px] font-bold mt-1">Twitter/X</span>
              </a>

              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}/?tab=tour360&site=${site.id}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 transition-colors"
              >
                <span className="text-lg">📘</span>
                <span className="text-[11px] font-bold mt-1">Facebook</span>
              </a>

              {/* Telegram */}
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(`${window.location.origin}/?tab=tour360&site=${site.id}`)}&text=${encodeURIComponent(`Jelajahi situs ${site.title} Kota Tua Donggala`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition-colors"
              >
                <span className="text-lg">✈️</span>
                <span className="text-[11px] font-bold mt-1">Telegram</span>
              </a>

            </div>

            {/* Notification Toast */}
            {isCopied && (
              <div className="mt-3 p-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold text-center flex items-center justify-center gap-1.5 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Tautan lokasi 360° berhasil disalin ke papan klip!</span>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
