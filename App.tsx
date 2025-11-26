import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Background from './components/Background';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ToolPage from './pages/ToolPage';
import ToolsPage from './pages/ToolsPage';


const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen w-full relative overflow-hidden flex flex-col">
        <Background />
        <Navbar />



        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/tools/:id" element={<ToolPage />} />
          </Routes>
        </main>

        <footer className="w-full py-8 text-center text-slate-500 text-sm relative z-10 border-t border-slate-800/50 mt-12">
          <p>© 2025 EasyPDF. All rights reserved.</p>
          <p className="mt-2 text-slate-600 font-medium">Developed BY <span className="text-cyan-400">MIDHUN SANIL</span></p>
        </footer>
      </div>
    </Router>
  );
};

export default App;