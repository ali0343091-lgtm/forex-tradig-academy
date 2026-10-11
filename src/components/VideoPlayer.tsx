import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, RotateCw, CheckCircle, Settings, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface VideoPlayerProps {
  lessonId: string;
  title: string;
  onCompleted?: () => void;
  isCompleted?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ lessonId, title, onCompleted, isCompleted }) => {
  const { user, token } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Moving watermark coordinates to discourage screen recording
  const [watermarkPos, setWatermarkPos] = useState({ top: 15, left: 20 });

  useEffect(() => {
    const timer = setInterval(() => {
      setWatermarkPos({
        top: Math.floor(Math.random() * 70) + 10,
        left: Math.floor(Math.random() * 65) + 10
      });
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  // Construct secure stream URL with token parameter for HTML5 media element
  const videoStreamUrl = `/api/classes/${lessonId}/stream?token=${encodeURIComponent(token || '')}`;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(err => {
        console.error('Play error', err);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    setLoadError(null);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const skipTime = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(Math.max(videoRef.current.currentTime + seconds, 0), duration);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(err => console.error(err));
      setIsFullscreen(false);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      className="relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800 group select-none"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {loadError ? (
        <div className="aspect-video flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-slate-300">
          <ShieldCheck className="w-12 h-12 text-amber-500 mb-3" />
          <h4 className="text-lg font-bold text-white mb-1">Access Protected</h4>
          <p className="text-sm text-slate-400 max-w-md">{loadError}</p>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            src={videoStreamUrl}
            className="w-full aspect-video object-contain bg-black cursor-pointer"
            onClick={togglePlay}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => {
              setIsPlaying(false);
              if (onCompleted) onCompleted();
            }}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onError={() => {
              setLoadError('Unable to load video stream. Please verify your student payment approval or refresh.');
            }}
            playsInline
            controlsList="nodownload"
          />

          {/* Dynamic Floating Watermark to discourage unauthorized screen capture */}
          <div
            className="absolute pointer-events-none transition-all duration-1000 ease-in-out opacity-25 hover:opacity-10 text-[10px] sm:text-xs font-mono font-bold tracking-widest text-white/80 drop-shadow-md select-none bg-black/30 px-2 py-0.5 rounded border border-white/10"
            style={{ top: `${watermarkPos.top}%`, left: `${watermarkPos.left}%` }}
          >
            FTA • {user?.email || 'STUDENT'} • ID-{user?.id.slice(0, 8)}
          </div>

          {/* Big Center Play Button when paused */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500/90 text-black flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
            >
              <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-black translate-x-0.5" />
            </button>
          )}

          {/* Controls Overlay */}
          <div
            className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3 sm:p-4 transition-opacity duration-300 ${
              showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Seek Bar */}
            <div className="flex items-center gap-2 mb-2">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Bottom Buttons Bar */}
            <div className="flex items-center justify-between text-white text-xs sm:text-sm">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={togglePlay}
                  className="p-1.5 hover:text-amber-400 transition-colors"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                </button>

                <button
                  onClick={() => skipTime(-10)}
                  className="p-1 hover:text-amber-400 transition-colors"
                  title="Rewind 10s"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => skipTime(10)}
                  className="p-1 hover:text-amber-400 transition-colors"
                  title="Forward 10s"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                {/* Volume */}
                <div className="flex items-center gap-1.5 ml-1">
                  <button onClick={toggleMute} className="p-1 hover:text-amber-400 transition-colors">
                    {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-14 sm:w-20 h-1 bg-slate-700 rounded appearance-none accent-amber-500 cursor-pointer hidden sm:block"
                  />
                </div>

                {/* Time Display */}
                <span className="text-[11px] font-mono text-slate-300 ml-2">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {/* Right Side Options */}
              <div className="flex items-center gap-2">
                {/* Speed Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                    className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                  >
                    {playbackRate}x
                  </button>

                  {showSpeedMenu && (
                    <div className="absolute bottom-full right-0 mb-2 bg-[#0b101e] border border-slate-700 rounded-lg p-1 shadow-xl flex flex-col gap-0.5 z-20">
                      {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSpeedChange(s)}
                          className={`px-3 py-1 text-left text-xs rounded hover:bg-amber-500 hover:text-black transition-colors ${
                            playbackRate === s ? 'text-amber-400 font-bold' : 'text-slate-300'
                          }`}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Complete Marker Button */}
                {onCompleted && (
                  <button
                    onClick={onCompleted}
                    className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded transition-colors ${
                      isCompleted ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                    title={isCompleted ? 'Completed' : 'Mark as complete'}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{isCompleted ? 'Completed' : 'Complete'}</span>
                  </button>
                )}

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 hover:text-amber-400 transition-colors"
                  title="Fullscreen"
                >
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
