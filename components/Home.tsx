'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Facebook, Menu, X, ChevronUp, Info, Users, Target, Gamepad2, Award } from 'lucide-react';
import CRTEffect from '@/components/crt-effect';

const Home: React.FC = () => {
  // State management
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  
  // Character data for team members
  const characters = [
    {
      name: "David Brandhuber",
      role: "Vereinsobmann",
      stats: {
        leadership: 100,
        strategy: 100,
        gaming: 100,
        community: 100
      },
      skills: ["Teamführung", "Strategische Planung", "Community Building"],
      description: "Gründer und Leiter des Vereins mit einer Vision für eSport in der Region.",
      color: "#ff5e5e"
    },
    {
      name: "Michael Wojnar",
      role: "Mitbegründer",
      stats: {
        organization: 100,
        networking: 100,
        gaming: 100,
        events: 100
      },
      skills: ["Event-Organisation", "Networking", "Gaming-Events"],
      description: "Treibende Kraft hinter unseren Events und Community-Aktivitäten.",
      color: "#5e8eff"
    },
    {
      name: "Katrin Brandhuber",
      role: "Social Media",
      stats: {
        creativity: 100,
        communication: 100,
        design: 100,
        social: 100
      },
      skills: ["Content Creation", "Community Management", "Grafik-Design"],
      description: "Kreative Kraft, die unsere Online-Präsenz gestaltet und betreut.",
      color: "#ff5ec8"
    },
    {
      name: "Iris Brandhuber",
      role: "Social Media",
      stats: {
        creativity: 100,
        communication: 100,
        design: 100,
        social: 100
      },
      skills: ["Content Creation", "Community Management", "Grafik-Design"],
      description: "Kreative Kraft, die unsere Online-Präsenz gestaltet und betreut.",
      color: "#ff5ec8"
    },
    {
      name: "Ronald Bauer",
      role: "Webdesign",
      stats: {
        coding: 100,
        design: 100,
        ux: 100,
        gaming: 100
      },
      skills: ["Web-Entwicklung", "UI/UX Design", "Gaming Integration"],
      description: "Technischer Experte, der unsere digitale Präsenz zum Leben erweckt.",
      color: "#5effae"
    }
  ];
  

  // Scroll effects - optimized with useCallback
  const handleScroll = useCallback(() => {
    
    // Show/hide scroll-to-top button with smoother threshold
    if (window.scrollY > 300) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
    
    // Detect active section
    const sections = ['about', 'goals', 'activities', 'mission', 'mitglied'];
    let currentSection = '';
    
    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        // Consider a section active when it's in the top half of the viewport
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          currentSection = section;
          break;
        }
      }
    }
    
    setActiveSection(currentSection);
  }, []);

  useEffect(() => {
    // Intersection Observer for smooth animations on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          // Unobserve after animation to improve performance
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px' // Start animation slightly before element is in view
    });
    
    // Observe all elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
    
    // Add scroll event listener with passive option for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
    
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // Ensure viewport height works correctly on mobile browsers
  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fixed scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Function to handle smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      setIsMenuOpen(false); // Close mobile menu when navigating
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Social media links
  const socialLinks = [
    { name: "Facebook", icon: <Facebook size={20} />, href: "https://www.facebook.com/profile.php?id=61565503147498" }
  ];

  // Navigation links - centralized for consistency
  const navLinks = [
    { name: "Home", href: "#", icon: <Info size={18} /> },
    { name: "Über uns", href: "#about", icon: <Users size={18} /> },
    { name: "Unser Ziel", href: "#goals", icon: <Target size={18} /> },
    { name: "Aktivitäten", href: "#activities", icon: <Gamepad2 size={18} /> },
    { name: "Mission", href: "#mission", icon: <Award size={18} /> },
    { name: "Mitglied werden", href: "#mitglied", icon: <Users size={18} /> },
  ];

  // Function to generate pixelated avatar for team members
  const generatePixelAvatar = (index: number) => {
    const colors = [
      ['#ff5e5e', '#ff9e9e'], // David
      ['#5e8eff', '#9ebeff'], // Michael
      ['#ff5ec8', '#ff9ee8'], // Katrin
      ['#ff5ec8', '#ff9ee8'], // Iris
      ['#5effae', '#9effce']  // Ronald
    ];
    
    const mainColor = colors[index][0];
    const lightColor = colors[index][1];
    
    // Render SVG for pixel art character
    return (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="pixel-avatar">
        <rect width="64" height="64" fill="#222" />
        {/* Head */}
        <rect x="24" y="12" width="16" height="16" fill={mainColor} />
        <rect x="26" y="14" width="4" height="4" fill={lightColor} />
        {/* Body */}
        <rect x="20" y="28" width="24" height="20" fill={mainColor} />
        <rect x="22" y="30" width="8" height="6" fill={lightColor} />
        {/* Arms */}
        <rect x="12" y="28" width="8" height="16" fill={mainColor} />
        <rect x="44" y="28" width="8" height="16" fill={mainColor} />
        {/* Legs */}
        <rect x="20" y="48" width="8" height="12" fill={mainColor} />
        <rect x="36" y="48" width="8" height="12" fill={mainColor} />
      </svg>
    );
  }

  // Display a character's stats using the StatBar component
  const renderCharacterStats = (character: typeof characters[0]) => {
    return (
      <div className="mt-4">
        {Object.entries(character.stats).map(([key, value]) => (
          <StatBar 
            key={key} 
            name={key.charAt(0).toUpperCase() + key.slice(1)} 
            value={value} 
            color={character.color} 
          />
        ))}
      </div>
    );
  };

  // Stat bar component for character stats
  const StatBar = ({ name, value, color }: { name: string, value: number, color: string }) => {
    return (
      <div className="mb-2">
        <div className="flex justify-between text-xs mb-1">
          <span>{name}</span>
          <span className="pixel-text">{value}/100</span>
        </div>
        <div className="h-2 bg-black/50 w-full rounded-sm border border-white/20 overflow-hidden relative">
          <div 
            className="h-full transition-all duration-300"
            style={{ 
              width: `${value}%`, 
              background: `linear-gradient(90deg, ${color}40 0%, ${color} 50%, ${color}80 100%)`,
              boxShadow: `0 0 8px ${color}80` 
            }}
          ></div>
          {/* Pixelated effect on stat bar */}
          <div className="absolute inset-0 stat-pixel-overlay"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen text-white font-terminal overflow-hidden relative">
      {/* Add the CRT Effect component */}
      <CRTEffect />
      
      {/* Scanlines overlay */}
      <div className="scanlines"></div>
      
      {/* Vignette effect */}
      <div className="vignette"></div>
      
      {/* Main content container */}
      <div className="crt-screen-container">
        {/* Main wrapper for all content */}
        <div className="max-w-screen-xl mx-auto relative z-10 flex flex-col min-h-screen">
          {/* Header */}
          <header 
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3"
            style={{ 
              backdropFilter: 'blur(4px)',
              backgroundColor: 'rgba(14, 10, 31, 0.8)',
              borderBottom: '1px solid rgba(102, 149, 255, 0.2)'
            }}
          >
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
              {/* Logo with retro style */}
              <div className="flex items-center">
                <a 
                  href="#" 
                  onClick={(e) => {e.preventDefault(); scrollToTop();}} 
                  className="logo-text retro-title hover:scale-105 transition-all duration-300"
                >
                  <span>GAME:</span>
                  <span>changer</span>
                </a>
              </div>
              
              {/* Mobile menu button */}
              <div className="md:hidden">
                <button 
                  className="p-2 rounded-lg bg-black/30 hover:bg-blue-900/20 transition-colors pixel-button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                >
                  {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
              
              {/* Desktop navigation with spacing */}
              <nav className="hidden md:flex items-center space-x-6">
                {navLinks.map((item, index) => (
                  <a 
                    key={index}
                    href={item.href}
                    className={`nav-link relative px-3 py-2 text-sm hover:text-blue-400 transition-colors ${
                      activeSection === item.href.replace('#', '') ? 'text-blue-400' : 'text-white'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (item.href === '#') {
                        scrollToTop();
                      } else {
                        scrollToSection(item.href.replace('#', ''));
                      }
                    }}
                  >
                    {item.name}
                  </a>
                ))}
                
                {/* Facebook link */}
                <a 
                  href="https://www.facebook.com/profile.php?id=61565503147498"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-blue-400 transition-colors p-2"
                  aria-label="Facebook"
                >
                  <Facebook size={18} />
                </a>
              </nav>
            </div>
            
            {/* Mobile menu */}
            <div 
              className={`md:hidden overflow-hidden transition-all duration-300 ${
                isMenuOpen ? 'max-h-500 opacity-100' : 'max-h-0 opacity-0'
              }`}
              style={{
                backdropFilter: 'blur(4px)',
                backgroundColor: 'rgba(14, 10, 31, 0.9)'
              }}
            >
              <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col space-y-1 border-t border-blue-900/20">
                {navLinks.map((item, index) => (
                  <a 
                    key={index}
                    href={item.href}
                    className={`flex items-center px-4 py-3 hover:bg-blue-900/20 rounded-md transition-colors ${
                      activeSection === item.href.replace('#', '') ? 'text-blue-400' : 'text-white'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (item.href === '#') {
                        scrollToTop();
                        setIsMenuOpen(false);
                      } else {
                        scrollToSection(item.href.replace('#', ''));
                      }
                    }}
                  >
                    <span className="mr-3 text-blue-400/80">{item.icon}</span>
                    {item.name}
                  </a>
                ))}
                
                {/* Social links in mobile menu */}
                <div className="flex items-center space-x-2 px-4 py-3 border-t border-blue-900/10 mt-2">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full hover:bg-blue-900/20 text-white hover:text-blue-400 transition-colors"
                      aria-label={link.name}
                    >
                      {link.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </header>

          {/* Hero section - center the content */}
          <section className="hero-section flex-grow flex flex-col items-center justify-center relative pt-24 pb-16">
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
              {/* Main title */}
              <h1 className="retro-title GamerWord mb-8">
                <span>GAME:</span><span>changer</span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-10 sm:mb-12 md:mb-16 px-2 sm:px-4">
                Gemeinnütziger Verein für eSport & Gaming in Pleissing, Niederösterreich
              </p>
              
              {/* Action buttons with CRT shine effect */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 px-4">
                <a 
                  href="https://www.facebook.com/profile.php?id=61565503147498" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary bg-pink-600 hover:bg-pink-700 flex items-center justify-center gap-2 py-3 px-5 sm:px-6 text-white"
                >
                  <Facebook size={16} />
                  <span>Facebook</span>
                </a>
                
                <a 
                  href="#mitglied" 
                  className="btn-primary bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2 py-3 px-5 sm:px-6 text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('mitglied');
                  }}
                >
                  <span>Mitglied werden</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </section>
          
          {/* About Section */}
          <section id="about" className="py-16 md:py-24 relative w-full max-w-6xl mx-auto px-4 sm:px-6">
            <div className="bg-black/30 backdrop-blur-md border border-blue-900/30 rounded-lg p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 retro-title">Über uns</h2>
              <p className="mb-6">
                Game:changer ist ein gemeinnütziger Verein, der sich der Förderung von Gaming und eSport in der Region widmet. 
                Gegründet von leidenschaftlichen Gamern, möchten wir eine Community aufbauen, die allen Altersgruppen Zugang zu 
                Gaming-Aktivitäten ermöglicht.
              </p>
              
              {/* Team section with character cards */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {characters.map((char, index) => (
                  <div 
                    key={index} 
                    className="relative bg-black/50 border border-white/10 p-4 rounded-lg hover-float transition-all duration-300 hover:border-blue-500/40"
                  >
                    <div 
                      className="text-center mb-2"
                      style={{ color: char.color }}
                    >
                      {generatePixelAvatar(index)}
                      <h3 className="mt-3 font-bold text-white">{char.name}</h3>
                      <p className="text-sm text-blue-200">{char.role}</p>
                    </div>
                    {/* Using the StatBar component */}
                    {renderCharacterStats(char)}
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Footer with retro styling */}
          <footer className="py-8 border-t border-blue-900/20 relative z-10 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="text-2xl retro-title mb-4">GAME:changer</div>
              <p className="text-blue-200 text-sm">© {new Date().getFullYear()} Game:changer. Alle Rechte vorbehalten.</p>
            </div>
          </footer>
          
          {/* Scroll to top button */}
          <button 
            onClick={scrollToTop}
            className={`fixed bottom-8 right-6 z-50 p-3 rounded-md bg-blue-600/90 shadow-lg transition-all duration-300 transform ${
              showScrollTop ? 'opacity-90 visible scale-100' : 'opacity-0 invisible scale-75'
            } pixel-button`}
            aria-label="Scroll to top"
          >
            <ChevronUp size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;