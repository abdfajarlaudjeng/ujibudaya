import { prepareIndonesianSpeechText, LEDA_VOICE_CONFIG } from '../utils/indonesianSpeechHelper';

export interface TalkRequestPayload {
  siteId: string;
  siteTitle: string;
  personaName: string;
  personaRole: string;
  systemPrompt: string;
  userMessage: string;
  conversationHistory: { sender: string; text: string }[];
}

export async function askTalkingTourGuide(payload: TalkRequestPayload): Promise<string> {
  try {
    const res = await fetch('/api/gemini/talk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    return data.reply || 'Tabe! Terima kasih atas pertanyaannya.';
  } catch (err: any) {
    console.warn('API error, falling back:', err);
    return `Tabe! Sebagai ${payload.personaName}, saya sangat senang Anda menanyakan hal ini. Kota Tua Donggala dan kawasan Banawa menyimpan kekayaan sejarah bahari yang luar biasa sejak abad ke-15. Kami terus berdiri menjaga ingatan sejarah ini untuk generasi penerus bangsa.`;
  }
}

export async function generateSiteDeepDiveStory(siteTitle: string, topic?: string): Promise<string> {
  try {
    const res = await fetch('/api/gemini/story', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ siteTitle, topic }),
    });
    const data = await res.json();
    return data.story || '';
  } catch (err) {
    console.error('Failed to generate story:', err);
    return '';
  }
}

export interface TTSResponse {
  audioUrl: string;
  mimeType: string;
  voice: string;
  tone: string;
  preparedText: string;
  cached?: boolean;
}

// Client request to Gemini 3.1 Flash TTS endpoint
export async function requestGeminiTTS(
  text: string, 
  lang: 'id' | 'en' = 'id',
  voiceName: string = LEDA_VOICE_CONFIG.voiceName
): Promise<TTSResponse> {
  const res = await fetch('/api/gemini/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, lang, voiceName }),
  });

  if (!res.ok) {
    throw new Error(`TTS API failed with status ${res.status}`);
  }

  const data = await res.json();
  if (!data.audioUrl) {
    throw new Error('No audio URL returned from TTS');
  }

  return data;
}

/**
 * VoiceNarrator: Engine Audio Narasi Digitalisasi Kota Tua Donggala
 * - Bahasa Indonesia: Suara Wanita Muda, Lembut (Leda) dengan Tone Suara Bersemangat & Penuh Energi
 * - Dilengkapi normalisasi fonetik, penanggalan, dan dialek lokal Sulawesi/Donggala
 * - Prioritas utama: Gemini 3.1 Flash TTS (Ultra-natural studio quality)
 * - Fallback cerdas: Web Speech API Browser yang dituning khusus (suara wanita, pitch 1.15, tempo 1.05)
 */
export class VoiceNarrator {
  private static synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;
  private static currentAudio: HTMLAudioElement | null = null;
  private static isPlayingState: boolean = false;
  private static clientAudioCache = new Map<string, string>();
  private static abortController: AbortController | null = null;

  public static getVoiceProfile(lang: 'id' | 'en' = 'id') {
    if (lang === 'id') {
      return {
        name: 'Leda',
        character: 'Wanita Muda, Lembut & Bersemangat',
        description: 'Suara Wanita Muda, Lembut (Leda) dengan Tone Suara Bersemangat & Penuh Energi',
        dialect: 'Bahasa Indonesia Fasih & Artikulatif'
      };
    }
    return {
      name: 'Aoede',
      character: 'Clear & Energetic English Narrator',
      description: 'Energetic English Heritage Guide',
      dialect: 'Standard English'
    };
  }

