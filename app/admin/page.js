'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [games, setGames] = useState([]);
  const [settings, setSettings] = useState({
    banner_image: '',
    background_image: '',
    wa_group_url: '',
    discord_url: '',
  });
  const [bannerFile, setBannerFile] = useState(null);
  const [bgFile, setBgFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data: g } = await supabase.from('games').select('*').order('created_at', { ascending: false });
    setGames(g || []);
    const { data: s } = await supabase.from('site_settings').select('*').eq('id', 1).single();
    if (s) setSettings(s);
  }

  async function uploadFile(file, prefix) {
    const fileName = `${prefix}-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('images').upload(fileName, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from('images').getPublicUrl(fileName);
    return data.publicUrl;
  }

  async function saveSettings(e) {
    e.preventDefault();
    setSaving(true);
    let banner_image = settings.banner_image;
    let background_image = settings.background_image;
    try {
      if (bannerFile) banner_image = await uploadFile(bannerFile, 'banner');
      if (bgFile) background_image = await uploadFile(bgFile, 'bg');
      const { error } = await supabase.from('site_settings').upsert({
        id: 1,
        banner_image,
        background_image,
        wa_group_url: settings.wa_group_url,
        discord_url: settings.discord_url,
      });
      if (error) throw error;
      setSettings((prev) => ({ ...prev, banner_image, background_image }));
      alert('Pengaturan tersimpan');
    } catch (err) {
      alert('Gagal: ' + err.message);
    }
    setSaving(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  }

  async function handleDelete(id) {
    if (!confirm('Hapus game ini?')) return;
    await supabase.from('games').delete().eq('id', id);
    load();
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-brand">Admin Panel</h1>
        <button onClick={handleLogout} className="text-sm text-red-400">Keluar</button>
      </div>

      <section className="bg-white/5 p-4 rounded-2xl space-y-3">
        <h2 className="font-semibold">Pengaturan Tampilan</h2>
        <form onSubmit={saveSettings} className="space-y-3">
          <div>
            <label className="text-sm text-gray-400">Banner (tampil di atas halaman utama)</label>
            <input type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files[0])} className="block mt-1 text-sm" />
          </div>
          <div>
            <label className="text-sm text-gray-400">Background (foto jejepangan, dsb)</label>
            <input type="file" accept="image/*" onChange={(e) => setBgFile(e.target.files[0])} className="block mt-1 text-sm" />
          </div>
          <input
            value={settings.wa_group_url || ''}
            onChange={(e) => setSettings({ ...settings, wa_group_url: e.target.value })}
            placeholder="Link Grup WhatsApp"
            className="w-full bg-white/10 p-2 rounded-lg text-sm"
          />
          <input
            value={settings.discord_url || ''}
            onChange={(e) => setSettings({ ...settings, discord_url: e.target.value })}
            placeholder="Link Discord"
            className="w-full bg-white/10 p-2 rounded-lg text-sm"
          />
          <button disabled={saving} className="w-full bg-brand text-black font-semibold py-2 rounded-xl">
            {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </form>
      </section>

      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">Daftar Game ({games.length})</h2>
          <Link href="/admin/game/new" className="bg-brand text-black text-sm font-semibold px-3 py-2 rounded-xl">
            + Tambah Game
          </Link>
        </div>
        <div className="space-y-2">
          {games.map((g) => (
            <div key={g.id} className="bg-white/5 p-3 rounded-xl flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">{g.name}</p>
                <p className="text-xs text-gray-400">v{g.version}</p>
              </div>
              <div className="flex gap-3 text-sm">
                <Link href={`/admin/game/${g.id}/edit`} className="text-blue-400">Edit</Link>
                <button onClick={() => handleDelete(g.id)} className="text-red-400">Hapus</button>
              </div>
            </div>
          ))}
          {games.length === 0 && <p className="text-gray-400 text-sm">Belum ada game.</p>}
        </div>
      </section>
    </div>
  );
}
