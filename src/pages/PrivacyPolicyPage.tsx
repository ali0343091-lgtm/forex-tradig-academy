import React from 'react';
import { ShieldCheck, Lock, FileText, CheckCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.tsx';

export const PrivacyPolicyPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
          Transparency & Security
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400">
          Last revised: October 2026 • {settings.academyName}
        </p>
      </div>

      <div className="bg-[#080d1b] border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-8 text-sm text-slate-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            1. Information We Collect
          </h2>
          <p>
            When you register with <strong>{settings.academyName}</strong>, we collect your Full Name, Email Address, optional Phone Number, and securely salted password hashes. We do not collect credit card credentials, bank account passwords, or payment wallet MPINs.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            2. Payment Receipts and Transaction References
          </h2>
          <p>
            When submitting course tuition verification via Easypaisa or JazzCash, students upload transaction screenshots and reference numbers. These receipts are stored in a private directory and are only accessible by the student who uploaded them and authorized academy administrators for independent confirmation.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-400" />
            3. Protection of Educational Content
          </h2>
          <p>
            Video streams are protected by authenticated authorization tokens. Video playback is tied to approved student accounts. Watermarking mechanisms are deployed across video streams to deter unauthorized redistribution and protect intellectual property.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-amber-400" />
            4. Data Retention & Contact
          </h2>
          <p>
            We retain account data as long as you remain a student of the academy. You may request account deletion or data clarification by contacting us at <strong>{settings.contactEmail}</strong>.
          </p>
        </section>
      </div>
    </div>
  );
};
