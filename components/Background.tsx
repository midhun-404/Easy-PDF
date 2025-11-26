import React from 'react';

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-slate-950">
      {/* Gradient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-600/20 blur-[120px] animate-float" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-600/20 blur-[120px] animate-float-delayed" />
      <div className="absolute top-[20%] right-[10%] w-[20vw] h-[20vw] rounded-full bg-cyan-500/10 blur-[80px] animate-pulse" />
      
      {/* Mesh Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
      
      {/* Floating Particles */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-yellow-400 rounded-full blur-sm opacity-60 animate-bounce duration-[4000ms]" />
      <div className="absolute top-3/4 left-1/3 w-4 h-4 bg-green-400 rounded-full blur-sm opacity-50 animate-ping duration-[3000ms]" />
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-pink-500 rounded-full blur-[1px] opacity-80 animate-float" />
      
      {/* Abstract Line */}
      <svg className="absolute right-0 top-1/3 opacity-20" width="300" height="600" viewBox="0 0 100 200">
        <path d="M10,10 Q90,100 10,190" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="5,5" />
      </svg>
    </div>
  );
};

export default Background;