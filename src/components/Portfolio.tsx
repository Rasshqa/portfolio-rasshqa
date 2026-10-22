'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  Sparkles, 
  Menu, 
  Mail, 
  Heart, 
  ArrowUpRight, 
  Sun, 
  Moon, 
  ExternalLink, 
  Send, 
  CheckCircle2, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Code2,
  Award
} from 'lucide-react';
import { PortfolioData, initialPortfolioData } from '@/lib/data';
import WhatsAppWidget from './WhatsAppWidget';

interface InspectableBoxProps {
  children: React.ReactNode;
  dimensions?: string;
  color?: string;
  badgePosition?: 'top' | 'bottom';
  className?: string;
  defaultDraggable?: boolean;
  initialPos?: { x: number; y: number };
  delay?: number;
  isReady?: boolean;
  onClick?: () => void;
}

const InspectableBox: React.FC<InspectableBoxProps> = ({ 
  children, 
  dimensions = "548 x 136", 
  color = "#0ea5e9", 
  badgePosition = "bottom",
  className = "",
  defaultDraggable = false,
  initialPos = { x: 0, y: 0 },
  delay = 0,
  isReady = true,
  onClick
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [pos, setPos] = useState(initialPos);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const boxRef = useRef<HTMLDivElement>(null);
  const [measuredDims, setMeasuredDims] = useState(dimensions);

  useEffect(() => {
    if (boxRef.current && !dimensions) {
      const rect = boxRef.current.getBoundingClientRect();
      setMeasuredDims(`${Math.round(rect.width)} × ${Math.round(rect.height)}`);
    }
  }, [dimensions, isHovered]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!defaultDraggable) return;
    // Don't stop propagation completely so global hold detection can still track if needed
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y
    };
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      setPos({
        x: e.clientX - dragStartRef.current.x,
        y: e.clientY - dragStartRef.current.y
      });
    };
    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={boxRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleMouseDown}
      onClick={onClick}
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        animationDelay: `${delay}ms`,
        opacity: isReady ? 1 : 0,
      }}
      className={`relative inline-block transition-transform duration-200 ${
        isReady ? 'animate-pop-in' : 'opacity-0 pointer-events-none'
      } ${defaultDraggable ? 'cursor-grab active:cursor-grabbing' : ''} ${className}`}
    >
      {/* Bounding Box Border & Corner Handles */}
      {isHovered && (
        <div 
          className="absolute -inset-1.5 pointer-events-none z-30 transition-all duration-150"
          style={{ border: `1.5px solid ${color}` }}
        >
          {/* 4 Corner Handles */}
          <span className="absolute -top-1.5 -left-1.5 w-2.5 h-2.5 bg-white border-[1.5px] rounded-full" style={{ borderColor: color }} />
          <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-white border-[1.5px] rounded-full" style={{ borderColor: color }} />
          <span className="absolute -bottom-1.5 -left-1.5 w-2.5 h-2.5 bg-white border-[1.5px] rounded-full" style={{ borderColor: color }} />
          <span className="absolute -bottom-1.5 -right-1.5 w-2.5 h-2.5 bg-white border-[1.5px] rounded-full" style={{ borderColor: color }} />

          {/* Dimension Pill Tag */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 px-2 py-0.5 text-[10px] font-mono-tech font-bold text-white rounded shadow-sm whitespace-nowrap tracking-tighter ${
              badgePosition === 'top' ? '-top-6' : '-bottom-6'
            }`}
            style={{ backgroundColor: color }}
          >
            {measuredDims}
          </div>
        </div>
      )}

      {children}
    </div>
  );
};

const RainbowLogoSVG = ({ isDark }: { isDark: boolean }) => (
  <svg width="38" height="28" viewBox="0 0 42 30" fill="none" className="transition-transform duration-300 hover:scale-115">
    <path d="M3 27C3 14 11 4 21 4C31 4 39 14 39 27" stroke={isDark ? "#f6f5f0" : "#111"} strokeWidth="2.8" strokeLinecap="round"/>
    <path d="M8 27C8 17 13.5 9 21 9C28.5 9 34 17 34 27" stroke={isDark ? "#38bdf8" : "#111"} strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M13 27C13 20 16.5 14 21 14C25.5 14 29 20 29 27" stroke={isDark ? "#facc15" : "#111"} strokeWidth="2.2" strokeLinecap="round"/>
    <path d="M18 27C18 23 19.2 20 21 20C22.8 20 24 23 24 27" stroke={isDark ? "#f472b6" : "#111"} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const CrownSVG = () => (
  <svg width="64" height="50" viewBox="0 0 70 55" fill="none" className="drop-shadow-sm">
    <path 
      d="M8 44L4 16L23 29L35 9L47 29L66 16L62 44H8Z" 
      fill="#FDE047" 
      stroke="#FACC15" 
      strokeWidth="2" 
      strokeLinejoin="round"
    />
    <path d="M10 48H60" stroke="#EAB308" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

/* Portrait Component with dark tape, real photo support, and high-contrast SVG styling */
const StylizedPortrait = ({ isInverted, photoUrl, onClick }: { isInverted: boolean; photoUrl?: string; onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className="relative w-[300px] sm:w-[370px] md:w-[410px] h-[350px] sm:h-[420px] md:h-[450px] select-none cursor-pointer group neo-card-grand"
  >
    {/* Dark Tape at top right */}
    <div className="absolute -top-3 right-12 w-24 h-8 bg-[#1e242b] rotate-[22deg] z-20 opacity-95 shadow-sm" />

    {/* Electric Blue Rough Paint Brush Backdrop */}
    <svg 
      viewBox="0 0 400 430" 
      className="absolute inset-0 w-full h-full drop-shadow-md"
      fill="none"
    >
      <path 
        d="M55 75 C80 55, 150 50, 195 52 C240 40, 320 35, 355 50 C375 85, 365 180, 378 265 C382 325, 385 375, 365 405 C295 412, 140 410, 45 405 C32 340, 42 260, 38 190 C35 120, 40 90, 55 75 Z" 
        fill="#2563EB"
      />
      <path d="M35 160 L50 145 L45 190 Z" fill="#2563EB" />
      <path d="M360 110 L382 125 L370 165 Z" fill="#2563EB" />
      <path d="M180 42 L245 34 L230 58 Z" fill="#2563EB" />
    </svg>

    {/* White Paper Cutout + Character Portrait or Real Photo */}
    <div 
      className={`relative z-10 w-full h-full flex items-end justify-center overflow-hidden transition-all duration-300 ${
        isInverted ? 'invert contrast-125' : ''
      }`}
    >
      {photoUrl ? (
        <div className="relative w-[85%] h-[88%] rounded-2xl border-4 border-white neo-shadow overflow-hidden bg-neutral-900 mb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoUrl}
            alt="Rashqa Andrean"
            className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-300"
          />
        </div>
      ) : (
        <svg viewBox="0 0 400 440" className="w-full h-full">
          {/* Paper Cutout Outline */}
          <path 
            d="M65 415 L72 325 C74 295 95 275 135 262 L152 248 L152 218 C134 205 126 185 128 164 C118 148 118 115 132 95 C140 62 175 42 215 44 C258 42 292 65 302 102 C312 125 305 155 292 172 C292 192 282 212 266 222 L266 250 L288 262 C328 274 348 298 354 335 L364 415 Z" 
            fill="#FFFFFF"
            stroke="#FFFFFF"
            strokeWidth="18"
            strokeLinejoin="round"
          />

          {/* Hoodie Body */}
          <path 
            d="M76 412 L84 332 C86 302 106 284 144 272 L165 256 L255 256 L278 272 C316 284 338 305 344 340 L352 412 Z" 
            fill="#141414"
          />

          {/* Hoodie Details */}
          <path 
            d="M142 272 C145 305 175 322 212 322 C248 322 272 302 278 272 L262 245 L158 245 Z" 
            fill="#1f1f1f"
            stroke="#0a0a0a"
            strokeWidth="3"
          />
          <path d="M112 285 L125 412 L152 412 L140 274 Z" fill="#262626" />
          <path d="M306 285 L292 412 L265 412 L278 274 Z" fill="#262626" />

          {/* Hoodie Drawstrings */}
          <path d="M188 308 C186 340 185 365 188 392" stroke="#f5f5f5" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M232 308 C234 335 232 355 230 380" stroke="#f5f5f5" strokeWidth="4.5" strokeLinecap="round" />

          {/* Chest Patch with Tech Glyph */}
          <g transform="translate(245, 362) rotate(-8)">
            <rect x="0" y="0" width="22" height="16" rx="2" fill="#111" stroke="#eee" strokeWidth="1.5"/>
            <path d="M5 12 L11 4 L17 12 Z" fill="#eee" />
          </g>

          {/* Neck */}
          <path d="M174 210 L174 268 C174 285 244 285 244 268 L244 210 Z" fill="#d4d4d4" />
          <path d="M174 215 C190 238 228 242 244 225 L244 210 L174 210 Z" fill="#262626" />

          {/* Ears */}
          <ellipse cx="152" cy="176" rx="12" ry="18" transform="rotate(-10 152 176)" fill="#d4d4d4" stroke="#171717" strokeWidth="2.5" />
          <ellipse cx="268" cy="174" rx="11" ry="17" transform="rotate(12 268 174)" fill="#bdbdbd" stroke="#171717" strokeWidth="2.5" />

          {/* Face */}
          <path 
            d="M156 125 C156 95 264 95 264 125 L262 178 C260 208 238 232 210 232 C182 232 160 208 158 178 Z" 
            fill="#e5e5e5" 
            stroke="#171717" 
            strokeWidth="3"
          />

          <path 
            d="M235 160 C238 188 225 215 198 226 C225 230 255 208 260 178 L262 140 Z" 
            fill="#a3a3a3" 
          />

          <path d="M210 156 L205 182 L218 184" stroke="#171717" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M194 202 C204 207 218 206 226 200" stroke="#171717" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* Retro Sunglasses */}
          <g transform="rotate(-3 210 155)">
            <rect x="156" y="138" width="48" height="33" rx="8" fill="#0a0a0a" stroke="#171717" strokeWidth="3" />
            <rect x="216" y="138" width="48" height="33" rx="8" fill="#0a0a0a" stroke="#171717" strokeWidth="3" />
            <path d="M204 148 Q210 143 216 148" stroke="#171717" strokeWidth="4.5" fill="none" />
            <path d="M164 144 L176 144 L168 164 L160 164 Z" fill="#ffffff" opacity="0.22" />
            <path d="M224 144 L236 144 L228 164 L220 164 Z" fill="#ffffff" opacity="0.22" />
          </g>

          {/* Hair */}
          <path 
            d="M145 155 C128 140 125 108 142 88 C148 64 180 48 214 52 C252 46 286 68 294 98 C306 118 298 148 276 158 C276 135 268 122 252 118 C245 132 228 138 215 130 C202 142 182 142 172 128 C160 135 152 145 145 155 Z" 
            fill="#141414" 
          />
          <path d="M162 115 Q178 142 198 132 Q188 115 212 135 Q232 140 246 122" stroke="#141414" strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M165 82 Q195 68 228 78" stroke="#404040" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M150 105 Q175 95 202 102" stroke="#333333" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      )}
    </div>

    {/* Bottom Torn Paper Edge */}
    <div className="absolute bottom-2 left-6 right-6 h-5 bg-white z-20 flex items-center overflow-hidden shadow-sm">
      <svg viewBox="0 0 400 24" className="w-full h-full fill-current text-[#f6f5f0] dark:text-[#18191c]">
        <path d="M0 24 L0 8 L18 15 L36 4 L58 16 L82 6 L105 18 L132 5 L158 15 L186 4 L215 17 L242 6 L270 16 L298 5 L325 18 L354 6 L380 15 L400 4 L400 24 Z" />
      </svg>
    </div>
  </div>
);

export default function Portfolio() {
  const [data, setData] = useState<PortfolioData>(initialPortfolioData);

  // Intro Sequence State: 'hey' -> 'welcome' -> 'burst' -> 'ready'
  const [introStep, setIntroStep] = useState<'hey' | 'welcome' | 'burst' | 'ready'>('hey');
  const [activeTab, setActiveTab] = useState<'HOME' | 'ABOUT' | 'WORKS' | 'BLOG' | 'CONTACT'>('HOME');
  const [isDark, setIsDark] = useState(false);
  
  // Spread Theme Transition State
  const [themeSpread, setThemeSpread] = useState<{ active: boolean; targetDark: boolean } | null>(null);

  const [isPortraitInverted, setIsPortraitInverted] = useState(false);
  const [showAvatarToast, setShowAvatarToast] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Slide Sub-navigation States
  const [aboutSlide, setAboutSlide] = useState<number>(0);
  const [worksPage, setWorksPage] = useState<number>(0);
  const [blogSlide, setBlogSlide] = useState<number>(0);

  // Custom Cursor & Hold Invert Lens
  const [mousePos, setMousePos] = useState({ x: 520, y: 360 });
  const [cursorRingPos, setCursorRingPos] = useState({ x: 520, y: 360 });
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  
  const [isHoldingClick, setIsHoldingClick] = useState(false);
  const [lensRadius, setLensRadius] = useState(0);

  // Fetch live CMS data from API on mount
  useEffect(() => {
    setMounted(true);
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setData(res.data);
        }
      })
      .catch(err => console.warn('Could not load dynamic CMS data:', err));
  }, []);

  // Intro sequence timer
  useEffect(() => {
    const t1 = setTimeout(() => setIntroStep('welcome'), 950);
    const t2 = setTimeout(() => setIntroStep('burst'), 1850);
    const t3 = setTimeout(() => setIntroStep('ready'), 2250);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Replay intro AND redirect to HOME
  const replayIntro = () => {
    setActiveTab('HOME');
    setIntroStep('hey');
    setTimeout(() => setIntroStep('welcome'), 900);
    setTimeout(() => setIntroStep('burst'), 1750);
    setTimeout(() => setIntroStep('ready'), 2150);
  };

  // Track mouse coordinates
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement | null;
      if (target && (target.closest('button') || target.closest('a') || target.closest('input') || target.closest('textarea') || target.closest('[data-interactive="true"]'))) {
        setIsHoveringInteractive(true);
      } else {
        setIsHoveringInteractive(false);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Smooth follower cursor
  useEffect(() => {
    let animationFrameId: number;
    const followMouse = () => {
      setCursorRingPos((prev) => ({
        x: prev.x + (mousePos.x - prev.x) * 0.22,
        y: prev.y + (mousePos.y - prev.y) * 0.22,
      }));
      animationFrameId = requestAnimationFrame(followMouse);
    };
    animationFrameId = requestAnimationFrame(followMouse);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mousePos]);

  // RELIABLE HOLD-TO-INVERT LENS (Pointerdown & Pointerup)
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return; // Left button only
      const target = e.target as HTMLElement | null;
      // Do not block normal button / input interactions
      if (target && (target.closest('button') || target.closest('a') || target.closest('input') || target.closest('textarea'))) {
        return;
      }
      setIsHoldingClick(true);
    };

    const handlePointerUp = () => {
      setIsHoldingClick(false);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, []);

  // Smooth lens bloom interpolation
  useEffect(() => {
    let frameId: number;
    const targetRadius = isHoldingClick ? 165 : 0;
    const step = () => {
      setLensRadius((prev) => {
        const diff = targetRadius - prev;
        if (Math.abs(diff) < 0.8) return targetRadius;
        return prev + diff * 0.26;
      });
      frameId = requestAnimationFrame(step);
    };
    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [isHoldingClick]);

  // TOP-RIGHT SPREAD THEME TRANSITION
  const handleThemeToggle = () => {
    const nextDark = !isDark;
    setThemeSpread({ active: true, targetDark: nextDark });

    // Smoothly apply theme mid-spread
    setTimeout(() => {
      setIsDark(nextDark);
    }, 380);

    // Clean up spread overlay after animation completes
    setTimeout(() => {
      setThemeSpread(null);
    }, 850);
  };

  const handleAvatarClick = () => {
    setShowAvatarToast(true);
    setTimeout(() => setShowAvatarToast(false), 2600);
  };

  const navigateToTechStack = () => {
    setActiveTab('ABOUT');
    setAboutSlide(2);
  };

  const isReady = introStep === 'ready';

  // Works Pagination
  const projectsPerPage = 4;
  const totalWorksPages = Math.ceil(data.projects.length / projectsPerPage);
  const currentProjects = data.projects.slice(
    worksPage * projectsPerPage,
    (worksPage + 1) * projectsPerPage
  );

  return (
    <div className={`${isDark ? 'dark' : ''} relative min-h-screen select-none overflow-x-hidden`}>
      
      {/* SPREAD FROM TOP-RIGHT THEME TRANSITION OVERLAY */}
      {themeSpread && (
        <div
          className="fixed inset-0 pointer-events-none z-[120] animate-theme-spread overflow-hidden"
          style={{
            backgroundColor: themeSpread.targetDark ? '#18191c' : '#f6f5f0',
            boxShadow: themeSpread.targetDark 
              ? '0 0 60px 20px rgba(56, 189, 248, 0.4)' 
              : '0 0 60px 20px rgba(37, 99, 235, 0.3)'
          }}
        />
      )}

      {/* WORKING INVERT LENS WITH BACKDROP FILTER */}
      {lensRadius > 4 && (
        <div
          className="fixed pointer-events-none z-[110]"
          style={{
            left: mousePos.x,
            top: mousePos.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Glass Lens with backdrop-filter: invert */}
          <div
            className="invert-lens-glass rounded-full"
            style={{
              width: lensRadius * 2,
              height: lensRadius * 2,
            }}
          />

          {/* HUD Target Ring */}
          <div
            className="absolute inset-0 rounded-full border border-dashed border-cyan-400 pointer-events-none flex items-center justify-center animate-spin"
            style={{
              width: lensRadius * 2 + 18,
              height: lensRadius * 2 + 18,
              margin: -9,
              animationDuration: '14s'
            }}
          >
            <span className="absolute -top-1 w-2.5 h-0.5 bg-cyan-400" />
            <span className="absolute -bottom-1 w-2.5 h-0.5 bg-cyan-400" />
            <span className="absolute -left-1 w-0.5 h-2.5 bg-cyan-400" />
            <span className="absolute -right-1 w-0.5 h-2.5 bg-cyan-400" />
          </div>

          {/* Tag */}
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-[#111] text-cyan-300 text-[10px] font-mono-tech font-extrabold rounded border border-cyan-400 shadow-md whitespace-nowrap">
            INVERT LENS [{Math.round(lensRadius * 2)}px]
          </div>
        </div>
      )}

      {/* Custom Follower Cursor ("YOU") */}
      {mounted && (
        <div
          className="fixed top-0 left-0 pointer-events-none z-[100] hidden sm:block"
          style={{
            transform: `translate3d(${cursorRingPos.x}px, ${cursorRingPos.y}px, 0)`,
          }}
        >
          <div
            className={`-translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150 ${
              isHoveringInteractive
                ? 'w-6 h-6 border-2 border-[#111] dark:border-white bg-transparent scale-110'
                : isHoldingClick
                ? 'w-4 h-4 bg-[#2563eb] scale-125'
                : 'w-3 h-3 bg-[#111] dark:bg-white'
            }`}
          />
          <div className="ml-2.5 mt-1 px-2 py-0.5 bg-[#111] dark:bg-white text-white dark:text-[#111] text-[10px] font-mono-tech font-extrabold rounded-full shadow-md tracking-wider">
            {isHoldingClick ? 'INVERTING' : 'YOU'}
          </div>
        </div>
      )}

      {/* Main Background Canvas */}
      <div className="min-h-screen bg-[#f6f5f0] dark:bg-[#18191c] text-[#111111] dark:text-[#f6f5f0] transition-colors duration-300 flex flex-col justify-between relative">
        
        {/* TOP NAVBAR */}
        <header className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 pt-4 pb-2 flex items-center justify-between z-40">
          {/* Left Nav Group */}
          <div className="flex items-center gap-2 sm:gap-5 flex-wrap">
            {/* Rainbow Logo: Clicking resets to HOME and replays intro */}
            <button 
              onClick={replayIntro}
              title="Kembali ke Home &amp; Putar Ulang Animasi"
              className="mr-2 focus:outline-none group relative cursor-pointer"
            >
              <RainbowLogoSVG isDark={isDark} />
            </button>

            {/* Nav Items */}
            {[
              { id: 'HOME' as const, label: 'HOME', icon: Home },
              { id: 'ABOUT' as const, label: 'ABOUT', icon: Sparkles },
              { id: 'WORKS' as const, label: 'WORKS', icon: Menu },
              { id: 'BLOG' as const, label: 'ACHIEVEMENTS', icon: Award },
              { id: 'CONTACT' as const, label: 'CONTACT', icon: Mail },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-3.5 py-2 text-xs font-mono-tech font-extrabold tracking-wider flex items-center gap-2 transition-transform duration-150 hover:-translate-y-0.5 cursor-pointer ${
                    isActive ? 'text-[#111]' : 'text-[#111] dark:text-[#f3f4f6] hover:opacity-75'
                  }`}
                >
                  {isActive && (
                    <span className="absolute inset-0 bg-[#38bdf8] clip-brush-nav -z-10 transform -rotate-1 scale-105 shadow-sm" />
                  )}
                  <Icon className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Controls: Theme Switcher, Avatar, Let's Talk */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Sun / Moon Pill Toggle with Top-Right Spread */}
            <button
              onClick={handleThemeToggle}
              aria-label="Toggle Dark Mode"
              title="Ganti Tema (Spread dari atas kanan)"
              className="w-12 h-6 rounded-full bg-neutral-200 dark:bg-neutral-800 border-2 border-[#111] dark:border-neutral-700 p-0.5 flex items-center transition-colors relative cursor-pointer neo-shadow-sm neo-btn"
            >
              <div
                className={`w-4 h-4 rounded-full bg-white dark:bg-neutral-900 shadow flex items-center justify-center transition-transform duration-300 ${
                  isDark ? 'translate-x-5' : 'translate-x-0'
                }`}
              >
                {isDark ? (
                  <Moon className="w-2.5 h-2.5 text-yellow-400" />
                ) : (
                  <Sun className="w-2.5 h-2.5 text-neutral-700" />
                )}
              </div>
            </button>

            {/* Mini Avatar with Toast */}
            <div className="relative">
              <button
                onClick={handleAvatarClick}
                aria-label="Avatar greetings"
                className="w-9 h-9 rounded-full bg-[#38bdf8] border-2 border-[#111] dark:border-white overflow-hidden flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-pointer"
              >
                <svg viewBox="0 0 40 40" className="w-full h-full">
                  <circle cx="20" cy="20" r="20" fill="#38bdf8" />
                  <circle cx="20" cy="16" r="7" fill="#e5e5e5" stroke="#111" strokeWidth="1.5" />
                  <path d="M13 13 C13 8 27 8 27 13" fill="#111" />
                  <rect x="14" y="13" width="5" height="3.5" rx="1" fill="#111" />
                  <rect x="21" y="13" width="5" height="3.5" rx="1" fill="#111" />
                  <path d="M10 38 C10 28 30 28 30 38" fill="#111" />
                </svg>
              </button>

              {showAvatarToast && (
                <div className="absolute right-0 top-12 z-50 bg-[#2563eb] text-white text-xs font-mono-tech font-bold px-3.5 py-2 rounded-lg border-2 border-[#111] neo-shadow whitespace-nowrap animate-pop-in">
                  Have a productive day! 🚀
                </div>
              )}
            </div>

            {/* LET'S TALK Button */}
            <button
              onClick={() => setActiveTab('CONTACT')}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-[#23252a] text-[#111] dark:text-white text-xs font-mono-tech font-extrabold tracking-wider border-2 border-[#111] dark:border-neutral-300 rounded-[4px] neo-shadow neo-btn-grand cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>LET&apos;S TALK</span>
            </button>
          </div>
        </header>

        {/* FULLSCREEN INTRO OVERLAY */}
        {introStep !== 'ready' && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-30">
            {(introStep === 'hey' || introStep === 'welcome') && (
              <div className="px-9 py-5 bg-[#2563eb] text-white font-display font-extrabold text-2xl sm:text-3xl rounded-2xl border-2 border-[#111] neo-shadow-lg animate-pop-in">
                {introStep === 'hey' ? 'Hey there' : `Welcome to ${data.profile.nickName}'s World`}
              </div>
            )}

            {introStep === 'burst' && (
              <div className="relative flex items-center justify-center">
                <svg width="260" height="260" viewBox="0 0 200 200" className="-translate-x-48 -translate-y-24">
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
                    <line
                      key={angle}
                      x1="100"
                      y1="30"
                      x2="100"
                      y2="10"
                      stroke={isDark ? '#fff' : '#9ca3af'}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      transform={`rotate(${angle} 100 100)`}
                      className="animate-ping"
                    />
                  ))}
                </svg>
              </div>
            )}
          </div>
        )}

        {/* MAIN BODY AREA (Strictly hidden during intro sequence so no emblem leaks!) */}
        <main className={`flex-1 w-full max-w-[1380px] mx-auto px-4 sm:px-10 py-6 flex items-center justify-center relative transition-opacity duration-500 ${
          isReady ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          
          {/* TAB: HOME */}
          {activeTab === 'HOME' && (
            <div className="w-full relative min-h-[560px] flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-6 py-4">
              
              {/* Top-left Plus '+' Sign */}
              <div 
                className={`hidden md:block absolute top-6 left-2 text-3xl font-extrabold transition-opacity duration-500 ${
                  isReady ? 'opacity-100' : 'opacity-0'
                }`}
              >
                +
              </div>

              {/* Left Mint Green Sticker: "FULL STACK DEVELOPER" */}
              <div className="hidden xl:block absolute top-28 -left-6 z-20">
                <InspectableBox
                  dimensions="130 × 108"
                  color="#10b981"
                  badgePosition="bottom"
                  defaultDraggable={true}
                  delay={180}
                  isReady={isReady}
                >
                  <div className="w-32 h-24 bg-[#a7f3d0] text-[#111] p-3 -rotate-12 shadow-md border-2 border-[#111] flex flex-col items-center justify-center text-center font-hand text-xl leading-tight font-bold neo-sticker-grand">
                    <span>FULL STACK</span>
                    <span>DEVELOPER</span>
                    <div className="w-12 h-0.5 bg-[#111]/40 mt-1 rounded-full" />
                  </div>
                </InspectableBox>
              </div>

              {/* Left Blue Zigzag 'W' Doodle */}
              <div 
                className={`hidden xl:block absolute bottom-44 left-6 transition-opacity duration-700 ${
                  isReady ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <svg width="34" height="24" viewBox="0 0 34 24" fill="none">
                  <path d="M3 4L10 20L17 7L24 20L31 4" stroke="#2563eb" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Bottom-left Yellow Sticky Note */}
              <div className="hidden xl:block absolute bottom-8 -left-4 z-20">
                <InspectableBox
                  dimensions="132 × 128"
                  color="#f59e0b"
                  badgePosition="top"
                  defaultDraggable={true}
                  delay={260}
                  isReady={isReady}
                >
                  <div className="w-32 h-32 bg-[#fde047] text-[#111] p-3 rotate-6 shadow-md border-2 border-[#111] flex flex-col items-center justify-center text-center font-hand text-lg leading-tight font-bold neo-sticker-grand">
                    <span>Clean</span>
                    <span>Code</span>
                    <span>=</span>
                    <span>High</span>
                    <span>Scalability</span>
                  </div>
                </InspectableBox>
              </div>

              {/* LEFT COLUMN: Hey, I'm RASHQA + Bio + CTA Buttons */}
              <div className="w-full lg:w-[52%] xl:pl-20 z-10 flex flex-col items-start text-left">
                
                {/* "Hey, I'm" Handwritten Greeting */}
                <InspectableBox
                  dimensions="142 × 48"
                  color="#0ea5e9"
                  badgePosition="top"
                  delay={50}
                  isReady={isReady}
                  className="mb-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400 text-lg font-mono-tech">=</span>
                    <span className="font-hand text-4xl sm:text-5xl font-bold tracking-wide -rotate-3 inline-block">
                      {data.profile.headline}
                    </span>
                  </div>
                </InspectableBox>

                {/* Giant "RASHQA ANDREAN" Heading with Yellow Crown */}
                <div className="relative mt-1 mb-5">
                  <div 
                    className={`absolute -top-10 right-2 sm:right-6 z-20 rotate-12 pointer-events-none transition-all duration-500 ${
                      isReady ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                    }`}
                  >
                    <CrownSVG />
                  </div>

                  <InspectableBox
                    dimensions="548 × 136"
                    color="#0ea5e9"
                    badgePosition="bottom"
                    delay={120}
                    isReady={isReady}
                  >
                    <h1 className="font-display font-extrabold text-5xl sm:text-7xl xl:text-[80px] leading-[0.92] tracking-tight uppercase px-1">
                      {data.profile.nickName}
                      <br />
                      ANDREAN
                    </h1>
                  </InspectableBox>
                </div>

                {/* Subtitle / Role Tag (Safely guarded by isReady) */}
                <div 
                  className={`mb-4 inline-flex items-center gap-2 px-3 py-1 bg-[#38bdf8] text-[#111] font-mono-tech font-extrabold text-xs rounded border-2 border-[#111] neo-shadow-sm transition-opacity duration-300 ${
                    isReady ? 'opacity-100 animate-pop-in' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <span>⚡ {data.profile.role}</span>
                </div>

                {/* Bio Paragraph */}
                <InspectableBox
                  dimensions="460 × 96"
                  color="#10b981"
                  badgePosition="bottom"
                  delay={200}
                  isReady={isReady}
                  className="w-full max-w-[460px] mb-7"
                >
                  <div className="border-y border-neutral-300 dark:border-neutral-700 py-3.5">
                    <p className="font-mono-tech text-xs sm:text-[14px] leading-relaxed text-neutral-700 dark:text-neutral-300">
                      {data.profile.bio}
                    </p>
                  </div>
                </InspectableBox>

                {/* Action Buttons: VIEW MY WORK & TECH STACKS */}
                <div className="flex flex-wrap items-center gap-4">
                  <InspectableBox
                    dimensions="186 × 48"
                    color="#0ea5e9"
                    badgePosition="bottom"
                    delay={280}
                    isReady={isReady}
                  >
                    <button
                      onClick={() => setActiveTab('WORKS')}
                      className="px-6 py-3.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-mono-tech font-extrabold text-xs tracking-wider rounded-md border-2 border-[#111] neo-shadow neo-btn-grand flex items-center gap-3 transition-transform cursor-pointer"
                    >
                      <span className="w-5 h-5 rounded bg-white text-[#111] flex items-center justify-center">
                        <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                      <span>VIEW MY WORK</span>
                    </button>
                  </InspectableBox>

                  <InspectableBox
                    dimensions="184 × 48"
                    color="#8b5cf6"
                    badgePosition="bottom"
                    delay={340}
                    isReady={isReady}
                  >
                    <button
                      onClick={navigateToTechStack}
                      className="px-6 py-3.5 bg-white dark:bg-[#23252a] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[#111] dark:text-white font-mono-tech font-extrabold text-xs tracking-wider rounded-md border-2 border-[#111] dark:border-neutral-400 neo-shadow neo-btn-grand flex items-center gap-2.5 transition-transform cursor-pointer"
                    >
                      <Code2 className="w-4 h-4 text-[#2563eb] stroke-[2.5]" />
                      <span>TECH STACKS</span>
                    </button>
                  </InspectableBox>
                </div>
              </div>

              {/* RIGHT COLUMN: Portrait + Browser Window Card + Stickers */}
              <div className="w-full lg:w-[48%] flex items-center justify-center relative min-h-[460px]">
                
                {/* Mini Retro Browser Window Card (Tech Stack Preview -> Click goes to Tech Stack) */}
                <div className="absolute -top-6 left-2 sm:left-4 z-30">
                  <InspectableBox
                    dimensions="190 × 140"
                    color="#0ea5e9"
                    badgePosition="top"
                    defaultDraggable={true}
                    delay={220}
                    isReady={isReady}
                  >
                    <div 
                      onClick={navigateToTechStack}
                      title="Klik untuk lihat detail Tech Stack di tab About"
                      className="w-44 sm:w-48 bg-white dark:bg-[#23252a] border-2 border-[#111] rounded-xl p-3 -rotate-6 neo-shadow neo-card-grand cursor-pointer"
                    >
                      {/* Window Header */}
                      <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-neutral-200 dark:border-neutral-700">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-400 border border-[#111]" />
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-[#111]" />
                          <span className="w-2.5 h-2.5 rounded-full bg-green-400 border border-[#111]" />
                        </div>
                        <span className="text-[9px] font-mono-tech font-bold text-neutral-400">STACK.TS</span>
                      </div>

                      {/* Stack Items */}
                      <div className="space-y-1.5 font-mono-tech text-[11px] font-extrabold text-[#111] dark:text-white">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded bg-[#111] text-white text-[8px] flex items-center justify-center">▲</span>
                            <span>Next.js</span>
                          </div>
                          <span className="text-[9px] text-[#38bdf8]">App</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded bg-[#f43f5e] text-white text-[8px] flex items-center justify-center">LV</span>
                            <span>Laravel</span>
                          </div>
                          <span className="text-[9px] text-[#f43f5e]">API</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded bg-[#00ADD8] text-white text-[8px] flex items-center justify-center">GO</span>
                            <span>Golang</span>
                          </div>
                          <span className="text-[9px] text-[#00ADD8]">Fast</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded bg-[#42b883] text-white text-[8px] flex items-center justify-center">V</span>
                            <span>Vue JS</span>
                          </div>
                          <span className="text-[9px] text-[#42b883]">&amp; more →</span>
                        </div>
                      </div>
                    </div>
                  </InspectableBox>
                </div>

                {/* Blue 'Z' Doodle above Portrait */}
                <div 
                  className={`hidden sm:block absolute top-6 left-52 z-20 transition-opacity duration-700 ${
                    isReady ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 6H19L6 18H20" stroke="#2563eb" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                {/* Center Portrait with Orange Bounding Box & Click-to-Invert */}
                <InspectableBox
                  dimensions="400 × 407"
                  color="#f97316"
                  badgePosition="bottom"
                  delay={160}
                  isReady={isReady}
                >
                  <StylizedPortrait 
                    isInverted={isPortraitInverted} 
                    photoUrl={data.profile.photoUrl}
                    onClick={() => setIsPortraitInverted(!isPortraitInverted)} 
                  />
                </InspectableBox>

                {/* Pink Starburst Sticker: "BUILD COOL THINGS" */}
                <div className="absolute bottom-14 right-4 sm:right-12 z-30">
                  <InspectableBox
                    dimensions="118 × 118"
                    color="#ec4899"
                    badgePosition="bottom"
                    defaultDraggable={true}
                    delay={300}
                    isReady={isReady}
                  >
                    <div className="relative w-28 h-28 flex items-center justify-center rotate-12 neo-sticker-grand">
                      <svg viewBox="0 0 120 120" className="w-full h-full fill-[#f472b6] drop-shadow">
                        <polygon points="60,2 73,18 93,9 96,30 116,33 107,52 120,68 103,80 106,101 86,102 77,120 60,108 43,120 34,102 14,101 17,80 0,68 13,52 4,33 24,30 27,9 47,18" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center font-hand font-extrabold text-[#111] text-lg leading-none">
                        <span>BUILD</span>
                        <span>COOL</span>
                        <span>THINGS</span>
                      </div>
                    </div>
                  </InspectableBox>
                </div>

                {/* Top-right Lime Green Sticky Note */}
                <div className="hidden sm:block absolute -top-8 -right-4 z-20">
                  <InspectableBox
                    dimensions="112 × 110"
                    color="#84cc16"
                    badgePosition="bottom"
                    defaultDraggable={true}
                    delay={250}
                    isReady={isReady}
                  >
                    <div className="w-28 h-28 bg-[#bef264] text-[#111] p-3 rotate-6 shadow-md border-2 border-[#111] flex flex-col items-center justify-center text-center font-hand text-xl leading-tight font-bold neo-sticker-grand">
                      <span>Design.</span>
                      <span>Code.</span>
                      <span>Ship</span>
                    </div>
                  </InspectableBox>
                </div>

                {/* Right Oval Badge: "creativity + technology" */}
                <div className="hidden sm:block absolute top-44 -right-6 z-20">
                  <InspectableBox
                    dimensions="132 × 84"
                    color="#0ea5e9"
                    badgePosition="bottom"
                    defaultDraggable={true}
                    delay={320}
                    isReady={isReady}
                  >
                    <div className="px-5 py-3.5 bg-white dark:bg-[#23252a] text-[#111] dark:text-white border-2 border-[#111] dark:border-white rounded-full -rotate-6 shadow-sm flex flex-col items-center justify-center text-center font-hand text-lg leading-none font-bold neo-sticker-grand">
                      <span>creativity</span>
                      <span className="text-xs my-0.5">+</span>
                      <span>technology</span>
                    </div>
                  </InspectableBox>
                </div>

                {/* Right Hand-drawn Heart Outline */}
                <div 
                  className={`hidden sm:block absolute bottom-32 -right-2 transition-opacity duration-700 ${
                    isReady ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Heart className="w-7 h-7 stroke-[2.2] text-[#111] dark:text-white rotate-12" />
                </div>

                {/* Bottom-right Circle Badge: "Let's Create Together" */}
                <div className="hidden sm:block absolute -bottom-4 right-0 z-20">
                  <InspectableBox
                    dimensions="114 × 114"
                    color="#ec4899"
                    badgePosition="top"
                    defaultDraggable={true}
                    delay={380}
                    isReady={isReady}
                  >
                    <div 
                      onClick={() => setActiveTab('CONTACT')}
                      className="w-28 h-28 rounded-full bg-white dark:bg-[#23252a] text-[#111] dark:text-white border-2 border-[#111] dark:border-white p-3 -rotate-6 shadow-md flex flex-col items-center justify-center text-center font-hand text-lg leading-tight font-bold cursor-pointer neo-sticker-grand"
                    >
                      <span>Let&apos;s</span>
                      <span>Create</span>
                      <span>Together</span>
                    </div>
                  </InspectableBox>
                </div>

              </div>
            </div>
          )}

          {/* TAB: ABOUT (SLIDE BASED - NO SCROLL) */}
          {activeTab === 'ABOUT' && (
            <div className="w-full max-w-4xl py-4 animate-pop-in">
              <div className="bg-white dark:bg-[#23252a] border-2 border-[#111] dark:border-neutral-400 rounded-2xl p-6 sm:p-8 neo-shadow-lg relative flex flex-col min-h-[540px] justify-between">
                
                {/* Slide Header & Tab Switcher */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b-2 border-neutral-200 dark:border-neutral-700">
                    <div>
                      <div className="inline-block px-3 py-1 bg-[#fde047] text-[#111] font-mono-tech font-extrabold text-xs rounded border border-[#111] mb-1">
                        * ABOUT RASHQA
                      </div>
                      <h2 className="font-display font-extrabold text-2xl sm:text-3xl">
                        {aboutSlide === 0 && '01. PROFILE OVERVIEW'}
                        {aboutSlide === 1 && '02. MY STORY & PHILOSOPHY'}
                        {aboutSlide === 2 && '03. TECH STACK & EXPERTISE'}
                      </h2>
                    </div>

                    {/* Slide Pill Navigation */}
                    <div className="flex items-center gap-1.5 bg-[#f6f5f0] dark:bg-neutral-800 p-1 rounded-lg border border-[#111]">
                      {['Profile', 'About Me', 'Tech Stack'].map((label, idx) => (
                        <button
                          key={label}
                          onClick={() => setAboutSlide(idx)}
                          className={`px-3 py-1.5 text-xs font-mono-tech font-extrabold rounded transition-all cursor-pointer ${
                            aboutSlide === idx
                              ? 'bg-[#2563eb] text-white shadow'
                              : 'text-neutral-600 dark:text-neutral-300 hover:text-[#111]'
                          }`}
                        >
                          {idx + 1}. {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SLIDE 0: PROFILE */}
                  {aboutSlide === 0 && (
                    <div className="space-y-6 animate-slide-right">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 bg-[#bae6fd] text-[#111] rounded-xl border-2 border-[#111] neo-shadow neo-card-grand">
                          <span className="text-[10px] font-mono-tech font-extrabold uppercase">Full Name</span>
                          <h3 className="font-display font-extrabold text-base sm:text-lg mt-0.5">{data.profile.fullName}</h3>
                          <p className="text-xs font-mono-tech mt-1 text-neutral-700">{data.profile.role}</p>
                        </div>
                        <div className="p-4 bg-[#a7f3d0] text-[#111] rounded-xl border-2 border-[#111] neo-shadow neo-card-grand">
                          <span className="text-[10px] font-mono-tech font-extrabold uppercase">Experience</span>
                          <h3 className="font-display font-extrabold text-xl sm:text-2xl mt-0.5">{data.profile.stats.experience}</h3>
                          <p className="text-xs font-mono-tech mt-1 text-neutral-700">{data.profile.stats.projects} Proyek Terselesaikan</p>
                        </div>
                        <div className="p-4 bg-[#fde047] text-[#111] rounded-xl border-2 border-[#111] neo-shadow neo-card-grand">
                          <span className="text-[10px] font-mono-tech font-extrabold uppercase">Core Domains</span>
                          <h3 className="font-display font-extrabold text-base sm:text-lg mt-0.5">Full Stack &amp; Cloud</h3>
                          <p className="text-xs font-mono-tech mt-1 text-neutral-700">Golang • Next.js • Laravel</p>
                        </div>
                      </div>

                      <div className="p-5 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-300 dark:border-neutral-700">
                        <h4 className="font-display font-extrabold text-sm uppercase mb-2 tracking-wider text-[#2563eb]">
                          Engineering Focus &amp; Principles
                        </h4>
                        <p className="font-mono-tech text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                          Berfokus pada pembuatan produk digital yang tahan uji (robust), performa tinggi, dan memiliki interaktivitas visual tingkat tinggi. Berpengalaman dari database modeling hingga frontend micro-interactions.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2 text-xs font-mono-tech">
                          <span className="px-2.5 py-1 bg-white dark:bg-neutral-700 border border-[#111] rounded font-bold">📍 {data.profile.location}</span>
                          <a href={`mailto:${data.profile.email}`} className="px-2.5 py-1 bg-white dark:bg-neutral-700 border border-[#111] rounded font-bold hover:bg-[#38bdf8] hover:text-[#111] transition-colors">✉ {data.profile.email}</a>
                          <a href={data.profile.github} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 bg-white dark:bg-neutral-700 border border-[#111] rounded font-bold hover:bg-[#a7f3d0] hover:text-[#111] transition-colors">🐙 GitHub</a>
                          <a href={data.profile.linkedin} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 bg-white dark:bg-neutral-700 border border-[#111] rounded font-bold hover:bg-[#38bdf8] hover:text-[#111] transition-colors">💼 LinkedIn</a>
                          <a href={data.profile.instagram} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 bg-white dark:bg-neutral-700 border border-[#111] rounded font-bold hover:bg-[#f472b6] hover:text-[#111] transition-colors">📸 @rasshqa.tsx</a>
                          <a href={data.profile.tiktok} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 bg-white dark:bg-neutral-700 border border-[#111] rounded font-bold hover:bg-[#fde047] hover:text-[#111] transition-colors">🎵 @rasshqa</a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SLIDE 1: ABOUT ME */}
                  {aboutSlide === 1 && (
                    <div className="space-y-6 animate-slide-right">
                      <p className="font-mono-tech text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        {data.aboutStory.lead}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {data.aboutStory.pillars.map((pillar) => (
                          <div key={pillar.title} className={`${pillar.bg} text-[#111] p-4 rounded-xl border-2 border-[#111] neo-shadow neo-card-grand`}>
                            <h3 className="font-display font-extrabold text-base mb-1.5">{pillar.title}</h3>
                            <p className="font-mono-tech text-xs leading-relaxed opacity-90">{pillar.desc}</p>
                          </div>
                        ))}
                      </div>

                      <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-mono-tech text-neutral-600 dark:text-neutral-300 space-y-2">
                        {data.aboutStory.paragraphs.map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SLIDE 2: TECH STACK */}
                  {aboutSlide === 2 && (
                    <div className="space-y-4 animate-slide-right">
                      <p className="font-mono-tech text-xs text-neutral-600 dark:text-neutral-400">
                        Teknologi utama yang digunakan dalam membangun sistem berskala besar:
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {data.techStacks.map((group) => (
                          <div key={group.category} className="p-4 bg-white dark:bg-neutral-800/80 border-2 border-[#111] rounded-xl neo-shadow neo-card-grand">
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neutral-200 dark:border-neutral-700">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: group.color }} />
                              <h4 className="font-display font-extrabold text-xs uppercase tracking-wider">{group.category}</h4>
                            </div>

                            <div className="space-y-2">
                              {group.skills.map((skill) => (
                                <div 
                                  key={skill.name}
                                  className="flex items-center justify-between p-2 bg-[#f6f5f0] dark:bg-neutral-900 rounded border border-neutral-300 dark:border-neutral-700 hover:border-[#111] transition-all"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded bg-[#111] text-white text-[9px] flex items-center justify-center font-bold">
                                      {skill.icon}
                                    </span>
                                    <span className="font-mono-tech font-bold text-xs">{skill.name}</span>
                                  </div>
                                  <span className="text-[10px] font-mono-tech font-bold px-1.5 py-0.5 rounded bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600">
                                    {skill.level}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Slide Bottom Controls */}
                <div className="pt-6 mt-6 border-t-2 border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                  <button
                    onClick={() => setAboutSlide(prev => Math.max(0, prev - 1))}
                    disabled={aboutSlide === 0}
                    className="px-4 py-2 bg-white dark:bg-neutral-800 border-2 border-[#111] rounded font-mono-tech font-bold text-xs neo-shadow neo-btn-grand disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>SEBELUMNYA</span>
                  </button>

                  <div className="text-xs font-mono-tech font-extrabold text-neutral-500">
                    SLIDE {aboutSlide + 1} DARI 3
                  </div>

                  <button
                    onClick={() => setAboutSlide(prev => Math.min(2, prev + 1))}
                    disabled={aboutSlide === 2}
                    className="px-4 py-2 bg-[#2563eb] text-white border-2 border-[#111] rounded font-mono-tech font-extrabold text-xs neo-shadow neo-btn-grand disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>SELANJUTNYA</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* TAB: SELECTED WORKS (4 PROJECTS PER SLIDE) */}
          {activeTab === 'WORKS' && (
            <div className="w-full max-w-5xl py-4 animate-pop-in">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div>
                  <h2 className="font-display font-extrabold text-3xl sm:text-4xl">SELECTED WORKS</h2>
                  <p className="font-mono-tech text-xs text-neutral-500 mt-0.5">
                    Halaman {worksPage + 1} dari {totalWorksPages} (Menampilkan 4 proyek per slide)
                  </p>
                </div>

                {/* Slide Pagination Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setWorksPage(prev => Math.max(0, prev - 1))}
                    disabled={worksPage === 0}
                    className="px-3.5 py-2 bg-white dark:bg-[#23252a] border-2 border-[#111] font-mono-tech font-bold text-xs rounded neo-shadow neo-btn-grand disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>PREV</span>
                  </button>
                  <button
                    onClick={() => setWorksPage(prev => Math.min(totalWorksPages - 1, prev + 1))}
                    disabled={worksPage >= totalWorksPages - 1}
                    className="px-3.5 py-2 bg-[#2563eb] text-white border-2 border-[#111] font-mono-tech font-extrabold text-xs rounded neo-shadow neo-btn-grand disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                  >
                    <span>NEXT SLIDE</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 4 Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {currentProjects.map((proj, idx) => (
                  <InspectableBox
                    key={proj.id}
                    dimensions="480 × 220"
                    color="#2563eb"
                    badgePosition="bottom"
                    delay={idx * 70}
                  >
                    <div className="bg-white dark:bg-[#23252a] border-2 border-[#111] dark:border-neutral-400 rounded-xl p-5 sm:p-6 neo-shadow neo-card-grand flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span 
                            className="inline-block px-2.5 py-1 text-[10px] font-mono-tech font-extrabold text-[#111] rounded border border-[#111]"
                            style={{ backgroundColor: proj.accent }}
                          >
                            {proj.tag}
                          </span>
                          <span className="font-hand text-lg font-bold">
                            #{worksPage * projectsPerPage + idx + 1}
                          </span>
                        </div>

                        <h3 className="font-display font-extrabold text-xl sm:text-2xl mb-2">{proj.title}</h3>
                        <p className="font-mono-tech text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-3">
                          {proj.desc}
                        </p>

                        <div className="inline-block px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-[10px] font-mono-tech font-bold text-neutral-600 dark:text-neutral-400 rounded border border-neutral-300 dark:border-neutral-700">
                          ⚡ {proj.metrics}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-4 border-t border-neutral-200 dark:border-neutral-700">
                        <a
                          href={proj.liveUrl || proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono-tech text-xs font-bold flex items-center gap-1.5 text-[#2563eb] dark:text-[#38bdf8] hover:underline"
                        >
                          LIVE PREVIEW <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono-tech text-xs font-bold text-neutral-500 hover:text-[#111] dark:hover:text-white"
                        >
                          GITHUB →
                        </a>
                      </div>
                    </div>
                  </InspectableBox>
                ))}
              </div>
            </div>
          )}

          {/* TAB: ACHIEVEMENTS & CERTIFICATES */}
          {activeTab === 'BLOG' && (
            <div className="w-full max-w-4xl py-4 animate-pop-in">
              <div className="bg-white dark:bg-[#23252a] border-2 border-[#111] dark:border-neutral-400 rounded-2xl p-6 sm:p-8 neo-shadow-lg min-h-[520px] flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b-2 border-neutral-200 dark:border-neutral-700">
                    <div>
                      <div className="inline-block px-3 py-1 bg-[#fde047] text-[#111] font-mono-tech font-extrabold text-xs rounded border border-[#111] mb-1">
                        * MILESTONES &amp; CREDENTIALS
                      </div>
                      <h2 className="font-display font-extrabold text-2xl sm:text-3xl">
                        {blogSlide === 0 && 'PRESTASI & PENGHARGAAN'}
                        {blogSlide === 1 && 'SERTIFIKASI PROFESIONAL'}
                        {blogSlide === 2 && 'ARTIKEL & PUBLIKASI TEKNIS'}
                      </h2>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex items-center gap-1.5 bg-[#f6f5f0] dark:bg-neutral-800 p-1 rounded-lg border border-[#111]">
                      {['Prestasi', 'Sertifikat', 'Artikel'].map((cat, idx) => (
                        <button
                          key={cat}
                          onClick={() => setBlogSlide(idx)}
                          className={`px-3 py-1.5 text-xs font-mono-tech font-extrabold rounded transition-all cursor-pointer ${
                            blogSlide === idx
                              ? 'bg-[#2563eb] text-white shadow'
                              : 'text-neutral-600 dark:text-neutral-300 hover:text-[#111]'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filtered Achievements */}
                  <div className="space-y-3.5 animate-slide-right">
                    {data.achievements
                      .filter((item) => {
                        if (blogSlide === 0) return item.category === 'PRESTASI';
                        if (blogSlide === 1) return item.category === 'SERTIFIKAT';
                        return item.category === 'ARTIKEL';
                      })
                      .map((item) => (
                        <div
                          key={item.id}
                          className="bg-white dark:bg-neutral-800/90 border-2 border-[#111] rounded-xl p-4 sm:p-5 neo-shadow neo-card-grand flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono-tech font-bold text-neutral-500">
                                {item.year} • {item.issuer}
                              </span>
                              <span 
                                className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-extrabold text-[#111] border border-[#111]"
                                style={{ backgroundColor: item.accent }}
                              >
                                {item.badge}
                              </span>
                            </div>
                            <h3 className="font-display font-extrabold text-lg sm:text-xl text-[#111] dark:text-white">
                              {item.title}
                            </h3>
                            <p className="font-mono-tech text-xs text-neutral-600 dark:text-neutral-300">
                              {item.description}
                            </p>
                          </div>

                          <div className="self-start sm:self-center">
                            <span className="px-3 py-1.5 bg-[#f6f5f0] dark:bg-neutral-900 border border-[#111] rounded font-mono-tech font-bold text-xs flex items-center gap-1.5">
                              VERIFIED <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Bottom Slide Switcher */}
                <div className="pt-6 mt-6 border-t-2 border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                  <button
                    onClick={() => setBlogSlide(prev => Math.max(0, prev - 1))}
                    disabled={blogSlide === 0}
                    className="px-4 py-2 bg-white dark:bg-neutral-800 border-2 border-[#111] rounded font-mono-tech font-bold text-xs neo-shadow neo-btn-grand disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>PREV</span>
                  </button>

                  <div className="text-xs font-mono-tech font-extrabold text-neutral-500">
                    KATEGORI {blogSlide + 1} DARI 3
                  </div>

                  <button
                    onClick={() => setBlogSlide(prev => Math.min(2, prev + 1))}
                    disabled={blogSlide === 2}
                    className="px-4 py-2 bg-[#2563eb] text-white border-2 border-[#111] rounded font-mono-tech font-extrabold text-xs neo-shadow neo-btn-grand disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>NEXT</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CONTACT */}
          {activeTab === 'CONTACT' && (
            <div className="w-full max-w-xl py-4 animate-pop-in">
              <div className="bg-white dark:bg-[#23252a] border-2 border-[#111] dark:border-neutral-400 rounded-xl p-6 sm:p-8 neo-shadow-lg">
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl mb-2">LET&apos;S CREATE TOGETHER</h2>
                <p className="font-mono-tech text-xs text-neutral-600 dark:text-neutral-300 mb-6">
                  Have a web project, engineering challenge, or collaboration idea? Drop a message below:
                </p>

                {contactSent ? (
                  <div className="p-6 bg-[#a7f3d0] text-[#111] border-2 border-[#111] rounded-lg text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 mx-auto" />
                    <h3 className="font-display font-extrabold text-xl">MESSAGE SENT!</h3>
                    <p className="font-mono-tech text-xs">Thanks for reaching out, Rashqa will get back to you shortly.</p>
                    <button
                      onClick={() => setContactSent(false)}
                      className="px-4 py-2 bg-white border-2 border-[#111] font-mono-tech font-bold text-xs rounded neo-shadow neo-btn-grand cursor-pointer"
                    >
                      SEND ANOTHER
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setContactSent(true);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block font-mono-tech text-xs font-bold mb-1">YOUR NAME</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        className="w-full px-3.5 py-2.5 bg-[#f6f5f0] dark:bg-neutral-800 border-2 border-[#111] rounded font-mono-tech text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono-tech text-xs font-bold mb-1">YOUR EMAIL</label>
                      <input
                        type="email"
                        required
                        placeholder="hello@example.com"
                        className="w-full px-3.5 py-2.5 bg-[#f6f5f0] dark:bg-neutral-800 border-2 border-[#111] rounded font-mono-tech text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono-tech text-xs font-bold mb-1">PROJECT DETAILS</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Let's build something awesome together..."
                        className="w-full px-3.5 py-2.5 bg-[#f6f5f0] dark:bg-neutral-800 border-2 border-[#111] rounded font-mono-tech text-xs focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#2563eb] text-white font-mono-tech font-extrabold text-xs tracking-wider rounded border-2 border-[#111] neo-shadow neo-btn-grand flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>SEND MESSAGE</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

        </main>

        {/* Subtle Bottom Helper Bar (No Admin CMS button here!) */}
        <footer className="w-full max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between text-[11px] font-mono-tech text-neutral-500 z-20">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Interactive Canvas • Tahan Klik Kiri untuk Invert Lens • Klik stiker untuk inspeksi
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={replayIntro}
              className="inline-flex items-center gap-1.5 hover:text-[#111] dark:hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Replay Intro</span>
            </button>
          </div>
        </footer>
      </div>

      {/* Floating Minimizeable WhatsApp Widget */}
      <WhatsAppWidget 
        phoneNumber={data.profile.whatsapp} 
        name={data.profile.fullName} 
      />

    </div>
  );
}
