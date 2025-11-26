import React from 'react';
import { TOOLS } from '../constants';
import ToolCard from '../components/ToolCard';
import { ToolCategory } from '../types';

const ToolsPage: React.FC = () => {
  // Filter tools by category
  const pdfTools = TOOLS.filter(t => t.category === ToolCategory.PDF);
  const wordTools = TOOLS.filter(t => t.category === ToolCategory.WORD);
  const extraTools = TOOLS.filter(t => t.category === ToolCategory.IMAGE || t.category === ToolCategory.UTILITY);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 min-h-screen">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display">All Tools</h1>
      <p className="text-slate-400 mb-12 text-lg">Explore our complete collection of file conversion and manipulation utilities.</p>

      <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-indigo-500 rounded-full block shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
          PDF Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pdfTools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
        </div>
      </div>

      <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-cyan-500 rounded-full block shadow-[0_0_10px_rgba(6,182,212,0.5)]"></span>
          Word Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wordTools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <span className="w-1.5 h-8 bg-purple-500 rounded-full block shadow-[0_0_10px_rgba(168,85,247,0.5)]"></span>
          Extra Utilities
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {extraTools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;