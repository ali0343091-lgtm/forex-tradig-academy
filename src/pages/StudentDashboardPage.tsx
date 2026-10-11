import React, { useEffect, useState } from 'react';
import { BookOpen, CheckCircle, Clock, Play, Award, ShieldCheck, Lock, ArrowRight, UserCheck, BarChart2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useSettings } from '../context/SettingsContext.tsx';
import { ClassLesson, StudentProgress } from '../types/index.ts';

interface StudentDashboardPageProps {
  navigate: (path: string) => void;
}

export const StudentDashboardPage: React.FC<StudentDashboardPageProps> = ({ navigate }) => {
  const { user, paymentStatus, canAccessClasses } = useAuth();
  const { settings } = useSettings();

  const [classes, setClasses] = useState<ClassLesson[]>([]);
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('fta_token');
        const [classesRes, progRes] = await Promise.all([
          fetch('/api/classes'),
          token ? fetch('/api/progress', { headers: { Authorization: `Bearer ${token}` } }) : null
        ]);

        if (classesRes.ok) {
          const cData = await classesRes.json();
          setClasses(cData.classes || []);
        }

        if (progRes && progRes.ok) {
          const pData = await progRes.json();
          setProgress(pData.progress);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Student Portal</h2>
        <p className="text-xs text-slate-400">Please sign in to access your dashboard.</p>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2.5 bg-amber-500 text-black font-bold text-xs rounded-xl"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const completedCount = progress?.completedLessonIds.length || 0;
  const totalClasses = classes.length || 9;
  const progressPercent = Math.min(100, Math.round((completedCount / totalClasses) * 100));

  // Determine next lesson to watch
  const nextLesson = classes.find(c => !progress?.completedLessonIds.includes(c.id)) || classes[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0c1428] via-[#090f1e] to-[#060a14] border border-amber-500/25 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Student Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Track your curriculum progress, re-watch institutional setups, and maintain unwavering risk discipline.
          </p>
        </div>

        {/* Quick Access Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-[#050813] border border-slate-800 rounded-2xl px-4 py-3 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Account</span>
            <span className={`text-xs font-bold uppercase ${user.status === 'approved' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {user.status}
            </span>
          </div>

          <div className="bg-[#050813] border border-slate-800 rounded-2xl px-4 py-3 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Payment</span>
            <span className={`text-xs font-bold uppercase ${paymentStatus === 'approved' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {paymentStatus === 'approved' ? 'Verified' : paymentStatus === 'pending' ? 'Pending' : 'Unpaid'}
            </span>
          </div>

          <button
            onClick={() => navigate('/status')}
            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-2xl transition-colors cursor-pointer"
          >
            Check Status
          </button>
        </div>
      </div>

      {/* Lock Warning if not approved */}
      {!canAccessClasses && (
        <div className="p-5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Lock className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white">Private Classes are Locked</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Full class video streaming requires an approved student account and verified payment receipt of PKR {settings.discountedPrice.toLocaleString()}.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/payment-submission')}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl shrink-0 cursor-pointer"
          >
            Submit Payment Receipt
          </button>
        </div>
      )}

      {/* Overview Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Progress Card */}
        <div className="bg-[#080d1b] border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-slate-400 block mb-1">
              Curriculum Completed
            </span>
            <div className="text-3xl font-extrabold text-white font-mono-numbers">
              {progressPercent}%
            </div>
            <span className="text-xs text-slate-400 mt-1 block">
              {completedCount} of {totalClasses} classes completed
            </span>
          </div>

          <div className="w-14 h-14 rounded-full border-4 border-slate-800 border-t-amber-500 flex items-center justify-center font-mono font-bold text-xs text-amber-400">
            {completedCount}/{totalClasses}
          </div>
        </div>

        {/* Current Module */}
        <div className="bg-[#080d1b] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-amber-400 block mb-1">
              Next Up for You
            </span>
            <h4 className="text-sm font-bold text-white line-clamp-1">
              {nextLesson ? nextLesson.title : 'All Classes Complete!'}
            </h4>
            <span className="text-xs text-slate-400 mt-1 block">
              {nextLesson ? nextLesson.moduleTitle : 'Review anytime'}
            </span>
          </div>

          {canAccessClasses && nextLesson && (
            <button
              onClick={() => navigate(`/classes/${nextLesson.id}`)}
              className="mt-3 text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>Resume Lesson</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Support & Community */}
        <div className="bg-[#080d1b] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase text-slate-400 block mb-1">
              Instructor Support
            </span>
            <p className="text-xs text-slate-300">
              Direct verification and technical queries via WhatsApp: <strong>{settings.whatsappNumber}</strong>
            </p>
          </div>
          <button
            onClick={() => navigate('/contact')}
            className="mt-3 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Contact Help Desk
          </button>
        </div>
      </div>

      {/* Quick Class Browser */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white font-display">Your Classes</h3>
            <p className="text-xs text-slate-400">Watch private classes on mobile or desktop</p>
          </div>

          <button
            onClick={() => navigate('/classes')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>View Full Library</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {classes.slice(0, 6).map((c) => {
            const isCompleted = progress?.completedLessonIds.includes(c.id);
            return (
              <div
                key={c.id}
                className="bg-[#080d1b] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-amber-500/30 transition-colors group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="text-[10px] uppercase font-bold text-amber-400">{c.moduleTitle.split(':')[0]}</span>
                    <span className="flex items-center gap-1 font-mono"><Clock className="w-3 h-3" /> {c.durationMinutes}m</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2 group-hover:text-amber-300 transition-colors line-clamp-2">
                    {c.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                    {c.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className={`text-[11px] font-semibold flex items-center gap-1 ${
                    isCompleted ? 'text-emerald-400' : 'text-slate-500'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : null}
                    {isCompleted ? 'Completed' : 'Not started'}
                  </span>

                  <button
                    onClick={() => {
                      if (canAccessClasses) {
                        navigate(`/classes/${c.id}`);
                      } else {
                        navigate('/status');
                      }
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1 transition-all ${
                      canAccessClasses
                        ? 'bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {canAccessClasses ? <Play className="w-3 h-3 fill-current" /> : <Lock className="w-3 h-3" />}
                    <span>{canAccessClasses ? 'Watch' : 'Locked'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
