import React from 'react';
import { User, Mail, Phone, Calendar, ShieldCheck, Key, ArrowRight, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface ProfilePageProps {
  navigate: (path: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ navigate }) => {
  const { user, paymentStatus } = useAuth();

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Student Sign In Required</h2>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 bg-amber-500 text-black font-bold text-xs rounded-xl"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
          Account Settings
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mt-1">
          Student Profile
        </h1>
        <p className="text-xs text-slate-400">
          Manage your academy credentials and enrollment security.
        </p>
      </div>

      <div className="bg-[#090e1d] border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-2xl font-display">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{user.name}</h2>
            <p className="text-xs text-slate-400">{user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {user.role}
              </span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                Status: {user.status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#050813] p-4 rounded-xl border border-slate-800">
            <span className="text-slate-400 uppercase font-semibold block mb-1">Full Name</span>
            <span className="text-white font-bold">{user.name}</span>
          </div>

          <div className="bg-[#050813] p-4 rounded-xl border border-slate-800">
            <span className="text-slate-400 uppercase font-semibold block mb-1">Email Address</span>
            <span className="text-white font-bold">{user.email}</span>
          </div>

          <div className="bg-[#050813] p-4 rounded-xl border border-slate-800">
            <span className="text-slate-400 uppercase font-semibold block mb-1">Phone / WhatsApp</span>
            <span className="text-white font-bold">{user.phone || 'Not provided'}</span>
          </div>

          <div className="bg-[#050813] p-4 rounded-xl border border-slate-800">
            <span className="text-slate-400 uppercase font-semibold block mb-1">Enrolled Date</span>
            <span className="text-white font-bold">
              {new Date(user.createdAt).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Security / Password section */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              Security & Credentials
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Keep your trading portal credentials confidential.
            </p>
          </div>

          <button
            onClick={() => navigate('/change-password')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer w-full sm:w-auto text-center"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};
