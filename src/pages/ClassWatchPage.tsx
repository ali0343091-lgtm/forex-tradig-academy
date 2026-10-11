import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle, Clock, ChevronRight, Lock, BookOpen, AlertCircle, Share2, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { ClassLesson, StudentProgress } from '../types/index.ts';
import { VideoPlayer } from '../components/VideoPlayer.tsx';

interface ClassWatchPageProps {
  lessonId: string;
  navigate: (path: string) => void;
}

export const ClassWatchPage: React.FC<ClassWatchPageProps> = ({ lessonId, navigate }) => {
  const { user, canAccessClasses } = useAuth();
  const [lesson, setLesson] = useState<ClassLesson | null>(null);
  const [allClasses, setAllClasses] = useState<ClassLesson[]>([]);
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('fta_token');
        const [classRes, allClassesRes, progRes] = await Promise.all([
          fetch(`/api/classes/${lessonId}`),
          fetch('/api/classes'),
          token ? fetch('/api/progress', { headers: { Authorization: `Bearer ${token}` } }) : null
        ]);

        if (classRes.ok) {
          const cData = await classRes.json();
          setLesson(cData);
        }
        if (allClassesRes.ok) {
          const aData = await allClassesRes.json();
          setAllClasses(aData.classes || []);
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
  }, [lessonId]);

  const toggleComplete = async () => {
    const token = localStorage.getItem('fta_token');
    if (!token) return;
    try {
      const res = await fetch('/api/progress/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ lessonId })
      });
      if (res.ok) {
        const data = await res.json();
        setProgress(data.progress);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!canAccessClasses) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Private Class Restricted</h2>
        <p className="text-xs text-slate-300">
          This class is reserved for enrolled students with verified payment.
        </p>
        <button
          onClick={() => navigate('/status')}
          className="px-6 py-2.5 bg-amber-500 text-black font-extrabold text-xs rounded-xl shadow-lg"
        >
          Check Enrollment Status
        </button>
      </div>
    );
  }

  if (loading || !lesson) {
    return <div className="py-20 text-center text-xs text-slate-500">Loading lesson...</div>;
  }

  const isCompleted = progress?.completedLessonIds.includes(lesson.id) || false;
  const currentIndex = allClasses.findIndex(c => c.id === lesson.id);
  const nextLesson = currentIndex >= 0 && currentIndex < allClasses.length - 1 ? allClasses[currentIndex + 1] : null;
  const prevLesson = currentIndex > 0 ? allClasses[currentIndex - 1] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button and breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/classes')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Class Library</span>
        </button>

        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
          {lesson.moduleTitle}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Video Viewport (2 Cols on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          <VideoPlayer
            lessonId={lesson.id}
            title={lesson.title}
            isCompleted={isCompleted}
            onCompleted={toggleComplete}
          />

          {/* Lesson Metadata and Actions */}
          <div className="bg-[#080d1b] border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] uppercase font-bold text-amber-400 tracking-wider">
                  Lesson {lesson.orderIndex} • {lesson.durationMinutes} Minutes
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-white font-display mt-0.5">
                  {lesson.title}
                </h1>
              </div>

              <button
                onClick={toggleComplete}
                className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>{isCompleted ? 'Marked as Completed' : 'Mark as Completed'}</span>
              </button>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-800/80">
              {lesson.description}
            </p>

            {/* Next / Previous Controls */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              {prevLesson ? (
                <button
                  onClick={() => navigate(`/classes/${prevLesson.id}`)}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous: {prevLesson.title.slice(0, 25)}...</span>
                </button>
              ) : <div />}

              {nextLesson && (
                <button
                  onClick={() => navigate(`/classes/${nextLesson.id}`)}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5"
                >
                  <span>Next: {nextLesson.title.slice(0, 25)}...</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: All Lessons Playlist */}
        <div className="space-y-4">
          <div className="bg-[#080d1b] border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              Course Curriculum
            </h3>

            <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
              {allClasses.map((item, idx) => {
                const isCurrent = item.id === lesson.id;
                const isDone = progress?.completedLessonIds.includes(item.id);

                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(`/classes/${item.id}`)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 ${
                      isCurrent
                        ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300'
                        : 'bg-[#050813] hover:bg-slate-800/60 border border-transparent text-slate-400'
                    }`}
                  >
                    <span className="text-xs font-mono font-bold shrink-0 mt-0.5">
                      #{idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold truncate ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                        {item.title}
                      </p>
                      <span className="text-[10px] text-slate-500">
                        {item.durationMinutes} min
                      </span>
                    </div>
                    {isDone && (
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
