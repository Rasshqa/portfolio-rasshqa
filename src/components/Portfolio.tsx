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
  Award,
  MapPin,
  Music2,
  Zap,
  Database,
  Box,
  GitBranch,
  Server,
  Terminal,
  Cpu,
  Palette,
  FileCode,
  Eye,
  X,
  Maximize2,
  BookOpen,
  Info,
  FileText
} from 'lucide-react';
import { PortfolioData, initialPortfolioData, ProjectItem, AchievementItem } from '@/lib/data';
import { Language, translations } from '@/lib/translations';
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

/* Real Brand SVG Icons replacing all emojis */
const GitHubIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedInIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.63 1.63 0 1 0 0-3.26 1.63 1.63 0 0 0 0 3.26m1.4 9.74v-8.37H5.06v8.37h2.8z" />
  </svg>
);

const InstagramIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const TikTokIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.89 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.36 0 .7.07 1.01.2V9.45a6.34 6.34 0 0 0-1.01-.08 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.06a8.28 8.28 0 0 0 4.76 1.51V7.12a4.84 4.84 0 0 1-1-.43z" />
  </svg>
);

/* Clean Icon Mapper for Tech Stack items (zero emojis) */
const renderTechSkillIcon = (name: string, iconKey: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('next')) return <Cpu className="w-3 h-3 text-[#38bdf8]" />;
  if (lower.includes('vue')) return <span className="font-mono-tech font-extrabold text-[10px] text-[#42b883]">V</span>;
  if (lower.includes('react')) return <Code2 className="w-3 h-3 text-[#61dafb]" />;
  if (lower.includes('typescript')) return <span className="font-mono-tech font-extrabold text-[9px] text-[#3178c6]">TS</span>;
  if (lower.includes('tailwind')) return <Palette className="w-3 h-3 text-[#38bdf8]" />;
  if (lower.includes('golang') || lower.includes('go')) return <Zap className="w-3 h-3 text-[#00add8] fill-[#00add8]" />;
  if (lower.includes('laravel')) return <Server className="w-3 h-3 text-[#f43f5e]" />;
  if (lower.includes('python')) return <Terminal className="w-3 h-3 text-[#eab308]" />;
  if (lower.includes('node') || lower.includes('express')) return <span className="font-mono-tech font-extrabold text-[9px] text-[#22c55e]">JS</span>;
  if (lower.includes('api') || lower.includes('rest')) return <FileCode className="w-3 h-3 text-sky-400" />;
  if (lower.includes('postgres') || lower.includes('neon') || lower.includes('mysql') || lower.includes('database')) {
    return <Database className="w-3 h-3 text-[#38bdf8]" />;
  }
  if (lower.includes('redis')) return <Server className="w-3 h-3 text-[#ef4444]" />;
  if (lower.includes('docker')) return <Box className="w-3 h-3 text-[#0db7ed]" />;
  if (lower.includes('git') || lower.includes('ci/cd')) return <GitBranch className="w-3 h-3 text-[#f97316]" />;
  return <span className="font-mono-tech font-extrabold text-[9px]">{iconKey}</span>;
};

