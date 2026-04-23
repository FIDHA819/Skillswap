import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white/70 backdrop-blur-xl border-t border-gray-200 mt-20">

      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">

        {/* Brand Section */}

        <div>
          <h2 className="text-2xl font-bold text-blue-600">
            SkillSwap
          </h2>

          <p className="mt-4 text-gray-600 text-sm">
            Learn faster by exchanging skills with real people.  
            Teach what you know. Learn what you need 🤝
          </p>
        </div>


        {/* Quick Links */}

        <div>
          <h3 className="font-semibold text-gray-800 mb-4">
            Quick Links
          </h3>

          <ul className="space-y-2 text-gray-600 text-sm">
            <li>
              <Link to="/" className="hover:text-blue-600">
                Home
              </Link>
            </li>

            <li>
              <Link to="/explore" className="hover:text-blue-600">
                Explore Skills
              </Link>
            </li>

            <li>
              <Link to="/about" className="hover:text-blue-600">
                About Us
              </Link>
            </li>

            <li>
              <Link to="/contact" className="hover:text-blue-600">
                Contact
              </Link>
            </li>
          </ul>
        </div>


        {/* Support */}

        <div>
          <h3 className="font-semibold text-gray-800 mb-4">
            Support
          </h3>

          <ul className="space-y-2 text-gray-600 text-sm">
            <li className="hover:text-blue-600 cursor-pointer">
              Help Center
            </li>

            <li className="hover:text-blue-600 cursor-pointer">
              Privacy Policy
            </li>

            <li className="hover:text-blue-600 cursor-pointer">
              Terms & Conditions
            </li>
          </ul>
        </div>


        {/* Contact + Social */}

        <div>
          <h3 className="font-semibold text-gray-800 mb-4">
            Contact
          </h3>

          <p className="text-gray-600 text-sm">
            📧 skill-swap@gmail.com
          </p>

          <p className="text-gray-600 text-sm mt-1">
            📞 09874567221
          </p>

          {/* Social Icons */}

          <div className="flex gap-4 mt-4 text-lg">

            <span className="cursor-pointer hover:scale-110 transition">
              🌐
            </span>

            <span className="cursor-pointer hover:scale-110 transition">
              💼
            </span>

            <span className="cursor-pointer hover:scale-110 transition">
              📸
            </span>

          </div>
        </div>

      </div>


      {/* Bottom Strip */}

      <div className="border-t border-gray-200 py-4 text-center text-gray-500 text-sm">

        © {new Date().getFullYear()} SkillSwap. All rights reserved.

      </div>

    </footer>
  );
};

export default Footer;