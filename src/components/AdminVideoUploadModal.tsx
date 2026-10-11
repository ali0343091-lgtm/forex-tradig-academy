import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle2, AlertCircle, FileVideo, RefreshCw, Eye } from 'lucide-react';

interface AdminVideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminVideoUploadModal: React.FC<AdminVideoUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [title, setTitle] = useState('');
  const [moduleTitle, setModuleTitle] = useState('Module 1: Market Foundations & Mechanics');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFilename, setUploadedFilename] = useState<string | null>(null);
  const [published, setPublished] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setError(null);
      // Auto-suggest title from filename if title is blank
      if (!title) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    }
  };

  const handleUpload = () => {
    if (!title.trim()) {
      setError('Please enter a Class Title.');
      return;
    }
    if (!selectedFile) {
      setError('Please select a video file from your device.');
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    const formData = new FormData();
    formData.append('video', selectedFile);

    const token = localStorage.getItem('fta_token');
    const xhr = new XMLHttpRequest();

    xhr.open('POST', '/api/admin/classes/upload-video', true);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = async () => {
      if (xhr.status === 200) {
        try {
          const res = JSON.parse(xhr.responseText);
          setUploadedFilename(res.filename);
          setProgress(100);

          // Now create the class entry with the uploaded video!
          const createRes = await fetch('/api/admin/classes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              title: title.trim(),
              moduleTitle: moduleTitle || 'Forex Classes',
              videoFilename: res.filename,
              durationMinutes: 45,
              isPublished: true
            })
          });

          if (createRes.ok) {
            setPublished(true);
            setUploading(false);
          } else {
            const errData = await createRes.json();
            setError(errData.error || 'Failed to publish class.');
            setUploading(false);
          }
        } catch (e) {
          setError('Failed to parse server response.');
          setUploading(false);
        }
      } else {
        try {
          const errData = JSON.parse(xhr.responseText);
          setError(errData.error || `Upload failed with status ${xhr.status}.`);
        } catch (e) {
          setError(`Upload failed with status ${xhr.status}. Please check file format and try again.`);
        }
        setUploading(false);
      }
    };

    xhr.onerror = () => {
      setError('Network connection error during upload. Please check your internet and tap Retry.');
      setUploading(false);
    };

    xhr.send(formData);
  };

  const resetForm = () => {
    setTitle('');
    setSelectedFile(null);
    setUploading(false);
    setProgress(0);
    setError(null);
    setUploadedFilename(null);
    setPublished(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFinish = () => {
    resetForm();
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0b101f] border border-amber-500/30 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-display">
              + NEW CLASS / UPLOAD VIDEO
            </h3>
            <p className="text-xs text-slate-400">
              Upload classes directly from phone gallery or computer
            </p>
          </div>
        </div>

        {published ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Class Uploaded & Published!</h4>
            <p className="text-sm text-slate-300 mb-6">
              "{title}" is now securely available to all approved students in their dashboard.
            </p>
            <button
              onClick={handleFinish}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-xl transition-all shadow-lg"
            >
              Done & View Classes
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Class Title Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Class Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Lesson 5: Fair Value Gaps & Liquidity Sweeps"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={uploading}
                className="w-full bg-[#050813] border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl py-3 px-4 text-white text-sm outline-none placeholder:text-slate-600"
              />
            </div>

            {/* Module Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Module Category
              </label>
              <select
                value={moduleTitle}
                onChange={(e) => setModuleTitle(e.target.value)}
                disabled={uploading}
                className="w-full bg-[#050813] border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl py-2.5 px-4 text-white text-sm outline-none"
              >
                <option value="Module 1: Market Foundations & Mechanics">Module 1: Market Foundations & Mechanics</option>
                <option value="Module 2: Institutional Price Action & Candlesticks">Module 2: Institutional Price Action & Candlesticks</option>
                <option value="Module 3: Risk Management & Trading Psychology">Module 3: Risk Management & Trading Psychology</option>
                <option value="Module 4: Live Market Case Studies & Trade Breakdowns">Module 4: Live Market Case Studies</option>
              </select>
            </div>

            {/* Video File Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Select Video File (MP4, WebM, MOV) <span className="text-rose-400">*</span>
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime,video/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
                id="admin-video-file-input"
              />

              <label
                htmlFor="admin-video-file-input"
                className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  selectedFile
                    ? 'border-amber-500/60 bg-amber-500/5'
                    : 'border-slate-700 hover:border-slate-500 bg-[#050813]'
                }`}
              >
                {selectedFile ? (
                  <div className="flex items-center gap-3 text-left">
                    <FileVideo className="w-8 h-8 text-amber-400 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-white truncate max-w-xs">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB • Tap to change
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-sm font-semibold text-amber-400">
                      Tap to Choose Video from Phone / PC
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                      Works on mobile gallery, camera rolls, and desktop files
                    </span>
                  </>
                )}
              </label>
            </div>

            {/* Upload Progress Bar */}
            {uploading && (
              <div className="bg-[#050813] p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-amber-400 flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Uploading Video to Secure Storage...
                  </span>
                  <span className="text-white font-mono">{progress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-amber-300 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-2 text-center">
                  Do not close this window until upload reaches 100%
                </p>
              </div>
            )}

            {/* Error Message with Retry */}
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-2.5 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span>{error}</span>
                  <button
                    onClick={handleUpload}
                    className="block mt-1 font-semibold text-rose-200 underline hover:text-white"
                  >
                    Tap here to Retry Upload
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={uploading}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-sm transition-all"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading || !selectedFile || !title.trim()}
                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-black font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10"
              >
                {uploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Uploading ({progress}%)
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload & Publish
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
