import React, { useState } from 'react';
import { Copy, Check, ArrowRight, ShieldCheck, Smartphone, CheckCircle, AlertTriangle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.tsx';

interface PaymentInstructionsPageProps {
  navigate: (path: string) => void;
}

export const PaymentInstructionsPage: React.FC<PaymentInstructionsPageProps> = ({ navigate }) => {
  const { settings } = useSettings();
  const [copiedMethod, setCopiedMethod] = useState<string | null>(null);

  const copyToClipboard = (text: string, method: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMethod(method);
    setTimeout(() => setCopiedMethod(null), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
          Manual Payment Guide
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display">
          How to Pay via Easypaisa & JazzCash
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
          Course Fee: <span className="text-amber-400 font-bold">PKR {settings.discountedPrice.toLocaleString()}</span>. Follow these exact steps to complete your transfer.
        </p>
      </div>

      {/* Account Numbers Prominent Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Method 1: Easypaisa */}
        <div className="bg-[#090e1d] border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-sm">
                EP
              </span>
              <div>
                <h3 className="text-lg font-bold text-white">Method 1: Easypaisa</h3>
                <span className="text-xs text-slate-400">{settings.easypaisaAccountTitle}</span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
              Active
            </span>
          </div>

          <div className="bg-[#050813] border border-slate-800 rounded-2xl p-4">
            <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1">
              Easypaisa Account Number:
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-widest select-all">
              {settings.easypaisaNumber}
            </div>
          </div>

          <button
            onClick={() => copyToClipboard(settings.easypaisaNumber, 'easypaisa')}
            className="w-full py-3 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {copiedMethod === 'easypaisa' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedMethod === 'easypaisa' ? 'Easypaisa Number Copied!' : 'Copy Easypaisa Number'}</span>
          </button>

          {/* Steps for Easypaisa */}
          <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
            <p className="font-bold text-white">How to send via Easypaisa App:</p>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-400">
              <li>Open your Easypaisa Mobile App and sign in.</li>
              <li>Tap <strong>Send Money</strong> &gt; <strong>Easypaisa Transfer</strong>.</li>
              <li>Enter Account Number: <strong className="text-white">{settings.easypaisaNumber}</strong>.</li>
              <li>Enter exact Amount: <strong className="text-emerald-400 font-bold">PKR {settings.discountedPrice.toLocaleString()}</strong>.</li>
              <li>Verify receiver title and tap <strong>Send Now</strong>.</li>
              <li><strong>Save or Screenshot the Receipt</strong> with Transaction ID!</li>
            </ol>
          </div>
        </div>

        {/* Method 2: JazzCash */}
        <div className="bg-[#090e1d] border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-sm">
                JC
              </span>
              <div>
                <h3 className="text-lg font-bold text-white">Method 2: JazzCash</h3>
                <span className="text-xs text-slate-400">{settings.jazzcashAccountTitle}</span>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
              Active
            </span>
          </div>

          <div className="bg-[#050813] border border-slate-800 rounded-2xl p-4">
            <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1">
              JazzCash Account Number:
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-widest select-all">
              {settings.jazzcashNumber}
            </div>
          </div>

          <button
            onClick={() => copyToClipboard(settings.jazzcashNumber, 'jazzcash')}
            className="w-full py-3 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {copiedMethod === 'jazzcash' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedMethod === 'jazzcash' ? 'JazzCash Number Copied!' : 'Copy JazzCash Number'}</span>
          </button>

          {/* Steps for JazzCash */}
          <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
            <p className="font-bold text-white">How to send via JazzCash App or *786#:</p>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-400">
              <li>Open JazzCash App or dial *786# from your Jazz SIM.</li>
              <li>Select <strong>Send Money</strong> &gt; <strong>To JazzCash Account</strong>.</li>
              <li>Enter Account Number: <strong className="text-white">{settings.jazzcashNumber}</strong>.</li>
              <li>Enter exact Amount: <strong className="text-amber-400 font-bold">PKR {settings.discountedPrice.toLocaleString()}</strong>.</li>
              <li>Confirm with your MPIN.</li>
              <li><strong>Save or Screenshot the Receipt</strong> containing your TID (Transaction ID)!</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Critical Security Box */}
      <div className="bg-[#0b101f] border border-slate-800 rounded-2xl p-6 flex items-start gap-4 text-xs text-slate-300">
        <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white">Important Security Notice</h4>
          <p className="text-slate-400 leading-relaxed">
            We will <strong>NEVER</strong> ask for your Easypaisa or JazzCash PIN, MPIN, password, or SMS OTP codes. Only send the course fee to the two official numbers above. Keep your transaction reference safe for the verification form.
          </p>
        </div>
      </div>

      {/* Next Step CTA */}
      <div className="text-center space-y-4 pt-4">
        <h3 className="text-xl font-bold text-white">Already Completed Your Transfer?</h3>
        <p className="text-xs text-slate-400">
          Upload your screenshot and enter your transaction ID on our verification page.
        </p>
        <button
          onClick={() => navigate('/payment-submission')}
          className="px-8 py-3.5 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-extrabold text-sm rounded-xl shadow-xl inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Go to Payment Submission Page</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
