export type KelurahanType = 
  | 'Kelurahan Boya' 
  | 'Kelurahan Gunung Bale' 
  | 'Kelurahan Tanjung Batu' 
  | 'Kelurahan Labuan Bajo' 
  | string;

export type CategoryType = 
  | 'Maritim & Pelabuhan' 
  | 'Kolonial & Pemerintahan' 
  | 'Arsitektur & Rumah Adat' 
  | 'Religi & Multikultural' 
  | 'Pertahanan & Pengawasan'
  | 'Situs'
  | 'Kawasan'
  | 'Bangunan'
  | 'Struktur'
  | string;

export interface HotspotPOI {
  id: string;
  title: string;
  description: string;
  yaw: number; // horizontal angle in degrees (-180 to 180)
  pitch: number; // vertical angle in degrees (-90 to 90)
  icon?: string;
  detailImage?: string;
}

export interface TalkingPersona {
  name: string;
  role: string;
  avatar: string;
  greeting: string;
  systemPrompt: string;
  sampleQuestions: string[];
}

export interface HeritageSite {
  id: string;
  title: string;
  localName?: string;
  kelurahan: KelurahanType;
  establishedYear: string;
  period: string; // e.g. "Abad ke-19 (Hindia Belanda)", "Era Kerajaan Banawa"
  category: CategoryType;
  locationDescription: string;
  coordinates: {
    lat: number;
    lng: number;
    mapX: number; // percentage on interactive SVG map (0-100)
    mapY: number; // percentage on interactive SVG map (0-100)
  };
  thumbnail: string;
  bannerImage: string;
  pastPhoto: {
    url: string;
    caption: string;
    source: string;
    year: string;
  };
  currentPhoto: {
    url: string;
    caption: string;
    conditionStatus: 'Terawat' | 'Perlu Revitalisasi' | 'Sisa Struktur/Puing' | 'Dalam Pemugaran';
  };
  panorama360: {
    url: string;
    videoUrl?: string; // Video 360 equirectangular MP4 or YouTube 360 URL
    type: 'sphere' | 'cubemap' | 'interactive-canvas';
    initialYaw?: number;
    initialPitch?: number;
    hotspots: HotspotPOI[];
  };
  video360?: {
    url: string;
    title?: string;
    provider?: 'mp4' | 'youtube' | 'drive';
    duration?: string;
  };
  videoDocumentaryUrl?: string;
  briefDescription: string;
  historicalSignificance: string;
  architecturalStyle: string;
  maritimeRelevance: string;
  audioNarration: {
    title: string;
    speakerName: string;
    durationText: string;
    transcript: string;
    audioUrl?: string;
  };
  talkingPersona: TalkingPersona;
  trivia: string[];
  keyFacts: {
    label: string;
    value: string;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'persona' | 'guide';
  text: string;
  timestamp: string;
  isStreaming?: boolean;
}

export interface TourBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  requiredVisits: number;
}

export interface BukuTourProgress {
  visitedSiteIds: string[];
  stampsCount: number;
  earnedBadges: TourBadge[];
  explorerName?: string;
}

export interface MissionChallenge {
  id: string;
  title?: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  relatedSiteId?: string;
  siteIdReference?: string;
  clue?: string;
  points?: number;
}

export interface QuizQuestion extends MissionChallenge {}

export interface TimelineEvent {
  id?: string;
  year: string;
  era?: string;
  title: string;
  description: string;
  category?: 'Era Kerajaan Banawa' | 'Era Kolonial & Maritim' | 'Kemerdekaan & Kontemporer';
  siteId?: string;
  image?: string;
}

export interface ProjectDetails {
  title: string;
  subtitle: string;
  applicantName: string;
  expertAdvisor: string;
  expertAdvisorDesc?: string;
  teamMembers: string[];
  leadership?: { role: string; name: string }[];
  techAndDesign?: { role: string; name: string }[];
  creativeAndMedia?: { role: string; name: string }[];
  operationsAndField?: { role: string; name: string }[];
  fundingProgram: string;
  fundingCategory: string;
  recommendingInstitution: string;
  recommendationDetails: string;
  targetLocation: string;
  background: string;
  targetSitesList: string[];
}

