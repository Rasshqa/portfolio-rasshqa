'use client';

import React, { useState } from 'react';
import { PortfolioData } from '@/lib/data';
import { X, Lock, CheckCircle2, AlertCircle, Save, Database, Plus, Trash2, ShieldCheck } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PortfolioData;
  onSave: (newData: PortfolioData) => Promise<{ success: boolean; message: string }>;
  isNeonConnected: boolean;
}

export default function AdminModal({
  isOpen,
  onClose,
  data: initialData,
  onSave,
  isNeonConnected
}: AdminModalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'PROJECTS' | 'ACHIEVEMENTS' | 'TECH'>('PROFILE');
  const [formData, setFormData] = useState<PortfolioData>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) {
      setAuthError('Masukkan PIN Admin.');
      return;
    }
    // Simple client check or verify against server
    setIsAuthenticated(true);
    setAuthError('');
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const res = await onSave(formData);
      if (res.success) {
        setStatusMessage({ type: 'success', text: res.message });
      } else {
        setStatusMessage({ type: 'error', text: res.message });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'Gagal menyimpan perubahan.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#f6f5f0] dark:bg-[#1e2024] text-[#111] dark:text-white border-2 border-[#111] dark:border-neutral-400 rounded-2xl neo-shadow-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#2563eb] text-white border-b-2 border-[#111] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6" />
            <div>
              <h2 className="font-display font-extrabold text-lg sm:text-xl leading-none">
                PANEL ADMIN PORTFOLIO
              </h2>
              <p className="font-mono-tech text-[11px] opacity-90 mt-0.5">
                Kelola Profil, Proyek, Sertifikat &amp; Tech Stack
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-2.5 py-1 text-[10px] font-mono-tech font-extrabold rounded border border-white/40 flex items-center gap-1.5 ${
              isNeonConnected ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-[#111]'
            }`}>
              <Database className="w-3 h-3" />
              <span>{isNeonConnected ? 'Neon DB Terhubung' : 'Mode Lokal (Tanpa DB)'}</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Screen */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#fde047] border-2 border-[#111] neo-shadow flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-[#111]" />
            </div>
            <h3 className="font-display font-extrabold text-2xl mb-2">Kunci Akses Admin</h3>
            <p className="font-mono-tech text-xs text-neutral-600 dark:text-neutral-400 max-w-md mb-6">
              Masukkan Master PIN untuk mengakses panel pengaturan data. (Default PIN: <code className="bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.5 rounded font-bold">rashqa2026</code>)
            </p>

            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Masukkan PIN Admin..."
                className="w-full px-4 py-2.5 bg-white dark:bg-neutral-800 border-2 border-[#111] rounded-lg font-mono-tech text-center tracking-widest text-sm focus:outline-none"
                autoFocus
              />
              {authError && (
                <p className="text-red-500 text-xs font-mono-tech font-bold">{authError}</p>
              )}
              <button
                type="submit"
                className="w-full py-2.5 bg-[#2563eb] text-white font-mono-tech font-extrabold text-xs tracking-wider rounded border-2 border-[#111] neo-shadow neo-btn cursor-pointer"
              >
                MASUK KE PANEL ADMIN
              </button>
            </form>
          </div>
        ) : (
          /* Logged In Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Sub Nav Tabs */}
            <div className="flex items-center gap-2 px-6 pt-3 border-b border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800/50 overflow-x-auto">
              {[
                { id: 'PROFILE', label: '1. Profil & Bio' },
                { id: 'PROJECTS', label: '2. Daftar Proyek' },
                { id: 'ACHIEVEMENTS', label: '3. Prestasi & Sertifikat' },
                { id: 'TECH', label: '4. Tech Stack' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 text-xs font-mono-tech font-extrabold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-[#2563eb] text-[#2563eb] dark:text-sky-400 bg-white dark:bg-[#1e2024] rounded-t'
                      : 'border-transparent text-neutral-500 hover:text-[#111] dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {statusMessage && (
                <div className={`p-4 rounded-lg border-2 border-[#111] neo-shadow flex items-center gap-3 text-xs font-mono-tech font-bold ${
                  statusMessage.type === 'success' ? 'bg-[#a7f3d0] text-[#064e3b]' : 'bg-[#fecaca] text-[#7f1d1d]'
                }`}>
                  {statusMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                  <span>{statusMessage.text}</span>
                </div>
              )}

              {/* TAB 1: PROFILE */}
              {activeTab === 'PROFILE' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono-tech font-bold mb-1">Nama Lengkap</label>
                      <input
                        type="text"
                        value={formData.profile.fullName}
                        onChange={(e) => setFormData({
                          ...formData,
                          profile: { ...formData.profile, fullName: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border-2 border-[#111] rounded text-xs font-mono-tech focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono-tech font-bold mb-1">Nama Singkat / Display</label>
                      <input
                        type="text"
                        value={formData.profile.nickName}
                        onChange={(e) => setFormData({
                          ...formData,
                          profile: { ...formData.profile, nickName: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border-2 border-[#111] rounded text-xs font-mono-tech focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono-tech font-bold mb-1">Profesi Utama</label>
                      <input
                        type="text"
                        value={formData.profile.role}
                        onChange={(e) => setFormData({
                          ...formData,
                          profile: { ...formData.profile, role: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border-2 border-[#111] rounded text-xs font-mono-tech focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono-tech font-bold mb-1">Nomor WhatsApp (dengan kode negara)</label>
                      <input
                        type="text"
                        value={formData.profile.whatsapp}
                        onChange={(e) => setFormData({
                          ...formData,
                          profile: { ...formData.profile, whatsapp: e.target.value }
                        })}
                        placeholder="Contoh: 62895328811198"
                        className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border-2 border-[#111] rounded text-xs font-mono-tech focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono-tech font-bold mb-1">Email</label>
                      <input
                        type="email"
                        value={formData.profile.email}
                        onChange={(e) => setFormData({
                          ...formData,
                          profile: { ...formData.profile, email: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border-2 border-[#111] rounded text-xs font-mono-tech focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono-tech font-bold mb-1">URL GitHub</label>
                      <input
                        type="text"
                        value={formData.profile.github}
                        onChange={(e) => setFormData({
                          ...formData,
                          profile: { ...formData.profile, github: e.target.value }
                        })}
                        className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border-2 border-[#111] rounded text-xs font-mono-tech focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono-tech font-bold mb-1">Bio Singkat (Hero)</label>
                    <textarea
                      rows={3}
                      value={formData.profile.bio}
                      onChange={(e) => setFormData({
                        ...formData,
                        profile: { ...formData.profile, bio: e.target.value }
                      })}
                      className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border-2 border-[#111] rounded text-xs font-mono-tech focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: PROJECTS */}
              {activeTab === 'PROJECTS' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-mono-tech text-neutral-500">
                      Total: {formData.projects.length} Proyek (Tampil 4 proyek per slide)
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const newProj = {
                          id: `proj-${Date.now()}`,
                          title: 'Proyek Baru',
                          tag: 'NEXT.JS • TAILWIND',
                          desc: 'Deskripsi singkat mengenai proyek ini...',
                          metrics: 'High Performance',
                          accent: '#38bdf8',
                          liveUrl: 'https://github.com/rasshqa',
                          githubUrl: 'https://github.com/rasshqa'
                        };
                        setFormData({
                          ...formData,
                          projects: [newProj, ...formData.projects]
                        });
                      }}
                      className="px-3 py-1.5 bg-[#a7f3d0] text-[#111] border border-[#111] rounded font-mono-tech font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Proyek</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.projects.map((proj, idx) => (
                      <div key={proj.id} className="p-4 bg-white dark:bg-neutral-800 border-2 border-[#111] rounded-xl neo-shadow space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono-tech font-extrabold text-xs text-[#2563eb]">#{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                projects: formData.projects.filter(p => p.id !== proj.id)
                              });
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Hapus Proyek"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-mono-tech font-bold">Judul Proyek</label>
                            <input
                              type="text"
                              value={proj.title}
                              onChange={(e) => {
                                const updated = [...formData.projects];
                                updated[idx].title = e.target.value;
                                setFormData({ ...formData, projects: updated });
                              }}
                              className="w-full px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-[#111] rounded text-xs font-mono-tech"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-mono-tech font-bold">Tech Tag (Dipisah titik bulat)</label>
                            <input
                              type="text"
                              value={proj.tag}
                              onChange={(e) => {
                                const updated = [...formData.projects];
                                updated[idx].tag = e.target.value;
                                setFormData({ ...formData, projects: updated });
                              }}
                              className="w-full px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-[#111] rounded text-xs font-mono-tech"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono-tech font-bold">Deskripsi</label>
                          <textarea
                            rows={2}
                            value={proj.desc}
                            onChange={(e) => {
                              const updated = [...formData.projects];
                              updated[idx].desc = e.target.value;
                              setFormData({ ...formData, projects: updated });
                            }}
                            className="w-full px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-[#111] rounded text-xs font-mono-tech"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-mono-tech font-bold">Preview Link</label>
                            <input
                              type="text"
                              value={proj.liveUrl || ''}
                              onChange={(e) => {
                                const updated = [...formData.projects];
                                updated[idx].liveUrl = e.target.value;
                                setFormData({ ...formData, projects: updated });
                              }}
                              className="w-full px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-[#111] rounded text-xs font-mono-tech"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-mono-tech font-bold">Metrik / Highlights</label>
                            <input
                              type="text"
                              value={proj.metrics || ''}
                              onChange={(e) => {
                                const updated = [...formData.projects];
                                updated[idx].metrics = e.target.value;
                                setFormData({ ...formData, projects: updated });
                              }}
                              className="w-full px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-[#111] rounded text-xs font-mono-tech"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: ACHIEVEMENTS */}
              {activeTab === 'ACHIEVEMENTS' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-mono-tech text-neutral-500">
                      Total: {formData.achievements.length} Prestasi / Sertifikat
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const newAch = {
                          id: `ach-${Date.now()}`,
                          year: '2026',
                          title: 'Sertifikasi Baru',
                          issuer: 'Lembaga Penerbit',
                          category: 'SERTIFIKAT' as const,
                          description: 'Keterangan kompetensi...',
                          badge: 'CERTIFIED',
                          accent: '#38bdf8'
                        };
                        setFormData({
                          ...formData,
                          achievements: [newAch, ...formData.achievements]
                        });
                      }}
                      className="px-3 py-1.5 bg-[#fde047] text-[#111] border border-[#111] rounded font-mono-tech font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Item</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.achievements.map((ach, idx) => (
                      <div key={ach.id} className="p-4 bg-white dark:bg-neutral-800 border-2 border-[#111] rounded-xl neo-shadow space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 bg-neutral-200 dark:bg-neutral-700 text-[#111] dark:text-white rounded text-[10px] font-mono-tech font-bold">
                            {ach.category} • {ach.year}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                achievements: formData.achievements.filter(a => a.id !== ach.id)
                              });
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={ach.title}
                          onChange={(e) => {
                            const updated = [...formData.achievements];
                            updated[idx].title = e.target.value;
                            setFormData({ ...formData, achievements: updated });
                          }}
                          className="w-full px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-[#111] rounded text-xs font-mono-tech font-bold"
                          placeholder="Judul Pencapaian / Sertifikat"
                        />
                        <textarea
                          rows={2}
                          value={ach.description}
                          onChange={(e) => {
                            const updated = [...formData.achievements];
                            updated[idx].description = e.target.value;
                            setFormData({ ...formData, achievements: updated });
                          }}
                          className="w-full px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-[#111] rounded text-xs font-mono-tech"
                          placeholder="Deskripsi pencapaian"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: TECH */}
              {activeTab === 'TECH' && (
                <div className="space-y-4">
                  <p className="text-xs font-mono-tech text-neutral-500">
                    Kategori &amp; Skill Tech Stack yang ditampilkan di Slide About &amp; Home:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {formData.techStacks.map((group, gIdx) => (
                      <div key={group.category} className="p-4 bg-white dark:bg-neutral-800 border-2 border-[#111] rounded-xl neo-shadow">
                        <h4 className="font-display font-extrabold text-sm mb-3 text-[#2563eb] dark:text-sky-400">
                          {group.category}
                        </h4>
                        <div className="space-y-2">
                          {group.skills.map((skill, sIdx) => (
                            <div key={skill.name} className="flex items-center justify-between text-xs font-mono-tech p-1.5 bg-neutral-100 dark:bg-neutral-900 rounded border border-neutral-300 dark:border-neutral-700">
                              <span className="font-bold">{skill.name}</span>
                              <span className="text-[10px] text-neutral-500">{skill.level}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 bg-neutral-100 dark:bg-neutral-900 border-t-2 border-[#111] flex items-center justify-between">
              <span className="text-xs font-mono-tech text-neutral-500">
                {isNeonConnected ? '⚡ Terhubung ke Neon Lakebase Postgres' : '💾 Mode Lokal Sementara'}
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-white dark:bg-neutral-800 border-2 border-[#111] rounded font-mono-tech font-bold text-xs neo-shadow cursor-pointer"
                >
                  TUTUP
                </button>
                <button
                  type="button"
                  onClick={handleSaveAll}
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#2563eb] text-white border-2 border-[#111] rounded font-mono-tech font-extrabold text-xs neo-shadow neo-btn flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'MENYIMPAN...' : 'SIMPAN SEMUA PERUBAHAN'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
