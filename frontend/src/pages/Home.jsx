import React, { useState } from 'react';
import { Menu, X, ChevronDown, Activity, BarChart3, Trophy, Target } from 'lucide-react';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-sky-200 to-blue-300">
      {/* Navbar */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-sky-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-sky-400 to-blue-500 p-2 rounded-full">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <span className="text-sky-800 text-xl font-bold">CricketPro</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-sky-700 hover:text-sky-500 transition-colors duration-200 font-medium">
                Home
              </a>
              <div className="relative group">
                <button className="text-sky-700 hover:text-sky-500 transition-colors duration-200 font-medium flex items-center space-x-1">
                  <span>Analysis</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-sky-100">
                  <a href="#" className="block px-4 py-2 text-sky-700 hover:bg-sky-50 rounded-t-lg">Live Match</a>
                  <a href="#" className="block px-4 py-2 text-sky-700 hover:bg-sky-50">Team Stats</a>
                  <a href="#" className="block px-4 py-2 text-sky-700 hover:bg-sky-50 rounded-b-lg">Player Stats</a>
                </div>
              </div>
              <a href="#" className="text-sky-700 hover:text-sky-500 transition-colors duration-200 font-medium">
                Predictions
              </a>
              <a href="#" className="text-sky-700 hover:text-sky-500 transition-colors duration-200 font-medium">
                Matches
              </a>
              <a href="#" className="text-sky-700 hover:text-sky-500 transition-colors duration-200 font-medium">
                News
              </a>
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <button className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:from-sky-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
                Get Premium
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-sky-700 hover:text-sky-500 transition-colors duration-200"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="bg-white/90 backdrop-blur-md border-t border-sky-200">
            <div className="px-4 py-2 space-y-1">
              <a href="#" className="block text-sky-700 hover:text-sky-500 py-2 font-medium">Home</a>
              <a href="#" className="block text-sky-700 hover:text-sky-500 py-2 font-medium">Analysis</a>
              <a href="#" className="block text-sky-700 hover:text-sky-500 py-2 font-medium">Predictions</a>
              <a href="#" className="block text-sky-700 hover:text-sky-500 py-2 font-medium">Matches</a>
              <a href="#" className="block text-sky-700 hover:text-sky-500 py-2 font-medium">News</a>
              <button className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white px-4 py-2 rounded-full font-semibold mt-2">
                Get Premium
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Body */}
      <main className="relative min-h-screen">
        {/* Empty body as requested */}
      </main>
    </div>
  );
};

export default Home;