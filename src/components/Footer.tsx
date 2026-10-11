import React, { useState } from 'react';
import { Copy, Check, Shield, AlertTriangle, Phone, Mail, Award } from 'lucide-react';
import { Logo } from './Logo.tsx';
import { useSettings } from '../context/SettingsContext.tsx';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { settings } = useSettings();
  const [copiedMethod, setCopiedMethod] = useState<string | null>(null);

  const copyToClipboard = (text: string, method: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMethod(method);
    setTimeout(() => setCopiedMethod(null), 2500);
  };

  return (
    <footer className="bg-[#03060d] border-t border-slate-800/80 text-slate-400 text-sm">
      {/* Upper Footer - Payment Methods Strip */}
      <div className="border-b border-slate-800/60 bg-[#050814]/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h4 className="text-white font-bold text-base flex items-center gap-2 justify-center md:justify-start">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Official Manual Payment Accounts
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Course Fee: <span className="text-amber-400 font-bold">PKR {settings.discountedPrice.toLocaleString()}</span> (Save 70% off original PKR {settings.originalPrice.toLocaleString()})
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Easypaisa Box */}
            <div className="bg-[#080d1d] border border-emerald-500/30 rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-lg">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                EP
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
                  Easypaisa
                </span>
                <span className="text-sm font-mono font-bold text-white tracking-wide">
                  {settings.easypaisaNumber}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(settings.easypaisaNumber, 'easypaisa')}
                className="ml-2 p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 transition-colors"
                title="Copy Easypaisa Number"
              >
                {copiedMethod === 'easypaisa' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* JazzCash Box */}
            <div className="bg-[#080d1d] border border-amber-500/30 rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-lg">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                JC
              </div>
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                  JazzCash
                </span>
                <span className="text-sm font-mono font-bold text-white tracking-wide">
                  {settings.jazzcashNumber}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(settings.jazzcashNumber, 'jazzcash')}
                className="ml-2 p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 transition-colors"
                title="Copy JazzCash Number"
              >
                {copiedMethod === 'jazzcash' ? (
                  <Check className="w-4 h-4 text-amber-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Logo size="md" />
            <p className="text-xs text-slate-400 leading-relaxed">
              {settings.tagline} A disciplined institutional trading academy dedicated to risk-first currency market execution and real price action.
            </p>
            <div className="text-xs text-slate-500">
              <p>Email: {settings.contactEmail}</p>
              <p>Phone: {settings.contactPhone}</p>
            </div>
          </div>

          {/* Quick Academy Navigation */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Academy
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/')} className="hover:text-amber-400 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-amber-400 transition-colors">
                  About the Academy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/fees')} className="hover:text-amber-400 transition-colors">
                  Course Fees & Curriculum
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/payment-instructions')} className="hover:text-amber-400 transition-colors">
                  Payment Instructions
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-amber-400 transition-colors">
                  Contact Instructor
                </button>
              </li>
            </ul>
          </div>

          {/* Student Portal Links */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-white mb-4">
              Student Access
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/register')} className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                  New Student Registration
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/login')} className="hover:text-amber-400 transition-colors">
                  Student Login
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/payment-submission')} className="hover:text-amber-400 transition-colors">
                  Submit Payment Receipt
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/status')} className="hover:text-amber-400 transition-colors">
                  Check Approval Status
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/admin-login')} className="text-slate-500 hover:text-slate-300 transition-colors">
                  Admin Login
                </button>
              </li>
            </ul>
          </div>

          {/* Educational Risk Disclaimer */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-widest text-white mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Risk Disclaimer
            </h5>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Trading foreign exchange (Forex) on margin carries high risk and may not be suitable for all investors. FOREX TRADING ACADEMY provides strict financial education and risk control methods. We never claim guaranteed profits or unrealistic returns. Trade only with risk capital you can afford to lose.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} FOREX TRADING ACADEMY. All rights reserved.
          </p>
          <div className="flex gap-4">
            <button onClick={() => navigate('/privacy')} className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={() => navigate('/terms')} className="hover:text-slate-300 transition-colors">
              Terms & Conditions
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
