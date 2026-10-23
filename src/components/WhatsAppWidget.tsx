'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, ChevronDown, Check } from 'lucide-react';
import { Language, translations } from '@/lib/translations';

interface WhatsAppWidgetProps {
  phoneNumber: string;
  name: string;
  lang?: Language;
}

export default function WhatsAppWidget({ phoneNumber, name, lang = 'id' }: WhatsAppWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = translations[lang].whatsapp;
  const [customMsg, setCustomMsg] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(t.topics[0].id);

  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');

  const handleSend = (textToSend?: string) => {
    const text = textToSend || customMsg || t.topics[0].text;
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-20 md:bottom-5 right-4 sm:right-5 z-[90] font-mono-tech select-none">
      {/* Expanded Chat Box Popup */}
      {isOpen && (
        <div className="mb-3 w-[310px] sm:w-[350px] bg-white dark:bg-[#1f2127] text-[#111] dark:text-white border-2 border-[#111] dark:border-neutral-400 rounded-2xl neo-shadow-lg overflow-hidden animate-pop-in">
          {/* Header */}
          <div className="p-4 bg-[#25D366] text-[#111] border-b-2 border-[#111] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-[#111] flex items-center justify-center font-display font-extrabold text-sm text-[#111]">
                  RA
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-700 border-2 border-white rounded-full" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-sm leading-tight text-[#111]">
                  {name}
                </h3>
                <p className="text-[10px] font-bold opacity-80">
                  {t.headerStatus}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/80 hover:bg-white text-[#111] border border-[#111] flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
              title="Minimize"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 space-y-3 bg-[#f6f5f0] dark:bg-[#18191c]">
            {/* Speech Bubble */}
            <div className="p-3 bg-white dark:bg-neutral-800 border-2 border-[#111] rounded-xl neo-shadow-sm text-xs leading-relaxed">
              <p className="font-bold flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.bubbleTitle}</span>
              </p>
              <p className="text-neutral-700 dark:text-neutral-300">
                {t.bubbleDesc}
              </p>
            </div>

            {/* Quick Templates */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                {t.topicLabel}
              </p>
              {t.topics.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedTopic(item.id);
                    setCustomMsg(item.text);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded border transition-all cursor-pointer flex items-center justify-between ${
                    selectedTopic === item.id
                      ? 'bg-[#25D366]/20 border-emerald-600 text-emerald-800 dark:text-emerald-300 font-bold'
                      : 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-[#111]'
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  {selectedTopic === item.id && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              ))}
            </div>

            {/* Input & Send Button */}
            <div className="space-y-2 pt-1">
              <textarea
                rows={2}
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder={t.topics[0].text}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border-2 border-[#111] rounded-lg text-xs font-mono-tech focus:outline-none"
              />

              <button
                onClick={() => handleSend()}
                className="w-full py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-[#111] font-extrabold text-xs tracking-wider rounded-lg border-2 border-[#111] neo-shadow neo-btn flex items-center justify-center gap-2 cursor-pointer transition-transform"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t.sendButton}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trigger Floating Button (Always Visible or Collapsed) */}
      <div className="flex items-center justify-end">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Chat WhatsApp"
          className="group relative flex items-center gap-2.5 px-3.5 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-[#111] border-2 border-[#111] rounded-full neo-shadow hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          {/* Animated pulsing indicator */}
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-900" />
          </span>

          {/* WhatsApp Custom SVG Icon */}
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.06 7.42C8.89 7.42 8.62 7.48 8.39 7.73C8.16 7.98 7.5 8.6 7.5 9.87C7.5 11.14 8.42 12.37 8.56 12.55C8.7 12.72 10.34 15.39 12.92 16.41C15.07 17.26 15.51 17.09 15.97 17.05C16.43 17.01 17.45 16.44 17.66 15.86C17.87 15.27 17.87 14.77 17.8 14.66C17.74 14.56 17.58 14.5 17.33 14.37C17.08 14.25 15.86 13.65 15.63 13.57C15.41 13.48 15.24 13.44 15.08 13.69C14.91 13.94 14.43 14.5 14.28 14.67C14.14 14.83 14 14.86 13.75 14.73C13.5 14.6 12.44 14.25 11.19 13.13C10.22 12.26 9.56 11.19 9.43 10.97C9.31 10.74 9.42 10.62 9.54 10.5C9.65 10.39 9.79 10.21 9.92 10.06C10.05 9.91 10.09 9.8 10.18 9.63C10.26 9.46 10.22 9.32 10.15 9.2C10.09 9.07 9.6 7.84 9.38 7.34C9.18 6.86 8.97 6.92 8.81 6.91C8.66 6.91 8.49 6.91 8.32 6.91L9.06 7.42Z"/>
          </svg>

          <span className="font-extrabold text-xs hidden sm:inline-block">
            {isOpen ? (lang === 'en' ? 'Close' : 'Tutup') : (lang === 'en' ? 'Chat WhatsApp' : 'Chat WhatsApp')}
          </span>
        </button>
      </div>
    </div>
  );
}
