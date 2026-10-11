import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, Send, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.tsx';

interface ContactPageProps {
  navigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = () => {
  const { settings } = useSettings();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
          Support & Inquiries
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display">
          Contact the Academy
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Have questions regarding manual payment verification, enrollment status, or course curriculum? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* WhatsApp Card */}
        <div className="bg-[#080d1b] border border-slate-800 rounded-2xl p-6 text-center space-y-3 hover:border-emerald-500/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">WhatsApp Support</h3>
          <p className="text-xs text-slate-400">Fastest response for payment receipts and queries</p>
          <a
            href={`https://wa.me/92${settings.whatsappNumber.replace(/^0/, '')}`}
            target="_blank"
            rel="noreferrer"
            className="inline-block px-4 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-bold text-xs rounded-xl"
          >
            {settings.whatsappNumber}
          </a>
        </div>

        {/* Phone Card */}
        <div className="bg-[#080d1b] border border-slate-800 rounded-2xl p-6 text-center space-y-3 hover:border-amber-500/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
            <Phone className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Direct Phone</h3>
          <p className="text-xs text-slate-400">Monday to Saturday: 10:00 AM – 8:00 PM</p>
          <div className="font-mono font-bold text-white text-sm">
            {settings.contactPhone}
          </div>
        </div>

        {/* Email Card */}
        <div className="bg-[#080d1b] border border-slate-800 rounded-2xl p-6 text-center space-y-3 hover:border-cyan-500/40 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Official Email</h3>
          <p className="text-xs text-slate-400">For enrollment documentation and verification</p>
          <div className="font-mono font-bold text-cyan-300 text-xs truncate">
            {settings.contactEmail}
          </div>
        </div>
      </div>

      {/* Inquiry Form */}
      <div className="bg-[#090e1d] border border-slate-800 rounded-3xl p-6 sm:p-10 max-w-2xl mx-auto shadow-2xl">
        <h2 className="text-xl font-bold text-white font-display mb-1">
          Send a Direct Message
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Our team reviews submissions and responds within 24 hours.
        </p>

        {sent ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">Message Sent!</h3>
            <p className="text-xs text-slate-300">
              Thank you for contacting FOREX TRADING ACADEMY. We will reply to your email promptly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Muhammad Ali"
                className="w-full bg-[#050813] border border-slate-700 rounded-xl py-2.5 px-4 text-white text-sm outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ali@example.com"
                className="w-full bg-[#050813] border border-slate-700 rounded-xl py-2.5 px-4 text-white text-sm outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Message / Question</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we assist you?"
                className="w-full bg-[#050813] border border-slate-700 rounded-xl p-3 text-white text-sm outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
