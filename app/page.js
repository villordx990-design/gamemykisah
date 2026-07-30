'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function HomePage() {
  const [settings, setSettings] = useState(null);
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      const { data: s } = await supabase.from('site_settings').select('*').eq('id', 1).single();
      setSettings(s);
      const { data: g } = await supabase.from('games').select('*').order('created_at', { ascending: false });
      setGames(g || []);
    }
    load();
  }, []);

  const filtered = games.filter((g) => g.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div
      style={{
        backgroundImage: settings?.background_image ? `url(${settings.background_image})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
      }}
    >
      <div className="min-h-screen bg-black/60">
        <header className="p-4 flex items-center justify-between bg-black/50 backdrop-blur sticky top-0 z-10">
          <h1 className="text-xl font-bold text-brand">GameMyKisah.</h1>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari game..."
            className="bg-white/10 px-4 py-2 rounded-full text-sm w-1/2"
          />
        </header>

        {settings?.banner_image && (
          <div className="px-4 mt-4">
            <img src={settings.banner_image} alt="Banner" className="w-full rounded-2xl object-cover max-h-60" />
          </div>
        )}

        <div className="flex gap-3 px-4 mt-4">
          {settings?.wa_group_url && (
            <a href={settings.wa_group_url} target="_blank" rel="noreferrer" className="flex-1 text-center bg-green-600 py-2 rounded-xl font-medium">
              Join Grup WA
            </a>
          )}
          {settings?.discord_url && (
            <a href={settings.discord_url} target="_blank" rel="noreferrer" className="flex-1 text-center bg-indigo-600 py-2 rounded-xl font-medium">
              Join Discord
            </a>
          )}
        </div>

        <main className="grid grid-cols-2 gap-4 p-4">
          {filtered.map((game) => (
            <Link key={game.id} href={`/game/${game.slug}`} className="bg-white/5 rounded-2xl p-3 hover:bg-white/10 transition">
              <img src={game.cover_image} alt={game.name} className="w-full h-28 object-cover rounded-xl mb-2" />
              <p className="font-semibold text-sm">{game.name}</p>
              <p className="text-xs text-gray-400">v{game.version}</p>
            </Link>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-2 text-center text-gray-400 py-10">Belum ada game.</p>
          )}
        </main>
      </div>
    </div>
  );
}
