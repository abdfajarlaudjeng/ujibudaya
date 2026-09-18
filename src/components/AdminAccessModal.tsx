import React, { useState } from 'react';
import { ShieldCheck, Lock, KeyRound, Eye, EyeOff, X, ArrowRight, AlertCircle } from 'lucide-react';

interface AdminAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockSuccess: () => void;
}

export const ADMIN_PASSCODE_KEY = 'donggala_admin_passcode';
export const DEFAULT_ADMIN_PASSCODE = 'DONGGALA2026';

export function getStoredAdminPasscode(): string {
  if (typeof window === 'undefined') return DEFAULT_ADMIN_PASSCODE;
  return localStorage.getItem(ADMIN_PASSCODE_KEY) || DEFAULT_ADMIN_PASSCODE;
}

export function setStoredAdminPasscode(newPasscode: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADMIN_PASSCODE_KEY, newPasscode.trim());
}

export const AdminAccessModal: React.FC<AdminAccessModalProps> = ({
  isOpen,
  onClose,
  onUnlockSuccess,
}) => {
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const correctCode = getStoredAdminPasscode();
      if (passcode.trim() === correctCode) {
        setIsLoading(false);
        setPasscode('');
        onUnlockSuccess();
      } else {
        setIsLoading(false);
        setError('Kode akses tidak sesuai. Silakan periksa kembali kode akses Anda.');
      }
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration bar */}
        <div className="h-2 bg-gradient-to-r from-[#C85A32] via-[#0F4C81] to-emerald-600" />

        <div className="p-6 sm:p-7">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon and Title */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#C85A32] shadow-xs">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-stone-900 font-serif-heading">
                  Akses Administrator
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-stone-100 text-stone-600 rounded-full border border-stone-200">
                  Terproteksi
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Pengelolaan website cagar budaya Kota Tua Donggala
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 mb-5 leading-relaxed">
            Halaman ini khusus untuk administrator pengelola situs. Masukkan kode akses Anda untuk membuka panel konfigurasi Google Sheets, cadangan Google Drive, pembaruan database situs, dan pengaturan musik latar.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Kode Akses Administrator
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (error) setError(null);
                  }}
                  autoFocus
                  placeholder="Masukkan kode akses..."
                  className="w-full pl-3.5 pr-10 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent tracking-wide"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-100 text-[11px] text-amber-900 leading-normal flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span>Petunjuk Awal: Kode default adalah </span>
                <code className="font-mono font-bold bg-amber-100 px-1 py-0.5 rounded text-amber-950">
                  DONGGALA2026
                </code>
                <span>. Anda dapat mengubah kode ini kapan saja di dalam panel administrator.</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={!passcode.trim() || isLoading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F4C81] hover:bg-[#0c3c66] disabled:opacity-50 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isLoading ? 'Memverifikasi...' : 'Buka Panel Admin'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
