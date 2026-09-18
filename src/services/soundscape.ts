// Coastal & Maritime Soundscape & Background Music Manager for Kota Tua Donggala
// Generates realistic ambient sounds of Makassar Strait ocean waves, soft sea breeze, and distant port bells
// or streams custom background music from Google Drive / direct audio URL.

export interface BackgroundMusicInfo {
  title: string;
  url: string;
  sourceType: 'synthesizer' | 'custom';
}

const STORAGE_KEY = 'donggala_bg_music_config';
export const DEFAULT_MUSIC_TITLE = 'Musik Latar Digitalisasi Situs Sejarah Kota Tua Donggala';

export function resolveAudioUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();

  // Handle Google Drive share URLs:
  // https://drive.google.com/file/d/FILE_ID/view...
  // https://drive.google.com/open?id=FILE_ID
  const fileIdMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/id=([a-zA-Z0-9_-]+)/);
  if (fileIdMatch && fileIdMatch[1]) {
    return `https://docs.google.com/uc?export=download&id=${fileIdMatch[1]}`;
  }

  return trimmed;
}

class SoundscapeManager {
  private audioCtx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private gainNode: GainNode | null = null;
  private noiseNode: AudioNode | null = null;
  private waveInterval: any = null;

  // Custom Audio Track Support
  private audioElement: HTMLAudioElement | null = null;
  private musicTitle: string = DEFAULT_MUSIC_TITLE;
  private musicUrl: string = '';
  private listeners: Set<(isPlaying: boolean, info: BackgroundMusicInfo) => void> = new Set();

  constructor() {
    this.loadPersistedConfig();
  }

  private loadPersistedConfig() {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.title) this.musicTitle = parsed.title;
        if (parsed.url) this.musicUrl = parsed.url;
      }
    } catch (e) {
      console.warn('Failed to load music config:', e);
    }
  }

  private saveConfig() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          title: this.musicTitle,
          url: this.musicUrl,
        })
      );
    } catch (e) {
      console.warn('Failed to save music config:', e);
    }
  }

  public subscribe(fn: (isPlaying: boolean, info: BackgroundMusicInfo) => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    const info = this.getMusicInfo();
    this.listeners.forEach((fn) => fn(this.isPlaying, info));
  }

  public getMusicInfo(): BackgroundMusicInfo {
    return {
      title: this.musicTitle || DEFAULT_MUSIC_TITLE,
      url: this.musicUrl,
      sourceType: this.musicUrl ? 'custom' : 'synthesizer',
    };
  }

  public setCustomTrack(url: string, title?: string) {
    const prevPlaying = this.isPlaying;
    if (this.isPlaying) {
      this.pause();
    }

    this.musicUrl = url.trim();
    if (title && title.trim()) {
      this.musicTitle = title.trim();
    } else if (!this.musicUrl) {
      this.musicTitle = DEFAULT_MUSIC_TITLE;
    }

    this.saveConfig();

    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
      this.audioElement = null;
    }

    if (prevPlaying) {
      this.play();
    } else {
      this.notify();
    }
  }

  public resetToDefaultSynthesizer() {
    this.setCustomTrack('', DEFAULT_MUSIC_TITLE);
  }

  public init() {
    if (typeof window === 'undefined') return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    if (!this.audioCtx) {
      this.audioCtx = new AudioContextClass();
    }
  }

  public play() {
    if (this.musicUrl) {
      this.playCustomAudio();
    } else {
      this.playSynthesizer();
    }
  }

  private playCustomAudio() {
    const resolvedUrl = resolveAudioUrl(this.musicUrl);
    if (!resolvedUrl) {
      this.playSynthesizer();
      return;
    }

    try {
      if (!this.audioElement || this.audioElement.src !== resolvedUrl) {
        this.audioElement = new Audio(resolvedUrl);
        this.audioElement.loop = true;
        this.audioElement.volume = this.isMuted ? 0 : 0.45;
        this.audioElement.onerror = () => {
          console.warn('Custom background music failed to play, falling back to ambient synthesizer.');
          this.playSynthesizer();
        };
      }

      this.audioElement.play().then(() => {
        this.isPlaying = true;
        this.notify();
      }).catch((e) => {
        console.warn('Audio play autoplay restriction or error:', e);
        // Fallback to synthesizer if audio element fails
        this.playSynthesizer();
      });
    } catch (e) {
      console.warn('Error starting custom audio:', e);
      this.playSynthesizer();
    }
  }

  private playSynthesizer() {
    this.init();
    if (!this.audioCtx) return;

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    if (this.isPlaying && !this.musicUrl) return;

    try {
      const masterGain = this.audioCtx.createGain();
      masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.18, this.audioCtx.currentTime);
      masterGain.connect(this.audioCtx.destination);
      this.gainNode = masterGain;

      // Create pink/brown noise buffer for natural ocean waves
      const bufferSize = this.audioCtx.sampleRate * 4;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Pink noise filter approximation
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.5;
      }

      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      // Bandpass filter for coastal wave resonance
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, this.audioCtx.currentTime);
      filter.Q.setValueAtTime(1.5, this.audioCtx.currentTime);

      const waveGain = this.audioCtx.createGain();
      waveGain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);

      noise.connect(filter);
      filter.connect(waveGain);
      waveGain.connect(masterGain);
      noise.start();
      this.noiseNode = noise;

      // Animate wave swell cycle (inhale/exhale of Makassar Strait coast)
      let swellTime = 0;
      this.waveInterval = setInterval(() => {
        if (!this.audioCtx || !waveGain) return;
        swellTime += 0.1;
        const swell = (Math.sin(swellTime * 0.8) + 1) / 2; // 0 to 1 cycle
        const targetVol = 0.04 + swell * 0.14;
        const targetFreq = 220 + swell * 350;
        
        try {
          waveGain.gain.setTargetAtTime(targetVol, this.audioCtx.currentTime, 0.4);
          filter.frequency.setTargetAtTime(targetFreq, this.audioCtx.currentTime, 0.4);
        } catch (e) {
          // ignore transient timing errors
        }
      }, 200);

      this.isPlaying = true;
      this.notify();
    } catch (e) {
      console.warn('Could not start soundscape audio:', e);
    }
  }

  public pause() {
    if (this.audioElement) {
      this.audioElement.pause();
    }

    if (this.waveInterval) {
      clearInterval(this.waveInterval);
      this.waveInterval = null;
    }
    if (this.noiseNode) {
      try {
        (this.noiseNode as any).stop();
        this.noiseNode.disconnect();
      } catch (e) {}
      this.noiseNode = null;
    }
    this.isPlaying = false;
    this.notify();
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.audioElement) {
      this.audioElement.volume = muted ? 0 : 0.45;
    }
    if (this.gainNode && this.audioCtx) {
      this.gainNode.gain.setTargetAtTime(
        muted ? 0 : 0.18,
        this.audioCtx.currentTime,
        0.1
      );
    }
    if (!muted && !this.isPlaying) {
      this.play();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }
}

export const Soundscape = new SoundscapeManager();
export const soundscape = Soundscape;


