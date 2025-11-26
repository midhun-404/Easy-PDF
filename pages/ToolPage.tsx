import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { TOOLS } from '../constants';
import FileUploader from '../components/FileUploader';
import ProcessingLoader from '../components/ProcessingLoader';
import { FileState, ProcessingResult } from '../types';
import { processFiles } from '../services/toolService';
import { ChevronLeft, Download, RefreshCw, CheckCircle } from 'lucide-react';

const ToolPage: React.FC = () => {
  // Although the user prompt mentions specific HTML files, in React Router we use the ID param
  // We map the path to the tool ID for simplicity.
  const { id } = useParams<{ id: string }>(); // e.g., 'img-to-pdf'
  const location = useLocation();

  // Find tool definition. 
  // Note: The routes in App.tsx will map "/tools/:id" so 'id' here corresponds to the URL param.
  // But our TOOLS constant has ids like 'img-to-pdf'. 
  // We need to ensure the URL param matches the tool ID.
  const tool = TOOLS.find(t => t.id === id);

  const [files, setFiles] = useState<FileState[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [password, setPassword] = useState('');
  const [targetFormat, setTargetFormat] = useState('png');
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkPosition, setWatermarkPosition] = useState('middle');
  const [watermarkFont, setWatermarkFont] = useState('Helvetica');
  const [watermarkColor, setWatermarkColor] = useState('#FF0000');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.3);
  const [layoutMode, setLayoutMode] = useState('2');

  // Reset state when switching tools
  useEffect(() => {
    setFiles([]);
    setIsProcessing(false);
    setResult(null);
    setPassword('');
    setTargetFormat('png');
    setWatermarkText('CONFIDENTIAL');
    setLayoutMode('2');

    // Check for passed state
    if (location.state && (location.state as any).initialFiles) {
      setFiles((location.state as any).initialFiles);
      // Clear state to prevent re-loading on refresh (optional, but good UX)
      window.history.replaceState({}, document.title);
    }
  }, [id, location.state]);

  if (!tool) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center flex-col text-center px-4">
        <h2 className="text-3xl font-bold text-red-400 mb-4">Tool Not Found</h2>
        <Link to="/" className="text-cyan-400 hover:underline">Return Home</Link>
      </div>
    );
  }

  const handleProcess = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    // Min delay for animation
    await new Promise(r => setTimeout(r, 800));

    const res = await processFiles(tool.id, files, {
      password,
      targetFormat,
      watermarkText,
      watermarkPosition,
      watermarkFont,
      watermarkColor,
      watermarkOpacity,
      layoutMode
    });
    setResult(res);
    setIsProcessing(false);
  };

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setPassword('');
    setTargetFormat('png');
    setWatermarkText('CONFIDENTIAL');
    setWatermarkPosition('middle');
    setWatermarkFont('Helvetica');
    setWatermarkColor('#FF0000');
    setWatermarkOpacity(0.3);
    setLayoutMode('2');
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 min-h-[80vh]">
      <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Tools
      </Link>

      <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden border border-white/10">
        {/* Background accent */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px]"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-slate-800 rounded-xl text-cyan-400">
              <tool.icon className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">{tool.name}</h1>
          </div>
          <p className="text-slate-400 mb-8 text-lg">{tool.description}</p>

          {!isProcessing && !result && (
            <div className="animate-in fade-in zoom-in duration-500">
              <FileUploader
                onFilesSelected={setFiles}
                accept={tool.accepts}
                multiple={tool.multiple}
              />

              {files.length > 0 && (
                <div className="mt-8">
                  {tool.id === 'pdf-lock' && (
                    <div className="mb-6 max-w-md mx-auto text-left">
                      <label className="block text-slate-300 mb-2 font-medium">Set Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                        placeholder="Enter password to encrypt..."
                      />
                    </div>
                  )}

                  {(tool.id === 'pdf-watermark' || tool.id === 'word-watermark') && (
                    <div className="mb-6 max-w-md mx-auto text-left">
                      <label className="block text-slate-300 mb-2 font-medium">Watermark Text</label>
                      <input
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors mb-4"
                        placeholder="Enter watermark text..."
                      />

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-slate-300 mb-2 font-medium">Font</label>
                          <select
                            value={watermarkFont}
                            onChange={(e) => setWatermarkFont(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none cursor-pointer"
                          >
                            <option value="Helvetica">Helvetica</option>
                            <option value="Times Roman">Times Roman</option>
                            <option value="Courier">Courier</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-300 mb-2 font-medium">Color</label>
                          <select
                            value={watermarkColor}
                            onChange={(e) => setWatermarkColor(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none cursor-pointer"
                          >
                            <option value="#FF0000">Red</option>
                            <option value="#00FF00">Green</option>
                            <option value="#0000FF">Blue</option>
                            <option value="#000000">Black</option>
                            <option value="#808080">Gray</option>
                            <option value="#FFA500">Orange</option>
                            <option value="#800080">Purple</option>
                            <option value="#FFC0CB">Pink</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-slate-300 mb-2 font-medium">Opacity: {Math.round(watermarkOpacity * 100)}%</label>
                        <input
                          type="range"
                          min="0.1"
                          max="1"
                          step="0.1"
                          value={watermarkOpacity}
                          onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                      </div>

                      <label className="block text-slate-300 mb-2 font-medium">Position</label>
                      <select
                        value={watermarkPosition}
                        onChange={(e) => setWatermarkPosition(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none cursor-pointer"
                      >
                        <option value="top">Top</option>
                        <option value="middle">Middle</option>
                        <option value="bottom">Bottom</option>
                      </select>
                    </div>
                  )}

                  {tool.id === 'pdf-layout' && (
                    <div className="mb-6 max-w-md mx-auto text-left">
                      <label className="block text-slate-300 mb-2 font-medium">Pages per Sheet</label>
                      <select
                        value={layoutMode}
                        onChange={(e) => setLayoutMode(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none cursor-pointer"
                      >
                        <option value="2">2 Pages / Sheet</option>
                        <option value="4">4 Pages / Sheet</option>
                      </select>
                    </div>
                  )}

                  {tool.id === 'image-convert' && (
                    <div className="mb-6 max-w-md mx-auto text-left">
                      <label className="block text-slate-300 mb-2 font-medium">Target Format</label>
                      <select
                        value={targetFormat}
                        onChange={(e) => setTargetFormat(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none cursor-pointer"
                      >
                        <option value="png">PNG</option>
                        <option value="jpeg">JPG</option>
                        <option value="webp">WEBP</option>
                      </select>
                    </div>
                  )}

                  <div className="flex justify-center">
                    <button
                      onClick={handleProcess}
                      className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-lg font-bold rounded-full shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all transform hover:scale-105"
                    >
                      Convert Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {isProcessing && (
            <ProcessingLoader />
          )}

          {result && (
            <div className="text-center py-8 animate-in slide-in-from-bottom duration-500">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Success!</h3>
              <p className="text-slate-300 mb-8">Your file has been processed successfully.</p>

              <div className="flex flex-wrap gap-4 justify-center">
                {result.downloadUrl && (
                  <a
                    href={result.downloadUrl}
                    download={result.downloadName}
                    className="flex items-center gap-2 px-8 py-3 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Download File
                  </a>
                )}
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-8 py-3 bg-slate-700 text-white font-semibold rounded-full hover:bg-slate-600 transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                  Convert Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 text-slate-400 max-w-2xl mx-auto text-center text-sm">
        <p>All files are processed securely in your browser. No data is uploaded to any server.</p>
      </div>
    </div>
  );
};

export default ToolPage;