/* Portrait Component with dark tape, real photo support, and high-contrast SVG styling */
const StylizedPortrait = ({ isInverted, photoUrl, onClick }: { isInverted: boolean; photoUrl?: string; onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className="relative w-[270px] sm:w-[350px] md:w-[410px] h-[310px] sm:h-[400px] md:h-[450px] max-w-full select-none cursor-pointer group neo-card-grand"
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
        <div className="relative w-full h-full flex items-end justify-center select-none pointer-events-none pb-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoUrl}
            alt="Rashqa Andrean"
            className="w-auto h-[96%] max-w-[96%] object-contain select-none transition-transform duration-300 group-hover:scale-[1.03] pointer-events-auto"
            style={{
              filter: 'drop-shadow(0 0 0 4px #ffffff) drop-shadow(0 12px 20px rgba(0,0,0,0.35))',
            }}
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

interface PreviewModalData {
  title: string;
  categoryOrTag: string;
  desc: string;
  imageUrl: string;
  accent?: string;
  badge?: string;
  metrics?: string;
  issuer?: string;
  year?: string;
  liveUrl?: string;
  githubUrl?: string;
}

const ImagePreviewModal: React.FC<{
  data: PreviewModalData | null;
  onClose: () => void;
  lang: Language;
}> = ({ data, onClose, lang }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (data) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [data, onClose]);

  if (!data) return null;

  return (
    <div 
      className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-pop-in select-none"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-[#1a1b1f] text-[#111] dark:text-white border-2 sm:border-3 border-[#111] dark:border-neutral-300 rounded-2xl neo-shadow-lg overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-3.5 sm:p-4 bg-neutral-100 dark:bg-neutral-800 border-b-2 border-[#111] dark:border-neutral-700 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <span 
              className="px-2.5 py-0.5 rounded text-[10px] sm:text-xs font-mono-tech font-extrabold text-[#111] border border-[#111] shrink-0"
              style={{ backgroundColor: data.accent || '#38bdf8' }}
            >
              {data.badge || data.categoryOrTag}
            </span>
            <h3 className="font-display font-extrabold text-sm sm:text-lg truncate">
              {data.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white dark:bg-neutral-700 border-2 border-[#111] flex items-center justify-center neo-shadow-sm neo-btn cursor-pointer shrink-0"
            title="Tutup (ESC)"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Image Box */}
        <div className="relative w-full bg-neutral-900 border-b-2 border-[#111] dark:border-neutral-700 max-h-[50vh] sm:max-h-[55vh] flex items-center justify-center overflow-hidden group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.imageUrl}
            alt={data.title}
            className="w-full h-auto max-h-[50vh] sm:max-h-[55vh] object-contain transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80';
            }}
          />
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-[10px] font-mono-tech font-bold rounded border border-white/30 backdrop-blur-sm flex items-center gap-1 pointer-events-none">
            <Eye className="w-3 h-3 text-[#38bdf8]" />
            <span>HQ Preview</span>
          </div>
        </div>

        {/* Modal Info & Footer */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 bg-[#f6f5f0] dark:bg-[#121316]">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-tech font-bold text-neutral-600 dark:text-neutral-400">
            {data.issuer && (
              <span>
                {data.year ? `${data.year} • ` : ''}{data.issuer}
              </span>
            )}
            {data.metrics && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded border border-[#111]">
                <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>{data.metrics}</span>
              </span>
            )}
          </div>

          <p className="font-mono-tech text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
            {data.desc}
          </p>

          {/* Action buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-300 dark:border-neutral-700">
            <div className="flex items-center gap-2">
              {data.liveUrl && (
                <a
                  href={data.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-[#2563eb] text-white text-xs font-mono-tech font-extrabold rounded-md border-2 border-[#111] neo-shadow neo-btn flex items-center gap-1.5"
                >
                  <span>{lang === 'en' ? 'Live Demo' : 'Lihat Demo'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {data.githubUrl && (
                <a
                  href={data.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-white dark:bg-neutral-800 text-[#111] dark:text-white text-xs font-mono-tech font-extrabold rounded-md border-2 border-[#111] neo-shadow-sm neo-btn flex items-center gap-1.5"
                >
                  <span>GitHub</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-neutral-200 dark:bg-neutral-800 text-[#111] dark:text-white text-xs font-mono-tech font-bold rounded border border-[#111] hover:bg-neutral-300 cursor-pointer ml-auto"
            >
              {lang === 'en' ? 'Close Preview' : 'Tutup Preview'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectDetailModal: React.FC<{
  project: ProjectItem | null;
  onClose: () => void;
  lang: Language;
  onEnlargeImage: (preview: PreviewModalData) => void;
}> = ({ project, onClose, lang, onEnlargeImage }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [project, onClose]);

  if (!project) return null;

  const tags = project.tag ? project.tag.split('•').map(t => t.trim()) : [];

  return (
    <div 
      className="fixed inset-0 z-[160] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-pop-in select-none"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-[#1a1b1f] text-[#111] dark:text-white border-2 sm:border-3 border-[#111] dark:border-neutral-300 rounded-2xl neo-shadow-lg overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3.5 sm:p-4 bg-neutral-100 dark:bg-neutral-800 border-b-2 border-[#111] dark:border-neutral-700 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex items-center gap-1.5 mr-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 border border-[#111]" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-[#111]" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 border border-[#111]" />
            </div>
            <span 
              className="px-2.5 py-0.5 rounded text-[10px] sm:text-xs font-mono-tech font-extrabold text-[#111] border border-[#111] shrink-0"
              style={{ backgroundColor: project.accent || '#fde047' }}
            >
              {lang === 'en' ? 'PROJECT SPEC' : 'DETAIL PROYEK'}
            </span>
            <span className="font-mono-tech text-xs text-neutral-400 font-bold truncate">
              {project.id}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white dark:bg-neutral-700 border-2 border-[#111] flex items-center justify-center neo-shadow-sm neo-btn cursor-pointer shrink-0"
            title="Tutup (ESC)"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#f6f5f0] dark:bg-[#121316] neo-scrollbar" data-scrollable="true">
          {/* Banner with Zoom */}
          <div 
            onClick={() => onEnlargeImage({
              title: project.title,
              categoryOrTag: project.tag,
              desc: project.desc,
              imageUrl: project.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80',
              accent: project.accent,
              metrics: project.metrics,
              liveUrl: project.liveUrl,
              githubUrl: project.githubUrl
            })}
            className="relative w-full h-44 sm:h-64 rounded-xl border-2 border-[#111] overflow-hidden bg-neutral-900 group cursor-pointer select-none"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80'}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80';
              }}
            />
            <div className="absolute inset-0 bg-[#111]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="px-3 py-1.5 bg-white text-[#111] text-xs font-mono-tech font-extrabold rounded-md border-2 border-[#111] neo-shadow-sm flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Click to Enlarge Fullscreen' : 'Klik untuk Memperbesar Gambar'}</span>
              </span>
            </div>
          </div>

          {/* Title & Metrics */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#111] dark:text-white">
                {project.title}
              </h2>
              {project.metrics && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-300 dark:bg-amber-950 text-[#111] dark:text-amber-200 text-xs font-mono-tech font-extrabold rounded-md border-2 border-[#111]">
                  <Zap className="w-3.5 h-3.5 fill-current text-amber-600 dark:text-amber-400" />
                  <span>{project.metrics}</span>
                </div>
              )}
            </div>

            {/* Tech Tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 bg-white dark:bg-neutral-800 text-[#111] dark:text-neutral-200 text-xs font-mono-tech font-extrabold rounded border border-[#111] shadow-xs"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Detailed Scope */}
          <div className="p-4 sm:p-5 bg-white dark:bg-neutral-800/90 border-2 border-[#111] rounded-xl neo-shadow space-y-2">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-200 dark:border-neutral-700">
              <BookOpen className="w-4 h-4 text-[#2563eb]" />
              <h4 className="font-mono-tech font-extrabold text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                {lang === 'en' ? 'Architecture & Technical Scope' : 'Arsitektur & Lingkup Teknis'}
              </h4>
            </div>
            <p className="font-mono-tech text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-line">
              {project.desc}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-4 bg-white dark:bg-neutral-800 border-t-2 border-[#111] dark:border-neutral-700 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-mono-tech font-extrabold rounded-md border-2 border-[#111] neo-shadow neo-btn flex items-center gap-2"
              >
                <span>{lang === 'en' ? 'Open Live App' : 'Buka Demo Langsung'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white dark:bg-neutral-700 hover:bg-neutral-100 text-[#111] dark:text-white text-xs font-mono-tech font-extrabold rounded-md border-2 border-[#111] neo-shadow-sm neo-btn flex items-center gap-2"
              >
                <span>GitHub Source</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 text-[#111] dark:text-white text-xs font-mono-tech font-bold rounded-md border-2 border-[#111] cursor-pointer"
          >
            {lang === 'en' ? 'Close' : 'Tutup'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Portfolio() {
  const [data, setData] = useState<PortfolioData>(initialPortfolioData);

  // Intro Sequence State: 'hey' -> 'welcome' -> 'burst' -> 'ready'
  const [introStep, setIntroStep] = useState<'hey' | 'welcome' | 'burst' | 'ready'>('hey');
  const [activeTab, setActiveTab] = useState<'HOME' | 'ABOUT' | 'WORKS' | 'BLOG' | 'CONTACT'>('HOME');
  const [isDark, setIsDark] = useState(false);
  
  // Language State: 'id' (Bahasa Indonesia) or 'en' (English)
  const [lang, setLang] = useState<Language>('id');

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('portfolio_lang') as Language;
      if (savedLang === 'en' || savedLang === 'id') {
        setLang(savedLang);
      }
    } catch {}
  }, []);

  const handleSetLanguage = (newLang: Language) => {
    setLang(newLang);
    try {
      localStorage.setItem('portfolio_lang', newLang);
    } catch {}

    // Immediately replay the intro animation in the newly selected language!
    setActiveTab('HOME');
    setIntroStep('hey');
    setTimeout(() => setIntroStep('welcome'), 900);
    setTimeout(() => setIntroStep('burst'), 1750);
    setTimeout(() => setIntroStep('ready'), 2150);
  };

  const handleLangToggle = () => {
    const nextLang: Language = lang === 'en' ? 'id' : 'en';
    handleSetLanguage(nextLang);
  };

  const t = translations[lang];

  // Spread Theme Transition State
  const [themeSpread, setThemeSpread] = useState<{ active: boolean; targetDark: boolean } | null>(null);

  const [isPortraitInverted, setIsPortraitInverted] = useState(false);
  const [showAvatarToast, setShowAvatarToast] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activePreview, setActivePreview] = useState<PreviewModalData | null>(null);

  // Active Modals
  const [activeProjectDetail, setActiveProjectDetail] = useState<ProjectItem | null>(null);

  // Slide Sub-navigation States
  const [aboutSlide, setAboutSlide] = useState<number>(0);
  const [worksPage, setWorksPage] = useState<number>(0);
  const [blogSlide, setBlogSlide] = useState<number>(0);
  const [prestasiPage, setPrestasiPage] = useState<number>(0);
  const [sertifikatPage, setSertifikatPage] = useState<number>(0);

  // Works Pagination (2 Projects Per Slide)
  const projectsPerPage = 2;
  const totalWorksPages = Math.max(1, Math.ceil(data.projects.length / projectsPerPage));
  const currentProjects = data.projects.slice(
    worksPage * projectsPerPage,
    (worksPage + 1) * projectsPerPage
  );

  // Achievements Sub-pagination
  const prestasiItems = data.achievements.filter(i => i.category === 'PRESTASI');
  const prestasiPerPage = 2;
  const totalPrestasiPages = Math.max(1, Math.ceil(prestasiItems.length / prestasiPerPage));
  const currentPrestasi = prestasiItems.slice(
    prestasiPage * prestasiPerPage,
    (prestasiPage + 1) * prestasiPerPage
  );

  const sertifikatItems = data.achievements.filter(i => i.category === 'SERTIFIKAT');
  const sertifikatPerPage = 2;
  const totalSertifikatPages = Math.max(1, Math.ceil(sertifikatItems.length / sertifikatPerPage));
  const currentSertifikat = sertifikatItems.slice(
    sertifikatPage * sertifikatPerPage,
    (sertifikatPage + 1) * sertifikatPerPage
  );

  const artikelItems = data.achievements.filter(i => i.category === 'ARTIKEL');

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

  // SCROLL WHEEL TO NAVIGATE TABS (HOME -> ABOUT -> WORKS -> BLOG -> CONTACT)
  // Refined: Will NOT switch tabs accidentally. Requires deliberate scroll intent,
  // respects internally scrollable elements (like articles), and checks scroll bounds.
  const isScrollingRef = useRef(false);
  const accumulatedWheelRef = useRef(0);
  const lastWheelTimestampRef = useRef(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (introStep !== 'ready') return;
      if (activePreview || activeProjectDetail) return;

      const target = e.target as HTMLElement | null;
      if (target && target.closest('input, textarea, form, select')) {
        return;
      }

      // 1. Check if hovering/scrolling inside an internal scrollable element (like article list)
      const scrollable = target?.closest('.overflow-y-auto, .overflow-y-scroll, [data-scrollable="true"]') as HTMLElement | null;
      if (scrollable) {
        const { scrollTop, scrollHeight, clientHeight } = scrollable;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 6;
        const isAtTop = scrollTop <= 6;

        // If scrolling down and not yet at bottom of the container, let it scroll internally
        if (e.deltaY > 0 && !isAtBottom) {
          accumulatedWheelRef.current = 0;
          return;
        }
        // If scrolling up and not yet at top of the container, let it scroll internally
        if (e.deltaY < 0 && !isAtTop) {
          accumulatedWheelRef.current = 0;
          return;
        }
      }

      // 2. Check document/window scroll (if any scroll exists on smaller screens)
      if (typeof window !== 'undefined') {
        const windowScrollTop = window.scrollY || document.documentElement.scrollTop;
        const windowScrollHeight = document.documentElement.scrollHeight;
        const windowClientHeight = window.innerHeight;
        const isWindowAtBottom = windowScrollTop + windowClientHeight >= windowScrollHeight - 12;
        const isWindowAtTop = windowScrollTop <= 12;

        if (e.deltaY > 0 && !isWindowAtBottom) {
          accumulatedWheelRef.current = 0;
          return;
        }
        if (e.deltaY < 0 && !isWindowAtTop) {
          accumulatedWheelRef.current = 0;
          return;
        }
      }

      // 3. Prevent accidental twitch triggers: accumulate wheel delta with a decay window
      const now = Date.now();
      if (now - lastWheelTimestampRef.current > 380) {
        accumulatedWheelRef.current = 0;
      }
      lastWheelTimestampRef.current = now;

      // Reset if user reverses direction
      if (
        (accumulatedWheelRef.current > 0 && e.deltaY < 0) ||
        (accumulatedWheelRef.current < 0 && e.deltaY > 0)
      ) {
        accumulatedWheelRef.current = 0;
      }

      accumulatedWheelRef.current += e.deltaY;

      // Require a deliberate cumulative threshold (>= 260px)
      if (Math.abs(accumulatedWheelRef.current) < 260) {
        return;
      }

      if (isScrollingRef.current) return;

      isScrollingRef.current = true;
      const direction = accumulatedWheelRef.current > 0 ? 1 : -1;
      accumulatedWheelRef.current = 0;

      // 950ms cooldown prevents skipping multiple tabs in a single continuous scroll
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 950);

      const tabList: Array<'HOME' | 'ABOUT' | 'WORKS' | 'BLOG' | 'CONTACT'> = [
        'HOME',
        'ABOUT',
        'WORKS',
        'BLOG',
        'CONTACT'
      ];

      setActiveTab((current) => {
        const idx = tabList.indexOf(current);
        if (direction > 0) {
          return tabList[Math.min(tabList.length - 1, idx + 1)];
        } else {
          return tabList[Math.max(0, idx - 1)];
        }
      });
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [introStep, activePreview, activeProjectDetail]);

  // KEYBOARD ARROW NAVIGATION FOR SLIDES AND TABS
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (introStep !== 'ready') return;
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || (activeEl as HTMLElement).isContentEditable)) {
        return;
      }

      const tabList: Array<'HOME' | 'ABOUT' | 'WORKS' | 'BLOG' | 'CONTACT'> = [
        'HOME',
        'ABOUT',
        'WORKS',
        'BLOG',
        'CONTACT'
      ];

      if (e.key === 'ArrowRight') {
        if (activeTab === 'ABOUT') {
          setAboutSlide(prev => Math.min(2, prev + 1));
        } else if (activeTab === 'WORKS') {
          setWorksPage(prev => Math.min(totalWorksPages - 1, prev + 1));
        } else if (activeTab === 'BLOG') {
          setBlogSlide(prev => Math.min(2, prev + 1));
        } else {
          setActiveTab(curr => tabList[Math.min(tabList.length - 1, tabList.indexOf(curr) + 1)]);
        }
      } else if (e.key === 'ArrowLeft') {
        if (activeTab === 'ABOUT') {
          setAboutSlide(prev => Math.max(0, prev - 1));
        } else if (activeTab === 'WORKS') {
          setWorksPage(prev => Math.max(0, prev - 1));
        } else if (activeTab === 'BLOG') {
          setBlogSlide(prev => Math.max(0, prev - 1));
        } else {
          setActiveTab(curr => tabList[Math.max(0, tabList.indexOf(curr) - 1)]);
        }
      } else if (e.key === 'ArrowDown') {
        setActiveTab(curr => tabList[Math.min(tabList.length - 1, tabList.indexOf(curr) + 1)]);
      } else if (e.key === 'ArrowUp') {
        setActiveTab(curr => tabList[Math.max(0, tabList.indexOf(curr) - 1)]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [introStep, activeTab, totalWorksPages]);

  // RELIABLE HOLD-TO-INVERT LENS (Exact match to Image 1 & Opposite-Mode Inversion)
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return; // Left button only
      const target = e.target as HTMLElement | null;
      // Do not block normal button / input / link interactions
      if (target && (target.closest('button') || target.closest('a') || target.closest('input') || target.closest('textarea') || target.closest('select'))) {
        return;
      }
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsHoldingClick(true);
    };

    const handlePointerMove = (e: PointerEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handlePointerUp = () => {
      setIsHoldingClick(false);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    window.addEventListener('blur', handlePointerUp);
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      window.removeEventListener('blur', handlePointerUp);
    };
  }, []);

  // TOP-RIGHT SPREAD THEME TRANSITION
  const handleThemeToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const nextDark = !isDark;
    const rect = e.currentTarget.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--spread-x', `${originX}px`);
      document.documentElement.style.setProperty('--spread-y', `${originY}px`);
    }

    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      (document as any).startViewTransition(() => {
        setIsDark(nextDark);
      });
    } else {
      setThemeSpread({ active: true, targetDark: nextDark });
      setTimeout(() => {
        setIsDark(nextDark);
      }, 300);
      setTimeout(() => {
        setThemeSpread(null);
      }, 750);
    }
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

  return (
    <div className={`${isDark ? 'dark' : ''} relative min-h-screen select-none overflow-x-hidden`}>
      
      {/* SPREAD FROM TOP-RIGHT THEME TRANSITION OVERLAY (Fallback for non-viewTransition) */}
      {themeSpread && (
        <div
          className="fixed inset-0 pointer-events-none z-[120] animate-theme-spread overflow-hidden"
          style={{
            backgroundColor: themeSpread.targetDark ? '#18191c' : '#f6f5f0',
            boxShadow: themeSpread.targetDark 
              ? '0 0 80px 30px rgba(56, 189, 248, 0.45)' 
              : '0 0 80px 30px rgba(37, 99, 235, 0.35)'
          }}
        />
      )}

      {/* WORKING INVERT LENS: INVERTS ANY ELEMENT UNDERNEATH TO OPPOSITE MODE WITH EXPANDING ANIMATION */}
      {isHoldingClick && (
        <>
          {/* Shockwave expanding ring (animasi membesar gelombang luar) */}
          <div
            className="fixed pointer-events-none z-[109] rounded-[36px] border-2 border-[#2563eb] dark:border-[#38bdf8] animate-lens-shockwave"
            style={{
              left: mousePos.x - 145,
              top: mousePos.y - 145,
              width: 290,
              height: 290,
            }}
          />

          {/* Difference Blending Inversion Core: expanding pop-in & zoom */}
          <div
            className="fixed pointer-events-none z-[110] rounded-[28px] overflow-hidden animate-lens-expand shadow-2xl"
            style={{
              left: mousePos.x - 140,
              top: mousePos.y - 140,
              width: 280,
              height: 280,
              backgroundColor: '#ffffff',
              mixBlendMode: 'difference',
            }}
          />

          {/* Figma-Style Inspection Frame with Corner Handles & Expanding Animation */}
          <div
            className="fixed pointer-events-none z-[115] animate-lens-expand"
            style={{
              left: mousePos.x - 140,
              top: mousePos.y - 140,
              width: 280,
              height: 280,
            }}
          >
            <div className="w-full h-full rounded-[28px] border-2 border-black dark:border-white shadow-[0_0_35px_rgba(37,99,235,0.35)] dark:shadow-[0_0_35px_rgba(56,189,248,0.45)]" />

            {/* 4 Corner Circular Dots matching Figma inspection box */}
            <span className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-black dark:bg-white rounded-full border-2 border-white dark:border-black pointer-events-none shadow-sm" />
            <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-black dark:bg-white rounded-full border-2 border-white dark:border-black pointer-events-none shadow-sm" />
            <span className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-black dark:bg-white rounded-full border-2 border-white dark:border-black pointer-events-none shadow-sm" />
            <span className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-black dark:bg-white rounded-full border-2 border-white dark:border-black pointer-events-none shadow-sm" />

            {/* Dimension Pill (Figma style) */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#2563eb] text-white text-[9px] font-mono-tech font-extrabold rounded border border-[#111] shadow whitespace-nowrap">
              280 × 280 px
            </div>

            {/* Mode Indicator Badge */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-black dark:bg-white text-white dark:text-black text-[9px] font-mono-tech font-extrabold rounded shadow tracking-wider uppercase whitespace-nowrap border border-white dark:border-black">
              {isDark ? 'INVERTING TO LIGHT' : 'INVERTING TO DARK'}
            </div>
          </div>
        </>
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
        <header className={`w-full max-w-[1400px] mx-auto px-4 sm:px-8 pt-4 pb-2 flex items-center justify-between z-40 transition-opacity duration-500 ${
          isReady ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          {/* Left Nav Group */}
          <div className="flex items-center gap-2 sm:gap-5 flex-wrap">
            {/* Rainbow Logo: Clicking resets to HOME and replays intro */}
            <button 
              onClick={replayIntro}
              title="Kembali ke Home & Putar Ulang Animasi"
              className="mr-2 focus:outline-none group relative cursor-pointer"
            >
              <RainbowLogoSVG isDark={isDark} />
            </button>

            {/* Desktop Nav Items */}
            <div className="hidden md:flex items-center gap-1.5 lg:gap-3">
              {[
                { id: 'HOME' as const, label: t.nav.home, icon: Home },
                { id: 'ABOUT' as const, label: t.nav.about, icon: Sparkles },
                { id: 'WORKS' as const, label: t.nav.works, icon: Menu },
                { id: 'BLOG' as const, label: t.nav.achievements, icon: Award },
                { id: 'CONTACT' as const, label: t.nav.contact, icon: Mail },
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
          </div>

          {/* Right Controls: Language Switcher, Theme Switcher, Avatar, Let's Talk */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Language Switcher: Explicit ID and EN Buttons */}
            <div 
              className="h-7 p-0.5 bg-white dark:bg-neutral-800 border-2 border-[#111] dark:border-neutral-600 rounded-full flex items-center neo-shadow-sm select-none"
              title={t.nav.langTitle}
            >
              <button
                type="button"
                onClick={() => handleSetLanguage('id')}
                aria-label="Bahasa Indonesia"
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono-tech font-extrabold transition-all cursor-pointer ${
                  lang === 'id'
                    ? 'bg-[#2563eb] text-white shadow-xs'
                    : 'text-neutral-500 hover:text-[#111] dark:hover:text-white'
                }`}
              >
                ID
              </button>
              <button
                type="button"
                onClick={() => handleSetLanguage('en')}
                aria-label="English Language"
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono-tech font-extrabold transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[#2563eb] text-white shadow-xs'
                    : 'text-neutral-500 hover:text-[#111] dark:hover:text-white'
                }`}
              >
                EN
              </button>
            </div>

            {/* Sun / Moon Pill Toggle with Top-Right Spread */}
            <button
              onClick={handleThemeToggle}
              aria-label="Toggle Dark Mode"
              title={t.nav.themeTitle}
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
                {data.profile.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.profile.photoUrl}
                    alt={data.profile.nickName}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <svg viewBox="0 0 40 40" className="w-full h-full">
                    <circle cx="20" cy="20" r="20" fill="#38bdf8" />
                    <circle cx="20" cy="16" r="7" fill="#e5e5e5" stroke="#111" strokeWidth="1.5" />
                    <path d="M13 13 C13 8 27 8 27 13" fill="#111" />
                    <rect x="14" y="13" width="5" height="3.5" rx="1" fill="#111" />
                    <rect x="21" y="13" width="5" height="3.5" rx="1" fill="#111" />
                    <path d="M10 38 C10 28 30 28 30 38" fill="#111" />
                  </svg>
                )}
              </button>

              {showAvatarToast && (
                <div className="absolute right-0 top-12 z-50 bg-[#2563eb] text-white text-xs font-mono-tech font-bold px-3.5 py-2 rounded-lg border-2 border-[#111] neo-shadow whitespace-nowrap animate-pop-in flex items-center gap-1.5">
                  <span>{t.nav.avatarToast}</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                </div>
              )}
            </div>

            {/* LET'S TALK Button */}
            <button
              onClick={() => setActiveTab('CONTACT')}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-[#23252a] text-[#111] dark:text-white text-xs font-mono-tech font-extrabold tracking-wider border-2 border-[#111] dark:border-neutral-300 rounded-[4px] neo-shadow neo-btn-grand cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>{t.nav.talk}</span>
            </button>
          </div>
        </header>

        {/* FULLSCREEN INTRO OVERLAY */}
        {introStep !== 'ready' && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-30">
            {(introStep === 'hey' || introStep === 'welcome') && (
              <div className="px-9 py-5 bg-[#2563eb] text-white font-display font-extrabold text-2xl sm:text-3xl rounded-2xl border-2 border-[#111] neo-shadow-lg animate-pop-in">
                {introStep === 'hey' 
                  ? (lang === 'id' ? (data.intro?.hey_id || t.intro.hey) : (data.intro?.hey_en || t.intro.hey))
                  : (lang === 'id' ? (data.intro?.welcome_id || t.intro.welcome) : (data.intro?.welcome_en || t.intro.welcome))
                }
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
        <main className={`flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-8 xl:px-12 py-3 sm:py-6 pb-24 md:pb-6 flex items-center justify-center relative transition-opacity duration-500 ${
          isReady ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          
          {/* TAB: HOME */}
          {activeTab === 'HOME' && (
            <div className="w-full relative min-h-[580px] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-6 xl:gap-8 py-2 sm:py-4">
              
              {/* Top-left Plus '+' Sign */}
              <div 
                className={`hidden md:block absolute top-6 left-2 text-3xl font-extrabold transition-opacity duration-500 ${
                  isReady ? 'opacity-100' : 'opacity-0'
                }`}
              >
                +
              </div>

              {/* Left Mint Green Sticker: "FULL STACK DEVELOPER" with Gentle Float */}
              <div className="hidden xl:block absolute top-24 -left-2 xl:-left-6 2xl:-left-10 z-20">
                <InspectableBox
                  dimensions="120 × 96"
                  color="#10b981"
                  badgePosition="bottom"
                  defaultDraggable={true}
                  delay={180}
                  isReady={isReady}
                >
                  <div className="w-28 h-22 sm:w-30 sm:h-24 bg-[#a7f3d0] text-[#111] p-2.5 -rotate-12 shadow-md border-2 border-[#111] flex flex-col items-center justify-center text-center font-hand text-lg sm:text-xl leading-tight font-bold neo-sticker-grand animate-float-gentle">
                    <span>{t.hero.stickers.fullstackLine1}</span>
                    <span>{t.hero.stickers.fullstackLine2}</span>
                    <div className="w-10 h-0.5 bg-[#111]/40 mt-1 rounded-full" />
                  </div>
                </InspectableBox>
              </div>

              {/* Left Blue Zigzag 'W' Doodle with Bobbing Float */}
              <div 
                className={`hidden xl:block absolute top-[280px] left-2 xl:left-4 z-10 transition-opacity duration-700 ${
                  isReady ? 'opacity-100 animate-float-bob' : 'opacity-0'
                }`}
              >
                <svg width="34" height="24" viewBox="0 0 34 24" fill="none">
                  <path d="M3 4L10 20L17 7L24 20L31 4" stroke="#2563eb" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Bottom-left Yellow Sticky Note with Delayed Float */}
              <div className="hidden xl:block absolute bottom-4 -left-2 xl:-left-6 2xl:-left-8 z-20">
                <InspectableBox
                  dimensions="120 × 120"
                  color="#f59e0b"
                  badgePosition="top"
                  defaultDraggable={true}
                  delay={260}
                  isReady={isReady}
                >
                  <div className="w-28 h-28 sm:w-30 sm:h-30 bg-[#fde047] text-[#111] p-2.5 rotate-6 shadow-md border-2 border-[#111] flex flex-col items-center justify-center text-center font-hand text-base sm:text-lg leading-tight font-bold neo-sticker-grand animate-float-delayed">
                    {t.hero.stickers.goodDesign.map((line, idx) => (
                      <span key={idx}>{line}</span>
                    ))}
                  </div>
                </InspectableBox>
              </div>

              {/* LEFT COLUMN: Hey, I'm RASHQA + Bio + CTA Buttons */}
              <div className="w-full lg:w-[48%] xl:w-[47%] xl:pl-28 2xl:pl-32 z-10 flex flex-col items-start text-left">
                
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
                      {lang === 'id' ? (data.profile.headline || t.hero.greeting) : t.hero.greeting}
                    </span>
                  </div>
                </InspectableBox>

                {/* Giant "RASHQA ANDREAN" Heading with Yellow Crown & Doodles */}
                <div className="relative mt-1 mb-4 w-full">
                  {/* Floating Yellow Crown (Anchored over center of name with gentle bob) */}
                  <div 
                    className={`absolute -top-9 sm:-top-10 right-16 sm:right-28 xl:right-36 z-20 rotate-12 pointer-events-none transition-all duration-500 ${
                      isReady ? 'opacity-100 scale-100 animate-float-bob' : 'opacity-0 scale-50'
                    }`}
                  >
                    <CrownSVG />
                  </div>

                  {/* Curved Arrow Doodle Pointing to Name (Matching Image 0) */}
                  <div 
                    className={`hidden sm:block absolute -right-6 top-8 pointer-events-none text-[#111] dark:text-white transition-opacity duration-700 ${
                      isReady ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <svg width="42" height="42" viewBox="0 0 46 46" fill="none">
                      <path d="M8 6 C 28 10, 38 22, 26 38" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
                      <path d="M18 34 L 26 38 L 32 30" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  <InspectableBox
                    dimensions="548 × 136"
                    color="#0ea5e9"
                    badgePosition="bottom"
                    delay={120}
                    isReady={isReady}
                    className="w-full"
                  >
                    <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-[62px] xl:text-[72px] 2xl:text-[78px] leading-[0.92] tracking-tight uppercase px-1 text-[#111111] dark:text-white">
                      {data.profile.nickName}
                      <br />
                      ANDREAN
                    </h1>

                    {/* Doodle underline below name (Matching Image 0) */}
                    <div className="w-36 sm:w-48 h-3.5 pl-2 mt-2">
                      <svg viewBox="0 0 180 14" className="w-full h-full fill-none text-[#111] dark:text-white">
                        <path d="M4 8 Q 90 12, 170 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="174" cy="5" r="2.5" fill="currentColor" />
                      </svg>
                    </div>
                  </InspectableBox>
                </div>

                {/* Subtitle / Role Tag (Safely guarded by isReady) */}
                <div 
                  className={`mb-3.5 inline-flex items-center gap-1.5 px-3 py-1 bg-[#38bdf8] text-[#111] font-mono-tech font-extrabold text-xs rounded border-2 border-[#111] neo-shadow-sm transition-opacity duration-300 ${
                    isReady ? 'opacity-100 animate-pop-in' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 fill-[#111] stroke-[#111]" />
                  <span>{t.hero.roleTag}</span>
                </div>

                {/* Bio Paragraph */}
                <InspectableBox
                  dimensions="460 × 96"
                  color="#10b981"
                  badgePosition="bottom"
                  delay={200}
                  isReady={isReady}
                  className="w-full max-w-[440px] mb-6"
                >
                  <div className="border-y border-neutral-300 dark:border-neutral-700 py-3">
                    <p className="font-mono-tech text-xs sm:text-[13.5px] leading-relaxed text-neutral-700 dark:text-neutral-300">
                      {lang === 'en' ? translations.en.hero.bio : data.profile.bio}
                    </p>
                  </div>
                </InspectableBox>

                {/* Action Buttons: VIEW MY WORK & TECH STACKS */}
                <div className="flex flex-wrap items-center gap-3.5">
                  <InspectableBox
                    dimensions="186 × 48"
                    color="#0ea5e9"
                    badgePosition="bottom"
                    delay={280}
                    isReady={isReady}
                  >
                    <button
                      onClick={() => setActiveTab('WORKS')}
                      className="px-5 sm:px-6 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-mono-tech font-extrabold text-xs tracking-wider rounded-md border-2 border-[#111] neo-shadow neo-btn-grand flex items-center gap-2.5 transition-transform cursor-pointer"
                    >
                      <span className="w-5 h-5 rounded bg-white text-[#111] flex items-center justify-center">
                        <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                      <span>{t.hero.viewWork}</span>
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
                      className="px-5 sm:px-6 py-3 bg-white dark:bg-[#23252a] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[#111] dark:text-white font-mono-tech font-extrabold text-xs tracking-wider rounded-md border-2 border-[#111] dark:border-neutral-400 neo-shadow neo-btn-grand flex items-center gap-2.5 transition-transform cursor-pointer"
                    >
                      <Code2 className="w-4 h-4 text-[#2563eb] stroke-[2.5]" />
                      <span>{t.hero.techStacks}</span>
                    </button>
                  </InspectableBox>
                </div>

                {/* Mobile Friendly Interactive Sticker Bar (< 1280px) */}
                <div className="flex xl:hidden flex-wrap items-center gap-2.5 mt-5 pt-3 border-t border-dashed border-neutral-300 dark:border-neutral-700">
                  <div 
                    onClick={() => setActiveTab('ABOUT')}
                    className="px-2.5 py-1.5 bg-[#a7f3d0] text-[#111] border-2 border-[#111] rounded-md text-xs font-hand font-bold -rotate-3 neo-shadow-sm neo-btn animate-float-gentle cursor-pointer"
                  >
                    {t.hero.stickers.fullstackLine1} {t.hero.stickers.fullstackLine2}
                  </div>
                  <div 
                    onClick={navigateToTechStack}
                    className="px-2.5 py-1.5 bg-white dark:bg-[#23252a] text-[#111] dark:text-white border-2 border-[#111] rounded-md text-xs font-mono-tech font-bold rotate-2 neo-shadow-sm neo-btn animate-float-sway cursor-pointer flex items-center gap-1.5"
                  >
                    <Code2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>STACK.TS →</span>
                  </div>
                  <div 
                    onClick={() => setActiveTab('CONTACT')}
                    className="px-2.5 py-1.5 bg-[#fde047] text-[#111] border-2 border-[#111] rounded-md text-xs font-hand font-bold -rotate-2 neo-shadow-sm neo-btn animate-float-delayed cursor-pointer"
                  >
                    {t.hero.stickers.createTogether.join(' ')}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Portrait + Browser Window Card + Stickers */}
              <div className="w-full lg:w-[48%] xl:w-[48%] flex items-center justify-center relative min-h-[460px]">
                
                {/* Mini Retro Browser Window Card (Positioned gracefully above the blue brush without covering face on desktop, replaced by sticker shelf on mobile) */}
                <div className="hidden lg:block absolute -top-10 sm:-top-14 lg:-top-16 left-0 sm:left-[-10px] lg:left-[-8px] xl:left-[-16px] z-30">
                  <InspectableBox
                    dimensions="172 × 126"
                    color="#0ea5e9"
                    badgePosition="top"
                    defaultDraggable={true}
                    delay={220}
                    isReady={isReady}
                  >
                    <div 
                      onClick={navigateToTechStack}
                      title="Klik untuk lihat detail Tech Stack di tab About"
                      className="w-40 sm:w-42 bg-white dark:bg-[#23252a] border-2 border-[#111] rounded-xl p-2.5 -rotate-6 neo-shadow neo-card-grand cursor-pointer animate-float-sway"
                    >
                      {/* Window Header */}
                      <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-neutral-200 dark:border-neutral-700">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-400 border border-[#111]" />
                          <span className="w-2 h-2 rounded-full bg-yellow-400 border border-[#111]" />
                          <span className="w-2 h-2 rounded-full bg-green-400 border border-[#111]" />
                        </div>
                        <span className="text-[9px] font-mono-tech font-bold text-neutral-400">STACK.TS</span>
                      </div>

                      {/* Stack Items */}
                      <div className="space-y-1 font-mono-tech text-[10.5px] font-extrabold text-[#111] dark:text-white">
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
                  className={`hidden sm:block absolute top-4 left-44 sm:left-48 z-20 transition-opacity duration-700 ${
                    isReady ? 'opacity-100 animate-float-bob' : 'opacity-0'
                  }`}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
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

                {/* Pink Starburst Sticker: "BUILD COOL THINGS" with Gentle Float */}
                <div className="absolute bottom-12 sm:bottom-16 right-14 sm:right-28 z-30 pointer-events-auto">
                  <InspectableBox
                    dimensions="114 × 114"
                    color="#ec4899"
                    badgePosition="bottom"
                    defaultDraggable={true}
                    delay={300}
                    isReady={isReady}
                  >
                    <div className="relative w-26 h-26 sm:w-28 sm:h-28 flex items-center justify-center rotate-12 neo-sticker-grand animate-float-gentle">
                      <svg viewBox="0 0 120 120" className="w-full h-full fill-[#f472b6] drop-shadow">
                        <polygon points="60,2 73,18 93,9 96,30 116,33 107,52 120,68 103,80 106,101 86,102 77,120 60,108 43,120 34,102 14,101 17,80 0,68 13,52 4,33 24,30 27,9 47,18" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center font-hand font-extrabold text-[#111] text-base sm:text-lg leading-none">
                        {t.hero.stickers.buildCoolThings.map((word, idx) => (
                          <span key={idx}>{word}</span>
                        ))}
                      </div>
                    </div>
                  </InspectableBox>
                </div>

                {/* Top-right Lime Green Sticky Note with Delayed Float */}
                <div className="hidden sm:block absolute -top-10 sm:-top-12 -right-2 sm:-right-6 z-20">
                  <InspectableBox
                    dimensions="112 × 110"
                    color="#84cc16"
                    badgePosition="bottom"
                    defaultDraggable={true}
                    delay={250}
                    isReady={isReady}
                  >
                    <div className="w-26 h-26 sm:w-28 sm:h-28 bg-[#bef264] text-[#111] p-3 rotate-6 shadow-md border-2 border-[#111] flex flex-col items-center justify-center text-center font-hand text-lg sm:text-xl leading-tight font-bold neo-sticker-grand animate-float-delayed">
                      {t.hero.stickers.designCodeShip.map((line, idx) => (
                        <span key={idx}>{line}</span>
                      ))}
                    </div>
                  </InspectableBox>
                </div>

                {/* Right Oval Badge: "creativity + technology" with Sway Float */}
                <div className="hidden sm:block absolute top-28 sm:top-32 -right-4 sm:-right-8 z-20">
                  <InspectableBox
                    dimensions="130 × 74"
                    color="#0ea5e9"
                    badgePosition="bottom"
                    defaultDraggable={true}
                    delay={320}
                    isReady={isReady}
                  >
                    <div className="px-4 sm:px-5 py-3 bg-white dark:bg-[#23252a] text-[#111] dark:text-white border-2 border-[#111] dark:border-white rounded-full -rotate-6 shadow-sm flex flex-col items-center justify-center text-center font-hand text-base sm:text-lg leading-none font-bold neo-sticker-grand animate-float-sway">
                      <span>{t.hero.stickers.creativityTech.line1}</span>
                      <span className="text-xs my-0.5">+</span>
                      <span>{t.hero.stickers.creativityTech.line2}</span>
                    </div>
                  </InspectableBox>
                </div>

                {/* Right Hand-drawn Heart Outline with Bobbing Float */}
                <div 
                  className={`hidden sm:block absolute top-[230px] sm:top-[245px] -right-1 sm:-right-3 transition-opacity duration-700 ${
                    isReady ? 'opacity-100 animate-float-bob' : 'opacity-0'
                  }`}
                >
                  <Heart className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2] text-[#111] dark:text-white rotate-12" />
                </div>

                {/* Bottom-right Circle Badge: "Let's Create Together" with Delayed Float */}
                <div className="hidden sm:block absolute -bottom-6 sm:-bottom-8 -right-2 sm:-right-6 z-20">
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
                      className="w-26 h-26 sm:w-28 sm:h-28 rounded-full bg-white dark:bg-[#23252a] text-[#111] dark:text-white border-2 border-[#111] dark:border-white p-2.5 -rotate-6 shadow-md flex flex-col items-center justify-center text-center font-hand text-base sm:text-lg leading-tight font-bold cursor-pointer neo-sticker-grand animate-float-delayed"
                    >
                      {t.hero.stickers.createTogether.map((word, idx) => (
                        <span key={idx}>{word}</span>
                      ))}
                    </div>
                  </InspectableBox>
                </div>

                {/* Bottom-center slash doodle matching Image 0 */}
                <div 
                  className={`hidden sm:block absolute bottom-4 -left-8 sm:-left-12 pointer-events-none text-2xl font-hand font-extrabold text-[#111] dark:text-white transition-opacity duration-700 ${
                    isReady ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  /
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
                        {t.about.tag}
                      </div>
                      <h2 className="font-display font-extrabold text-2xl sm:text-3xl">
                        {aboutSlide === 0 && t.about.slideHeaders.profile}
                        {aboutSlide === 1 && t.about.slideHeaders.story}
                        {aboutSlide === 2 && t.about.slideHeaders.tech}
                      </h2>
                    </div>

                    {/* Slide Pill Navigation */}
                    <div className="flex items-center gap-1.5 bg-[#f6f5f0] dark:bg-neutral-800 p-1 rounded-lg border border-[#111]">
                      {[t.about.slideTabs.profile, t.about.slideTabs.story, t.about.slideTabs.tech].map((label, idx) => (
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
                          <span className="text-[10px] font-mono-tech font-extrabold uppercase">{t.about.profile.fullName}</span>
                          <h3 className="font-display font-extrabold text-base sm:text-lg mt-0.5">{data.profile.fullName}</h3>
                          <p className="text-xs font-mono-tech mt-1 text-neutral-700">{data.profile.role}</p>
                        </div>
                        <div className="p-4 bg-[#a7f3d0] text-[#111] rounded-xl border-2 border-[#111] neo-shadow neo-card-grand">
                          <span className="text-[10px] font-mono-tech font-extrabold uppercase">{t.about.profile.yearsExp}</span>
                          <h3 className="font-display font-extrabold text-xl sm:text-2xl mt-0.5">{data.profile.stats.experience}</h3>
                          <p className="text-xs font-mono-tech mt-1 text-neutral-700">{data.profile.stats.projects} {lang === 'en' ? 'Completed' : 'Terselesaikan'}</p>
                        </div>
                        <div className="p-4 bg-[#fde047] text-[#111] rounded-xl border-2 border-[#111] neo-shadow neo-card-grand">
                          <span className="text-[10px] font-mono-tech font-extrabold uppercase">{t.about.profile.focusAreas}</span>
                          <h3 className="font-display font-extrabold text-base sm:text-lg mt-0.5">Full Stack &amp; Cloud</h3>
                          <p className="text-xs font-mono-tech mt-1 text-neutral-700">Golang • Next.js • Laravel</p>
                        </div>
                      </div>

                      <div className="p-5 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-300 dark:border-neutral-700">
                        <h4 className="font-display font-extrabold text-sm uppercase mb-2 tracking-wider text-[#2563eb]">
                          {lang === 'en' ? 'Engineering Principles & Focus' : 'Fokus & Prinsip Rekayasa'}
                        </h4>
                        <p className="font-mono-tech text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                          {lang === 'en' 
                            ? 'Specializing in building robust, high-performance digital products with uncompromising reliability and tactile visual polish. Experienced across database modeling, distributed backends, and frontend micro-interactions.'
                            : 'Berfokus pada pembuatan produk digital yang tahan uji (robust), performa tinggi, dan memiliki interaktivitas visual tingkat tinggi. Berpengalaman dari database modeling hingga frontend micro-interactions.'}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2 text-xs font-mono-tech">
                          <span className="px-2.5 py-1 bg-white dark:bg-neutral-700 border border-[#111] rounded font-bold flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span>{data.profile.location}</span>
                          </span>
                          <a href={`mailto:${data.profile.email}`} className="px-2.5 py-1 bg-white dark:bg-neutral-700 border border-[#111] rounded font-bold hover:bg-[#38bdf8] hover:text-[#111] transition-colors flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span>{data.profile.email}</span>
                          </a>
                          <a href={data.profile.github} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 bg-white dark:bg-neutral-700 border border-[#111] rounded font-bold hover:bg-[#a7f3d0] hover:text-[#111] transition-colors flex items-center gap-1.5">
                            <GitHubIcon className="w-3.5 h-3.5 shrink-0" />
                            <span>GitHub</span>
                          </a>
                          <a href={data.profile.linkedin} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 bg-white dark:bg-neutral-700 border border-[#111] rounded font-bold hover:bg-[#38bdf8] hover:text-[#111] transition-colors flex items-center gap-1.5">
                            <LinkedInIcon className="w-3.5 h-3.5 text-[#0a66c2] shrink-0" />
                            <span>LinkedIn</span>
                          </a>
                          <a href={data.profile.instagram} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 bg-white dark:bg-neutral-700 border border-[#111] rounded font-bold hover:bg-[#f472b6] hover:text-[#111] transition-colors flex items-center gap-1.5">
                            <InstagramIcon className="w-3.5 h-3.5 text-[#e4405f] shrink-0" />
                            <span>@rasshqa.tsx</span>
                          </a>
                          <a href={data.profile.tiktok} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 bg-white dark:bg-neutral-700 border border-[#111] rounded font-bold hover:bg-[#fde047] hover:text-[#111] transition-colors flex items-center gap-1.5">
                            <TikTokIcon className="w-3.5 h-3.5 shrink-0" />
                            <span>@rasshqa</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SLIDE 1: ABOUT ME */}
                  {aboutSlide === 1 && (
                    <div className="space-y-6 animate-slide-right">
                      <p className="font-mono-tech text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        {lang === 'en' ? t.about.story.lead : data.aboutStory.lead}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {(lang === 'en' ? t.about.story.pillars : data.aboutStory.pillars).map((pillar, i) => {
                          const bg = data.aboutStory.pillars[i]?.bg || 'bg-[#bae6fd]';
                          return (
                            <div key={pillar.title} className={`${bg} text-[#111] p-4 rounded-xl border-2 border-[#111] neo-shadow neo-card-grand`}>
                              <h3 className="font-display font-extrabold text-base mb-1.5">{pillar.title}</h3>
                              <p className="font-mono-tech text-xs leading-relaxed opacity-90">{pillar.desc}</p>
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-mono-tech text-neutral-600 dark:text-neutral-300 space-y-2">
                        {(lang === 'en' ? t.about.story.paragraphs : data.aboutStory.paragraphs).map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SLIDE 2: TECH STACK */}
                  {aboutSlide === 2 && (
                    <div className="space-y-4 animate-slide-right">
                      <p className="font-mono-tech text-xs text-neutral-600 dark:text-neutral-400">
                        {t.about.tech.lead}
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
                                    <span className="w-5 h-5 rounded bg-[#111] dark:bg-neutral-800 text-white flex items-center justify-center font-bold">
                                      {renderTechSkillIcon(skill.name, skill.icon)}
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
                    <span>{lang === 'en' ? 'PREV' : 'SEBELUMNYA'}</span>
                  </button>

                  <div className="text-xs font-mono-tech font-extrabold text-neutral-500">
                    SLIDE {aboutSlide + 1} {lang === 'en' ? 'OF' : 'DARI'} 3
                  </div>

                  <button
                    onClick={() => setAboutSlide(prev => Math.min(2, prev + 1))}
                    disabled={aboutSlide === 2}
                    className="px-4 py-2 bg-[#2563eb] text-white border-2 border-[#111] rounded font-mono-tech font-extrabold text-xs neo-shadow neo-btn-grand disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{lang === 'en' ? 'NEXT' : 'SELANJUTNYA'}</span>
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
                  <h2 className="font-display font-extrabold text-3xl sm:text-4xl">{t.works.title}</h2>
                  <p className="font-mono-tech text-xs text-neutral-500 mt-0.5">
                    {t.works.pageIndicator(worksPage, totalWorksPages)} • {t.works.lead}
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
                    <span>{t.works.prev}</span>
                  </button>
                  <button
                    onClick={() => setWorksPage(prev => Math.min(totalWorksPages - 1, prev + 1))}
                    disabled={worksPage >= totalWorksPages - 1}
                    className="px-3.5 py-2 bg-[#2563eb] text-white border-2 border-[#111] font-mono-tech font-extrabold text-xs rounded neo-shadow neo-btn-grand disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t.works.next}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 2 Projects Per Slide Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {currentProjects.map((proj, idx) => (
                  <InspectableBox
                    key={proj.id}
                    dimensions="480 × 340"
                    color="#2563eb"
                    badgePosition="bottom"
                    delay={idx * 70}
                  >
                    <div className="bg-white dark:bg-[#23252a] border-2 border-[#111] dark:border-neutral-400 rounded-xl p-4 sm:p-5 neo-shadow neo-card-grand flex flex-col justify-between h-full">
                      <div>
                        {/* Project Image Preview Banner with Zoom Hover */}
                        <div
                          onClick={() => setActivePreview({
                            title: proj.title,
                            categoryOrTag: proj.tag,
                            desc: proj.desc,
                            imageUrl: proj.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80',
                            accent: proj.accent,
                            metrics: proj.metrics,
                            liveUrl: proj.liveUrl,
                            githubUrl: proj.githubUrl,
                          })}
                          className="relative w-full h-40 sm:h-44 rounded-lg border-2 border-[#111] dark:border-neutral-700 overflow-hidden mb-3 bg-neutral-100 dark:bg-neutral-800 group/thumb cursor-pointer select-none"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={proj.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80'}
                            alt={proj.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80';
                            }}
                          />
                          <div className="absolute inset-0 bg-[#111]/30 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="px-3 py-1.5 bg-white text-[#111] text-[11px] font-mono-tech font-extrabold rounded-md border-2 border-[#111] neo-shadow-sm flex items-center gap-1.5 transform translate-y-1 group-hover/thumb:translate-y-0 transition-transform">
                              <Eye className="w-3.5 h-3.5" />
                              <span>{lang === 'en' ? 'Enlarge Preview' : 'Perbesar Gambar'}</span>
                            </span>
                          </div>
                        </div>

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

                        <h3 className="font-display font-extrabold text-lg sm:text-xl mb-1.5">{proj.title}</h3>
                        <p className="font-mono-tech text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-3 line-clamp-2">
                          {proj.desc}
                        </p>

                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 dark:bg-amber-950/60 text-[#111] dark:text-amber-300 text-[10px] font-mono-tech font-bold rounded border border-amber-400 dark:border-amber-800">
                          <Zap className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                          <span>{proj.metrics}</span>
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-neutral-200 dark:border-neutral-700 space-y-2.5">
                        {/* Toggle Button for Full Project Description / Specs Modal */}
                        <div className="flex items-center justify-between gap-2">
                          <button
                            onClick={() => setActiveProjectDetail(proj)}
                            className="px-3 py-1.5 bg-[#fde047] hover:bg-yellow-400 text-[#111] font-mono-tech font-extrabold text-xs rounded border-2 border-[#111] neo-shadow-sm neo-btn flex items-center gap-1.5 cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>{t.works.viewDetails}</span>
                          </button>

                          <button
                            onClick={() => setActivePreview({
                              title: proj.title,
                              categoryOrTag: proj.tag,
                              desc: proj.desc,
                              imageUrl: proj.imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80',
                              accent: proj.accent,
                              metrics: proj.metrics,
                              liveUrl: proj.liveUrl,
                              githubUrl: proj.githubUrl,
                            })}
                            className="p-1.5 bg-neutral-100 dark:bg-neutral-800 text-[#111] dark:text-white rounded border border-[#111] hover:scale-105 transition-transform cursor-pointer"
                            title={lang === 'en' ? 'Inspect Image' : 'Lihat Gambar Preview'}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* External Links */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-3">
                            {proj.liveUrl && (
                              <a
                                href={proj.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono-tech text-xs font-bold flex items-center gap-1.5 text-[#2563eb] dark:text-[#38bdf8] hover:underline"
                              >
                                {t.works.viewLive} <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {proj.githubUrl && (
                              <a
                                href={proj.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono-tech text-xs font-bold text-neutral-500 hover:text-[#111] dark:hover:text-white"
                              >
                                {t.works.sourceCode} →
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </InspectableBox>
                ))}
              </div>
            </div>
          )}

          {/* TAB: ACHIEVEMENTS & CERTIFICATES WITH IMAGE PREVIEWS ACROSS ALL CATEGORIES */}
          {activeTab === 'BLOG' && (
            <div className="w-full max-w-4xl py-4 animate-pop-in">
              <div className="bg-white dark:bg-[#23252a] border-2 border-[#111] dark:border-neutral-400 rounded-2xl p-5 sm:p-8 neo-shadow-lg min-h-[520px] flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b-2 border-neutral-200 dark:border-neutral-700">
                    <div>
                      <div className="inline-block px-3 py-1 bg-[#fde047] text-[#111] font-mono-tech font-extrabold text-xs rounded border border-[#111] mb-1">
                        {t.achievements.tag}
                      </div>
                      <h2 className="font-display font-extrabold text-2xl sm:text-3xl">
                        {blogSlide === 0 && t.achievements.categoryHeaders.prestasi}
                        {blogSlide === 1 && t.achievements.categoryHeaders.sertifikat}
                        {blogSlide === 2 && t.achievements.categoryHeaders.artikel}
                      </h2>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex items-center gap-1.5 bg-[#f6f5f0] dark:bg-neutral-800 p-1 rounded-lg border border-[#111] flex-wrap">
                      {[t.achievements.categories.prestasi, t.achievements.categories.sertifikat, t.achievements.categories.artikel].map((cat, idx) => (
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

                  {/* Category 0: PRESTASI (Sub-paginated 2 per slide) */}
                  {blogSlide === 0 && (
                    <div className="space-y-4 animate-slide-right">
                      {currentPrestasi.length === 0 ? (
                        <div className="p-8 text-center bg-[#f6f5f0] dark:bg-neutral-800/60 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700">
                          <p className="font-mono-tech text-xs text-neutral-500">
                            {lang === 'en' ? 'No awards logged yet.' : 'Belum ada data prestasi.'}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3.5">
                          {currentPrestasi.map((item) => (
                            <div
                              key={item.id}
                              className="bg-white dark:bg-neutral-800/90 border-2 border-[#111] rounded-xl p-4 sm:p-5 neo-shadow neo-card-grand flex flex-col sm:flex-row items-start sm:items-center gap-4"
                            >
                              {/* Dedicated Image Preview Thumbnail */}
                              <div
                                onClick={() => setActivePreview({
                                  title: item.title,
                                  categoryOrTag: item.category,
                                  desc: item.description,
                                  imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=900&q=80',
                                  accent: item.accent,
                                  badge: item.badge,
                                  issuer: item.issuer,
                                  year: item.year
                                })}
                                className="relative w-full sm:w-44 h-36 sm:h-28 shrink-0 rounded-lg border-2 border-[#111] overflow-hidden group/ach cursor-pointer bg-neutral-100 dark:bg-neutral-900 select-none"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={item.imageUrl || 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=900&q=80'}
                                  alt={item.title}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover/ach:scale-105"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=900&q=80';
                                  }}
                                />
                                <div className="absolute inset-0 bg-[#111]/30 opacity-0 group-hover/ach:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="px-2.5 py-1 bg-white text-[#111] text-[10px] font-mono-tech font-extrabold rounded border border-[#111] flex items-center gap-1 shadow-sm">
                                    <Eye className="w-3 h-3" />
                                    <span>{lang === 'en' ? 'Preview' : 'Lihat'}</span>
                                  </span>
                                </div>
                              </div>

                              {/* Content Details */}
                              <div className="flex-1 space-y-1.5 w-full">
                                <div className="flex flex-wrap items-center justify-between gap-2">
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

                                  <span className="px-2.5 py-1 bg-[#f6f5f0] dark:bg-neutral-900 border border-[#111] rounded font-mono-tech font-bold text-[11px] flex items-center gap-1">
                                    VERIFIED <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  </span>
                                </div>

                                <h3 className="font-display font-extrabold text-base sm:text-lg text-[#111] dark:text-white leading-tight">
                                  {item.title}
                                </h3>
                                <p className="font-mono-tech text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed line-clamp-2">
                                  {item.description}
                                </p>

                                <button
                                  onClick={() => setActivePreview({
                                    title: item.title,
                                    categoryOrTag: item.category,
                                    desc: item.description,
                                    imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=900&q=80',
                                    accent: item.accent,
                                    badge: item.badge,
                                    issuer: item.issuer,
                                    year: item.year
                                  })}
                                  className="inline-flex items-center gap-1 text-[11px] font-mono-tech font-bold text-[#2563eb] dark:text-[#38bdf8] hover:underline pt-1 cursor-pointer"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>{lang === 'en' ? 'Inspect Award / Preview →' : 'Lihat Piagam / Prestasi →'}</span>
                                </button>
                              </div>
                            </div>
                          ))}

                          {/* Sub-slide pagination for Prestasi */}
                          {totalPrestasiPages > 1 && (
                            <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-700">
                              <button
                                onClick={() => setPrestasiPage(p => Math.max(0, p - 1))}
                                disabled={prestasiPage === 0}
                                className="px-3 py-1.5 bg-white dark:bg-neutral-800 border-2 border-[#111] rounded text-xs font-mono-tech font-bold neo-shadow-sm neo-btn-grand disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                                <span>{t.achievements.prev}</span>
                              </button>
                              <span className="text-xs font-mono-tech font-bold text-neutral-500">
                                {lang === 'en' ? `Page ${prestasiPage + 1} of ${totalPrestasiPages}` : `Halaman ${prestasiPage + 1} dari ${totalPrestasiPages}`}
                              </span>
                              <button
                                onClick={() => setPrestasiPage(p => Math.min(totalPrestasiPages - 1, p + 1))}
                                disabled={prestasiPage >= totalPrestasiPages - 1}
                                className="px-3 py-1.5 bg-[#2563eb] text-white border-2 border-[#111] rounded text-xs font-mono-tech font-extrabold neo-shadow-sm neo-btn-grand disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                              >
                                <span>{t.achievements.next}</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Category 1: SERTIFIKAT (Sub-paginated 2 per slide) */}
                  {blogSlide === 1 && (
                    <div className="space-y-4 animate-slide-right">
                      {currentSertifikat.length === 0 ? (
                        <div className="p-8 text-center bg-[#f6f5f0] dark:bg-neutral-800/60 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700">
                          <p className="font-mono-tech text-xs text-neutral-500">
                            {lang === 'en' ? 'No certificates logged yet.' : 'Belum ada data sertifikat.'}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3.5">
                          {currentSertifikat.map((item) => (
                            <div
                              key={item.id}
                              className="bg-white dark:bg-neutral-800/90 border-2 border-[#111] rounded-xl p-4 sm:p-5 neo-shadow neo-card-grand flex flex-col sm:flex-row items-start sm:items-center gap-4"
                            >
                              {/* Dedicated Image Preview Thumbnail */}
                              <div
                                onClick={() => setActivePreview({
                                  title: item.title,
                                  categoryOrTag: item.category,
                                  desc: item.description,
                                  imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=900&q=80',
                                  accent: item.accent,
                                  badge: item.badge,
                                  issuer: item.issuer,
                                  year: item.year
                                })}
                                className="relative w-full sm:w-44 h-36 sm:h-28 shrink-0 rounded-lg border-2 border-[#111] overflow-hidden group/ach cursor-pointer bg-neutral-100 dark:bg-neutral-900 select-none"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={item.imageUrl || 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=900&q=80'}
                                  alt={item.title}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover/ach:scale-105"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=900&q=80';
                                  }}
                                />
                                <div className="absolute inset-0 bg-[#111]/30 opacity-0 group-hover/ach:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="px-2.5 py-1 bg-white text-[#111] text-[10px] font-mono-tech font-extrabold rounded border border-[#111] flex items-center gap-1 shadow-sm">
                                    <Eye className="w-3 h-3" />
                                    <span>{lang === 'en' ? 'Preview' : 'Lihat'}</span>
                                  </span>
                                </div>
                              </div>

                              {/* Content Details */}
                              <div className="flex-1 space-y-1.5 w-full">
                                <div className="flex flex-wrap items-center justify-between gap-2">
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

                                  <span className="px-2.5 py-1 bg-[#f6f5f0] dark:bg-neutral-900 border border-[#111] rounded font-mono-tech font-bold text-[11px] flex items-center gap-1">
                                    VERIFIED <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  </span>
                                </div>

                                <h3 className="font-display font-extrabold text-base sm:text-lg text-[#111] dark:text-white leading-tight">
                                  {item.title}
                                </h3>
                                <p className="font-mono-tech text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed line-clamp-2">
                                  {item.description}
                                </p>

                                <button
                                  onClick={() => setActivePreview({
                                    title: item.title,
                                    categoryOrTag: item.category,
                                    desc: item.description,
                                    imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=900&q=80',
                                    accent: item.accent,
                                    badge: item.badge,
                                    issuer: item.issuer,
                                    year: item.year
                                  })}
                                  className="inline-flex items-center gap-1 text-[11px] font-mono-tech font-bold text-[#2563eb] dark:text-[#38bdf8] hover:underline pt-1 cursor-pointer"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>{lang === 'en' ? 'Inspect Certificate / Preview →' : 'Lihat Dokumen / Sertifikat →'}</span>
                                </button>
                              </div>
                            </div>
                          ))}

                          {/* Sub-slide pagination for Sertifikat */}
                          {totalSertifikatPages > 1 && (
                            <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-700">
                              <button
                                onClick={() => setSertifikatPage(p => Math.max(0, p - 1))}
                                disabled={sertifikatPage === 0}
                                className="px-3 py-1.5 bg-white dark:bg-neutral-800 border-2 border-[#111] rounded text-xs font-mono-tech font-bold neo-shadow-sm neo-btn-grand disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                                <span>{t.achievements.prev}</span>
                              </button>
                              <span className="text-xs font-mono-tech font-bold text-neutral-500">
                                {lang === 'en' ? `Page ${sertifikatPage + 1} of ${totalSertifikatPages}` : `Halaman ${sertifikatPage + 1} dari ${totalSertifikatPages}`}
                              </span>
                              <button
                                onClick={() => setSertifikatPage(p => Math.min(totalSertifikatPages - 1, p + 1))}
                                disabled={sertifikatPage >= totalSertifikatPages - 1}
                                className="px-3 py-1.5 bg-[#2563eb] text-white border-2 border-[#111] rounded text-xs font-mono-tech font-extrabold neo-shadow-sm neo-btn-grand disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                              >
                                <span>{t.achievements.next}</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Category 2: ARTIKEL (Internally scrollable container for rich archives) */}
                  {blogSlide === 2 && (
                    <div className="animate-slide-right">
                      {artikelItems.length === 0 ? (
                        <div className="p-8 text-center bg-[#f6f5f0] dark:bg-neutral-800/60 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700">
                          <p className="font-mono-tech text-xs text-neutral-500">
                            {lang === 'en' ? 'No published articles yet.' : 'Belum ada artikel yang dipublikasikan.'}
                          </p>
                        </div>
                      ) : (
                        <div 
                          className="space-y-3.5 max-h-[350px] sm:max-h-[380px] overflow-y-auto neo-scrollbar pr-1.5"
                          data-scrollable="true"
                        >
                          {artikelItems.map((item) => (
                            <div
                              key={item.id}
                              className="bg-white dark:bg-neutral-800/90 border-2 border-[#111] rounded-xl p-4 sm:p-5 neo-shadow neo-card-grand flex flex-col sm:flex-row items-start sm:items-center gap-4"
                            >
                              {/* Thumbnail */}
                              <div
                                onClick={() => setActivePreview({
                                  title: item.title,
                                  categoryOrTag: item.category,
                                  desc: item.description,
                                  imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80',
                                  accent: item.accent,
                                  badge: item.badge,
                                  issuer: item.issuer,
                                  year: item.year
                                })}
                                className="relative w-full sm:w-44 h-36 sm:h-28 shrink-0 rounded-lg border-2 border-[#111] overflow-hidden group/ach cursor-pointer bg-neutral-100 dark:bg-neutral-900 select-none"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={item.imageUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80'}
                                  alt={item.title}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover/ach:scale-105"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80';
                                  }}
                                />
                                <div className="absolute inset-0 bg-[#111]/30 opacity-0 group-hover/ach:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="px-2.5 py-1 bg-white text-[#111] text-[10px] font-mono-tech font-extrabold rounded border border-[#111] flex items-center gap-1 shadow-sm">
                                    <Eye className="w-3 h-3" />
                                    <span>{lang === 'en' ? 'Preview' : 'Lihat'}</span>
                                  </span>
                                </div>
                              </div>

                              {/* Details */}
                              <div className="flex-1 space-y-1.5 w-full">
                                <div className="flex flex-wrap items-center justify-between gap-2">
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
                                </div>

                                <h3 className="font-display font-extrabold text-base sm:text-lg text-[#111] dark:text-white leading-tight">
                                  {item.title}
                                </h3>
                                <p className="font-mono-tech text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                                  {item.description}
                                </p>

                                <button
                                  onClick={() => setActivePreview({
                                    title: item.title,
                                    categoryOrTag: item.category,
                                    desc: item.description,
                                    imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80',
                                    accent: item.accent,
                                    badge: item.badge,
                                    issuer: item.issuer,
                                    year: item.year
                                  })}
                                  className="inline-flex items-center gap-1 text-[11px] font-mono-tech font-bold text-[#2563eb] dark:text-[#38bdf8] hover:underline pt-1 cursor-pointer"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>{lang === 'en' ? 'Read Article / Preview →' : 'Baca Artikel / Pratinjau →'}</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Slide Switcher */}
                <div className="pt-5 mt-5 border-t-2 border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                  <button
                    onClick={() => setBlogSlide(prev => Math.max(0, prev - 1))}
                    disabled={blogSlide === 0}
                    className="px-4 py-2 bg-white dark:bg-neutral-800 border-2 border-[#111] rounded font-mono-tech font-bold text-xs neo-shadow neo-btn-grand disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>{t.achievements.prev}</span>
                  </button>

                  <div className="text-xs font-mono-tech font-extrabold text-neutral-500">
                    {lang === 'en' ? 'CATEGORY' : 'KATEGORI'} {blogSlide + 1} {lang === 'en' ? 'OF' : 'DARI'} 3
                  </div>

                  <button
                    onClick={() => setBlogSlide(prev => Math.min(2, prev + 1))}
                    disabled={blogSlide === 2}
                    className="px-4 py-2 bg-[#2563eb] text-white border-2 border-[#111] rounded font-mono-tech font-extrabold text-xs neo-shadow neo-btn-grand disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{t.achievements.next}</span>
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
                <div className="inline-block px-3 py-1 bg-[#fde047] text-[#111] font-mono-tech font-extrabold text-xs rounded border border-[#111] mb-2">
                  {t.contact.tag}
                </div>
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl mb-2">{t.contact.title}</h2>
                <p className="font-mono-tech text-xs text-neutral-600 dark:text-neutral-300 mb-6">
                  {t.contact.lead}
                </p>

                {contactSent ? (
                  <div className="p-6 bg-[#a7f3d0] text-[#111] border-2 border-[#111] rounded-lg text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-700" />
                    <h3 className="font-display font-extrabold text-xl">{t.contact.form.successTitle}</h3>
                    <p className="font-mono-tech text-xs">{t.contact.form.successDesc}</p>
                    <button
                      onClick={() => setContactSent(false)}
                      className="px-4 py-2 bg-white border-2 border-[#111] font-mono-tech font-bold text-xs rounded neo-shadow neo-btn-grand cursor-pointer"
                    >
                      {lang === 'en' ? 'TRANSMIT ANOTHER' : 'KIRIM PESAN LAIN'}
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!contactName || !contactEmail || !contactMessage) return;
                      setIsSubmittingContact(true);
                      try {
                        await fetch('/api/contact', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            name: contactName,
                            email: contactEmail,
                            message: contactMessage,
                          }),
                        });
                        setContactSent(true);
                        setContactName('');
                        setContactEmail('');
                        setContactMessage('');
                      } catch {
                        setContactSent(true);
                      } finally {
                        setIsSubmittingContact(false);
                      }
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block font-mono-tech text-xs font-bold mb-1">{t.contact.form.name}</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder={t.contact.form.namePlaceholder}
                        className="w-full px-3.5 py-2.5 bg-[#f6f5f0] dark:bg-neutral-800 border-2 border-[#111] rounded font-mono-tech text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono-tech text-xs font-bold mb-1">{t.contact.form.email}</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder={t.contact.form.emailPlaceholder}
                        className="w-full px-3.5 py-2.5 bg-[#f6f5f0] dark:bg-neutral-800 border-2 border-[#111] rounded font-mono-tech text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-mono-tech text-xs font-bold mb-1">{t.contact.form.message}</label>
                      <textarea
                        rows={3}
                        required
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder={t.contact.form.messagePlaceholder}
                        className="w-full px-3.5 py-2.5 bg-[#f6f5f0] dark:bg-neutral-800 border-2 border-[#111] rounded font-mono-tech text-xs focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmittingContact}
                      className="w-full py-3 bg-[#2563eb] text-white font-mono-tech font-extrabold text-xs tracking-wider rounded border-2 border-[#111] neo-shadow neo-btn-grand flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmittingContact ? (lang === 'en' ? 'TRANSMITTING...' : 'MENGIRIM...') : t.contact.form.send}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

        </main>

        {/* Subtle Bottom Helper Bar */}
        <footer className={`w-full max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between text-[11px] font-mono-tech text-neutral-500 z-20 transition-opacity duration-500 ${
          isReady ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {t.footer.canvasHint}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={replayIntro}
              className="inline-flex items-center gap-1.5 hover:text-[#111] dark:hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t.footer.replayIntro}</span>
            </button>
          </div>
        </footer>
      </div>

      {/* Mobile Bottom Navigation Bar (< 768px) */}
      {isReady && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#18191c]/95 backdrop-blur-md border-t-2 border-[#111] dark:border-neutral-700 py-1.5 px-3 flex md:hidden items-center justify-around neo-shadow">
          {[
            { id: 'HOME' as const, label: t.nav.home, icon: Home },
            { id: 'ABOUT' as const, label: t.nav.about, icon: Sparkles },
            { id: 'WORKS' as const, label: t.nav.works, icon: Menu },
            { id: 'BLOG' as const, label: t.nav.achievements, icon: Award },
            { id: 'CONTACT' as const, label: t.nav.contact, icon: Mail },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center min-w-[54px] min-h-[46px] px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-[#38bdf8] text-[#111] font-extrabold border-2 border-[#111] neo-shadow-sm scale-105'
                    : 'text-neutral-600 dark:text-neutral-400 font-bold hover:text-[#111] dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 stroke-[2.5]" />
                <span className="text-[9px] font-mono-tech mt-0.5 tracking-tight font-extrabold">{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Floating Minimizeable WhatsApp Widget (Visible only after intro finishes) */}
      {isReady && (
        <WhatsAppWidget 
          phoneNumber={data.profile.whatsapp} 
          name={data.profile.fullName} 
          lang={lang}
        />
      )}

      {/* Full-view Neo-Brutalist Lightbox / Preview Modal */}
      <ImagePreviewModal
        data={activePreview}
        onClose={() => setActivePreview(null)}
        lang={lang}
      />

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={activeProjectDetail}
        onClose={() => setActiveProjectDetail(null)}
        lang={lang}
        onEnlargeImage={(preview) => setActivePreview(preview)}
      />

    </div>
  );
}
