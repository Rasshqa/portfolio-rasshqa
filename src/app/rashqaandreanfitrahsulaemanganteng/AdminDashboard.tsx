'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Database, 
  Save, 
  ExternalLink, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Layers,
  Code2,
  Award,
  User,
  Sun,
  Moon
} from 'lucide-react';
import { PortfolioData, initialPortfolioData, ProjectItem, AchievementItem } from '@/lib/data';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isDark, setIsDark] = useState(false);

  const [activeTab, setActiveTab] = useState<'PROFILE' | 'ABOUT' | 'PROJECTS' | 'ACHIEVEMENTS' | 'TECH'>('PROFILE');
  const [formData, setFormData] = useState<PortfolioData>(initialPortfolioData);
  const [isNeonConnected, setIsNeonConnected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load existing data on mount
  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setFormData(res.data);
          setIsNeonConnected(res.isNeonConnected);
        }
      })
      .catch(err => console.warn('Could not load data:', err));
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() !== '020709') {
      setAuthError('PIN salah. Akses ditolak.');
      return;
    }
    setIsAuthenticated(true);
    setAuthError('');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: '020709', data: formData })
      });
      const json = await res.json();
      if (json.success) {
        setStatusMessage({ type: 'success', text: json.message || 'Perubahan berhasil disimpan dan disinkronkan!' });
        setIsNeonConnected(json.isNeonConnected);
      } else {
        setStatusMessage({ type: 'error', text: json.message || 'Gagal menyimpan perubahan.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'Terjadi kesalahan jaringan.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`${isDark ? 'dark' : ''} min-h-screen bg-[#f6f5f0] dark:bg-[#121316] text-[#111] dark:text-[#f6f5f0] font-mono-tech transition-colors duration-200`}>
      
      {/* Top Admin Header */}
      <header className="border-b-2 border-[#111] dark:border-neutral-700 bg-white dark:bg-[#1a1b1f] px-6 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2563eb] text-white flex items-center justify-center border-2 border-[#111] neo-shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-xl leading-none">
                PANEL ADMIN RASHQA
              </h1>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                Rute Rahasia Pengaturan Portofolio &amp; Database Neon
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Neon Status Badge */}
            <div className={`px-3 py-1 text-xs font-extrabold rounded border-2 border-[#111] flex items-center gap-1.5 ${
              isNeonConnected ? 'bg-[#a7f3d0] text-[#064e3b]' : 'bg-[#fef08a] text-[#854d0e]'
            }`}>
              <Database className="w-3.5 h-3.5" />
              <span>{isNeonConnected ? 'Neon DB Terhubung' : 'Penyimpanan Lokal'}</span>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-2 border-[#111] neo-shadow-sm cursor-pointer"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Back to Home Link */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-[#fde047] text-[#111] border-2 border-[#111] rounded-lg text-xs font-bold neo-shadow-sm neo-btn flex items-center gap-1.5 cursor-pointer"
            >
              <span>Lihat Web Utama</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto p-6">
        
        {/* LOGIN GATE */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto my-16 bg-white dark:bg-[#1a1b1f] border-2 border-[#111] dark:border-neutral-600 rounded-2xl p-8 neo-shadow-lg text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#fde047] border-2 border-[#111] neo-shadow mx-auto flex items-center justify-center mb-5">
              <Lock className="w-8 h-8 text-[#111]" />
            </div>
            <h2 className="font-display font-extrabold text-2xl mb-2">Autentikasi Master PIN</h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6">
              Halaman ini dilindungi secara ketat. Masukkan PIN tanggal lahir kamu untuk membuka konsol pengelolaan:
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Masukkan 6 digit PIN..."
                className="w-full px-4 py-3 bg-[#f6f5f0] dark:bg-neutral-800 border-2 border-[#111] rounded-xl text-center text-lg tracking-widest font-mono-tech focus:outline-none"
                autoFocus
              />

              {authError && (
                <p className="text-red-500 text-xs font-bold">{authError}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#2563eb] text-white font-extrabold text-xs tracking-wider rounded-xl border-2 border-[#111] neo-shadow neo-btn cursor-pointer"
              >
                BUKA KONSOL ADMIN
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED DASHBOARD */
          <div className="space-y-6 animate-pop-in">
            
            {/* Action & Status Notification Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#1a1b1f] border-2 border-[#111] rounded-xl p-4 neo-shadow">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold">
                  Sesi Admin Aktif • Siap Menyimpan ke {isNeonConnected ? 'Neon Cloud' : 'Data Lokal'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-extrabold text-xs tracking-wider rounded-lg border-2 border-[#111] neo-shadow neo-btn flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}</span>
                </button>
              </div>
            </div>

            {statusMessage && (
              <div className={`p-4 rounded-xl border-2 border-[#111] neo-shadow flex items-center gap-3 text-xs font-bold ${
                statusMessage.type === 'success' ? 'bg-[#a7f3d0] text-[#064e3b]' : 'bg-[#fecaca] text-[#7f1d1d]'
              }`}>
                {statusMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                <span>{statusMessage.text}</span>
              </div>
            )}

            {/* Customization Navigation Tabs */}
            <div className="flex items-center gap-2 border-b-2 border-[#111] pb-1 overflow-x-auto">
              {[
                { id: 'PROFILE', label: '1. Profil & Kontak', icon: User },
                { id: 'ABOUT', label: '2. Cerita & Filosofi', icon: Sparkles },
                { id: 'PROJECTS', label: '3. Proyek (Works)', icon: Layers },
                { id: 'ACHIEVEMENTS', label: '4. Prestasi & Sertifikat', icon: Award },
                { id: 'TECH', label: '5. Tech Stack', icon: Code2 },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl border-2 border-b-0 border-[#111] transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#2563eb] text-white -mb-[2px] shadow'
                        : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB PANELS */}
            <div className="bg-white dark:bg-[#1a1b1f] border-2 border-[#111] rounded-2xl p-6 sm:p-8 neo-shadow-lg">
              
              {/* TAB 1: PROFILE */}
              {activeTab === 'PROFILE' && (
                <div className="space-y-6">
                  <h3 className="font-display font-extrabold text-xl pb-2 border-b border-neutral-200 dark:border-neutral-700">
                    Informasi Profil &amp; Identitas Utama
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1">Nama Lengkap</label>
                      <input
                        type="text"
                        value={formData.profile.fullName}
                        onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, fullName: e.target.value } })}
                        className="w-full px-3 py-2.5 bg-[#f6f5f0] dark:bg-neutral-800 border-2 border-[#111] rounded-lg text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Nama Singkat / Display Hero</label>
                      <input
                        type="text"
                        value={formData.profile.nickName}
                        onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, nickName: e.target.value } })}
                        className="w-full px-3 py-2.5 bg-[#f6f5f0] dark:bg-neutral-800 border-2 border-[#111] rounded-lg text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1">Profesi Utama (Badge)</label>
                      <input
                        type="text"
                        value={formData.profile.role}
                        onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, role: e.target.value } })}
                        className="w-full px-3 py-2.5 bg-[#f6f5f0] dark:bg-neutral-800 border-2 border-[#111] rounded-lg text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Headline Sapaan</label>
                      <input
                        type="text"
                        value={formData.profile.headline}
                        onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, headline: e.target.value } })}
                        className="w-full px-3 py-2.5 bg-[#f6f5f0] dark:bg-neutral-800 border-2 border-[#111] rounded-lg text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Deskripsi Bio Singkat (Hero)</label>
                    <textarea
                      rows={3}
                      value={formData.profile.bio}
                      onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, bio: e.target.value } })}
                      className="w-full px-3 py-2.5 bg-[#f6f5f0] dark:bg-neutral-800 border-2 border-[#111] rounded-lg text-xs font-bold"
                    />
                  </div>

                  {/* Photo Customization with Instant Preview */}
                  <div className="p-4 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border-2 border-[#111]">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div className="flex-1 min-w-[260px]">
                        <label className="block text-xs font-bold mb-1">
                          Foto Asli Profil (Path di folder public atau URL)
                        </label>
                        <input
                          type="text"
                          value={formData.profile.photoUrl || ''}
                          onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, photoUrl: e.target.value } })}
                          placeholder="Contoh: /rashqa.jpg atau https://..."
                          className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border-2 border-[#111] rounded-lg text-xs font-bold"
                        />
                        <p className="text-[11px] text-neutral-500 mt-1">
                          Tips: Taruh file fotomu di <code>portfolio-rasshqa/public/rashqa.jpg</code>, lalu ketik <code>/rashqa.jpg</code>. Kosongkan jika ingin memakai karakter anime/vektor retro.
                        </p>
                      </div>

                      {formData.profile.photoUrl && (
                        <div className="w-20 h-24 rounded-lg border-2 border-[#111] overflow-hidden bg-neutral-900 flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={formData.profile.photoUrl}
                            alt="Preview Foto"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Social & Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold mb-1">Nomor WhatsApp</label>
                      <input
                        type="text"
                        value={formData.profile.whatsapp}
                        onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, whatsapp: e.target.value } })}
                        className="w-full px-3 py-2 bg-[#f6f5f0] dark:bg-neutral-800 border-2 border-[#111] rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Email</label>
                      <input
                        type="email"
                        value={formData.profile.email}
                        onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, email: e.target.value } })}
                        className="w-full px-3 py-2 bg-[#f6f5f0] dark:bg-neutral-800 border-2 border-[#111] rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Lokasi</label>
                      <input
                        type="text"
                        value={formData.profile.location}
                        onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, location: e.target.value } })}
                        className="w-full px-3 py-2 bg-[#f6f5f0] dark:bg-neutral-800 border-2 border-[#111] rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">GitHub URL</label>
                      <input
                        type="text"
                        value={formData.profile.github}
                        onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, github: e.target.value } })}
                        className="w-full px-3 py-2 bg-[#f6f5f0] dark:bg-neutral-800 border-2 border-[#111] rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">LinkedIn URL</label>
                      <input
                        type="text"
                        value={formData.profile.linkedin}
                        onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, linkedin: e.target.value } })}
                        className="w-full px-3 py-2 bg-[#f6f5f0] dark:bg-neutral-800 border-2 border-[#111] rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Instagram URL</label>
                      <input
                        type="text"
                        value={formData.profile.instagram}
                        onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, instagram: e.target.value } })}
                        className="w-full px-3 py-2 bg-[#f6f5f0] dark:bg-neutral-800 border-2 border-[#111] rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">TikTok URL</label>
                      <input
                        type="text"
                        value={formData.profile.tiktok}
                        onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, tiktok: e.target.value } })}
                        className="w-full px-3 py-2 bg-[#f6f5f0] dark:bg-neutral-800 border-2 border-[#111] rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Pengalaman (Stats)</label>
                      <input
                        type="text"
                        value={formData.profile.stats.experience}
                        onChange={(e) => setFormData({
                          ...formData,
                          profile: {
                            ...formData.profile,
                            stats: { ...formData.profile.stats, experience: e.target.value }
                          }
                        })}
                        className="w-full px-3 py-2 bg-[#f6f5f0] dark:bg-neutral-800 border-2 border-[#111] rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Total Proyek Selesai</label>
                      <input
                        type="text"
                        value={formData.profile.stats.projects}
                        onChange={(e) => setFormData({
                          ...formData,
                          profile: {
                            ...formData.profile,
                            stats: { ...formData.profile.stats, projects: e.target.value }
                          }
                        })}
                        className="w-full px-3 py-2 bg-[#f6f5f0] dark:bg-neutral-800 border-2 border-[#111] rounded text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ABOUT STORY & PILLARS */}
              {activeTab === 'ABOUT' && (
                <div className="space-y-6">
                  <h3 className="font-display font-extrabold text-xl pb-2 border-b border-neutral-200 dark:border-neutral-700">
                    Cerita &amp; Filosofi Arsitektur (Slide About Me)
                  </h3>

                  <div>
                    <label className="block text-xs font-bold mb-1">Judul Utama Halaman About</label>
                    <input
                      type="text"
                      value={formData.aboutStory.heading}
                      onChange={(e) => setFormData({
                        ...formData,
                        aboutStory: { ...formData.aboutStory, heading: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-[#f6f5f0] dark:bg-neutral-800 border-2 border-[#111] rounded text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Paragraf Pembuka (Lead)</label>
                    <textarea
                      rows={2}
                      value={formData.aboutStory.lead}
                      onChange={(e) => setFormData({
                        ...formData,
                        aboutStory: { ...formData.aboutStory, lead: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-[#f6f5f0] dark:bg-neutral-800 border-2 border-[#111] rounded text-xs font-bold"
                    />
                  </div>

                  {/* 3 Pillars */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#2563eb]">
                      3 Pilar Keahlian &amp; Arsitektur
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {formData.aboutStory.pillars.map((pillar, idx) => (
                        <div key={idx} className="p-4 bg-neutral-50 dark:bg-neutral-800 border-2 border-[#111] rounded-xl space-y-2">
                          <label className="block text-[11px] font-bold">Judul Pilar #{idx + 1}</label>
                          <input
                            type="text"
                            value={pillar.title}
                            onChange={(e) => {
                              const updated = [...formData.aboutStory.pillars];
                              updated[idx].title = e.target.value;
                              setFormData({
                                ...formData,
                                aboutStory: { ...formData.aboutStory, pillars: updated }
                              });
                            }}
                            className="w-full px-2 py-1.5 bg-white dark:bg-neutral-900 border border-[#111] rounded text-xs font-bold"
                          />
                          <label className="block text-[11px] font-bold">Deskripsi Pilar</label>
                          <textarea
                            rows={3}
                            value={pillar.desc}
                            onChange={(e) => {
                              const updated = [...formData.aboutStory.pillars];
                              updated[idx].desc = e.target.value;
                              setFormData({
                                ...formData,
                                aboutStory: { ...formData.aboutStory, pillars: updated }
                              });
                            }}
                            className="w-full px-2 py-1.5 bg-white dark:bg-neutral-900 border border-[#111] rounded text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PROJECTS */}
              {activeTab === 'PROJECTS' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-700">
                    <div>
                      <h3 className="font-display font-extrabold text-xl">Daftar Proyek Portofolio</h3>
                      <p className="text-xs text-neutral-500">Ditampilkan 4 proyek per slide halaman</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const newProject: ProjectItem = {
                          id: `proj-${Date.now()}`,
                          title: 'Proyek Kustom Baru',
                          tag: 'NEXT.JS • GOLANG',
                          desc: 'Deskripsi singkat fungsionalitas dan arsitektur proyek ini...',
                          metrics: 'High Performance API',
                          accent: '#38bdf8',
                          imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80',
                          liveUrl: 'https://github.com/rasshqa',
                          githubUrl: 'https://github.com/rasshqa'
                        };
                        setFormData({ ...formData, projects: [newProject, ...formData.projects] });
                      }}
                      className="px-4 py-2 bg-[#a7f3d0] text-[#111] border-2 border-[#111] rounded-lg text-xs font-bold flex items-center gap-1.5 neo-shadow-sm neo-btn cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Proyek Baru</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.projects.map((proj, idx) => (
                      <div key={proj.id} className="p-4 bg-neutral-50 dark:bg-neutral-800/90 border-2 border-[#111] rounded-xl neo-shadow space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 bg-[#2563eb] text-white rounded text-xs font-extrabold">
                            PROYEK #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                projects: formData.projects.filter(p => p.id !== proj.id)
                              });
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            title="Hapus Proyek"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold">Judul Proyek</label>
                            <input
                              type="text"
                              value={proj.title}
                              onChange={(e) => {
                                const updated = [...formData.projects];
                                updated[idx].title = e.target.value;
                                setFormData({ ...formData, projects: updated });
                              }}
                              className="w-full px-2.5 py-1.5 bg-white dark:bg-neutral-900 border border-[#111] rounded text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold">Tech Tags (Pisahkan dengan •)</label>
                            <input
                              type="text"
                              value={proj.tag}
                              onChange={(e) => {
                                const updated = [...formData.projects];
                                updated[idx].tag = e.target.value;
                                setFormData({ ...formData, projects: updated });
                              }}
                              className="w-full px-2.5 py-1.5 bg-white dark:bg-neutral-900 border border-[#111] rounded text-xs font-bold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold">Deskripsi</label>
                          <textarea
                            rows={2}
                            value={proj.desc}
                            onChange={(e) => {
                              const updated = [...formData.projects];
                              updated[idx].desc = e.target.value;
                              setFormData({ ...formData, projects: updated });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white dark:bg-neutral-900 border border-[#111] rounded text-xs"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold">Live Preview Link</label>
                            <input
                              type="text"
                              value={proj.liveUrl || ''}
                              onChange={(e) => {
                                const updated = [...formData.projects];
                                updated[idx].liveUrl = e.target.value;
                                setFormData({ ...formData, projects: updated });
                              }}
                              className="w-full px-2.5 py-1.5 bg-white dark:bg-neutral-900 border border-[#111] rounded text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold">GitHub Repository Link</label>
                            <input
                              type="text"
                              value={proj.githubUrl || ''}
                              onChange={(e) => {
                                const updated = [...formData.projects];
                                updated[idx].githubUrl = e.target.value;
                                setFormData({ ...formData, projects: updated });
                              }}
                              className="w-full px-2.5 py-1.5 bg-white dark:bg-neutral-900 border border-[#111] rounded text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold">Metrik / Highlights</label>
                            <input
                              type="text"
                              value={proj.metrics || ''}
                              onChange={(e) => {
                                const updated = [...formData.projects];
                                updated[idx].metrics = e.target.value;
                                setFormData({ ...formData, projects: updated });
                              }}
                              className="w-full px-2.5 py-1.5 bg-white dark:bg-neutral-900 border border-[#111] rounded text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold">URL Gambar Preview Proyek (Screenshot / Thumbnail)</label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              placeholder="https://images.unsplash.com/... atau tautan gambar"
                              value={proj.imageUrl || ''}
                              onChange={(e) => {
                                const updated = [...formData.projects];
                                updated[idx].imageUrl = e.target.value;
                                setFormData({ ...formData, projects: updated });
                              }}
                              className="w-full px-2.5 py-1.5 bg-white dark:bg-neutral-900 border border-[#111] rounded text-xs"
                            />
                            {proj.imageUrl && (
                              <div className="w-12 h-9 rounded border border-[#111] overflow-hidden shrink-0 bg-neutral-200">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={proj.imageUrl} alt="preview" className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: ACHIEVEMENTS */}
              {activeTab === 'ACHIEVEMENTS' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-700">
                    <div>
                      <h3 className="font-display font-extrabold text-xl">Prestasi, Sertifikat &amp; Artikel</h3>
                      <p className="text-xs text-neutral-500">Kelola pencapaian yang tampil di tab Achievements</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const newAch: AchievementItem = {
                          id: `ach-${Date.now()}`,
                          year: '2026',
                          title: 'Pencapaian Baru',
                          issuer: 'Lembaga / Penyelenggara',
                          category: 'PRESTASI',
                          description: 'Keterangan prestasi atau kompetisi...',
                          badge: 'AWARD',
                          accent: '#fde047',
                          imageUrl: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=900&q=80'
                        };
                        setFormData({ ...formData, achievements: [newAch, ...formData.achievements] });
                      }}
                      className="px-4 py-2 bg-[#fde047] text-[#111] border-2 border-[#111] rounded-lg text-xs font-bold flex items-center gap-1.5 neo-shadow-sm neo-btn cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Item Baru</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.achievements.map((item, idx) => (
                      <div key={item.id} className="p-4 bg-neutral-50 dark:bg-neutral-800 border-2 border-[#111] rounded-xl neo-shadow space-y-3">
                        <div className="flex items-center justify-between">
                          <select
                            value={item.category}
                            onChange={(e) => {
                              const updated = [...formData.achievements];
                              updated[idx].category = e.target.value as any;
                              setFormData({ ...formData, achievements: updated });
                            }}
                            className="px-2 py-1 bg-white dark:bg-neutral-900 border border-[#111] rounded text-xs font-bold"
                          >
                            <option value="PRESTASI">Kategori: PRESTASI</option>
                            <option value="SERTIFIKAT">Kategori: SERTIFIKAT</option>
                            <option value="ARTIKEL">Kategori: ARTIKEL</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                achievements: formData.achievements.filter(a => a.id !== item.id)
                              });
                            }}
                            className="p-1 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-bold">Judul</label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => {
                                const updated = [...formData.achievements];
                                updated[idx].title = e.target.value;
                                setFormData({ ...formData, achievements: updated });
                              }}
                              className="w-full px-2 py-1.5 bg-white dark:bg-neutral-900 border border-[#111] rounded text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold">Tahun / Penerbit</label>
                            <input
                              type="text"
                              value={item.year}
                              onChange={(e) => {
                                const updated = [...formData.achievements];
                                updated[idx].year = e.target.value;
                                setFormData({ ...formData, achievements: updated });
                              }}
                              className="w-full px-2 py-1.5 bg-white dark:bg-neutral-900 border border-[#111] rounded text-xs"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold">Badge Text</label>
                            <input
                              type="text"
                              value={item.badge}
                              onChange={(e) => {
                                const updated = [...formData.achievements];
                                updated[idx].badge = e.target.value;
                                setFormData({ ...formData, achievements: updated });
                              }}
                              className="w-full px-2 py-1.5 bg-white dark:bg-neutral-900 border border-[#111] rounded text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold">Warna Aksen Hex (contoh: #fde047)</label>
                            <input
                              type="text"
                              value={item.accent}
                              onChange={(e) => {
                                const updated = [...formData.achievements];
                                updated[idx].accent = e.target.value;
                                setFormData({ ...formData, achievements: updated });
                              }}
                              className="w-full px-2 py-1.5 bg-white dark:bg-neutral-900 border border-[#111] rounded text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold">Keterangan Deskripsi</label>
                          <textarea
                            rows={2}
                            value={item.description}
                            onChange={(e) => {
                              const updated = [...formData.achievements];
                              updated[idx].description = e.target.value;
                              setFormData({ ...formData, achievements: updated });
                            }}
                            className="w-full px-2 py-1.5 bg-white dark:bg-neutral-900 border border-[#111] rounded text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold">URL Gambar Preview (Sertifikat / Piagam / Dokumen)</label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              placeholder="https://images.unsplash.com/... atau tautan gambar"
                              value={item.imageUrl || ''}
                              onChange={(e) => {
                                const updated = [...formData.achievements];
                                updated[idx].imageUrl = e.target.value;
                                setFormData({ ...formData, achievements: updated });
                              }}
                              className="w-full px-2.5 py-1.5 bg-white dark:bg-neutral-900 border border-[#111] rounded text-xs"
                            />
                            {item.imageUrl && (
                              <div className="w-12 h-9 rounded border border-[#111] overflow-hidden shrink-0 bg-neutral-200">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={item.imageUrl} alt="preview" className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: TECH STACK */}
              {activeTab === 'TECH' && (
                <div className="space-y-6">
                  <h3 className="font-display font-extrabold text-xl pb-2 border-b border-neutral-200 dark:border-neutral-700">
                    Kategori &amp; Skill Tech Stack
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {formData.techStacks.map((group, gIdx) => (
                      <div key={group.category} className="p-4 bg-neutral-50 dark:bg-neutral-800 border-2 border-[#111] rounded-xl neo-shadow space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-neutral-300 dark:border-neutral-700">
                          <h4 className="font-display font-extrabold text-sm">{group.category}</h4>
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: group.color }} />
                        </div>

                        <div className="space-y-2">
                          {group.skills.map((skill, sIdx) => (
                            <div key={skill.name} className="p-2 bg-white dark:bg-neutral-900 border border-[#111] rounded flex items-center justify-between">
                              <span className="font-bold text-xs">{skill.name}</span>
                              <span className="text-[10px] px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded font-bold border border-neutral-300">
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
          </div>
        )}

      </main>
    </div>
  );
}
