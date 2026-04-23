import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
const logoImg = "/assets/logo.png"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-lg bg-blue-400/80 shadow-md"
          : "bg-blue-400"
      }`}
    >
      <div className="max-w-7xl mx-auto px-10 h-[72px] flex items-center justify-between">

        {/* LOGO + BRAND */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logoImg}
            alt="SkillSwap Logo"
            className="h-10 w-10 object-contain"
          />

          <span className="text-2xl font-bold text-white">
            SkillSwap
          </span>
        </Link>


        {/* NAV LINKS */}
        <div className="hidden md:flex gap-8 font-medium text-white">
          <a href="#">Home</a>
          <a href="#">Explore</a>
          <a href="#">About Us</a>
          <a href="#">Contact</a>
        </div>


        {/* ACTION BUTTONS */}
        <div className="flex gap-4">

          <Link
            to="/login"
            className="px-6 py-2 rounded-xl border border-white text-white hover:bg-white/20 transition"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="px-6 py-2 rounded-xl bg-white text-blue-600 shadow-lg hover:bg-gray-100 transition"
          >
            Join Now
          </Link>

        </div>

      </div>
    </nav>
  );
}