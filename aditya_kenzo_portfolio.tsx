'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  Sparkles, 
  Menu, 
  MessageCircle, 
  Mail, 
  Heart, 
  ArrowUpRight, 
  Download, 
  Sun, 
  Moon, 
  ExternalLink, 
  Send, 
  CheckCircle2, 
  RotateCcw 
} from 'lucide-react';

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
    e.stopPropagation();
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
      className={`relative inline-block transition-opacity duration-500 ${
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
  <svg width="38" height="28" viewBox="0 0 42 30" fill="none" className="transition-transform duration-300 hover:scale-110">
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

/* Portrait Component matching the B&W high-contrast cool sunglasses guy with blue brush backdrop */
const StylizedPortrait = ({ isInverted, onClick }: { isInverted: boolean; onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className="relative w-[300px] sm:w-[370px] md:w-[410px] h-[350px] sm:h-[420px] md:h-[450px] select-none cursor-pointer group"
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
      {/* Rough brush edge details */}
      <path d="M35 160 L50 145 L45 190 Z" fill="#2563EB" />
      <path d="M360 110 L382 125 L370 165 Z" fill="#2563EB" />
      <path d="M180 42 L245 34 L230 58 Z" fill="#2563EB" />
    </svg>

    {/* White Paper Cutout + High-Contrast B&W Character Portrait */}
    <div 
      className={`relative z-10 w-full h-full flex items-end justify-center overflow-hidden transition-all duration-300 ${
        isInverted ? 'invert contrast-125' : ''
      }`}
    >
      <svg viewBox="0 0 400 440" className="w-full h-full">
        <defs>
          {/* Halftone & high contrast filter */}
          <filter id="bw-contrast">
            <feComponentTransfer>
              <feFuncR type="linear" slope="1.2" intercept="-0.05"/>
              <feFuncG type="linear" slope="1.2" intercept="-0.05"/>
              <feFuncB type="linear" slope="1.2" intercept="-0.05"/>
            </feComponentTransfer>
          </filter>
        </defs>

        {/* Thick White Paper Cutout Outline */}
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

        {/* Hoodie Collar & Fold Details */}
        <path 
          d="M142 272 C145 305 175 322 212 322 C248 322 272 302 278 272 L262 245 L158 245 Z" 
          fill="#1f1f1f"
          stroke="#0a0a0a"
          strokeWidth="3"
        />
        {/* Backpack Straps */}
        <path d="M112 285 L125 412 L152 412 L140 274 Z" fill="#262626" />
        <path d="M306 285 L292 412 L265 412 L278 274 Z" fill="#262626" />

        {/* White Hoodie Drawstrings */}
        <path d="M188 308 C186 340 185 365 188 392" stroke="#f5f5f5" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M232 308 C234 335 232 355 230 380" stroke="#f5f5f5" strokeWidth="4.5" strokeLinecap="round" />

        {/* Small white brand patch on chest */}
        <g transform="translate(245, 362) rotate(-8)">
          <rect x="0" y="0" width="22" height="16" rx="2" fill="#111" stroke="#eee" strokeWidth="1.5"/>
          <path d="M5 12 L11 4 L17 12 Z" fill="#eee" />
        </g>

        {/* Neck & Shading */}
        <path d="M174 210 L174 268 C174 285 244 285 244 268 L244 210 Z" fill="#d4d4d4" />
        <path d="M174 215 C190 238 228 242 244 225 L244 210 L174 210 Z" fill="#262626" />

        {/* Ears */}
        <ellipse cx="152" cy="176" rx="12" ry="18" transform="rotate(-10 152 176)" fill="#d4d4d4" stroke="#171717" strokeWidth="2.5" />
        <ellipse cx="268" cy="174" rx="11" ry="17" transform="rotate(12 268 174)" fill="#bdbdbd" stroke="#171717" strokeWidth="2.5" />

        {/* Face Base */}
        <path 
          d="M156 125 C156 95 264 95 264 125 L262 178 C260 208 238 232 210 232 C182 232 160 208 158 178 Z" 
          fill="#e5e5e5" 
          stroke="#171717" 
          strokeWidth="3"
        />

        {/* Aesthetic Comic/Photo Cheek & Jaw Shadow */}
        <path 
          d="M235 160 C238 188 225 215 198 226 C225 230 255 208 260 178 L262 140 Z" 
          fill="#a3a3a3" 
        />

        {/* Nose & Subtle Confident Smile */}
        <path d="M210 156 L205 182 L218 184" stroke="#171717" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M194 202 C204 207 218 206 226 200" stroke="#171717" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Retro Dark Sunglasses */}
        <g transform="rotate(-3 210 155)">
          {/* Left Frame */}
          <rect x="156" y="138" width="48" height="33" rx="8" fill="#0a0a0a" stroke="#171717" strokeWidth="3" />
          {/* Right Frame */}
          <rect x="216" y="138" width="48" height="33" rx="8" fill="#0a0a0a" stroke="#171717" strokeWidth="3" />
          {/* Bridge */}
          <path d="M204 148 Q210 143 216 148" stroke="#171717" strokeWidth="4.5" fill="none" />
          {/* Lens Glare */}
          <path d="M164 144 L176 144 L168 164 L160 164 Z" fill="#ffffff" opacity="0.22" />
          <path d="M224 144 L236 144 L228 164 L220 164 Z" fill="#ffffff" opacity="0.22" />
        </g>

        {/* Fluffy Messy Wavy Hair */}
        <path 
          d="M145 155 C128 140 125 108 142 88 C148 64 180 48 214 52 C252 46 286 68 294 98 C306 118 298 148 276 158 C276 135 268 122 252 118 C245 132 228 138 215 130 C202 142 182 142 172 128 C160 135 152 145 145 155 Z" 
          fill="#141414" 
        />
        {/* Extra Hair Locks on Forehead */}
        <path d="M162 115 Q178 142 198 132 Q188 115 212 135 Q232 140 246 122" stroke="#141414" strokeWidth="10" strokeLinecap="round" fill="none" />
        {/* Hair Highlight Strands */}
        <path d="M165 82 Q195 68 228 78" stroke="#404040" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M150 105 Q175 95 202 102" stroke="#333333" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>
    </div>

    {/* Bottom Rough Torn Paper Edge */}
    <div className="absolute bottom-2 left-6 right-6 h-5 bg-white z-20 flex items-center overflow-hidden shadow-sm">
      <svg viewBox="0 0 400 24" className="w-full h-full fill-current text-[#f6f5f0] dark:text-[#18191c]">
        <path d="M0 24 L0 8 L18 15 L36 4 L58 16 L82 6 L105 18 L132 5 L158 15 L186 4 L215 17 L242 6 L270 16 L298 5 L325 18 L354 6 L380 15 L400 4 L400 24 Z" />
      </svg>
    </div>
  </div>
);

export default function Portfolio() {
  // Intro Sequence State: 'hey' -> 'welcome' -> 'burst' -> 'ready'
  const [introStep, setIntroStep] = useState<'hey' | 'welcome' | 'burst' | 'ready'>('hey');
  const [activeTab, setActiveTab] = useState<'HOME' | 'ABOUT' | 'WORKS' | 'BLOG' | 'CONTACT'>('HOME');
  const [isDark, setIsDark] = useState(false);
  const [ripple, setRipple] = useState<{ x: number; y: number; targetDark: boolean } | null>(null);
  const [isPortraitInverted, setIsPortraitInverted] = useState(false);
  const [showAvatarToast, setShowAvatarToast] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Custom Cursor State
  const [mousePos, setMousePos] = useState({ x: 520, y: 360 });
  const [cursorRingPos, setCursorRingPos] = useState({ x: 520, y: 360 });
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Run Intro Sequence automatically
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

  const replayIntro = () => {
    setIntroStep('hey');
    setTimeout(() => setIntroStep('welcome'), 900);
    setTimeout(() => setIntroStep('burst'), 1750);
    setTimeout(() => setIntroStep('ready'), 2150);
  };

  // Track Mouse & Smooth Follower
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement | null;
      if (target && (target.closest('button') || target.closest('a') || target.closest('[data-interactive="true"]'))) {
        setIsHoveringInteractive(true);
      } else {
        setIsHoveringInteractive(false);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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

  // Circular Dark Mode Toggle Transition matching 0:27 in video
  const handleThemeToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    setRipple({ x, y, targetDark: !isDark });

    setTimeout(() => {
      setIsDark((prev) => !prev);
    }, 280);

    setTimeout(() => {
      setRipple(null);
    }, 650);
  };

  const handleAvatarClick = () => {
    setShowAvatarToast(true);
    setTimeout(() => setShowAvatarToast(false), 2600);
  };

  const isReady = introStep === 'ready';

  return (
    <div className={`${isDark ? 'dark' : ''} relative min-h-screen select-none overflow-x-hidden`}>
      {/* Circular Theme Ripple Overlay */}
      {ripple && (
        <div
          className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
          style={{
            background: ripple.targetDark ? '#18191c' : '#f6f5f0',
            clipPath: `circle(150% at ${ripple.x}px ${ripple.y}px)`,
            transition: 'clip-path 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      )}

      {/* Custom Follower Cursor ("YOU") */}
      {mounted && (
        <div
          className="fixed top-0 left-0 pointer-events-none z-[100] hidden sm:block"
          style={{
            transform: `translate3d(${cursorRingPos.x}px, ${cursorRingPos.y}px, 0)`,
          }}
        >
          {/* Black Dot or Outlined Circle on Hover */}
          <div
            className={`-translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150 ${
              isHoveringInteractive
                ? 'w-5 h-5 border-2 border-[#111] dark:border-white bg-transparent scale-110'
                : 'w-3 h-3 bg-[#111] dark:bg-white'
            }`}
          />
          {/* "YOU" Pill Tag */}
          <div className="ml-2.5 mt-1 px-2 py-0.5 bg-[#111] dark:bg-white text-white dark:text-[#111] text-[10px] font-mono-tech font-extrabold rounded-full shadow-md tracking-wider">
            YOU
          </div>
        </div>
      )}

      {/* Main Background Canvas */}
      <div className="min-h-screen bg-[#f6f5f0] dark:bg-[#18191c] text-[#111111] dark:text-[#f6f5f0] transition-colors duration-300 flex flex-col justify-between relative">
        
        {/* TOP NAVBAR */}
        <header className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 pt-4 pb-2 flex items-center justify-between z-40">
          {/* Left Nav Group */}
          <div className="flex items-center gap-2 sm:gap-5 flex-wrap">
            {/* Rainbow Logo */}
            <button 
              onClick={replayIntro}
              title="Replay Intro Animation"
              className="mr-2 focus:outline-none group relative cursor-pointer"
            >
              <RainbowLogoSVG isDark={isDark} />
            </button>

            {/* Nav Items */}
            {[
              { id: 'HOME' as const, label: 'HOME', icon: Home },
              { id: 'ABOUT' as const, label: 'ABOUT', icon: Sparkles },
              { id: 'WORKS' as const, label: 'WORKS', icon: Menu },
              { id: 'BLOG' as const, label: 'BLOG', icon: MessageCircle },
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
                  {/* Cyan Paint Brush Background for Active Tab */}
                  {isActive && (
                    <span className="absolute inset-0 bg-[#38bdf8] clip-brush-nav -z-10 transform -rotate-1 scale-105 shadow-sm" />
                  )}
                  <Icon className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Controls: Slash Accent, Theme Switcher, Avatar, Let's Talk */}
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden md:inline-block text-xs font-mono-tech text-neutral-400 tracking-widest mr-2">
              / /
            </span>

            {/* Sun / Moon Pill Toggle */}
            <button
              onClick={handleThemeToggle}
              aria-label="Toggle Dark Mode"
              className="w-11 h-6 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 p-0.5 flex items-center transition-colors relative cursor-pointer"
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

            {/* Mini Avatar with "Have a nice day!" Toast */}
            <div className="relative">
              <button
                onClick={handleAvatarClick}
                aria-label="Avatar greetings"
                className="w-9 h-9 rounded-full bg-[#38bdf8] border-2 border-[#111] dark:border-white overflow-hidden flex items-center justify-center shadow-sm hover:scale-105 transition-transform cursor-pointer"
              >
                {/* Mini stylized face */}
                <svg viewBox="0 0 40 40" className="w-full h-full">
                  <circle cx="20" cy="20" r="20" fill="#38bdf8" />
                  <circle cx="20" cy="16" r="7" fill="#e5e5e5" stroke="#111" strokeWidth="1.5" />
                  <path d="M13 13 C13 8 27 8 27 13" fill="#111" />
                  <rect x="14" y="13" width="5" height="3.5" rx="1" fill="#111" />
                  <rect x="21" y="13" width="5" height="3.5" rx="1" fill="#111" />
                  <path d="M10 38 C10 28 30 28 30 38" fill="#111" />
                </svg>
              </button>

              {/* Floating Blue Toast from 0:25 in video */}
              {showAvatarToast && (
                <div className="absolute right-0 top-12 z-50 bg-[#2563eb] text-white text-xs font-mono-tech font-bold px-3.5 py-2 rounded-lg border-2 border-[#111] neo-shadow whitespace-nowrap animate-pop-in">
                  Have a nice day!
                </div>
              )}
            </div>

            {/* LET'S TALK Hand-drawn Border Button */}
            <button
              onClick={() => setActiveTab('CONTACT')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#23252a] text-[#111] dark:text-white text-xs font-mono-tech font-extrabold tracking-wider border-2 border-[#111] dark:border-neutral-300 rounded-[4px] neo-shadow hover:translate-x-[1px] hover:translate-y-[1px] transition-all cursor-pointer"
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
                {introStep === 'hey' ? 'Hey there' : 'Welcome'}
              </div>
            )}

            {introStep === 'burst' && (
              <div className="relative flex items-center justify-center">
                {/* Hand-drawn Doodle Burst Lines around the Hero Entrance */}
                <svg width="260" height="260" viewBox="0 0 200 200" className=" -translate-x-48 -translate-y-24">
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

        {/* MAIN BODY AREA */}
        <main className="flex-1 w-full max-w-[1380px] mx-auto px-4 sm:px-10 py-6 flex items-center justify-center relative">
          {activeTab === 'HOME' && (
            <div className="w-full relative min-h-[560px] flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-6 py-4">
              
              {/* FLOATING STICKERS & DOODLES AROUND THE CANVAS */}
              
              {/* Top-left Plus '+' Sign */}
              <div 
                className={`hidden md:block absolute top-6 left-2 text-3xl font-extrabold transition-opacity duration-500 ${
                  isReady ? 'opacity-100' : 'opacity-0'
                }`}
              >
                +
              </div>

              {/* Left Mint Green Sticker: "UI/UX DESIGNER" */}
              <div className="hidden xl:block absolute top-28 -left-6 z-20">
                <InspectableBox
                  dimensions="120 × 103"
                  color="#d946ef"
                  badgePosition="bottom"
                  defaultDraggable={true}
                  delay={180}
                  isReady={isReady}
                >
                  <div className="w-28 h-24 bg-[#a7f3d0] text-[#111] p-3 -rotate-12 shadow-md border border-[#111]/20 flex flex-col items-center justify-center text-center font-hand text-xl leading-tight font-bold">
                    <span>UI/UX</span>
                    <span>DESIGNER</span>
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

              {/* Bottom-left Yellow Sticky Note: "Good Design = Better Experience" */}
              <div className="hidden xl:block absolute bottom-8 -left-4 z-20">
                <InspectableBox
                  dimensions="128 × 124"
                  color="#f59e0b"
                  badgePosition="top"
                  defaultDraggable={true}
                  delay={260}
                  isReady={isReady}
                >
                  <div className="w-32 h-32 bg-[#fde047] text-[#111] p-3 rotate-6 shadow-md border border-[#111]/20 flex flex-col items-center justify-center text-center font-hand text-lg leading-tight font-bold">
                    <span>Good</span>
                    <span>Design</span>
                    <span>=</span>
                    <span>Better</span>
                    <span>Experience</span>
                  </div>
                </InspectableBox>
              </div>

              {/* LEFT COLUMN: Hey, I'm ADITYA KENZO + Bio + CTA Buttons */}
              <div className="w-full lg:w-[52%] xl:pl-24 z-10 flex flex-col items-start text-left">
                
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
                      Hey, I&apos;m
                    </span>
                  </div>
                </InspectableBox>

                {/* Giant "ADITYA KENZO" Heading with Yellow Crown */}
                <div className="relative mt-1 mb-6">
                  {/* Floating Crown on top-right of 'A' */}
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
                    <h1 className="font-display font-extrabold text-5xl sm:text-7xl xl:text-[80px] leading-[0.94] tracking-tight uppercase px-1">
                      ADITYA
                      <br />
                      KENZO
                    </h1>
                  </InspectableBox>
                </div>

                {/* Bio Paragraph with Top & Bottom Divider Lines */}
                <InspectableBox
                  dimensions="436 × 96"
                  color="#10b981"
                  badgePosition="bottom"
                  delay={200}
                  isReady={isReady}
                  className="w-full max-w-[440px] mb-7"
                >
                  <div className="border-y border-neutral-300 dark:border-neutral-700 py-4">
                    <p className="font-mono-tech text-sm sm:text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-300">
                      I turn ideas into clean, modern web experiences. Focused on UI/UX, front-end and digital products.
                    </p>
                  </div>
                </InspectableBox>

                {/* Action Buttons: VIEW MY WORK & DOWNLOAD CV */}
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
                      className="px-6 py-3.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-mono-tech font-extrabold text-xs tracking-wider rounded-md border-2 border-[#111] neo-shadow flex items-center gap-3 transition-transform active:translate-y-0.5 cursor-pointer"
                    >
                      <span className="w-5 h-5 rounded bg-white text-[#111] flex items-center justify-center">
                        <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                      <span>VIEW MY WORK</span>
                    </button>
                  </InspectableBox>

                  <InspectableBox
                    dimensions="178 × 48"
                    color="#8b5cf6"
                    badgePosition="bottom"
                    delay={340}
                    isReady={isReady}
                  >
                    <button
                      onClick={() => setActiveTab('ABOUT')}
                      className="px-6 py-3.5 bg-white dark:bg-[#23252a] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[#111] dark:text-white font-mono-tech font-extrabold text-xs tracking-wider rounded-md border-2 border-[#111] dark:border-neutral-400 neo-shadow flex items-center gap-2.5 transition-transform active:translate-y-0.5 cursor-pointer"
                    >
                      <Download className="w-4 h-4 stroke-[2.5]" />
                      <span>DOWNLOAD CV</span>
                    </button>
                  </InspectableBox>
                </div>
              </div>

              {/* RIGHT COLUMN: Portrait + Browser Window Card + Surrounding Stickers */}
              <div className="w-full lg:w-[48%] flex items-center justify-center relative min-h-[460px]">
                
                {/* Mini Retro Browser Card ("HTML, CSS, JS") on Top-Left of Portrait */}
                <div className="absolute -top-4 left-2 sm:left-6 z-30">
                  <InspectableBox
                    dimensions="170 × 124"
                    color="#0ea5e9"
                    badgePosition="top"
                    defaultDraggable={true}
                    delay={220}
                    isReady={isReady}
                  >
                    <div className="w-40 sm:w-44 bg-white dark:bg-[#23252a] border-2 border-[#111] rounded-xl p-3 -rotate-6 neo-shadow">
                      {/* Window Traffic Lights */}
                      <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-neutral-200 dark:border-neutral-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-400 border border-[#111]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-[#111]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-green-400 border border-[#111]" />
                      </div>
                      {/* Stack Items */}
                      <div className="space-y-1.5 font-mono-tech text-xs font-extrabold text-[#111] dark:text-white">
                        <div className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded-sm bg-[#111] text-white text-[8px] flex items-center justify-center">&lt;/&gt;</span>
                          <span>HTML</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded-sm bg-[#111] text-white text-[8px] flex items-center justify-center">#</span>
                          <span>CSS</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded-sm bg-[#111] text-white text-[8px] flex items-center justify-center">JS</span>
                          <span>JS</span>
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

                {/* Center Stylized Portrait with Orange "400 x 407" Bounding Box & Click-to-Invert */}
                <InspectableBox
                  dimensions="400 × 407"
                  color="#f97316"
                  badgePosition="bottom"
                  delay={160}
                  isReady={isReady}
                >
                  <StylizedPortrait 
                    isInverted={isPortraitInverted} 
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
                    <div className="relative w-28 h-28 flex items-center justify-center rotate-12">
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

                {/* Top-right Lime Green Sticky Note: "Design. Code. Ship" */}
                <div className="hidden sm:block absolute -top-8 -right-4 z-20">
                  <InspectableBox
                    dimensions="112 × 110"
                    color="#84cc16"
                    badgePosition="bottom"
                    defaultDraggable={true}
                    delay={250}
                    isReady={isReady}
                  >
                    <div className="w-28 h-28 bg-[#bef264] text-[#111] p-3 rotate-6 shadow-md border border-[#111]/20 flex flex-col items-center justify-center text-center font-hand text-xl leading-tight font-bold">
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
                    <div className="px-5 py-3.5 bg-white dark:bg-[#23252a] text-[#111] dark:text-white border-2 border-[#111] dark:border-white rounded-full -rotate-6 shadow-sm flex flex-col items-center justify-center text-center font-hand text-lg leading-none font-bold">
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
                      className="w-28 h-28 rounded-full bg-white dark:bg-[#23252a] text-[#111] dark:text-white border-2 border-[#111] dark:border-white p-3 -rotate-6 shadow-md flex flex-col items-center justify-center text-center font-hand text-lg leading-tight font-bold cursor-pointer hover:scale-105 transition-transform"
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

          {/* ABOUT SECTION */}
          {activeTab === 'ABOUT' && (
            <div className="w-full max-w-4xl py-8 animate-pop-in">
              <div className="bg-white dark:bg-[#23252a] border-2 border-[#111] dark:border-neutral-400 rounded-xl p-6 sm:p-10 neo-shadow-lg relative">
                <div className="inline-block px-3 py-1 bg-[#fde047] text-[#111] font-mono-tech font-extrabold text-xs rounded border border-[#111] mb-4">
                  * ABOUT ME
                </div>
                <h2 className="font-display font-extrabold text-3xl sm:text-5xl mb-4">
                  CREATIVE FRONT-END &amp; UI/UX DESIGNER
                </h2>
                <p className="font-mono-tech text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
                  Hi! I&apos;m Aditya Kenzo. I love blending neo-brutalist aesthetics, playful micro-interactions, and clean Next.js architecture to build memorable digital websites. Try hovering or dragging any sticker on the home canvas!
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {[
                    { title: 'UI/UX Design', desc: 'Figma, Design Systems, Interactive Prototyping', bg: 'bg-[#a7f3d0]' },
                    { title: 'Front-End Dev', desc: 'Next.js, React, TypeScript, Tailwind CSS, Motion', bg: 'bg-[#bae6fd]' },
                    { title: 'Creative Coding', desc: 'SVG Animations, WebGL, Micro-interactions', bg: 'bg-[#fbcfe8]' },
                  ].map((skill) => (
                    <div key={skill.title} className={`${skill.bg} text-[#111] p-4 rounded-lg border-2 border-[#111] neo-shadow`}>
                      <h3 className="font-display font-extrabold text-lg mb-1">{skill.title}</h3>
                      <p className="font-mono-tech text-xs leading-relaxed">{skill.desc}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setActiveTab('HOME')}
                  className="px-5 py-2.5 bg-[#2563eb] text-white font-mono-tech font-bold text-xs rounded border-2 border-[#111] neo-shadow cursor-pointer"
                >
                  ← BACK TO INTERACTIVE CANVAS
                </button>
              </div>
            </div>
          )}

          {/* SELECTED WORKS SECTION */}
          {activeTab === 'WORKS' && (
            <div className="w-full max-w-5xl py-6 animate-pop-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-extrabold text-3xl sm:text-5xl">SELECTED WORKS</h2>
                <button
                  onClick={() => setActiveTab('HOME')}
                  className="px-4 py-2 bg-white dark:bg-[#23252a] border-2 border-[#111] font-mono-tech font-bold text-xs rounded neo-shadow cursor-pointer"
                >
                  ← CANVAS
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: 'Figma Canvas OS',
                    tag: 'NEXT.JS • TAILWIND • MOTION',
                    desc: 'Interactive design system playground with live bounding-box inspection and draggable sticker physics.',
                    accent: '#38bdf8'
                  },
                  {
                    title: 'Kenzofy Audio Synth',
                    tag: 'WEB AUDIO API • REACT',
                    desc: 'Brutalist browser synthesizer with custom rotary knobs and real-time waveform visualizer.',
                    accent: '#fde047'
                  },
                  {
                    title: 'MonoType Studio',
                    tag: 'E-COMMERCE • SANITY',
                    desc: 'Independent digital foundry showcase with interactive variable font testers.',
                    accent: '#a7f3d0'
                  },
                  {
                    title: 'ZineClub Maker',
                    tag: 'CANVAS API • NEXT.JS',
                    desc: 'Cut-and-paste collage builder with high-contrast halftone filters and instant PDF export.',
                    accent: '#f472b6'
                  },
                ].map((proj, idx) => (
                  <InspectableBox
                    key={proj.title}
                    dimensions="480 × 220"
                    color="#2563eb"
                    badgePosition="bottom"
                    delay={idx * 80}
                  >
                    <div className="bg-white dark:bg-[#23252a] border-2 border-[#111] dark:border-neutral-400 rounded-xl p-6 neo-shadow flex flex-col justify-between h-full">
                      <div>
                        <span 
                          className="inline-block px-2.5 py-1 text-[10px] font-mono-tech font-extrabold text-[#111] rounded border border-[#111] mb-3"
                          style={{ backgroundColor: proj.accent }}
                        >
                          {proj.tag}
                        </span>
                        <h3 className="font-display font-extrabold text-2xl mb-2">{proj.title}</h3>
                        <p className="font-mono-tech text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                          {proj.desc}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-700">
                        <span className="font-mono-tech text-xs font-bold flex items-center gap-1.5 text-[#2563eb] dark:text-[#38bdf8]">
                          LIVE PREVIEW <ExternalLink className="w-3.5 h-3.5" />
                        </span>
                        <span className="font-hand text-lg font-bold">0{idx + 1}</span>
                      </div>
                    </div>
                  </InspectableBox>
                ))}
              </div>
            </div>
          )}

          {/* BLOG SECTION */}
          {activeTab === 'BLOG' && (
            <div className="w-full max-w-4xl py-6 animate-pop-in">
              <h2 className="font-display font-extrabold text-3xl sm:text-5xl mb-6">NOTES &amp; ARTICLES</h2>
              <div className="space-y-4">
                {[
                  { date: 'OCT 2026', title: 'Why Playful Websites Are Making a Huge Comeback', read: '4 MIN READ' },
                  { date: 'SEP 2026', title: 'Building Figma-Like Inspection Overlays in Next.js', read: '6 MIN READ' },
                  { date: 'AUG 2026', title: 'Designing Circular Dark Mode Transitions with Clip-Path', read: '3 MIN READ' },
                ].map((post) => (
                  <div
                    key={post.title}
                    className="bg-white dark:bg-[#23252a] border-2 border-[#111] dark:border-neutral-400 rounded-xl p-5 neo-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:-translate-y-0.5 transition-transform cursor-pointer"
                  >
                    <div>
                      <span className="text-xs font-mono-tech text-neutral-500">{post.date}</span>
                      <h3 className="font-display font-extrabold text-xl mt-0.5">{post.title}</h3>
                    </div>
                    <span className="px-3 py-1 bg-[#fde047] text-[#111] font-mono-tech font-bold text-xs rounded border border-[#111] self-start sm:self-center">
                      {post.read}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONTACT SECTION */}
          {activeTab === 'CONTACT' && (
            <div className="w-full max-w-xl py-6 animate-pop-in">
              <div className="bg-white dark:bg-[#23252a] border-2 border-[#111] dark:border-neutral-400 rounded-xl p-6 sm:p-8 neo-shadow-lg">
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl mb-2">LET&apos;S CREATE TOGETHER</h2>
                <p className="font-mono-tech text-xs text-neutral-600 dark:text-neutral-300 mb-6">
                  Have a cool project or idea? Drop a message below!
                </p>

                {contactSent ? (
                  <div className="p-6 bg-[#a7f3d0] text-[#111] border-2 border-[#111] rounded-lg text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 mx-auto" />
                    <h3 className="font-display font-extrabold text-xl">MESSAGE SENT!</h3>
                    <p className="font-mono-tech text-xs">Thanks for reaching out, Aditya will reply soon.</p>
                    <button
                      onClick={() => setContactSent(false)}
                      className="px-4 py-2 bg-white border-2 border-[#111] font-mono-tech font-bold text-xs rounded neo-shadow cursor-pointer"
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
                        placeholder="Let's build something awesome..."
                        className="w-full px-3.5 py-2.5 bg-[#f6f5f0] dark:bg-neutral-800 border-2 border-[#111] rounded font-mono-tech text-xs focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-[#2563eb] text-white font-mono-tech font-extrabold text-xs tracking-wider rounded border-2 border-[#111] neo-shadow flex items-center justify-center gap-2 cursor-pointer"
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

        {/* Subtle Bottom Helper Bar */}
        <footer className="w-full max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between text-[11px] font-mono-tech text-neutral-500 z-20">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Interactive Canvas Active (Hover to inspect • Drag stickers • Click photo to invert)
            </span>
          </div>
          <button
            onClick={replayIntro}
            className="inline-flex items-center gap-1.5 hover:text-[#111] dark:hover:text-white transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Replay Intro</span>
          </button>
        </footer>
      </div>
    </div>
  );
}