  public static async speak(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: () => void,
    lang: 'id' | 'en' = 'id'
  ) {
    this.stop();

    if (!text || !text.trim()) return;

    // Normalisasi teks untuk pengejaan & dialek bahasa Indonesia yang benar
    const speechText = lang === 'id' ? prepareIndonesianSpeechText(text) : text.trim();
    if (!speechText) return;

    const voice = lang === 'id' ? LEDA_VOICE_CONFIG.voiceName : 'Aoede';
    const cacheKey = `${lang}_${voice}_${speechText}`;

    // Buat controller baru untuk membatalkan jika user mengklik stop sebelum request selesai
    this.abortController = new AbortController();
    const currentSignal = this.abortController.signal;

    // 1. Coba gunakan Gemini TTS (Suara Leda yang lembut & bersemangat)
    try {
      let audioUrl = this.clientAudioCache.get(cacheKey);

      if (!audioUrl) {
        const ttsData = await requestGeminiTTS(speechText, lang, voice);
        if (currentSignal.aborted) return;
        audioUrl = ttsData.audioUrl;
        this.clientAudioCache.set(cacheKey, audioUrl);
      }

      if (audioUrl && !currentSignal.aborted) {
        const audio = new Audio(audioUrl);
        this.currentAudio = audio;

        audio.onplay = () => {
          this.isPlayingState = true;
          if (onStart) onStart();
        };

        audio.onended = () => {
          this.isPlayingState = false;
          this.currentAudio = null;
          if (onEnd) onEnd();
        };

        audio.onerror = (e) => {
          console.warn('HTMLAudio error, falling back to Web Speech synthesis:', e);
          this.isPlayingState = false;
          this.currentAudio = null;
          this.speakFallbackWebSpeech(speechText, onStart, onEnd, onError, lang);
        };

        await audio.play();
        return;
      }
    } catch (err) {
      if (currentSignal.aborted) return;
      console.info('Gemini TTS unavailable, using enhanced Web Speech API fallback:', err);
    }

    // 2. Fallback: Browser Web Speech API dengan tuning karakter Suara Wanita Muda, Lembut & Bersemangat
    this.speakFallbackWebSpeech(speechText, onStart, onEnd, onError, lang);
  }

  private static speakFallbackWebSpeech(
    cleanText: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: () => void,
    lang: 'id' | 'en' = 'id'
  ) {
    if (!this.synth) {
      if (onError) onError();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);

    if (lang === 'id') {
      // Tuning agar suara terasa wanita muda, bersahabat, lembut dan bersemangat
      utterance.pitch = LEDA_VOICE_CONFIG.webSpeechPitch; // 1.15
      utterance.rate = LEDA_VOICE_CONFIG.webSpeechRate;   // 1.05
      utterance.lang = 'id-ID';

      const voices = this.synth.getVoices();
      // Cari suara wanita berbahasa Indonesia
      const idVoice = voices.find(v => 
        (v.lang.startsWith('id') || v.lang.startsWith('ms')) &&
        (v.name.toLowerCase().includes('gadis') || 
         v.name.toLowerCase().includes('damayanti') ||
         v.name.toLowerCase().includes('female') ||
         v.name.toLowerCase().includes('google') ||
         v.name.toLowerCase().includes('indonesia'))
      ) || voices.find(v => v.lang.startsWith('id') || v.lang.startsWith('ms'));

      if (idVoice) {
        utterance.voice = idVoice;
      }
    } else {
      utterance.pitch = 1.05;
      utterance.rate = 1.0;
      utterance.lang = 'en-US';
      const voices = this.synth.getVoices();
      const enVoice = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female')) ||
                      voices.find(v => v.lang.startsWith('en'));
      if (enVoice) utterance.voice = enVoice;
    }

    utterance.onstart = () => {
      this.isPlayingState = true;
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.isPlayingState = false;
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      this.isPlayingState = false;
      this.currentUtterance = null;
      if (onError) onError();
    };

    this.currentUtterance = utterance;
    this.isPlayingState = true;
    this.synth.speak(utterance);
  }

  public static stop() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }

    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }

    this.isPlayingState = false;
  }

  public static isSpeaking(): boolean {
    if (this.isPlayingState) return true;
    if (this.currentAudio && !this.currentAudio.paused) return true;
    return this.synth ? this.synth.speaking : false;
  }
}

