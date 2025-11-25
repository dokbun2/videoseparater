"use client";
import { useState, useCallback } from 'react';
import { Upload, FileAudio, Music, Mic, Loader2, AlertCircle } from 'lucide-react';

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('video/')) {
      setFile(droppedFile);
      setError(null);
    } else {
      setError("Please upload a valid video file (MP4).");
    }
  }, []);

  const onFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/separate`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Processing failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("An error occurred during processing. Please try again.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-8">
      {/* Upload Area */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
          ${isDragging 
            ? 'border-blue-500 bg-blue-500/10 scale-[1.02]' 
            : 'border-white/10 hover:border-white/20 bg-white/5'
          }
        `}
      >
        <input
          type="file"
          accept="video/mp4,video/*"
          onChange={onFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className={`p-4 rounded-full ${file ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
            {file ? <FileAudio size={32} /> : <Upload size={32} />}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {file ? file.name : "Drop your MP4 here"}
            </h3>
            <p className="text-white/50 text-sm">
              {file ? "Ready to process" : "or click to browse"}
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-400 bg-red-500/10 p-4 rounded-lg">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Process Button */}
      {file && !result && (
        <button
          onClick={handleUpload}
          disabled={isProcessing}
          className={`
            w-full py-4 rounded-xl font-semibold text-lg transition-all
            ${isProcessing 
              ? 'bg-white/10 text-white/50 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25'
            }
          `}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" />
              <span>Separating Audio...</span>
            </div>
          ) : (
            "Start Separation"
          )}
        </button>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-2xl font-bold text-white mb-6">Separation Results</h3>
          
          {/* Vocals */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400">
                <Mic size={24} />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">Vocals</h4>
                <p className="text-white/50 text-sm">Isolated vocal track</p>
              </div>
            </div>
            <audio controls className="w-full" src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${result.vocals}`} />
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${result.vocals}`} 
              download 
              className="block mt-4 text-center text-sm text-purple-400 hover:text-purple-300"
            >
              Download Vocals
            </a>
          </div>

          {/* Accompaniment */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg bg-cyan-500/20 text-cyan-400">
                <Music size={24} />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">Accompaniment</h4>
                <p className="text-white/50 text-sm">Instrumental track</p>
              </div>
            </div>
            <audio controls className="w-full" src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${result.accompaniment}`} />
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${result.accompaniment}`} 
              download 
              className="block mt-4 text-center text-sm text-cyan-400 hover:text-cyan-300"
            >
              Download Accompaniment
            </a>
          </div>
          
          <button 
            onClick={() => { setFile(null); setResult(null); }}
            className="w-full py-3 text-white/50 hover:text-white transition-colors"
          >
            Process Another File
          </button>
        </div>
      )}
    </div>
  );
}
