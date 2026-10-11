import React from 'react';
import { AlertTriangle, Shield, CheckCircle, Scale } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.tsx';

export const TermsPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
          Academy Rules & Compliance
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
          Terms & Conditions
        </h1>
        <p className="text-xs text-slate-400">
          Last revised: October 2026 • {settings.academyName}
        </p>
      </div>

      <div className="bg-[#080d1b] border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-8 text-sm text-slate-300 leading-relaxed">
        {/* Risk Disclaimer Box */}
        <div className="p-5 bg-rose-500/10 border border-rose-500/30 rounded-2xl space-y-2 text-rose-200">
          <h3 className="font-bold text-white flex items-center gap-2 text-base">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            Educational Disclaimer & Financial Risk Warning
          </h3>
          <p className="text-xs text-rose-300 leading-relaxed">
            All materials, lessons, videos, charts, and mentorship provided by {settings.academyName} are strictly for educational and instructional purposes. We do not provide personalized financial, investment, or trading advice. Trading foreign exchange (Forex) involves significant risk of loss. Past performance does not guarantee future results.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-400" />
            1. Manual Payment & Verification Policy
          </h2>
          <p>
            Course tuition (PKR {settings.discountedPrice.toLocaleString()}) is submitted manually via Easypaisa or JazzCash. Registration alone does not grant access to paid courses. The academy reserves the right to verify every transaction reference against actual bank/wallet records before approving access. Submitting falsified transaction IDs or fraudulent receipts will result in immediate and permanent account termination.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            2. Intellectual Property & Anti-Piracy
          </h2>
          <p>
            All video lectures, lesson modules, diagrams, and proprietary risk frameworks are the sole property of {settings.academyName}. Enrolled students are granted a single-user personal license. Sharing account credentials, downloading protected video feeds, screen recording for public re-distribution, or reselling course content is strictly forbidden and subject to account revocation.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-amber-400" />
            3. Student Discipline Code
          </h2>
          <p>
            Students are expected to adhere to our discipline protocol: practice on demo simulator accounts before live capital, respect the 1% risk limit per trade, and never engage in revenge trading or uncalculated leverage gambling.
          </p>
        </section>
      </div>
    </div>
  );
};
