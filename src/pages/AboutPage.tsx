import React from 'react';
import { ShieldCheck, Target, Award, BookOpen, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.tsx';
import { Logo } from '../components/Logo.tsx';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  const { settings } = useSettings();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-2">
          <Logo size="lg" showText={false} />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
          Our Philosophy & Mission
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display">
          About {settings.academyName}
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto font-light">
          {settings.tagline}
        </p>
      </div>

      {/* Core Mission */}
      <div className="bg-[#080d1b] border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-6">
        <h2 className="text-2xl font-bold text-white font-display">
          An Academy Built on Discipline, Not Delusion
        </h2>
        <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <p>
            The retail forex education industry is unfortunately saturated with flashy cars, falsified trading statements, and impossible promises of overnight millions. 
            <strong> {settings.academyName}</strong> was founded to offer an unapologetic antidote to that culture.
          </p>
          <p>
            Professional trading is not gambling; it is a game of statistics, execution consistency, and emotional equilibrium. A trader who risks 10% on every trade will inevitably go broke, regardless of their analysis. Conversely, a trader who risks strictly 1% with an asymmetric 1:3 risk-to-reward ratio will thrive even with a 40% win rate.
          </p>
          <p>
            Our curriculum strips away lagging indicators and teaches the foundational mechanics of the $7.5 Trillion daily currency market: how commercial banks move liquidity, how algorithmic order blocks form, and how to execute with calculated precision.
          </p>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#070b17] border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white font-display">1. Pure Price Action</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We do not sell magic indicators, automated robots, or "secret" algorithms. You will learn to read naked Japanese candlesticks, market structure shifts, and liquidity sweeps.
          </p>
        </div>

        <div className="bg-[#070b17] border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white font-display">2. Unforgiving Risk Control</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every lesson emphasizes capital preservation first. We enforce the 1% risk rule and calculated lot sizing on every single trade before any profit target is even considered.
          </p>
        </div>

        <div className="bg-[#070b17] border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white font-display">3. Transparent Manual Verification</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We maintain an honest, manual enrollment protocol. Students transfer fees directly via Easypaisa or JazzCash, and our human administrator verifies each transaction before granting course access.
          </p>
        </div>

        <div className="bg-[#070b17] border border-slate-800 p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white font-display">4. Zero False Promises</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We will never guarantee profits or claim trading is easy. It demands practice, emotional maturity, and months of simulated execution before risking live capital.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-amber-500/10 via-[#0a0f1d] to-cyan-500/10 border border-amber-500/30 rounded-3xl p-8 text-center space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
          Ready to learn real currency market trading?
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
          Enroll in the complete academy today for the discounted rate of PKR {settings.discountedPrice.toLocaleString()}.
        </p>
        <button
          onClick={() => navigate('/register')}
          className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm rounded-xl transition-all shadow-lg inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Register for Access</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
