import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Zap } from 'lucide-react';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!');
    });
  };

  const handleLanguage = () => {
    alert('Only English is currently supported.');
  };

  const location = useLocation();

  const handleFAQ = () => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById('faq');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById('faq');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <nav className="w-full py-6 px-6 md:px-12 flex items-center justify-between z-50 relative">
      <Link to="/" className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity">
        <Zap className="w-8 h-8 text-cyan-400 fill-cyan-400/20" />
        <span className="text-xl font-bold font-display tracking-wide">EasyPDF</span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <Link to="/tools" className="hover:text-white transition-colors">Tools</Link>
        {/* Placeholders for future pages */}
        <span onClick={handleLanguage} className="cursor-pointer hover:text-white transition-colors">Language</span>
        <span onClick={handleShare} className="cursor-pointer hover:text-white transition-colors">Share</span>
        <span onClick={handleFAQ} className="cursor-pointer hover:text-white transition-colors">FAQ</span>
      </div>

      <button
        onClick={() => navigate('/tools')}
        className="hidden md:block px-6 py-2.5 rounded-full bg-slate-800/50 border border-slate-700 hover:bg-slate-700 text-white text-sm font-semibold transition-all hover:shadow-[0_0_20px_rgba(56,189,248,0.3)]"
      >
        Get Started
      </button>

      {/* Mobile Menu Icon placeholder */}
      <div className="md:hidden text-white">
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </div>
    </nav>
  );
};

export default Navbar;