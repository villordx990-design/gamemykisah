'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function NewGame() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    developer: '',
    size: '',
    version: '',
    synopsis: '',
    android_url: '',
    pc_url: '',
    patch_url: '',
    tutorial_url: '',
  });
  const [coverFile, setCoverFile] = useState(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      let cover_image = '';
      if (coverFile) {
        const fileName = `cover-${Date.now()}-${coverFile.name}`;
        const { error } = await supabase.storage.from('images').upload(fileName, coverFile);
        if (error) throw error;
        cover_image = supabase.storage.from('images').getPublicUrl(fileName).data.publicUrl;
      }
      const slug = slugify(form.name) + '-' + Date.now().toString().slice(-4);
      const { error } = await supabase.from('games').insert({ ...form, slug, cover_image });
      if (error) throw error;
      router.push('/admin');
    } catch (err) {
      alert('Gagal: ' + err.message);
    }
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 space-y-3">
      <h1 className="text-xl font-bold text-brand mb-2">Tambah Game</h1>
      <input required placeholder="Nama Game" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-white/10 p-3 rounded-xl" />
      <input placeholder="Developer" value={form.developer} onChange={(e) => setForm({ ...form, developer: e.target.value })} className="w-full bg-white/10 p-3 rounded-xl" />
      <input placeholder="Size (contoh: 250 MB)" value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} className="w-full bg-white/10 p-3 rounded-xl" />
      <input placeholder="Versi (contoh: 1.0.2)" value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} className="w-full bg-white/10 p-3 rounded-xl" />
      <textarea placeholder="Sinopsis" value={form.synopsis} onChange={(e) => setForm({ ...form, synopsis: e.target.value })} rows={4} className="w-full bg-white/10 p-3 rounded-xl" />
      <div>
        <label className="text-sm text-gray-400">Cover Game</label>
        <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files[0])} className="block mt-1 text-sm" />
      </div>
      <input placeholder="Link Download Android" value={form.android_url} onChange={(e) => setForm({ ...form, android_url: e.target.value })} className="w-full bg-white/10 p-3 rounded-xl" />
      <input placeholder="Link Download PC" value={form.pc_url} onChange={(e) => setForm({ ...form, pc_url: e.target.value })} className="w-full bg-white/10 p-3 rounded-xl" />
      <input placeholder="Link Download Patch" value={form.patch_url} onChange={(e) => setForm({ ...form, patch_url: e.target.value })} className="w-full bg-white/10 p-3 rounded-xl" />
      <input placeholder="Link Tutorial (YouTube/artikel)" value={form.tutorial_url} onChange={(e) => setForm({ ...form, tutorial_url: e.target.value })} className="w-full bg-white/10 p-3 rounded-xl" />
      <button disabled={saving} className="w-full bg-brand text-black font-semibold py-3 rounded-xl">
        {saving ? 'Menyimpan...' : 'Simpan Game'}
      </button>
    </form>
  );
}
