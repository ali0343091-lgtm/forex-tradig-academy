import React, { useState, useRef } from 'react';
import { Upload, Copy, Check, ArrowRight, AlertCircle, CheckCircle2, FileImage, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useSettings } from '../context/SettingsContext.tsx';

interface PaymentSubmissionPageProps {
  navigate: (path: string) => void;
}

export const PaymentSubmissionPage: React.FC<PaymentSubmissionPageProps> = ({ navigate }) => {
  const { user, refreshUser } = useAuth();
  const { settings } = useSettings();

  const [method, setMethod] = useState<'Easypaisa' | 'JazzCash'>('Easypaisa');
  const [transactionRef, setTransactionRef] = useState('');
  const [amount, setAmount] = useState<number>(settings.discountedPrice || 15000);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // If not logged in, prompt to log in or register
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white font-display">Student Sign In Required</h2>
        <p className="text-sm text-slate-300">
          Please register or log in before submitting your course fee receipt so we can associate the verification with your student portal.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl border border-slate-700"
          >
            Log In
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl shadow-lg"
          >
            Register Account First
          </button>
        </div>
      </div>
    );
  }

  const selectedNumber = method === 'Easypaisa' ? settings.easypaisaNumber : settings.jazzcashNumber;
  const selectedTitle = method === 'Easypaisa' ? settings.easypaisaAccountTitle : settings.jazzcashAccountTitle;

  const copyNumber = () => {
    navigator.clipboard.writeText(selectedNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!transactionRef.trim()) {
      setError('Please provide the Transaction ID or Reference number.');
      return;
    }
    if (!selectedFile) {
      setError('Please attach your payment screenshot or receipt image.');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('method', method);
      formData.append('amount', String(amount));
      formData.append('transactionRef', transactionRef.trim());
      formData.append('receipt', selectedFile);

      const token = localStorage.getItem('fta_token');
      const res = await fetch('/api/payments/submit', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to submit payment receipt.');
        setSubmitting(false);
        return;
      }

      await refreshUser();
      setSubmitted(true);
      setSubmitting(false);
    } catch (err) {
      setError('Network connection error during submission.');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="bg-[#090e1d] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        <div className="text-center space-y-2 mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Manual Verification
          </span>
          <h1 className="text-2xl font-bold text-white font-display">
            Submit Payment Receipt
          </h1>
          <p className="text-xs text-slate-400">
            Student: <strong className="text-white">{user.name}</strong> ({user.email})
          </p>
        </div>

        {submitted ? (
          <div className="text-center space-y-5 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Receipt Submitted Successfully!</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                Your payment request has been securely recorded. Our academy administrator will review your receipt and transaction reference independently.
              </p>
            </div>

            <div className="p-4 bg-[#050813] border border-slate-800 rounded-2xl text-left text-xs space-y-1.5 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Method:</span>
                <span className="text-amber-400 font-bold">{method}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Amount:</span>
                <span className="text-white font-bold">PKR {amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Transaction ID:</span>
                <span className="text-cyan-300 font-bold">{transactionRef}</span>
              </div>
              <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                <span>Status:</span>
                <span className="text-amber-400 font-bold uppercase">Pending Verification</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => navigate('/status')}
                className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-extrabold text-sm rounded-xl shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Track Approval Status</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/student-dashboard')}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium text-xs rounded-xl border border-slate-800"
              >
                Go to Student Portal
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Select Method Tabs */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                1. Select Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMethod('Easypaisa')}
                  className={`py-3 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    method === 'Easypaisa'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                      : 'bg-[#050813] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span>Easypaisa</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('JazzCash')}
                  className={`py-3 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    method === 'JazzCash'
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-2 ring-amber-500/30'
                      : 'bg-[#050813] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>JazzCash</span>
                </button>
              </div>
            </div>

            {/* Display Selected Number Card with One-Tap Copy */}
            <div className="bg-[#050813] border border-amber-500/30 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase">
                  {method} Account Number:
                </span>
                <span className="text-[10px] text-slate-500">{selectedTitle}</span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-2xl font-mono font-bold text-white tracking-widest select-all">
                  {selectedNumber}
                </span>

                <button
                  type="button"
                  onClick={copyNumber}
                  className="px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Number'}</span>
                </button>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                2. Amount Paid (PKR)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
                className="w-full bg-[#050813] border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl py-2.5 px-4 text-white text-sm font-mono-numbers outline-none"
              />
            </div>

            {/* Transaction Reference / ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                3. Transaction Reference / TID <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 2938472918 or TRX-99214"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                required
                className="w-full bg-[#050813] border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl py-2.5 px-4 text-white text-sm outline-none placeholder:text-slate-600 font-mono"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Found in your SMS receipt or mobile app confirmation screen
              </span>
            </div>

            {/* Upload Receipt Screenshot */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                4. Payment Receipt Screenshot <span className="text-rose-400">*</span>
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="hidden"
                id="receipt-file-input"
              />

              <label
                htmlFor="receipt-file-input"
                className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  selectedFile
                    ? 'border-emerald-500/60 bg-emerald-500/5'
                    : 'border-slate-700 hover:border-slate-500 bg-[#050813]'
                }`}
              >
                {selectedFile ? (
                  <div className="flex items-center gap-3 text-left">
                    <FileImage className="w-8 h-8 text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-white truncate max-w-xs">
                        {selectedFile.name}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {(selectedFile.size / 1024).toFixed(0)} KB • Tap to replace
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-7 h-7 text-slate-400 mb-1.5" />
                    <span className="text-xs font-semibold text-amber-400">
                      Tap to Choose Screenshot from Phone / PC
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1">
                      JPG, PNG, WEBP or PDF receipt
                    </span>
                  </>
                )}
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting || !selectedFile || !transactionRef.trim()}
              className="w-full mt-2 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 disabled:opacity-50 text-black font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{submitting ? 'Submitting Receipt...' : 'Submit Payment for Verification'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
