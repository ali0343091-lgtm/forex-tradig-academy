import React, { useState } from 'react';
import { Check, Copy, ArrowRight, ShieldCheck, Sparkles, Video, BookOpen, Clock, Users, HelpCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.tsx';

interface FeesPageProps {
  navigate: (path: string) => void;
}

export const FeesPage: React.FC<FeesPageProps> = ({ navigate }) => {
  const { settings } = useSettings();
  const [copiedMethod, setCopiedMethod] = useState<string | null>(null);

  const copyToClipboard = (text: string, method: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMethod(method);
    setTimeout(() => setCopiedMethod(null), 2500);
  };

  const discountPercent = Math.round(
    ((settings.originalPrice - settings.discountedPrice) / settings.originalPrice) * 100
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Page Title */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
          Transparent Pricing
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display">
          Course Fees & Enrollment
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
          One-time course tuition. No hidden monthly charges or recurring fees.
        </p>
      </div>

      {/* Main Pricing Card */}
      <div className="max-w-2xl mx-auto bg-[#090e1d] border-2 border-amber-500/40 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-black px-6 py-2 rounded-bl-2xl font-black text-xs uppercase tracking-wider shadow-lg">
          Special Promotional Fee
        </div>

        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
              Comprehensive Institutional Forex Masterclass
            </span>
            <div className="flex items-baseline gap-3 mt-2">
              <span className="text-4xl sm:text-6xl font-extrabold text-white font-mono-numbers">
                PKR {settings.discountedPrice.toLocaleString()}
              </span>
              <span className="text-xl sm:text-2xl text-slate-500 line-through font-mono-numbers">
                PKR {settings.originalPrice.toLocaleString()}
              </span>
              <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full">
                SAVE {discountPercent}%
              </span>
            </div>
            <p className="text-xs text-amber-300 mt-2 font-medium">
              Current discounted price: PKR {settings.discountedPrice.toLocaleString()}. Includes all current modules and future video uploads.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-800 space-y-3 text-sm">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              What Is Included In Your Enrollment:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Full Access to All 9 Core Video Classes',
                'Institutional Order Block & Liquidity Mastery',
                'Strict 1:3 Risk Management Protocol',
                'Trading Psychology & Emotional Discipline',
                'Live Chart Analysis Case Studies',
                'Private Student Dashboard & Progress Tracker',
                'Access on Mobile, Tablet & Desktop PC',
                'Future Bonus Class Uploads by Instructor'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Account Details */}
          <div className="pt-6 border-t border-slate-800 space-y-4">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Accepted Manual Payment Methods:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Easypaisa */}
              <div className="bg-[#050813] border border-emerald-500/30 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-emerald-400 uppercase">Easypaisa</span>
                    <span className="text-[10px] text-slate-400">{settings.easypaisaAccountTitle}</span>
                  </div>
                  <div className="text-lg font-mono font-bold text-white tracking-wider my-2">
                    {settings.easypaisaNumber}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(settings.easypaisaNumber, 'easypaisa')}
                  className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold text-xs rounded-xl border border-emerald-500/30 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {copiedMethod === 'easypaisa' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedMethod === 'easypaisa' ? 'Number Copied!' : 'Copy Easypaisa Number'}</span>
                </button>
              </div>

              {/* JazzCash */}
              <div className="bg-[#050813] border border-amber-500/30 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-amber-400 uppercase">JazzCash</span>
                    <span className="text-[10px] text-slate-400">{settings.jazzcashAccountTitle}</span>
                  </div>
                  <div className="text-lg font-mono font-bold text-white tracking-wider my-2">
                    {settings.jazzcashNumber}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(settings.jazzcashNumber, 'jazzcash')}
                  className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold text-xs rounded-xl border border-amber-500/30 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {copiedMethod === 'jazzcash' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedMethod === 'jazzcash' ? 'Number Copied!' : 'Copy JazzCash Number'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button
              onClick={() => navigate('/register')}
              className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-extrabold text-base rounded-2xl shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Register Now for PKR {settings.discountedPrice.toLocaleString()}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
