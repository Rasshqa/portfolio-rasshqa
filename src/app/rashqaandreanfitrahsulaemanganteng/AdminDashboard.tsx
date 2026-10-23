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
  Moon,
  Upload,
  Mail,
  RefreshCw,
  Clock,
  ArrowUp,
  ArrowDown,
  Sliders,
  Play
} from 'lucide-react';
import { PortfolioData, initialPortfolioData, ProjectItem, AchievementItem } from '@/lib/data';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isDark, setIsDark] = useState(false);

  const [activeTab, setActiveTab] = useState<'INTRO' | 'PROFILE' | 'ABOUT' | 'PROJECTS' | 'ACHIEVEMENTS' | 'TECH' | 'MESSAGES'>('PROFILE');
  const [achievementFilter, setAchievementFilter] = useState<'ALL' | 'PRESTASI' | 'SERTIFIKAT' | 'ARTIKEL'>('ALL');
  const [formData, setFormData] = useState<PortfolioData>(initialPortfolioData);
  const [isNeonConnected, setIsNeonConnected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
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

  const loadMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const res = await fetch(`/api/contact?pin=${pinInput || '020709'}`);
      const json = await res.json();
      if (json.success) {
        setMessages(json.messages || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Hapus pesan ini dari Neon Database?')) return;
    try {
      await fetch('/api/contact', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput || '020709', id }),
      });
      setMessages(prev => prev.filter(m => m.id !== id));
      setStatusMessage({ type: 'success', text: 'Pesan berhasil dihapus dari database Neon.' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'Gagal menghapus pesan.' });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, onUrlReceived: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setStatusMessage(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: form,
      });
      const json = await res.json();
      if (json.success && json.url) {
        onUrlReceived(json.url);
        const optText = json.isWebp 
          ? ` • WebP terkompresi ${json.savings ? `(-${json.savings})` : ''}` 
          : '';
        setStatusMessage({
          type: 'success',
          text: `Gambar berhasil diunggah (${json.provider === 's3' ? 'AWS S3' : 'Lokal /uploads'}${optText})!`
        });
      } else {
        setStatusMessage({ type: 'error', text: json.message || 'Gagal mengunggah gambar.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'Terjadi kesalahan saat unggah gambar.' });
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

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
        setStatusMessage({ type: 'success', text: json.message || 'Perubahan berhasil disimpan dan disinkronkan ke Neon Postgres!' });
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

  // Reorder Projects
  const moveProject = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formData.projects.length) return;
    const updated = [...formData.projects];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setFormData({ ...formData, projects: updated });
  };

  // Reorder Achievements
  const moveAchievement = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formData.achievements.length) return;
    const updated = [...formData.achievements];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setFormData({ ...formData, achievements: updated });
  };

  // About Story Paragraphs
  const handleAddParagraph = () => {
    const updated = [...formData.aboutStory.paragraphs, 'Tulis paragraf cerita barumu di sini...'];
    setFormData({ ...formData, aboutStory: { ...formData.aboutStory, paragraphs: updated } });
  };

  const handleRemoveParagraph = (idx: number) => {
    const updated = formData.aboutStory.paragraphs.filter((_, i) => i !== idx);
    setFormData({ ...formData, aboutStory: { ...formData.aboutStory, paragraphs: updated } });
  };

  // Tech Stacks Skills
  const handleAddSkill = (groupIndex: number) => {
    const updated = [...formData.techStacks];
    updated[groupIndex].skills.push({ name: 'Skill Baru', level: 'Intermediate', icon: 'Code2' });
    setFormData({ ...formData, techStacks: updated });
  };

  const handleRemoveSkill = (groupIndex: number, skillIndex: number) => {
    const updated = [...formData.techStacks];
    updated[groupIndex].skills.splice(skillIndex, 1);
    setFormData({ ...formData, techStacks: updated });
  };

  const handleSkillChange = (groupIndex: number, skillIndex: number, field: 'name' | 'level', val: string) => {
    const updated = [...formData.techStacks];
    updated[groupIndex].skills[skillIndex][field] = val;
    setFormData({ ...formData, techStacks: updated });
  };

  // Filtered achievements for display in tab
  const displayedAchievements = formData.achievements.map((item, originalIdx) => ({ item, originalIdx }))
    .filter(({ item }) => achievementFilter === 'ALL' || item.category === achievementFilter);

  return (
    <div className={`${isDark ? 'dark' : ''} min-h-screen bg-[#f6f5f0] dark:bg-[#121316] text-[#111] dark:text-[#f6f5f0] font-mono-tech transition-colors duration-200`}>
      
      {/* Top Admin Header */}
      <header className="border-b-2 border-[#111] dark:border-neutral-700 bg-white dark:bg-[#1a1b1f] px-4 sm:px-6 py-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2563eb] text-white flex items-center justify-center border-2 border-[#111] neo-shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-lg sm:text-xl leading-none">
                PANEL KONTROL CMS RASHQA
              </h1>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                Kustomisasi Seluruh Konten &amp; Sinkronisasi Neon Postgres
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Neon Status Badge */}
            <div className={`px-3 py-1 text-xs font-extrabold rounded border-2 border-[#111] flex items-center gap-1.5 ${
              isNeonConnected ? 'bg-[#a7f3d0] text-[#064e3b]' : 'bg-[#fef08a] text-[#854d0e]'
            }`}>
              <Database className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isNeonConnected ? 'Neon DB Terhubung' : 'Penyimpanan Lokal'}</span>
              <span className="sm:hidden">{isNeonConnected ? 'Neon' : 'Lokal'}</span>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-2 border-[#111] neo-shadow-sm cursor-pointer"
              title="Ganti Mode Gelap/Terang"
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
              <span>Lihat Web</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto p-4 sm:p-6">
        
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
                placeholder="Masukkan 6 Digit PIN..."
                maxLength={10}
                className="w-full px-4 py-3 bg-[#f6f5f0] dark:bg-neutral-800 border-2 border-[#111] rounded-xl text-center text-lg font-bold tracking-widest focus:outline-none"
              />

              {authError && (
                <div className="p-3 bg-[#fecaca] text-[#7f1d1d] border-2 border-[#111] rounded-lg text-xs font-bold">
                  {authError}
                </div>
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
                  Sesi Admin Aktif • Siap Menyimpan ke {isNeonConnected ? 'Neon Lakebase Postgres' : 'Data Lokal'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-extrabold text-xs tracking-wider rounded-lg border-2 border-[#111] neo-shadow neo-btn flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'MENYIMPAN...' : 'SIMPAN SEMUA PERUBAHAN'}</span>
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
                { id: 'INTRO', label: '0. Intro Animation', icon: Sparkles },
                { id: 'PROFILE', label: '1. Profil & Kontak', icon: User },
                { id: 'ABOUT', label: '2. Cerita & Filosofi', icon: Layers },
                { id: 'PROJECTS', label: '3. Proyek (Works)', icon: Code2 },
                { id: 'ACHIEVEMENTS', label: '4. Prestasi & Sertifikat', icon: Award },
                { id: 'TECH', label: '5. Tech Stack', icon: Sliders },
                { id: 'MESSAGES', label: '6. Pesan Masuk (Neon)', icon: Mail },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      if (tab.id === 'MESSAGES') {
                        loadMessages();
                      }
                    }}
                    className={`px-3.5 py-2.5 text-xs font-extrabold rounded-t-xl border-2 border-b-0 border-[#111] transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
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
              
              {/* TAB 0: INTRO ANIMATION & GREETINGS */}
              {activeTab === 'INTRO' && (
                <div className="space-y-6">
                  <div className="pb-2 border-b border-neutral-200 dark:border-neutral-700">
                    <h3 className="font-display font-extrabold text-xl">Animasi Intro Pembuka</h3>
                    <p className="text-xs text-neutral-500 mt-1">
                      Kustomisasi teks yang muncul saat animasi fullscreen berjalan (saat pertama kali website dibuka atau saat beralih bahasa).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Indonesian Intro */}
                    <div className="p-5 bg-neutral-50 dark:bg-neutral-800 border-2 border-[#111] rounded-xl space-y-4 neo-shadow-sm">
                      <div className="flex items-center gap-2 pb-2 border-b border-neutral-200 dark:border-neutral-700">
                        <span className="px-2.5 py-0.5 bg-[#2563eb] text-white rounded font-mono-tech text-xs font-bold border border-[#111]">
                          ID
                        </span>
                        <h4 className="font-bold text-xs uppercase tracking-wider">Teks Intro Versi Bahasa Indonesia</h4>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold mb-1">Teks Sapaan Awal (Tahap 1)</label>
                        <input
                          type="text"
                          value={formData.intro?.hey_id ?? 'Halo!'}
                          onChange={(e) => setFormData({
                            ...formData,
                            intro: { ...formData.intro, hey_id: e.target.value }
                          })}
                          placeholder="Contoh: Halo!"
                          className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border-2 border-[#111] rounded-lg text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold mb-1">Teks Selamat Datang (Tahap 2)</label>
                        <input
                          type="text"
                          value={formData.intro?.welcome_id ?? 'Selamat Datang di Dunia Rashqa'}
                          onChange={(e) => setFormData({
                            ...formData,
                            intro: { ...formData.intro, welcome_id: e.target.value }
                          })}
                          placeholder="Contoh: Selamat Datang di Dunia Rashqa"
                          className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border-2 border-[#111] rounded-lg text-xs font-bold"
                        />
                      </div>
                    </div>

                    {/* English Intro */}
                    <div className="p-5 bg-neutral-50 dark:bg-neutral-800 border-2 border-[#111] rounded-xl space-y-4 neo-shadow-sm">
                      <div className="flex items-center gap-2 pb-2 border-b border-neutral-200 dark:border-neutral-700">
                        <span className="px-2.5 py-0.5 bg-[#38bdf8] text-[#111] rounded font-mono-tech text-xs font-bold border border-[#111]">
                          EN
                        </span>
                        <h4 className="font-bold text-xs uppercase tracking-wider">English Intro Animation Text</h4>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold mb-1">First Greeting (Step 1)</label>
                        <input
                          type="text"
                          value={formData.intro?.hey_en ?? 'Hey there'}
                          onChange={(e) => setFormData({
                            ...formData,
                            intro: { ...formData.intro, hey_en: e.target.value }
                          })}
                          placeholder="Example: Hey there"
                          className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border-2 border-[#111] rounded-lg text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold mb-1">Welcome Pitch (Step 2)</label>
                        <input
                          type="text"
                          value={formData.intro?.welcome_en ?? "Welcome to Rashqa's World"}
                          onChange={(e) => setFormData({
                            ...formData,
                            intro: { ...formData.intro, welcome_en: e.target.value }
                          })}
                          placeholder="Example: Welcome to Rashqa's World"
                          className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border-2 border-[#111] rounded-lg text-xs font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
                      <label className="block text-xs font-bold mb-1">Profesi Utama (Badge Hero)</label>
                      <input
                        type="text"
                        value={formData.profile.role}
                        onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, role: e.target.value } })}
                        className="w-full px-3 py-2.5 bg-[#f6f5f0] dark:bg-neutral-800 border-2 border-[#111] rounded-lg text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Sub Role / Spesialisasi Tambahan</label>
                      <input
                        type="text"
                        value={formData.profile.subRole}
                        onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, subRole: e.target.value } })}
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
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={formData.profile.photoUrl || ''}
                            onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, photoUrl: e.target.value } })}
                            placeholder="Contoh: /rashqa.png atau https://..."
                            className="flex-1 px-3 py-2 bg-white dark:bg-neutral-900 border-2 border-[#111] rounded-lg text-xs font-bold"
                          />
                          <label className="px-3 py-2 bg-[#2563eb] text-white border-2 border-[#111] rounded-lg text-xs font-bold neo-shadow neo-btn cursor-pointer flex items-center gap-1.5 flex-shrink-0">
                            <Upload className="w-3.5 h-3.5" />
                            <span>{isUploading ? 'Mengunggah...' : 'Unggah File'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={isUploading}
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, (url) => {
                                setFormData({ ...formData, profile: { ...formData.profile, photoUrl: url } });
                              })}
                            />
                          </label>
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-1">
                          Foto saat ini: <code>/rashqa.png</code>. Kamu juga bisa mengunggah foto baru via tombol Unggah File di atas.
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
                      <label className="block text-xs font-bold mb-1">Nomor WhatsApp (dengan kode negara)</label>
                      <input
                        type="text"
                        value={formData.profile.whatsapp}
                        onChange={(e) => setFormData({ ...formData, profile: { ...formData.profile, whatsapp: e.target.value } })}
                        placeholder="Contoh: 6285723894370"
                        className="w-full px-3 py-2 bg-[#f6f5f0] dark:bg-neutral-800 border-2 border-[#111] rounded text-xs font-bold"
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
                      <label className="block text-xs font-bold mb-1">Lokasi Domisili</label>
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
                        className="w-full px-3 py-2 bg-[#f6f5f0] dark:bg-neutral-800 border-2 border-[#111] rounded text-xs font-bold"
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
                        className="w-full px-3 py-2 bg-[#f6f5f0] dark:bg-neutral-800 border-2 border-[#111] rounded text-xs font-bold"
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

                  {/* Story Paragraphs CRUD */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#2563eb]">
                        Paragraf Cerita Filosofi ({formData.aboutStory.paragraphs.length} Paragraf)
                      </label>
                      <button
                        type="button"
                        onClick={handleAddParagraph}
                        className="px-3 py-1 bg-white dark:bg-neutral-800 border-2 border-[#111] rounded text-xs font-bold neo-shadow-sm flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Paragraf</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {formData.aboutStory.paragraphs.map((p, pIdx) => (
                        <div key={pIdx} className="p-3 bg-neutral-50 dark:bg-neutral-800/80 border-2 border-[#111] rounded-xl flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-[#fde047] text-[#111] font-bold text-xs flex items-center justify-center shrink-0 border border-[#111]">
                            {pIdx + 1}
                          </span>
                          <textarea
                            rows={3}
                            value={p}
                            onChange={(e) => {
                              const updated = [...formData.aboutStory.paragraphs];
                              updated[pIdx] = e.target.value;
                              setFormData({
                                ...formData,
                                aboutStory: { ...formData.aboutStory, paragraphs: updated }
                              });
                            }}
                            className="flex-1 p-2 bg-white dark:bg-neutral-900 border border-[#111] rounded text-xs leading-relaxed"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveParagraph(pIdx)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                            title="Hapus Paragraf"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3 Pillars */}
                  <div className="space-y-3 pt-2">
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
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-700 flex-wrap gap-3">
                    <div>
                      <h3 className="font-display font-extrabold text-xl">Daftar Proyek Portofolio ({formData.projects.length} Proyek)</h3>
                      <p className="text-xs text-neutral-500">
                        Ditampilkan 2 proyek per slide halaman. Kamu bisa mengatur urutan dengan tombol ▲ dan ▼.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const newProject: ProjectItem = {
                          id: `proj-${Date.now()}`,
                          title: 'Proyek Kustom Baru',
                          tag: 'NEXT.JS • GOLANG',
                          desc: 'Deskripsi lengkap lingkup arsitektur teknis dan fitur proyek...',
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
                      <div key={proj.id} className="p-4 sm:p-5 bg-neutral-50 dark:bg-neutral-800/90 border-2 border-[#111] rounded-xl neo-shadow space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 bg-[#2563eb] text-white rounded text-xs font-extrabold border border-[#111]">
                              SLIDE {Math.floor(idx / 2) + 1} • PROYEK #{idx + 1}
                            </span>
                            <span className="text-[11px] text-neutral-400 font-mono-tech">{proj.id}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            {/* Move Up */}
                            <button
                              type="button"
                              onClick={() => moveProject(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1.5 bg-white dark:bg-neutral-700 border border-[#111] rounded text-xs disabled:opacity-30 cursor-pointer"
                              title="Pindahkan ke Atas"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            {/* Move Down */}
                            <button
                              type="button"
                              onClick={() => moveProject(idx, 'down')}
                              disabled={idx === formData.projects.length - 1}
                              className="p-1.5 bg-white dark:bg-neutral-700 border border-[#111] rounded text-xs disabled:opacity-30 cursor-pointer"
                              title="Pindahkan ke Bawah"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Hapus proyek "${proj.title}"?`)) {
                                  setFormData({
                                    ...formData,
                                    projects: formData.projects.filter(p => p.id !== proj.id)
                                  });
                                }
                              }}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded ml-1 cursor-pointer"
                              title="Hapus Proyek"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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
                          <label className="block text-[11px] font-bold">Deskripsi Lengkap &amp; Arsitektur Teknis (Tampil di Popup Modal)</label>
                          <textarea
                            rows={3}
                            value={proj.desc}
                            onChange={(e) => {
                              const updated = [...formData.projects];
                              updated[idx].desc = e.target.value;
                              setFormData({ ...formData, projects: updated });
                            }}
                            className="w-full px-2.5 py-1.5 bg-white dark:bg-neutral-900 border border-[#111] rounded text-xs leading-relaxed"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold">Live Demo / App URL</label>
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
                            <label className="block text-[11px] font-bold">GitHub Source Code Link</label>
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
                            <label className="block text-[11px] font-bold">Metrik / Highlights (Badge)</label>
                            <input
                              type="text"
                              value={proj.metrics || ''}
                              onChange={(e) => {
                                const updated = [...formData.projects];
                                updated[idx].metrics = e.target.value;
                                setFormData({ ...formData, projects: updated });
                              }}
                              className="w-full px-2.5 py-1.5 bg-white dark:bg-neutral-900 border border-[#111] rounded text-xs font-bold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold">URL Gambar Preview / Screenshot</label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              placeholder="https://... atau /uploads/..."
                              value={proj.imageUrl || ''}
                              onChange={(e) => {
                                const updated = [...formData.projects];
                                updated[idx].imageUrl = e.target.value;
                                setFormData({ ...formData, projects: updated });
                              }}
                              className="flex-1 px-2.5 py-1.5 bg-white dark:bg-neutral-900 border border-[#111] rounded text-xs"
                            />
                            <label className="px-3 py-1.5 bg-[#fde047] text-[#111] border border-[#111] rounded text-xs font-bold neo-shadow cursor-pointer flex items-center gap-1 flex-shrink-0">
                              <Upload className="w-3.5 h-3.5" />
                              <span>{isUploading ? 'Mengunggah...' : 'Unggah'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                disabled={isUploading}
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, (url) => {
                                  const updated = [...formData.projects];
                                  updated[idx].imageUrl = url;
                                  setFormData({ ...formData, projects: updated });
                                })}
                              />
                            </label>
                            {proj.imageUrl && (
                              <div className="w-14 h-9 rounded border border-[#111] overflow-hidden shrink-0 bg-neutral-200">
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

              {/* TAB 4: ACHIEVEMENTS & CERTIFICATES */}
              {activeTab === 'ACHIEVEMENTS' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-700 flex-wrap gap-3">
                    <div>
                      <h3 className="font-display font-extrabold text-xl">Prestasi, Sertifikat &amp; Artikel</h3>
                      <p className="text-xs text-neutral-500">
                        Prestasi &amp; Sertifikat dipaginasi rapi 2 per sub-slide. Artikel dilengkapi scrollbar internal.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const newAch: AchievementItem = {
                          id: `ach-${Date.now()}`,
                          year: '2026',
                          title: 'Pencapaian Baru',
                          issuer: 'Lembaga / Penyelenggara',
                          category: achievementFilter === 'ALL' ? 'PRESTASI' : achievementFilter,
                          description: 'Keterangan lengkap pencapaian atau ulasan sertifikat...',
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

                  {/* Filter Sub-categories */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {[
                      { id: 'ALL', label: `Semua (${formData.achievements.length})` },
                      { id: 'PRESTASI', label: `Prestasi (${formData.achievements.filter(a => a.category === 'PRESTASI').length})` },
                      { id: 'SERTIFIKAT', label: `Sertifikat (${formData.achievements.filter(a => a.category === 'SERTIFIKAT').length})` },
                      { id: 'ARTIKEL', label: `Artikel (${formData.achievements.filter(a => a.category === 'ARTIKEL').length})` },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setAchievementFilter(f.id as any)}
                        className={`px-3 py-1.5 rounded-lg border-2 border-[#111] text-xs font-bold cursor-pointer transition-all ${
                          achievementFilter === f.id
                            ? 'bg-[#2563eb] text-white neo-shadow-sm'
                            : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    {displayedAchievements.map(({ item, originalIdx }) => (
                      <div key={item.id} className="p-4 bg-neutral-50 dark:bg-neutral-800 border-2 border-[#111] rounded-xl neo-shadow space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <select
                              value={item.category}
                              onChange={(e) => {
                                const updated = [...formData.achievements];
                                updated[originalIdx].category = e.target.value as any;
                                setFormData({ ...formData, achievements: updated });
                              }}
                              className="px-2.5 py-1 bg-white dark:bg-neutral-900 border-2 border-[#111] rounded text-xs font-extrabold"
                            >
                              <option value="PRESTASI">Kategori: PRESTASI</option>
                              <option value="SERTIFIKAT">Kategori: SERTIFIKAT</option>
                              <option value="ARTIKEL">Kategori: ARTIKEL</option>
                            </select>
                            <span className="text-[11px] text-neutral-400 font-mono-tech">{item.id}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => moveAchievement(originalIdx, 'up')}
                              disabled={originalIdx === 0}
                              className="p-1.5 bg-white dark:bg-neutral-700 border border-[#111] rounded text-xs disabled:opacity-30 cursor-pointer"
                              title="Pindahkan ke Atas"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveAchievement(originalIdx, 'down')}
                              disabled={originalIdx === formData.achievements.length - 1}
                              className="p-1.5 bg-white dark:bg-neutral-700 border border-[#111] rounded text-xs disabled:opacity-30 cursor-pointer"
                              title="Pindahkan ke Bawah"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Hapus item "${item.title}"?`)) {
                                  setFormData({
                                    ...formData,
                                    achievements: formData.achievements.filter(a => a.id !== item.id)
                                  });
                                }
                              }}
                              className="p-1 text-red-500 hover:text-red-700 ml-1 cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block text-[11px] font-bold">Judul</label>
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => {
                                const updated = [...formData.achievements];
                                updated[originalIdx].title = e.target.value;
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
                                updated[originalIdx].year = e.target.value;
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
                                updated[originalIdx].badge = e.target.value;
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
                                updated[originalIdx].accent = e.target.value;
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
                              updated[originalIdx].description = e.target.value;
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
                              placeholder="https://... atau /uploads/..."
                              value={item.imageUrl || ''}
                              onChange={(e) => {
                                const updated = [...formData.achievements];
                                updated[originalIdx].imageUrl = e.target.value;
                                setFormData({ ...formData, achievements: updated });
                              }}
                              className="flex-1 px-2.5 py-1.5 bg-white dark:bg-neutral-900 border border-[#111] rounded text-xs"
                            />
                            <label className="px-2.5 py-1.5 bg-[#a7f3d0] text-[#111] border border-[#111] rounded text-xs font-bold neo-shadow cursor-pointer flex items-center gap-1 flex-shrink-0">
                              <Upload className="w-3 h-3" />
                              <span>{isUploading ? '...' : 'Unggah'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                disabled={isUploading}
                                className="hidden"
                                onChange={(e) => handleFileUpload(e, (url) => {
                                  const updated = [...formData.achievements];
                                  updated[originalIdx].imageUrl = url;
                                  setFormData({ ...formData, achievements: updated });
                                })}
                              />
                            </label>
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
                  <div className="pb-2 border-b border-neutral-200 dark:border-neutral-700">
                    <h3 className="font-display font-extrabold text-xl">Kategori &amp; Skill Tech Stack</h3>
                    <p className="text-xs text-neutral-500 mt-1">
                      Kelola ekosistem teknologi yang kamu kuasai. Kamu bisa menambah, mengubah, dan menghapus keahlian di setiap kelompok.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {formData.techStacks.map((group, gIdx) => (
                      <div key={group.category} className="p-4 bg-neutral-50 dark:bg-neutral-800 border-2 border-[#111] rounded-xl neo-shadow space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-neutral-300 dark:border-neutral-700">
                          <div>
                            <h4 className="font-display font-extrabold text-sm">{group.category}</h4>
                            <span className="text-[10px] text-neutral-500">{group.skills.length} keahlian</span>
                          </div>
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: group.color }} />
                        </div>

                        {/* Skill List */}
                        <div className="space-y-2 max-h-[360px] overflow-y-auto neo-scrollbar pr-1">
                          {group.skills.map((skill, sIdx) => (
                            <div key={sIdx} className="p-2 bg-white dark:bg-neutral-900 border border-[#111] rounded flex items-center justify-between gap-2">
                              <input
                                type="text"
                                value={skill.name}
                                onChange={(e) => handleSkillChange(gIdx, sIdx, 'name', e.target.value)}
                                className="font-bold text-xs bg-transparent border-0 focus:outline-none flex-1"
                              />
                              <input
                                type="text"
                                value={skill.level}
                                onChange={(e) => handleSkillChange(gIdx, sIdx, 'level', e.target.value)}
                                className="text-[10px] px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded font-bold border border-neutral-300 w-24 text-center focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveSkill(gIdx, sIdx)}
                                className="text-red-500 hover:text-red-700 cursor-pointer p-0.5"
                                title="Hapus Skill"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddSkill(gIdx)}
                          className="w-full py-1.5 bg-white dark:bg-neutral-900 border border-[#111] rounded text-xs font-bold neo-shadow-sm flex items-center justify-center gap-1 cursor-pointer hover:bg-neutral-100"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah Skill</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: VISITOR MESSAGES (NEON DATABASE) */}
              {activeTab === 'MESSAGES' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-700 flex-wrap gap-3">
                    <div>
                      <h3 className="font-display font-extrabold text-xl">Pesan Masuk dari Pengunjung ({messages.length})</h3>
                      <p className="text-xs text-neutral-500">Tersimpan secara realtime di tabel Message Neon Postgres</p>
                    </div>

                    <button
                      type="button"
                      onClick={loadMessages}
                      disabled={isLoadingMessages}
                      className="px-3.5 py-2 bg-white dark:bg-neutral-800 border-2 border-[#111] text-xs font-bold rounded-lg neo-shadow flex items-center gap-1.5 cursor-pointer hover:bg-neutral-100"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMessages ? 'animate-spin' : ''}`} />
                      <span>{isLoadingMessages ? 'Memuat...' : 'Segarkan Pesan'}</span>
                    </button>
                  </div>

                  {messages.length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl space-y-2">
                      <Mail className="w-10 h-10 mx-auto text-neutral-400" />
                      <h4 className="font-display font-bold text-sm">Belum Ada Pesan Masuk</h4>
                      <p className="text-xs text-neutral-500">
                        Ketika pengunjung mengisi formulir di tab Contact, pesan akan langsung tersimpan di Neon dan muncul di sini.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className="p-4 bg-neutral-50 dark:bg-neutral-800/80 border-2 border-[#111] rounded-xl neo-shadow space-y-2"
                        >
                          <div className="flex items-start justify-between flex-wrap gap-2">
                            <div>
                              <h4 className="font-display font-extrabold text-sm">{msg.name}</h4>
                              <p className="text-xs font-mono-tech text-[#2563eb]">{msg.email}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[11px] font-mono-tech text-neutral-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{new Date(msg.createdAt).toLocaleString('id-ID')}</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded border border-transparent hover:border-red-400 cursor-pointer"
                                title="Hapus pesan ini"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <div className="p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs leading-relaxed font-mono-tech whitespace-pre-wrap">
                            {msg.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
