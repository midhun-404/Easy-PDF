import React from 'react';
import { Loader2 } from 'lucide-react';

const ProcessingLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl animate-pulse"></div>
        <Loader2 className="w-12 h-12 text-cyan-400 animate-spin relative z-10" />
      </div>
      <div className="space-y-2 text-center">
        <h3 className="text-xl font-bold text-white">Processing...</h3>
        <p className="text-slate-400 text-sm">We are converting your file</p>
        
        <div className="w-64 h-1.5 bg-slate-800 rounded-full mt-4 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 w-1/2 animate-[shimmer_1.5s_infinite_linear] rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingLoader;