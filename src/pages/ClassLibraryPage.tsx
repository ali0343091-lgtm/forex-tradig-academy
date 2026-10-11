import React, { useEffect, useState } from 'react';
import { Play, Lock, CheckCircle, Clock, BookOpen, Search, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useSettings } from '../context/SettingsContext.tsx';
import { ClassLesson, StudentProgress } from '../types/index.ts';

interface ClassLibraryPageProps {
  navigate: (path: string) => void;
}

export const ClassLibraryPage: React.FC<ClassLibraryPageProps> = ({ navigate }) => {
  const { user, canAccessClasses } = useAuth();
  const { settings } = useSettings();

  const [classes, setClasses] = useState<ClassLesson[]>([]);
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [search, setSearch] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('All');
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

  const modules = ['All', ...Array.from(new Set(classes.map(c => c.moduleTitle)))];

  const filtered = classes.filter(c => {
    const matchesModule = selectedModule === 'All' || c.moduleTitle === selectedModule;
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                          c.description.toLowerCase().includes(search.toLowerCase());
    return matchesModule && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Curriculum Vault
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display mt-1">
            Private Class Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Structured step-by-step masterclasses recorded by our academy mentor.
          </p>
        </div>

        {!canAccessClasses && (
          <button
            onClick={() => navigate('/status')}
            className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 self-start md:self-auto"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Enrollment Required to Watch</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Module tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 no-scrollbar">
          {modules.map((mod) => (
            <button
              key={mod}
              onClick={() => setSelectedModule(mod)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                selectedModule === mod
                  ? 'bg-amber-500 text-black font-bold'
                  : 'bg-[#080d1b] border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {mod}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search lesson topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#080d1b] border border-slate-800 focus:border-amber-500 rounded-xl py-2 pl-9 pr-4 text-xs text-white outline-none"
          />
        </div>
      </div>

      {/* Classes Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">Loading lessons...</div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400 bg-[#080d1b] rounded-2xl border border-slate-800">
          No classes match your search query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((lesson) => {
            const isCompleted = progress?.completedLessonIds.includes(lesson.id);

            return (
              <div
                key={lesson.id}
                className="bg-[#080d1b] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-500/40 transition-all shadow-lg group relative"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
                    <span className="text-[10px] uppercase font-bold text-amber-400/90 tracking-wide">
                      {lesson.moduleTitle}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {lesson.durationMinutes} min
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-amber-300 transition-colors leading-snug">
                    {lesson.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-6">
                    {lesson.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className={`text-xs font-semibold flex items-center gap-1.5 ${
                    isCompleted ? 'text-emerald-400' : 'text-slate-500'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : null}
                    {isCompleted ? 'Completed' : 'Not completed'}
                  </span>

                  <button
                    onClick={() => {
                      if (canAccessClasses) {
                        navigate(`/classes/${lesson.id}`);
                      } else {
                        navigate('/status');
                      }
                    }}
                    className={`px-4 py-2 text-xs font-extrabold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                      canAccessClasses
                        ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-md'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {canAccessClasses ? (
                      <>
                        <Play className="w-3.5 h-3.5 fill-black" />
                        <span>Watch Class</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Unlock Access</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
