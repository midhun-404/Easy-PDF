import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TOOLS } from '../constants';
import ToolCard from '../components/ToolCard';
import FileUploader from '../components/FileUploader';
import { FileState, ToolCategory } from '../types';
import { ArrowRight } from 'lucide-react';
import FAQSection from '../components/FAQSection';

const Home: React.FC = () => {
  const [files, setFiles] = useState<FileState[]>([]);

  // Filter tools by category
  const pdfTools = TOOLS.filter(t => t.category === ToolCategory.PDF);
  const wordTools = TOOLS.filter(t => t.category === ToolCategory.WORD);
  const extraTools = TOOLS.filter(t => t.category === ToolCategory.IMAGE || t.category === ToolCategory.UTILITY);

  const navigate = useNavigate();

  // Quick redirect for the hero uploader
  const handleHeroUpload = (files: FileState[]) => {
    setFiles(files);
    // Navigate to the tool page with the files in state
    navigate('/tools/img-to-pdf', { state: { initialFiles: files } });
  };

  return (
    <div className="pb-24">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 md:px-12 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold font-display mb-6 leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">Convert your</span><br />
          <span className="text-white">file easily</span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">
          Convert your Audio, Video and other Files from one format to another online for free!
          (Reference Design Implementation)
        </p>

        {/* Hero Card */}
        <div className="glass-card rounded-3xl p-8 md:p-12 max-w-4xl mx-auto shadow-2xl shadow-indigo-900/20 relative overflow-hidden">
          {/* Dotted Background Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          </div>

          {files.length === 0 ? (
            <div className="relative z-10">
              <FileUploader
                onFilesSelected={handleHeroUpload}
                accept="image/*" // Defaulting hero to image-to-pdf for demo
                multiple={true}
              />
              <div className="mt-6">
                <Link to="/tools" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                  Explore all tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-2xl font-bold text-white mb-4">Files Ready!</h3>
              <p className="text-slate-400 mb-8">You selected {files.length} files.</p>
              <Link
                to="/tools/img-to-pdf"
                className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              >
                Proceed to Conversion
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Tools Grid Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mt-12">
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <span className="w-2 h-8 bg-indigo-500 rounded-full block"></span>
            PDF Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pdfTools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
            <span className="w-2 h-8 bg-cyan-500 rounded-full block"></span>
            Word Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wordTools.map(tool => <ToolCard key={tool.id} tool={tool} />)}
          </div>
        </div>


      </section>

      {/* FAQ Section */}
      <FAQSection />
    </div>
  );
};

export default Home;