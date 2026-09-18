import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  HardDrive, 
  RefreshCw, 
  ExternalLink, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  FolderCheck, 
  Plus, 
  Search, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Database,
  Copy,
  Check,
  LogOut,
  Info,
  Layers,
  FileText,
  Video,
  Music,
  Volume2,
  VolumeX,
  Lock,
  ShieldCheck,
  KeyRound,
  Play,
  Square
} from 'lucide-react';
import { User } from 'firebase/auth';
import { 
  googleSignIn, 
  logoutGoogle, 
  getAccessToken 
} from '../services/googleAuth';
import { 
  findDonggalaSpreadsheets, 
  createDonggalaSpreadsheet, 
  writeSitesToSpreadsheet, 
  readSitesFromSpreadsheet,
  GoogleSpreadsheetInfo 
} from '../services/googleSheets';
import { 
  getOrCreateDonggalaFolder, 
  listDonggalaDriveFiles, 
  uploadMediaToDrive, 
  backupDatabaseToDrive, 
  DriveFileItem 
} from '../services/googleDrive';
import { HeritageSite } from '../types';
import { Soundscape, DEFAULT_MUSIC_TITLE, resolveAudioUrl } from '../services/soundscape';
import { getStoredAdminPasscode, setStoredAdminPasscode } from './AdminAccessModal';

interface GoogleWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLockAdmin?: () => void;
  currentUser: User | null;
  currentSites: HeritageSite[];
  onUpdateSitesFromSheets: (newSites: HeritageSite[]) => void;
  activeSpreadsheet: GoogleSpreadsheetInfo | null;
  setActiveSpreadsheet: (sheet: GoogleSpreadsheetInfo | null) => void;
}

