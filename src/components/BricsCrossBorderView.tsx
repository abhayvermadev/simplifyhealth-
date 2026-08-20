import React, { useState } from 'react';
import { BRICS_PARTNER_COUNTRIES } from '../data/bricsData';
import {
  Globe2,
  ShieldCheck,
  Lock,
  Cpu,
  RefreshCw,
  EyeOff,
  Scale,
} from 'lucide-react';

interface BricsCrossBorderViewProps {
  onTriggerNationalNavigation?: (countryId: string) => void;
}

export const BricsCrossBorderView: React.FC<BricsCrossBorderViewProps> = () => {
  const [selectedCountryId, setSelectedCountryId] = useState<string>('india');
  const [isSyncingGradients, setIsSyncingGradients] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const selectedCountry =
    BRICS_PARTNER_COUNTRIES.find((c) => c.id === selectedCountryId) || BRICS_PARTNER_COUNTRIES[0];

  // Trigger simulated zero-leakage federated learning gradient synchronization
  const handleTriggerPrivacyGradientSync = () => {
    setIsSyncingGradients(true);
    setSyncFeedback('Initiating Secure Multi-Party Computation (SMPC)... Injecting ε-DP noise (ε=0.5)...');

    setTimeout(() => {
      setIsSyncingGradients(false);
      setSyncFeedback('✓ Global Federated Weights Synchronized. 0 raw data bytes transferred across borders.');
      setTimeout(() => setSyncFeedback(null), 5000);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Sovereign Privacy Enclave Guarantee */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Globe2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                    BRICS Cross-Border Health Grid & Privacy-Preserving AI
                  </h1>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Zero Raw-Data Sharing Policy
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Multi-nation primary healthcare telemetry and privacy-preserving federated intelligence across BRICS member states
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTriggerPrivacyGradientSync}
              disabled={isSyncingGradients}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingGradients ? 'animate-spin' : ''}`} />
              <span>{isSyncingGradients ? 'Computing SMPC Weights...' : 'Sync Privacy-Preserved Gradients'}</span>
            </button>
          </div>
        </div>

        {/* Live Feedback Toast if active */}
        {syncFeedback && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-fade-in">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{syncFeedback}</span>
          </div>
        )}

        {/* 4 Sovereign Enclave Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-medium">Raw Patient Data Exported</span>
              <EyeOff className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-600">0 Bytes</div>
            <div className="text-[11px] text-slate-500 mt-1">100% in-country sovereign enclaves</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-medium">Differential Privacy Guarantee</span>
              <Lock className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-indigo-600">ε = 0.5 (Strict)</div>
            <div className="text-[11px] text-slate-500 mt-1">Laplacian noise injected on gradients</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-medium">Inter-Nation Cryptography</span>
              <Cpu className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-base font-bold text-slate-900 mt-1">SMPC Enclaves</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Homomorphic weight aggregation</div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-medium">Regulatory Sovereignty</span>
              <Scale className="w-4 h-4 text-slate-700" />
            </div>
            <div className="text-xs font-bold text-slate-900 mt-1">DPDP 🇮🇳 • LGPD 🇧🇷 • POPIA 🇿🇦</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">✓ Full Statutory Compliance</div>
          </div>
        </div>
      </div>

      {/* 2. BRICS Sovereign Health Authority Selector */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-wide">
              BRICS Sovereign Health Authority Enclaves
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any BRICS nation to inspect its national health architecture, primary care unit taxonomy, and isolated data boundaries
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">5 Sovereign Member States</span>
        </div>

        {/* Country Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {BRICS_PARTNER_COUNTRIES.map((country) => {
            const isSelected = selectedCountryId === country.id;
            return (
              <button
                key={country.id}
                onClick={() => setSelectedCountryId(country.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{country.flagEmoji}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {country.code}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">{country.name}</div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">{country.healthAuthority.split('&')[0]}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Country Profile Card */}
        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedCountry.flagEmoji}</span>
                <span className="text-sm font-bold text-slate-900">{selectedCountry.name} Health Framework</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-medium">
                  {selectedCountry.dataSovereigntyStatus}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                Governing Authority: <span className="text-slate-900">{selectedCountry.healthAuthority}</span>
              </p>
            </div>

            <div className="text-left md:text-right">
              <span className="text-[11px] text-slate-500 block">Sovereign Privacy Legislation</span>
              <span className="text-xs font-bold text-slate-900">{selectedCountry.privacyAct}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Primary Clinic Unit Taxonomy:</span>
              <span className="font-semibold text-slate-800">{selectedCountry.primaryClinicType}</span>
              <span className="text-[11px] text-slate-400 block font-mono">
                {selectedCountry.totalPrimaryUnits.toLocaleString()} Registered Nodes
              </span>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">Emergency / Referral Center:</span>
              <span className="font-semibold text-slate-800">{selectedCountry.emergencyUnitType}</span>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">Key Epidemic Surveillance Vectors:</span>
              <span className="font-semibold text-indigo-700">
                {selectedCountry.keySurveillanceVectors.join(' • ')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
