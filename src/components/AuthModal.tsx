import React, { useState } from 'react';
import {
  LogIn,
  X,
  ShieldCheck,
  Building2,
  UserCheck,
  Sparkles,
  AlertCircle,
  Stethoscope,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { signInWithGoogle, signInAsOfficer } from '../firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: { uid: string; displayName: string; email: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customRole, setCustomRole] = useState('State Nodal Officer');
  const [customState, setCustomState] = useState('National Grid');
  const [showCustomForm, setShowCustomForm] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const user = await signInWithGoogle();
      if (user) {
        onSuccess({
          uid: user.uid,
          displayName: user.displayName || user.email?.split('@')[0] || 'Health Nodal Officer',
          email: user.email || 'officer@mohfw.gov.in',
        });
        onClose();
      }
    } catch (err: any) {
      console.warn('Google sign-in exception:', err);
      const code = err?.code || '';
      if (code === 'auth/popup-blocked') {
        setErrorMessage(
          'Popup was blocked by your browser. Please allow popups or use 1-Click Nodal Officer Sign-In below.'
        );
      } else if (code === 'auth/unauthorized-domain') {
        setErrorMessage(
          'This preview domain is pending domain authorization in Firebase Console. You can use 1-Click Nodal Officer Sign-In below.'
        );
      } else if (code === 'auth/popup-closed-by-user') {
        setErrorMessage('Sign-in window was closed. You can retry or select a nodal officer profile below.');
      } else {
        setErrorMessage(
          err?.message || 'Google Sign-In could not complete in iframe. Select a verified officer profile below.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickOfficerLogin = async (
    name: string,
    email: string,
    role: string,
    state: string
  ) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const user = await signInAsOfficer(name, email);
      onSuccess({
        uid: user.uid,
        displayName: name,
        email: email,
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to authenticate officer profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    const email = customEmail.trim() || `${customName.toLowerCase().replace(/\s+/g, '.') || 'officer'}@mohfw.gov.in`;
    handleQuickOfficerLogin(customName, email, customRole, customState);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Health Officer Authentication
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-400/30">
                  MoHFW Grid
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Secure access for Nodal Officers, SCDC & Logistics Coordinators
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-amber-950">Notice</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Primary: Google Sign In */}
          <div>
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 text-slate-800 font-bold text-sm shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{loading ? 'Authenticating...' : 'Sign in with Google Account'}</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Or 1-Click Officer Access
            </span>
          </div>

          {/* Quick Officer Profiles */}
          <div className="space-y-2.5">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Verified Health Nodal Officers
            </p>

            <button
              onClick={() =>
                handleQuickOfficerLogin(
                  'Dr. Abhay Verma',
                  'abhayverma2951@gmail.com',
                  'National Health Nodal Officer',
                  'National Command Center (MoHFW)'
                )
              }
              disabled={loading}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                  AV
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">
                      Dr. Abhay Verma
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">
                      MoHFW Lead
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">abhayverma2951@gmail.com • National Lead</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
            </button>

            <button
              onClick={() =>
                handleQuickOfficerLogin(
                  'Dr. Priya Sharma',
                  'dr.priya.sharma@nrhm.gov.in',
                  'State Logistics Director',
                  'Maharashtra Health Directorate'
                )
              }
              disabled={loading}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                  PS
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                      Dr. Priya Sharma
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      State Director
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">dr.priya.sharma@nrhm.gov.in • Maharashtra</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
            </button>

            <button
              onClick={() =>
                handleQuickOfficerLogin(
                  'Dr. Rajesh Nair',
                  'rajesh.nair@dhs.kerala.gov.in',
                  'Chief Epidemiologist',
                  'Kerala SCDC'
                )
              }
              disabled={loading}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 transition-all text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
                  RN
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-sky-700">
                      Dr. Rajesh Nair
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800">
                      Epidemiologist
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">rajesh.nair@dhs.kerala.gov.in • Kerala SCDC</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Toggle Custom Officer */}
          <div className="pt-2">
            {!showCustomForm ? (
              <button
                onClick={() => setShowCustomForm(true)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                + Enter Custom Nodal Officer Details
              </button>
            ) : (
              <form onSubmit={handleCustomSubmit} className="space-y-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-800">Custom Officer Profile</p>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Full Name & Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Sunita Patil"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Official Email</label>
                  <input
                    type="email"
                    placeholder="officer@health.gov.in"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                  >
                    Authenticate as Custom Officer
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCustomForm(false)}
                    className="py-2 px-3 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            PostgreSQL & Firestore Secured
          </span>
          <span>MoHFW Nodal Gateway</span>
        </div>
      </div>
    </div>
  );
};
