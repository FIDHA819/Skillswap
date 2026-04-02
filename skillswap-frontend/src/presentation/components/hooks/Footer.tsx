
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white/10 backdrop-blur-lg border-t border-white/20 shadow-inner mt-10">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row  items-center text-white text-sm">
        <p>© {new Date().getFullYear()} Skill Swap. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
