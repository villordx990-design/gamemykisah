'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function SupportPage() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('site_settings').select('*').eq('id', 1).single();
      setSettings(data);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="p-4 flex items-center gap-3 bg-black/50 backdrop-blur sticky top-0 z-10">
        <Link href="/" className="text-brand text-sm">← Kembali</Link>
        <h1 className="text-lg font-bold text-brand">Support Vil Ordx</h1>
      </header>

      <div className="max-w-md mx-auto p-4 text-center">
        <p className="text-gray-300 mb-6">
          Semua game di sini aku translate sendiri secara gratis. Kalau kamu suka hasil translate-nya, dukungan kamu lewat QRIS bakal sangat membantu aku buat terus lanjut translate game-game lainnya 🙏
        </p>

        {settings?.qris_image ? (
          <img src={settings.qris_image} alt="QRIS Donasi" className="w-full max-w-xs mx-auto rounded-2xl border border-white/10" />
        ) : (
          <p className="text-gray-500 text-sm">QRIS belum diatur.</p>
        )}

        {settings?.donation_info && (
          <p className="text-gray-400 text-sm mt-4 whitespace-pre-line">{settings.donation_info}</p>
        )}

        <div className="flex gap-3 mt-8">
          {settings?.wa_group_url && (
            <a href={settings.wa_group_url} target="_blank" rel="noreferrer" className="flex-1 bg-green-600 py-2 rounded-xl text-sm font-medium">
              Grup WA
            </a>
          )}
          {settings?.discord_url && (
            <a href={settings.discord_url} target="_blank" rel="noreferrer" className="flex-1 bg-indigo-600 py-2 rounded-xl text-sm font-medium">
              Discord
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
