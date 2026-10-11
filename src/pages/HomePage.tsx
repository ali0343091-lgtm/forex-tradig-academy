import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Shield, TrendingUp, BookOpen, Clock, Copy, Check, Award, UserCheck, DollarSign, Sparkles } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.tsx';
import { ForexChart } from '../components/ForexChart.tsx';
import { RiskCalculator } from '../components/RiskCalculator.tsx';
import { Logo } from '../components/Logo.tsx';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { settings } = useSettings();
  const [copiedMethod, setCopiedMethod] = useState<string | null>(null);

  const copyToClipboard = (text: string, method: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMethod(method);
    setTimeout(() => setCopiedMethod(null), 2500);
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-12 overflow-hidden bg-grid-pattern">
        {/* Glow ambient background lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Announcement pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-6 animate-pulse-glow shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Limited Batch Offer: PKR {settings.discountedPrice.toLocaleString()} (Regular PKR {settings.originalPrice.toLocaleString()})</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 font-display">
            FOREX TRADING <span className="gold-gradient-text">ACADEMY</span>
          </h1>

          <p className="text-lg sm:text-2xl font-light text-slate-300 max-w-3xl mx-auto mb-4 tracking-wide font-sans">
            {settings.tagline}
          </p>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop relying on conflicting indicators and gambling mentality. Learn institutional price action, liquidity order blocks, and bulletproof 1% risk management from verified mentor classes.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-12">
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-extrabold text-sm sm:text-base rounded-xl shadow-xl shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Register Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/fees')}
              className="w-full sm:w-auto px-6 py-4 bg-[#0a0f1d] hover:bg-slate-800 text-white font-bold text-sm sm:text-base rounded-xl border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
            >
              View Course Fees & Outline
            </button>
          </div>

          {/* Quick Price & Payment Notice Card */}
          <div className="max-w-2xl mx-auto bg-[#070b17]/90 border border-amber-500/30 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <span className="text-xs uppercase tracking-wider text-slate-400 block font-semibold">
                  Course Enrollment Fee
                </span>
                <div className="flex items-baseline gap-2 justify-center sm:justify-start mt-0.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono-numbers">
                    PKR {settings.discountedPrice.toLocaleString()}
                  </span>
                  <span className="text-sm text-slate-500 line-through">
                    PKR {settings.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    70% OFF
                  </span>
                </div>
              </div>

              {/* Direct Fast Payment Transfer Buttons */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-[11px] text-slate-400">Manual Transfer:</span>
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => copyToClipboard(settings.easypaisaNumber, 'easypaisa')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-500/25 transition-colors"
                      title="Tap to copy Easypaisa number"
                    >
                      {copiedMethod === 'easypaisa' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Easypaisa: {settings.easypaisaNumber}</span>
                    </button>
                    <button
                      onClick={() => copyToClipboard(settings.jazzcashNumber, 'jazzcash')}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-amber-500/25 transition-colors"
                      title="Tap to copy JazzCash number"
                    >
                      {copiedMethod === 'jazzcash' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>JazzCash: {settings.jazzcashNumber}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Interactive Candlestick Chart Viewport */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Technical Execution
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Real-Time Market Structure Analysis
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-sm">
            Experience our institutional charting paradigm. No confusing indicators; only raw price action, liquidity, and supply/demand zones.
          </p>
        </div>

        <ForexChart />
      </section>

      {/* Simple 4-Step Student Access Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            How It Works
          </span>
          <h2 className="text-3xl font-bold text-white mt-1 mb-3 font-display">
            Simple 4-Step Enrollment Process
          </h2>
          <p className="text-sm text-slate-400">
            Transparent and secure manual verification. We inspect every transfer to ensure fair access.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="bg-[#080d1b] border border-slate-800 rounded-2xl p-6 relative group hover:border-amber-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-lg mb-4">
              1
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Register Account</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Open the simple registration form with your name, email, and password. Phone is optional.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="mt-4 text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>Register Now</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Step 2 */}
          <div className="bg-[#080d1b] border border-slate-800 rounded-2xl p-6 relative group hover:border-amber-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-lg mb-4">
              2
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Send PKR 15,000 Fee</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transfer via your phone banking app using Easypaisa (03135279108) or JazzCash (03430919084). Take a screenshot.
            </p>
            <button
              onClick={() => navigate('/payment-instructions')}
              className="mt-4 text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>View Guide</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Step 3 */}
          <div className="bg-[#080d1b] border border-slate-800 rounded-2xl p-6 relative group hover:border-amber-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-lg mb-4">
              3
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Submit Receipt</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Log in to your account and upload your receipt screenshot along with your transaction reference number.
            </p>
            <button
              onClick={() => navigate('/payment-submission')}
              className="mt-4 text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Upload Receipt</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Step 4 */}
          <div className="bg-[#080d1b] border border-slate-800 rounded-2xl p-6 relative group hover:border-amber-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-lg mb-4">
              4
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Admin Approval</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our academy administrator verifies the receipt and approves your access. Stream private classes anytime on phone or PC!
            </p>
            <button
              onClick={() => navigate('/status')}
              className="mt-4 text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>Check Status</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Risk & Discipline Calculator Tool */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RiskCalculator />
      </section>

      {/* Curriculum Outline Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Structured Education
          </span>
          <h2 className="text-3xl font-bold text-white mt-1 mb-3 font-display">
            The Complete Academy Curriculum
          </h2>
          <p className="text-sm text-slate-400">
            From complete beginner basics to institutional liquidity sweeps and strict risk management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Module 1 */}
          <div className="bg-[#070b18] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                Module 1
              </div>
              <h3 className="text-lg font-bold text-white mb-3">
                Market Foundations & Mechanics
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Anatomy of global forex & broker mechanics</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Calculating pips, lot sizes, leverage, & margin</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>4 Global trading sessions & high-volume overlaps</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 3 Classes</span>
              <span className="text-emerald-400 font-semibold">Included</span>
            </div>
          </div>

          {/* Module 2 */}
          <div className="bg-[#070b18] border border-amber-500/30 rounded-2xl p-6 flex flex-col justify-between shadow-xl shadow-amber-500/5">
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                Module 2 • Core Engine
              </div>
              <h3 className="text-lg font-bold text-white mb-3">
                Institutional Price Action & Candlesticks
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>High-probability candlestick formations & wicks</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Order Blocks (OB), Fair Value Gaps (FVG) & BOS</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Asian range liquidity raids & institutional sweeps</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 3 Classes</span>
              <span className="text-amber-400 font-semibold">Advanced</span>
            </div>
          </div>

          {/* Module 3 */}
          <div className="bg-[#070b18] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                Module 3
              </div>
              <h3 className="text-lg font-bold text-white mb-3">
                Risk Management & Discipline Protocol
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Ironclad 1% risk rule & 1:3 risk-to-reward ratios</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Eliminating FOMO, greed & revenge trading</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Building your verified trading journal & routine</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 3 Classes</span>
              <span className="text-cyan-400 font-semibold">Mastery</span>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/fees')}
            className="inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300"
          >
            <span>Explore Complete Class Breakdown & Syllabus</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Instructor Spotlight Section (Honoring requirement 11) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#090e1e] border border-amber-500/25 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Instructor Portrait/Placeholder */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-2xl bg-[#050813] flex items-center justify-center">
                  {settings.instructorAvatar ? (
                    <img
                      src={settings.instructorAvatar}
                      alt={settings.instructorName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      <Logo size="lg" showText={false} />
                      <span className="text-xs font-semibold text-amber-300 mt-3 font-display">
                        Official Academy Mentor
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1">
                        Portrait Uploadable in Admin Panel
                      </span>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-3 -right-3 bg-amber-500 text-black px-3 py-1 rounded-full text-[10px] font-extrabold uppercase shadow-lg">
                  Lead Instructor
                </div>
              </div>
            </div>

            {/* Bio and Philosophy */}
            <div className="md:col-span-2 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Meet Your Mentor
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
                {settings.instructorName}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {settings.instructorBio}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-[#04060f] p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Methodology</span>
                  <span className="text-xs font-bold text-amber-300">Pure Price Action</span>
                </div>
                <div className="bg-[#04060f] p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Core Rule</span>
                  <span className="text-xs font-bold text-white">1% Max Risk Per Trade</span>
                </div>
                <div className="bg-[#04060f] p-3 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
                  <span className="text-[10px] uppercase text-slate-400 font-bold block">Support</span>
                  <span className="text-xs font-bold text-emerald-400">Direct Verification</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Final Section */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-gradient-to-b from-[#0e172e] to-[#080d1b] border border-amber-500/40 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
            Start Your Disciplined Trading Journey
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Join the students mastering currency price action without hype. Register in 30 seconds, send your fee via Easypaisa or JazzCash, and start learning.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-extrabold text-sm rounded-xl shadow-xl shadow-amber-500/20 transition-all cursor-pointer"
            >
              Register for PKR 15,000
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-sm rounded-xl border border-slate-700"
            >
              Already Registered? Log In
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
