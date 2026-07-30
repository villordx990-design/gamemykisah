'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function EditGame() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('games').select('*').eq('id', id).single();
      setForm(data);
    }
    load();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      let cover_image = form.cover_image;
      if (coverFile) {
        const fileName = `cover-${Date.now()}-${coverFile.name}`;
        const { error } = await supabase.storage.from('images').upload(fileName, coverFile);
        if (error) throw error;
        cover_image = supabase.storage.from('images').getPublicUrl(fileName).data.publicUrl;
      }
      const { id: _id, created_at, ...rest } = form;
      const { error } = await supabase.from('games').update({ ...rest, cover_image }).eq('id', id);
      if (error) throw error;
      router.push('/admin');
    } catch (err) {
      alert('Gagal: ' + err.message);
    }
    setSaving(false);
  }

  if (!form) return <p className="p-6 text-center text-gray-400">Memuat...</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 space-y-3">
      <h1 className="text-xl font-bold text-brand mb-2">Edit Game</h1>
      <input required value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-white/10 p-3 rounded-xl" />
      <input value={form.developer || ''} onChange={(e) => setForm({ ...form, developer: e.target.value })} placeholder="Developer" className="w-full bg-white/10 p-3 rounded-xl" />
      <input value={form.size || ''} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="Size" className="w-full bg-white/10 p-3 rounded-xl" />
      <input value={form.version || ''} onChange={(e) => setForm({ ...form, version: e.target.value })} placeholder="Versi" className="w-full bg-white/10 p-3 rounded-xl" />
      <textarea value={form.synopsis || ''} onChange={(e) => setForm({ ...form, synopsis: e.target.value })} rows={4} className="w-full bg-white/10 p-3 rounded-xl" />
      <div>
        <label className="text-sm text-gray-400">Ganti Cover (opsional)</label>
        <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files[0])} className="block mt-1 text-sm" />
      </div>
      <input value={form.android_url || ''} onChange={(e) => setForm({ ...form, android_url: e.target.value })} placeholder="Link Android" className="w-full bg-white/10 p-3 rounded-xl" />
      <input value={form.pc_url || ''} onChange={(e) => setForm({ ...form, pc_url: e.target.value })} placeholder="Link PC" className="w-full bg-white/10 p-3 rounded-xl" />
      <input value={form.patch_url || ''} onChange={(e) => setForm({ ...form, patch_url: e.target.value })} placeholder="Link Patch" className="w-full bg-white/10 p-3 rounded-xl" />
      <input value={form.tutorial_url || ''} onChange={(e) => setForm({ ...form, tutorial_url: e.target.value })} placeholder="Link Tutorial" className="w-full bg-white/10 p-3 rounded-xl" />
      <button disabled={saving} className="w-full bg-brand text-black font-semibold py-3 rounded-xl">
        {saving ? 'Menyimpan...' : 'Update Game'}
      </button>
    </form>
  );
}
