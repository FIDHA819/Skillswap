
import React from 'react';
import { Link } from 'react-router-dom';

const logoImg = '/assets/logo.png';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
       
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logoImg}
            alt="Logo"
            className="w-10 h-10 rounded-full border-2 border-blue-100 shadow-md"
          />
          <span className="text-white font-extrabold text-xl">
            Skill <span className="text-blue-200">Swap</span>
          </span>
        </Link>

    
        <nav className="flex gap-6 text-white font-medium text-sm">
          <Link to="/" className="hover:text-blue-300 transition">
            Home
          </Link>
          <Link to="/about" className="hover:text-blue-300 transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-blue-300 transition">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
