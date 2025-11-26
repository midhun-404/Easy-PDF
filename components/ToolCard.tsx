import React from 'react';
import { Link } from 'react-router-dom';
import { ToolDef } from '../types';

const ToolCard: React.FC<{ tool: ToolDef }> = ({ tool }) => {
  return (
    <Link to={tool.path} className="block group">
      <div className="h-full p-6 rounded-xl glass-card hover:bg-slate-800/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(79,70,229,0.15)] border border-white/5">
        <div className="flex flex-col h-full">
          <div className="mb-4 p-3 w-fit rounded-lg bg-indigo-500/10 group-hover:bg-indigo-500/20 text-indigo-400 group-hover:text-indigo-300 transition-colors">
            <tool.icon className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors">{tool.name}</h3>
          <p className="text-sm text-slate-400 leading-relaxed">{tool.description}</p>
        </div>
      </div>
    </Link>
  );
};

export default ToolCard;