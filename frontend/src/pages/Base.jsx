import React, { useState } from 'react';
import { Menu, X, Activity } from 'lucide-react';
import Home from './Home';
import PlayerAnalysis from '../components/PlayerAnalysis';
const PAGES = [
  { name: 'Season', key: 'season' },
  { name: 'Team analysis', key: 'team' },
  { name: 'Player analysis', key: 'player' },
  { name: 'Predictions', key: 'predictions' },
  { name: 'Matches', key: 'matches' },
];

const Base = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const renderPage = () => {
    switch (currentPage) {
      case 'team':
        return <Home />;
      case 'player':
        return <PlayerAnalysis/>
      default:
        return <div className="p-8 text-center text-sky-700 text-2xl font-semibold">Coming Soon...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-sky-200 to-blue-300">
      <nav className="bg-white/90 backdrop-blur-md border-b border-sky-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-sky-400 to-blue-500 p-2 rounded-full">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <span className="text-sky-800 text-xl font-bold">CricketPro</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {PAGES.map(page => (
                <button
                  key={page.key}
                  onClick={() => setCurrentPage(page.key)}
                  className={`text-sky-700 hover:text-sky-500 transition-colors duration-200 font-medium ${
                    currentPage === page.key ? 'hover:text-sky-700' : ''
                  }`}
                >
                  {page.name}
                </button>
              ))}
            </div>
            <div className="hidden md:block">
              <button className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:from-sky-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
                Profile
              </button>
            </div>
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
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="bg-white/90 backdrop-blur-md border-t border-sky-200">
            <div className="px-4 py-2 space-y-1">
              {PAGES.map(page => (
                <button
                  key={page.key}
                  onClick={() => {
                    setCurrentPage(page.key);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-sky-700 hover:text-sky-500 py-2 font-medium"
                >
                  {page.name}
                </button>
              ))}
              <button className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white px-4 py-2 rounded-full font-semibold mt-2">
                Get Premium
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="relative min-h-screen">
        {renderPage()}
      </main>
    </div>
  );
};

export default Base;