import React, { useRef } from 'react';
import { X, Upload, Film, Play, Sparkles, Check } from 'lucide-react';
import { SAMPLE_VIDEOS, SampleVideo } from '../data/sampleVideos';

interface SamplePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (sample: SampleVideo) => void;
  onFileUpload: (file: File) => void;
}

export const SamplePickerModal: React.FC<SamplePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectSample,
  onFileUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
      onClose();
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1c1c24] border border-slate-700/80 rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden text-slate-100 flex flex-col">
        {/* Header */}
        <div className="bg-[#242430] border-b border-slate-700/80 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center">
              <Film className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-bold text-sm text-slate-100">Import Video / Choose Demo</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-blue-500/50 hover:border-blue-400 bg-slate-900/60 hover:bg-slate-900 rounded-xl p-6 text-center cursor-pointer transition-all space-y-2 group"
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="video/*,audio/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-100">Drag & Drop Local Video File Here</h4>
              <p className="text-xs text-slate-400">Supports MP4, WebM, MOV, MKV, AVI files</p>
            </div>
            <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold inline-block shadow">
              Browse PC Files...
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <div className="h-px bg-slate-800 flex-1" />
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Or Select a Sample Demo Video</span>
            <div className="h-px bg-slate-800 flex-1" />
          </div>

          {/* Sample Videos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SAMPLE_VIDEOS.map((sample) => (
              <div
                key={sample.id}
                onClick={() => {
                  onSelectSample(sample);
                  onClose();
                }}
                className="bg-slate-900 border border-slate-800 hover:border-blue-500/60 rounded-lg overflow-hidden cursor-pointer transition-all flex flex-col group hover:shadow-lg"
              >
                <div className="relative aspect-video bg-slate-950 overflow-hidden">
                  <img
                    src={sample.thumbnailUrl}
                    alt={sample.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute top-2 left-2 bg-slate-950/80 text-blue-300 text-[10px] px-2 py-0.5 rounded border border-blue-500/30">
                    {sample.category}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-slate-950/90 text-slate-200 text-[10px] font-mono px-1.5 py-0.5 rounded">
                    {sample.duration}s
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 ml-0.5 fill-current" />
                    </div>
                  </div>
                </div>
                <div className="p-3 space-y-1">
                  <h5 className="font-bold text-xs text-slate-100 truncate">{sample.title}</h5>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{sample.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
