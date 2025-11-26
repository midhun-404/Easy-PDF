import React, { useCallback, useState } from 'react';
import { Upload, File as FileIcon, X } from 'lucide-react';
import { FileState } from '../types';

interface FileUploaderProps {
  onFilesSelected: (files: FileState[]) => void;
  accept: string;
  multiple: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFilesSelected, accept, multiple }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileState[]>([]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const processFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const newFiles: FileState[] = Array.from(files).map(file => ({
      file,
      id: Math.random().toString(36).substring(7),
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));

    // If not multiple, just take the first one
    const finalFiles = multiple ? [...selectedFiles, ...newFiles] : newFiles.slice(0, 1);
    
    setSelectedFiles(finalFiles);
    onFilesSelected(finalFiles);
  }, [selectedFiles, multiple, onFilesSelected]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  const removeFile = (id: string) => {
    const filtered = selectedFiles.filter(f => f.id !== id);
    setSelectedFiles(filtered);
    onFilesSelected(filtered);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative group cursor-pointer
          flex flex-col items-center justify-center 
          h-64 w-full rounded-2xl 
          border-2 border-dashed transition-all duration-300
          ${isDragging 
            ? 'border-cyan-400 bg-cyan-500/10 scale-[1.02]' 
            : 'border-slate-600 bg-slate-800/30 hover:border-slate-500 hover:bg-slate-800/50'
          }
        `}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
        />
        
        <div className="flex flex-col items-center space-y-4 text-center p-6 pointer-events-none">
          <div className={`
            p-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 
            shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300
          `}>
            <Upload className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-lg font-semibold text-white mb-1">
              Drag & Drop file here
            </p>
            <p className="text-sm text-slate-400">
              or <span className="text-cyan-400 group-hover:underline">Choose file</span>
            </p>
          </div>
          <p className="text-xs text-slate-500 uppercase tracking-wider">
            {multiple ? 'Maximum upload size 50 MB' : 'Single file upload'}
          </p>
        </div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-6 space-y-3">
          {selectedFiles.map((f) => (
            <div key={f.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700 animate-float">
              <div className="flex items-center gap-3 overflow-hidden">
                {f.preview ? (
                  <img src={f.preview} alt="preview" className="w-10 h-10 object-cover rounded" />
                ) : (
                  <div className="w-10 h-10 rounded bg-slate-700 flex items-center justify-center">
                    <FileIcon className="w-5 h-5 text-slate-400" />
                  </div>
                )}
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-slate-200 truncate block max-w-[200px]">{f.file.name}</span>
                  <span className="text-xs text-slate-500">{(f.file.size / 1024).toFixed(1)} KB</span>
                </div>
              </div>
              <button 
                onClick={() => removeFile(f.id)}
                className="p-1.5 hover:bg-slate-700 rounded-full text-slate-400 hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;