export const GoogleWorkspaceModal: React.FC<GoogleWorkspaceModalProps> = ({
  isOpen,
  onClose,
  onLockAdmin,
  currentUser,
  currentSites,
  onUpdateSitesFromSheets,
  activeSpreadsheet,
  setActiveSpreadsheet,
}) => {
  const [activeTab, setActiveTab] = useState<'sheets' | 'drive' | 'preview' | 'security'>('sheets');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Background Music state
  const [musicTitleInput, setMusicTitleInput] = useState(() => Soundscape.getMusicInfo().title);
  const [musicUrlInput, setMusicUrlInput] = useState(() => Soundscape.getMusicInfo().url);
  const [isMusicPlaying, setIsMusicPlaying] = useState(() => Soundscape.getIsPlaying());
  const [musicSourceType, setMusicSourceType] = useState<'synthesizer' | 'custom'>(() => Soundscape.getMusicInfo().sourceType);

  // Security & Admin Passcode state
  const [currentPasscodeAttempt, setCurrentPasscodeAttempt] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmNewPasscode, setConfirmNewPasscode] = useState('');
  const [passcodeMessage, setPasscodeMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sheets state
  const [availableSheets, setAvailableSheets] = useState<GoogleSpreadsheetInfo[]>([]);
  const [isSearchingSheets, setIsSearchingSheets] = useState(false);
  const [customSheetId, setCustomSheetId] = useState('');

  // Drive state
  const [driveFolderId, setDriveFolderId] = useState<string | null>(null);
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [copiedFileUrl, setCopiedFileUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Destructive Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionLabel: string;
    isDangerous?: boolean;
    onConfirm: () => void;
  } | null>(null);

  // Subscribe to Soundscape state changes
  useEffect(() => {
    const unsub = Soundscape.subscribe((playing, info) => {
      setIsMusicPlaying(playing);
      setMusicTitleInput(info.title);
      setMusicUrlInput(info.url);
      setMusicSourceType(info.sourceType);
    });
    return () => unsub();
  }, []);

  // Auto-search for existing spreadsheets on modal open if user is logged in
  useEffect(() => {
    if (isOpen && currentUser) {
      loadDriveAndSheets();
    }
  }, [isOpen, currentUser]);

  const loadDriveAndSheets = async () => {
    const token = await getAccessToken();
    if (!token) return;

    try {
      setIsSearchingSheets(true);
      const [sheets, folderId] = await Promise.all([
        findDonggalaSpreadsheets(token).catch(() => []),
        getOrCreateDonggalaFolder(token).catch(() => null)
      ]);

      setAvailableSheets(sheets);
      if (sheets.length > 0 && !activeSpreadsheet) {
        setActiveSpreadsheet(sheets[0]);
      }

      if (folderId) {
        setDriveFolderId(folderId);
        const files = await listDonggalaDriveFiles(token, folderId).catch(() => []);
        setDriveFiles(files);
      }
    } catch (err: any) {
      console.warn('Load sheets/drive error:', err);
    } finally {
      setIsSearchingSheets(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      setStatusMessage(null);
      const result = await googleSignIn();
      if (result) {
        setStatusMessage({
          type: 'success',
          text: `Berhasil terhubung dengan Google (${result.user.displayName || result.user.email}).`
        });
        loadDriveAndSheets();
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Gagal masuk dengan Google. Pastikan izin akses disetujui.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutGoogle();
    setStatusMessage({ type: 'info', text: 'Telah keluar dari akun Google.' });
  };

  // 1. Create New Spreadsheet
  const handleCreateNewSpreadsheet = async () => {
    const token = await getAccessToken();
    if (!token) {
      setStatusMessage({ type: 'error', text: 'Silakan masuk ke Google terlebih dahulu.' });
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: 'Buat Spreadsheet Baru di Google Drive?',
      description: `Akan dibuat file Google Spreadsheet baru berjudul "Donggala Heritage - Database Cagar Budaya & 360" di Google Drive Anda yang diisi dengan data ${currentSites.length} situs cagar budaya lengkap dengan foto, deskripsi, dan titik koordinat 360°.`,
      actionLabel: 'Buat Spreadsheet',
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          setIsLoading(true);
          setStatusMessage({ type: 'info', text: 'Sedang membuat Google Spreadsheet baru...' });
          const newSheet = await createDonggalaSpreadsheet(
            token,
            `Donggala Heritage - Database Situs (${new Date().toLocaleDateString('id-ID')})`,
            currentSites
          );
          setActiveSpreadsheet(newSheet);
          setAvailableSheets((prev) => [newSheet, ...prev]);
          setStatusMessage({
            type: 'success',
            text: `Berhasil membuat spreadsheet! Buka tautan untuk mulai menyunting data situs secara langsung.`
          });
        } catch (err: any) {
          setStatusMessage({ type: 'error', text: err.message || 'Gagal membuat spreadsheet baru.' });
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  // 2. Push Current Website Data to Active Google Sheet
  const handlePushToSheets = async () => {
    if (!activeSpreadsheet) {
      setStatusMessage({ type: 'error', text: 'Pilih atau buat Google Spreadsheet terlebih dahulu.' });
      return;
    }

    const token = await getAccessToken();
    if (!token) {
      setStatusMessage({ type: 'error', text: 'Silakan masuk ke Google terlebih dahulu.' });
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: `Perbarui Data ke Google Sheet?`,
      description: `Data pada spreadsheet "${activeSpreadsheet.name}" akan ditimpa dan diperbarui dengan data ${currentSites.length} situs cagar budaya yang saat ini ada di website.`,
      actionLabel: 'Ya, Timpa & Simpan ke Sheets',
      isDangerous: true,
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          setIsLoading(true);
          setStatusMessage({ type: 'info', text: 'Sedang mengirim data ke Google Sheets...' });
          await writeSitesToSpreadsheet(token, activeSpreadsheet.id, currentSites);
          setStatusMessage({
            type: 'success',
            text: `Sukses! Seluruh data (${currentSites.length} situs) berhasil disimpan ke spreadsheet "${activeSpreadsheet.name}".`
          });
        } catch (err: any) {
          setStatusMessage({ type: 'error', text: err.message || 'Gagal memperbarui data ke spreadsheet.' });
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  // 3. Pull Data from Active Google Sheet to Website
  const handlePullFromSheets = async () => {
    if (!activeSpreadsheet) {
      setStatusMessage({ type: 'error', text: 'Pilih Google Spreadsheet yang ingin ditarik datanya.' });
      return;
    }

    const token = await getAccessToken();
    if (!token) {
      setStatusMessage({ type: 'error', text: 'Silakan masuk ke Google terlebih dahulu.' });
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: `Tarik & Perbaharui Data Website dari Google Sheets?`,
      description: `Sistem akan membaca baris tabel dari spreadsheet "${activeSpreadsheet.name}" dan memperbarui seluruh tampilan website (nama, sejarah, foto arsip, panorama 360, koordinat peta) secara langsung.`,
      actionLabel: 'Tarik & Terapkan Data',
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          setIsLoading(true);
          setStatusMessage({ type: 'info', text: 'Sedang membaca baris dari Google Sheets...' });
          const loadedSites = await readSitesFromSpreadsheet(token, activeSpreadsheet.id, currentSites);
          
          if (loadedSites.length === 0) {
            throw new Error('Tidak ada data situs yang valid ditemukan di spreadsheet.');
          }

          onUpdateSitesFromSheets(loadedSites);
          const updatedInfo = Soundscape.getMusicInfo();
          setMusicTitleInput(updatedInfo.title);
          setMusicUrlInput(updatedInfo.url);
          setMusicSourceType(updatedInfo.sourceType);

          setStatusMessage({
            type: 'success',
            text: `Berhasil! ${loadedSites.length} situs cagar budaya dan pengaturan website (termasuk musik latar) telah diperbarui langsung dari Google Sheets ke seluruh antarmuka website.`
          });
        } catch (err: any) {
          setStatusMessage({ type: 'error', text: err.message || 'Gagal menarik data dari Google Sheets.' });
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  // Background Music Management Handlers
  const handleSaveBackgroundMusic = () => {
    Soundscape.setCustomTrack(musicUrlInput, musicTitleInput);
    setStatusMessage({
      type: 'success',
      text: 'Pengaturan Musik Latar berhasil disimpan dan diperbaharui di seluruh website!'
    });
  };

  const handleResetBackgroundMusic = () => {
    Soundscape.resetToDefaultSynthesizer();
    setMusicTitleInput(DEFAULT_MUSIC_TITLE);
    setMusicUrlInput('');
    setStatusMessage({
      type: 'success',
      text: 'Musik latar telah dikembalikan ke synthesizer suara alami ombak pesisir Selat Makassar.'
    });
  };

  const handleTogglePlayMusic = () => {
    const isNowPlaying = Soundscape.toggle();
    setIsMusicPlaying(isNowPlaying);
  };

  const handleSetFileAsMusic = (file: DriveFileItem) => {
    const fileUrl = file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`;
    const cleanTitle = file.name.replace(/\.[^/.]+$/, '');
    Soundscape.setCustomTrack(fileUrl, cleanTitle);
    setMusicUrlInput(fileUrl);
    setMusicTitleInput(cleanTitle);
    setStatusMessage({
      type: 'success',
      text: `Berhasil! File "${file.name}" dari Google Drive telah diatur sebagai Musik Latar aktif website.`
    });
  };

  const handleUpdateAdminPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeMessage(null);
    const existing = getStoredAdminPasscode();
    if (currentPasscodeAttempt.trim() !== existing) {
      setPasscodeMessage({ type: 'error', text: 'Kode akses saat ini tidak sesuai.' });
      return;
    }
    if (newPasscode.trim().length < 4) {
      setPasscodeMessage({ type: 'error', text: 'Kode akses baru minimal harus 4 karakter.' });
      return;
    }
    if (newPasscode.trim() !== confirmNewPasscode.trim()) {
      setPasscodeMessage({ type: 'error', text: 'Konfirmasi kode akses baru tidak cocok.' });
      return;
    }
    setStoredAdminPasscode(newPasscode.trim());
    setCurrentPasscodeAttempt('');
    setNewPasscode('');
    setConfirmNewPasscode('');
    setPasscodeMessage({ type: 'success', text: 'Kode akses administrator berhasil diperbaharui!' });
  };

  // 4. Connect by direct Sheet ID or URL
  const handleConnectCustomSheet = async () => {
    if (!customSheetId.trim()) return;

    let id = customSheetId.trim();
    const match = id.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      id = match[1];
    }

    const token = await getAccessToken();
    if (!token) {
      setStatusMessage({ type: 'error', text: 'Silakan masuk ke Google terlebih dahulu.' });
      return;
    }

    try {
      setIsLoading(true);
      const metaUrl = `https://sheets.googleapis.com/v4/spreadsheets/${id}?fields=properties.title`;
      const res = await fetch(metaUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error('Spreadsheet tidak ditemukan atau Anda belum memiliki izin akses ke file tersebut.');
      }

      const data = await res.json();
      const customSheetInfo: GoogleSpreadsheetInfo = {
        id,
        name: data.properties?.title || 'Google Spreadsheet Terhubung',
        url: `https://docs.google.com/spreadsheets/d/${id}/edit`
      };

      setActiveSpreadsheet(customSheetInfo);
      setAvailableSheets((prev) => {
        const filtered = prev.filter((s) => s.id !== id);
        return [customSheetInfo, ...filtered];
      });
      setCustomSheetId('');
      setStatusMessage({
        type: 'success',
        text: `Berhasil terhubung ke spreadsheet: "${customSheetInfo.name}".`
      });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Gagal menghubungkan spreadsheet.' });
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Upload File to Google Drive
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = await getAccessToken();
    if (!token) {
      setStatusMessage({ type: 'error', text: 'Silakan masuk ke Google terlebih dahulu.' });
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: `Unggah File ke Google Drive?`,
      description: `File "${file.name}" (${(file.size / 1024).toFixed(1)} KB) akan diunggah ke folder "Donggala Heritage Media" di Google Drive Anda.`,
      actionLabel: 'Unggah Sekarang',
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          setIsUploadingFile(true);
          setStatusMessage({ type: 'info', text: `Sedang mengunggah ${file.name} ke Drive...` });
          const targetFolderId = driveFolderId || (await getOrCreateDonggalaFolder(token));
          setDriveFolderId(targetFolderId);

          const uploaded = await uploadMediaToDrive(token, file, targetFolderId);
          setDriveFiles((prev) => [uploaded, ...prev]);
          setStatusMessage({
            type: 'success',
            text: `File "${uploaded.name}" berhasil diunggah ke folder Google Drive!`
          });
        } catch (err: any) {
          setStatusMessage({ type: 'error', text: err.message || 'Gagal mengunggah file ke Google Drive.' });
        } finally {
          setIsUploadingFile(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      }
    });
  };

  // 6. Backup JSON Database to Drive
  const handleBackupToDrive = async () => {
    const token = await getAccessToken();
    if (!token) {
      setStatusMessage({ type: 'error', text: 'Silakan masuk ke Google terlebih dahulu.' });
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: 'Simpan Cadangan Database ke Google Drive?',
      description: `Seluruh rekaman data ${currentSites.length} situs cagar budaya saat ini akan diekspor sebagai file JSON cadangan dan disimpan ke folder Google Drive Anda.`,
      actionLabel: 'Simpan Cadangan',
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          setIsLoading(true);
          const targetFolderId = driveFolderId || (await getOrCreateDonggalaFolder(token));
          setDriveFolderId(targetFolderId);

          const uploaded = await backupDatabaseToDrive(token, currentSites, targetFolderId);
          setDriveFiles((prev) => [uploaded, ...prev]);
          setStatusMessage({
            type: 'success',
            text: `Cadangan database berhasil disimpan ke Google Drive (${uploaded.name}).`
          });
        } catch (err: any) {
          setStatusMessage({ type: 'error', text: err.message || 'Gagal membuat cadangan di Drive.' });
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFileUrl(text);
    setTimeout(() => setCopiedFileUrl(null), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800 bg-stone-950/80 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Lock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white font-serif-heading">
                  Panel Administrator
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Akses Terotentikasi
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Google Workspace
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Pengelolaan database 15 situs cagar budaya, media cadangan Google Drive, dan pengaturan musik latar.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onLockAdmin && (
              <button
                onClick={onLockAdmin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold border border-stone-700 transition-colors"
                title="Kunci Sesi Administrator"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Kunci Sesi</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Authentication Bar / Google Account State */}
        <div className="px-5 py-3 bg-stone-950/40 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-3">
              {currentUser.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt={currentUser.displayName || 'Google User'} 
                  className="w-8 h-8 rounded-full border border-stone-700" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#c85a32] text-white flex items-center justify-center font-bold text-xs">
                  {currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0) || 'G'}
                </div>
              )}
              <div className="text-xs">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <span>{currentUser.displayName || 'Pengguna Google'}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Terotentikasi
                  </span>
                </p>
                <p className="text-[11px] text-stone-400">{currentUser.email}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-stone-300">
              <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>Masuk dengan Akun Google untuk mengakses spreadsheet dan folder Drive Anda.</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            {currentUser ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-stone-400 hover:text-stone-200 hover:bg-stone-800 border border-stone-700/60 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar Akun</span>
              </button>
            ) : (
              /* Google Sign-in Official GSI Styling */
              <button
                onClick={handleSignIn}
                disabled={isLoading}
                className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white text-stone-900 font-semibold text-xs shadow-md hover:bg-stone-100 transition-all cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
                <span>{isLoading ? 'Menghubungkan...' : 'Sign in with Google'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Status Toast Alert */}
        {statusMessage && (
          <div className={`px-5 py-2.5 text-xs flex items-center justify-between border-b ${
            statusMessage.type === 'success' ? 'bg-emerald-950/40 text-emerald-300 border-emerald-900/50' :
            statusMessage.type === 'error' ? 'bg-red-950/40 text-red-300 border-red-900/50' :
            'bg-amber-950/40 text-amber-300 border-amber-900/50'
          }`}>
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />}
              {statusMessage.type === 'error' && <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-400" />}
              {statusMessage.type === 'info' && <Info className="w-4 h-4 flex-shrink-0 text-amber-400" />}
              <span>{statusMessage.text}</span>
            </div>
            <button 
              onClick={() => setStatusMessage(null)}
              className="text-stone-400 hover:text-white ml-2 text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center px-5 border-b border-stone-800 bg-stone-900/50 gap-2 flex-shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('sheets')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'sheets'
                ? 'border-emerald-500 text-white bg-emerald-500/5'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Google Sheets (Database Situs & Konfigurasi)</span>
          </button>

          <button
            onClick={() => setActiveTab('drive')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'drive'
                ? 'border-blue-500 text-white bg-blue-500/5'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <HardDrive className="w-4 h-4 text-blue-400" />
            <span>Google Drive (Media & File Musik)</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'preview'
                ? 'border-[#c85a32] text-white bg-[#c85a32]/5'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Music className="w-4 h-4 text-[#c85a32]" />
            <span>Pratinjau Data & Musik Latar</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'security'
                ? 'border-amber-500 text-white bg-amber-500/5'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Keamanan & Kode Akses</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* TAB 1: GOOGLE SHEETS */}
          {activeTab === 'sheets' && (
            <div className="space-y-5">
              {/* Linked Sheet Banner */}
              <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Spreadsheet Terpilih:</span>
                    {activeSpreadsheet ? (
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                        Aktif
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded bg-stone-800 text-stone-400 font-medium">
                        Belum Terhubung
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-white font-serif-heading">
                    {activeSpreadsheet ? activeSpreadsheet.name : 'Belum Ada Spreadsheet yang Dipilih'}
                  </h4>
                  {activeSpreadsheet && (
                    <p className="text-[11px] text-stone-400 font-mono break-all">
                      ID: {activeSpreadsheet.id}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {activeSpreadsheet && (
                    <a
                      href={activeSpreadsheet.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Buka di Google Sheets</span>
                    </a>
                  )}

                  <button
                    onClick={handleCreateNewSpreadsheet}
                    disabled={isLoading || !currentUser}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-all disabled:opacity-50"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Buat Spreadsheet Baru</span>
                  </button>
                </div>
              </div>

              {/* Sync Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pull from Google Sheets */}
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <ArrowDownToLine className="w-5 h-5" />
                    <h4 className="text-sm font-bold text-white">Tarik Data dari Google Sheets ke Website</h4>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Setelah Anda mengubah judul, narasi, tahun, atau URL foto langsung di Google Sheets, klik tombol di bawah ini untuk memperbarui data website seketika.
                  </p>
                  <button
                    onClick={handlePullFromSheets}
                    disabled={isLoading || !activeSpreadsheet || !currentUser}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Tarik & Perbaharui Data Website Sekarang</span>
                  </button>
                </div>

                {/* Push to Google Sheets */}
                <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/40 space-y-3">
                  <div className="flex items-center gap-2 text-blue-400">
                    <ArrowUpFromLine className="w-5 h-5" />
                    <h4 className="text-sm font-bold text-white">Kirim Data Website ke Google Sheets</h4>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Kirimkan seluruh data {currentSites.length} situs cagar budaya dari website saat ini ke dalam lembar Google Sheets terpilih (memperbarui baris tabel).
                  </p>
                  <button
                    onClick={handlePushToSheets}
                    disabled={isLoading || !activeSpreadsheet || !currentUser}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Kirim & Perbaharui Spreadsheet</span>
                  </button>
                </div>
              </div>

              {/* Available Spreadsheets in Drive */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                    Spreadsheet Donggala di Google Drive Anda
                  </h4>
                  <button
                    onClick={loadDriveAndSheets}
                    disabled={isSearchingSheets || !currentUser}
                    className="text-xs text-stone-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSearchingSheets ? 'animate-spin' : ''}`} />
                    <span>Segarkan</span>
                  </button>
                </div>

                {availableSheets.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {availableSheets.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => setActiveSpreadsheet(s)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-2 ${
                          activeSpreadsheet?.id === s.id
                            ? 'bg-emerald-950/40 border-emerald-500/50'
                            : 'bg-stone-950/40 border-stone-800 hover:border-stone-700'
                        }`}
                      >
                        <div className="min-w-0 space-y-1">
                          <p className="text-xs font-bold text-white truncate">{s.name}</p>
                          <p className="text-[10px] text-stone-400 font-mono truncate">{s.id}</p>
                          {s.modifiedTime && (
                            <p className="text-[10px] text-stone-500">
                              Diubah: {new Date(s.modifiedTime).toLocaleDateString('id-ID')}
                            </p>
                          )}
                        </div>
                        {activeSpreadsheet?.id === s.id && (
                          <span className="p-1 rounded-full bg-emerald-500 text-black flex-shrink-0">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-stone-950/40 border border-stone-800 text-center text-xs text-stone-400">
                    {currentUser 
                      ? 'Belum ada Google Spreadsheet terdeteksi di Drive Anda. Klik tombol "Buat Spreadsheet Baru" di atas untuk membuat database awal.' 
                      : 'Silakan masuk dengan Google untuk melihat spreadsheet Anda.'}
                  </div>
                )}

                {/* Direct ID / Link Input */}
                <div className="pt-2">
                  <label className="block text-xs text-stone-400 mb-1.5 font-medium">
                    Atau hubungkan dengan Spreadsheet ID / URL yang sudah ada:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customSheetId}
                      onChange={(e) => setCustomSheetId(e.target.value)}
                      placeholder="https://docs.google.com/spreadsheets/d/... atau Spreadsheet ID"
                      className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-600 focus:outline-hidden focus:border-emerald-500"
                    />
                    <button
                      onClick={handleConnectCustomSheet}
                      disabled={isLoading || !customSheetId.trim() || !currentUser}
                      className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold border border-stone-700 transition-colors disabled:opacity-50"
                    >
                      Hubungkan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GOOGLE DRIVE */}
          {activeTab === 'drive' && (
            <div className="space-y-5">
              {/* Drive Folder Banner */}
              <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FolderCheck className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-white">Folder "Donggala Heritage Media"</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-medium">
                      Google Drive
                    </span>
                  </div>
                  <p className="text-xs text-stone-400">
                    Folder khusus di Drive Anda untuk menyimpan foto masa lalu, foto masa kini, panorama 360°, serta cadangan database situs.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*,application/json"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingFile || !currentUser}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingFile ? 'Mengunggah...' : 'Unggah Foto/Media'}</span>
                  </button>

                  <button
                    onClick={handleBackupToDrive}
                    disabled={isLoading || !currentUser}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Database className="w-3.5 h-3.5 text-amber-400" />
                    <span>Cadangkan (JSON) ke Drive</span>
                  </button>
                </div>
              </div>

              {/* Uploaded Drive Files List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                    File & Media di Folder Donggala Drive ({driveFiles.length})
                  </h4>
                  <button
                    onClick={loadDriveAndSheets}
                    className="text-xs text-stone-400 hover:text-white flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Segarkan</span>
                  </button>
                </div>

                {driveFiles.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {driveFiles.map((file) => (
                      <div
                        key={file.id}
                        className="p-3 rounded-xl bg-stone-950/50 border border-stone-800 hover:border-stone-700 transition-all flex flex-col justify-between gap-2.5"
                      >
                        <div className="flex items-start gap-2.5">
                          {file.thumbnailLink ? (
                            <img 
                              src={file.thumbnailLink} 
                              alt={file.name} 
                              className="w-12 h-12 rounded-lg object-cover bg-stone-900 border border-stone-700 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-stone-800 flex items-center justify-center text-stone-400 flex-shrink-0">
                              <FileText className="w-6 h-6" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-white truncate" title={file.name}>
                              {file.name}
                            </p>
                            <p className="text-[10px] text-stone-500 font-mono truncate">{file.mimeType}</p>
                            {file.modifiedTime && (
                              <p className="text-[10px] text-stone-500">
                                {new Date(file.modifiedTime).toLocaleDateString('id-ID')}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-1.5 pt-2 border-t border-stone-800/80">
                          <div className="flex items-center gap-2">
                            {file.webViewLink ? (
                              <a
                                href={file.webViewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Buka File</span>
                              </a>
                            ) : (
                              <span />
                            )}

                            <button
                              onClick={() => handleSetFileAsMusic(file)}
                              className="text-[11px] text-amber-300 hover:text-amber-200 flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors cursor-pointer"
                              title="Jadikan file ini sebagai Musik Latar website"
                            >
                              <Music className="w-3 h-3 text-amber-400" />
                              <span>Musik Latar</span>
                            </button>
                          </div>

                          <button
                            onClick={() => copyToClipboard(file.webViewLink || file.id)}
                            className="text-[11px] text-stone-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-stone-800/60 hover:bg-stone-800 transition-colors"
                            title="Salin Tautan File"
                          >
                            {copiedFileUrl === (file.webViewLink || file.id) ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Tersalin!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Salin Tautan</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 rounded-xl bg-stone-950/40 border border-stone-800 text-center space-y-2">
                    <HardDrive className="w-8 h-8 text-stone-600 mx-auto" />
                    <p className="text-xs text-stone-400">
                      Belum ada file media yang diunggah ke folder Drive Donggala.
                    </p>
                    <p className="text-[11px] text-stone-500">
                      Klik "Unggah Foto/Media" untuk menambahkan gambar cagar budaya atau arsip bersejarah ke Google Drive Anda.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: DATA PREVIEW & BACKGROUND MUSIC */}
          {activeTab === 'preview' && (
            <div className="space-y-5">
              {/* PENGATURAN MUSIK LATAR AKTIF */}
              <div className="p-4.5 rounded-2xl bg-stone-950/80 border border-amber-500/30 shadow-lg space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Music className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-white font-serif-heading">
                          Pengaturan Musik Latar Website
                        </h4>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                          musicSourceType === 'custom'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}>
                          {musicSourceType === 'custom' ? 'Audio Kustom' : 'Synthesizer Pesisir'}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400">
                        Musik latar digitalisasi situs sejarah kota tua donggala yang dinikmati pengunjung website.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleTogglePlayMusic}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
                        isMusicPlaying
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white animate-pulse'
                          : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700'
                      }`}
                    >
                      {isMusicPlaying ? (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-white" />
                          <span>Hentikan Musik</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Uji Putar Musik Latar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1.5">
                      Judul Musik Latar:
                    </label>
                    <input
                      type="text"
                      value={musicTitleInput}
                      onChange={(e) => setMusicTitleInput(e.target.value)}
                      placeholder="Masukkan nama / judul musik latar..."
                      className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-600 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-300 mb-1.5">
                      Tautan Sumber Audio (MP3 / Google Drive URL):
                    </label>
                    <input
                      type="text"
                      value={musicUrlInput}
                      onChange={(e) => setMusicUrlInput(e.target.value)}
                      placeholder="Kosongkan untuk Synthesizer Suara Ombak, atau isi URL link..."
                      className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-600 focus:outline-hidden font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-800/80">
                  <p className="text-[11px] text-stone-400">
                    * Disimpan lokal dan tersinkronisasi ke tab <code className="text-amber-300 bg-stone-900 px-1 py-0.5 rounded font-mono">Pengaturan_Website</code> pada Google Sheets.
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetBackgroundMusic}
                      className="px-3 py-1.5 rounded-xl text-xs text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                    >
                      Kembalikan ke Suara Alami (Synthesizer)
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveBackgroundMusic}
                      className="px-4 py-1.5 rounded-xl bg-[#C85A32] hover:bg-[#b04d28] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      Simpan & Terapkan Musik Latar
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                    Daftar 15 Situs Cagar Budaya dalam Database Website
                  </h4>
                  <p className="text-[11px] text-stone-400">
                    Data berikut terhubung langsung ke Google Sheets. Anda dapat melihat ID dan nama setiap situs yang akan disinkronkan.
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-stone-800 text-stone-300">
                  {currentSites.length} Situs Terdaftar
                </span>
              </div>

              {/* Media Columns Information Card */}
              <div className="p-4 rounded-xl bg-[#13382c]/70 border border-[#d4af37]/40 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#ffd166]">
                  <Video className="w-4 h-4 text-rose-400" />
                  <span>Dukungan Database Media di Google Sheets:</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Anda dapat menyematkan dan memperbaharui media cagar budaya secara mandiri di lembar <code className="text-[#ffd166] bg-stone-900 px-1 py-0.5 rounded font-mono">Situs_Cagar_Budaya</code> melalui 4 kolom media baru:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1 text-[11px]">
                  <div className="p-2 rounded-lg bg-black/40 border border-stone-800">
                    <span className="font-mono text-rose-400 font-bold block">video360_url</span>
                    <span className="text-stone-400">Link MP4 atau YouTube 360° untuk Tur 360 interaktif.</span>
                  </div>
                  <div className="p-2 rounded-lg bg-black/40 border border-stone-800">
                    <span className="font-mono text-amber-400 font-bold block">video360_title</span>
                    <span className="text-stone-400">Judul klip tur 360° yang muncul di kontroler.</span>
                  </div>
                  <div className="p-2 rounded-lg bg-black/40 border border-stone-800">
                    <span className="font-mono text-sky-400 font-bold block">video_documentary_url</span>
                    <span className="text-stone-400">Tautan video dokumenter sejarah di modal detail.</span>
                  </div>
                  <div className="p-2 rounded-lg bg-black/40 border border-stone-800">
                    <span className="font-mono text-emerald-400 font-bold block">audio_url</span>
                    <span className="text-stone-400">File MP3 narasi panduan suara (Google Drive / public link).</span>
                  </div>
                </div>
              </div>

              <div className="border border-stone-800 rounded-xl overflow-hidden bg-stone-950/60">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-900/90 text-stone-400 text-[11px] uppercase tracking-wider sticky top-0 border-b border-stone-800">
                      <tr>
                        <th className="py-2.5 px-3">No</th>
                        <th className="py-2.5 px-3">ID Situs</th>
                        <th className="py-2.5 px-3">Nama Situs</th>
                        <th className="py-2.5 px-3">Tahun</th>
                        <th className="py-2.5 px-3">Kelurahan</th>
                        <th className="py-2.5 px-3">Video 360°</th>
                        <th className="py-2.5 px-3">Video Dok</th>
                        <th className="py-2.5 px-3">Audio</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/60 text-stone-300">
                      {currentSites.map((site, index) => (
                        <tr key={site.id} className="hover:bg-stone-900/40 transition-colors">
                          <td className="py-2 px-3 text-stone-500">{index + 1}</td>
                          <td className="py-2 px-3 font-mono text-[11px] text-[#c85a32]">{site.id}</td>
                          <td className="py-2 px-3 font-medium text-white">{site.title}</td>
                          <td className="py-2 px-3 font-semibold">{site.establishedYear}</td>
                          <td className="py-2 px-3 text-stone-400">{site.kelurahan}</td>
                          <td className="py-2 px-3">
                            {site.video360?.url ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                Tersedia
                              </span>
                            ) : (
                              <span className="text-[10px] text-stone-600">-</span>
                            )}
                          </td>
                          <td className="py-2 px-3">
                            {site.videoDocumentaryUrl ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                                Tersedia
                              </span>
                            ) : (
                              <span className="text-[10px] text-stone-600">-</span>
                            )}
                          </td>
                          <td className="py-2 px-3">
                            {site.audioNarration?.audioUrl ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                Rekaman
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-stone-800 text-stone-400">
                                TTS AI
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: KEAMANAN & KODE AKSES */}
          {activeTab === 'security' && (
            <div className="max-w-xl mx-auto space-y-5 py-2">
              <div className="p-5 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-serif-heading">
                      Pengaturan Kode Akses Administrator
                    </h4>
                    <p className="text-xs text-stone-400">
                      Perbaharui kode akses untuk melindungi panel pengelolaan website ini dari akses publik.
                    </p>
                  </div>
                </div>

                {passcodeMessage && (
                  <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                    passcodeMessage.type === 'success' 
                      ? 'bg-emerald-950/50 border-emerald-800 text-emerald-300' 
                      : 'bg-red-950/50 border-red-800 text-red-300'
                  }`}>
                    <Info className="w-4 h-4 flex-shrink-0" />
                    <span>{passcodeMessage.text}</span>
                  </div>
                )}

                <form onSubmit={handleUpdateAdminPasscode} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Kode Akses Saat Ini:
                    </label>
                    <input
                      type="password"
                      value={currentPasscodeAttempt}
                      onChange={(e) => setCurrentPasscodeAttempt(e.target.value)}
                      placeholder="Masukkan kode akses saat ini..."
                      className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        Kode Akses Baru:
                      </label>
                      <input
                        type="password"
                        value={newPasscode}
                        onChange={(e) => setNewPasscode(e.target.value)}
                        placeholder="Minimal 4 karakter..."
                        className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        Konfirmasi Kode Baru:
                      </label>
                      <input
                        type="password"
                        value={confirmNewPasscode}
                        onChange={(e) => setConfirmNewPasscode(e.target.value)}
                        placeholder="Ulangi kode baru..."
                        className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-stone-500">
                      Kode default: <code className="text-amber-400 font-mono">DONGGALA2026</code>
                    </span>

                    <button
                      type="submit"
                      disabled={!currentPasscodeAttempt || !newPasscode || !confirmNewPasscode}
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      Simpan Kode Baru
                    </button>
                  </div>
                </form>
              </div>

              {/* Lock session action card */}
              <div className="p-4 rounded-xl bg-stone-950/40 border border-stone-800 flex items-center justify-between gap-3">
                <div>
                  <h5 className="text-xs font-bold text-stone-200">Kunci Sesi Administrator</h5>
                  <p className="text-[11px] text-stone-400">
                    Tutup dan kunci kembali panel ini sehingga diperlukan kode akses untuk membukanya kembali.
                  </p>
                </div>

                {onLockAdmin && (
                  <button
                    type="button"
                    onClick={onLockAdmin}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white text-xs font-semibold border border-stone-700 transition-colors shrink-0"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Kunci Sesi Sekarang</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-stone-800 bg-stone-950/80 flex items-center justify-between text-xs text-stone-400 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Google Workspace API: Drive & Sheets Aktif</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>

      {/* Explicit User Confirmation Dialog (MANDATORY for Mutating / Workspace operations) */}
      {confirmDialog && confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl text-stone-200">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                confirmDialog.isDangerous ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {confirmDialog.isDangerous ? <AlertTriangle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="text-base font-bold text-white font-serif-heading">
                  {confirmDialog.title}
                </h4>
                <p className="text-xs text-stone-400">Konfirmasi Operasi Google Workspace</p>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed bg-stone-950/60 p-3 rounded-xl border border-stone-800">
              {confirmDialog.description}
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-md ${
                  confirmDialog.isDangerous
                    ? 'bg-red-600 hover:bg-red-500'
                    : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                {confirmDialog.actionLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
