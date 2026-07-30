'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function HomePage() {
  const [settings, setSettings] = useState(null);
  const [games, setGames] = useState([]);
  const [search, setSearch] = useState('');
  const [activeGenre, setActiveGenre] = useState('Semua');
  const [showGenreModal, setShowGenreModal] = useState(false);
  const [genreSearch, setGenreSearch] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  useEffect(() => {
    async function load() {
      const { data: s } = await supabase.from('site_settings').select('*').eq('id', 1).single();
      setSettings(s);
      const { data: g } = await supabase.from('games').select('*').order('created_at', { ascending: false });
      setGames(g || []);
    }
    load();
  }, []);

  const allGenres = Array.from(
    new Set(games.flatMap((g) => (g.genre ? g.genre.split(',').map((x) => x.trim()) : [])))
  ).filter(Boolean);

  const genreOptions = allGenres.filter((g) => g.toLowerCase().includes(genreSearch.toLowerCase()));

  const filtered = games.filter((g) => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase());
    const matchGenre = activeGenre === 'Semua' || (g.genre && g.genre.split(',').map((x) => x.trim()).includes(activeGenre));
    return matchSearch && matchGenre;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [search, activeGenre]);

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
      <div className="min-h-screen" style={{ backgroundColor: `rgba(0,0,0,${(settings?.bg_overlay ?? 60) / 100})` }}>
        <header className="p-4 flex items-center justify-between bg-black/50 backdrop-blur sticky top-0 z-10 gap-3">
          <h1 className="text-xl font-bold text-brand">GameMyKisah.</h1>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari game..."
            className="bg-white/10 px-4 py-2 rounded-full text-sm flex-1"
          />
          <Link href="/support" className="text-xs text-brand whitespace-nowrap">Support ♥</Link>
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

        {allGenres.length > 0 && (
          <div className="px-4 mt-4">
            <button
              onClick={() => setShowGenreModal(true)}
              className="w-full flex items-center justify-between bg-white/10 px-4 py-2.5 rounded-xl text-sm"
            >
              <span>Genre: <span className="text-brand font-medium">{activeGenre}</span></span>
              <span className="text-gray-400">▾</span>
            </button>
          </div>
        )}

        {showGenreModal && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-end" onClick={() => setShowGenreModal(false)}>
            <div
              className="bg-[#111815] w-full max-h-[75vh] rounded-t-2xl p-4 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Pilih Genre</h3>
                <button onClick={() => setShowGenreModal(false)} className="text-gray-400 text-xl leading-none">×</button>
              </div>
              <input
                autoFocus
                value={genreSearch}
                onChange={(e) => setGenreSearch(e.target.value)}
                placeholder="Cari genre..."
                className="bg-white/10 px-4 py-2 rounded-full text-sm mb-3"
              />
              <div className="overflow-y-auto space-y-1">
                <button
                  onClick={() => { setActiveGenre('Semua'); setShowGenreModal(false); setGenreSearch(''); }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm ${activeGenre === 'Semua' ? 'bg-brand text-black font-semibold' : 'hover:bg-white/5'}`}
                >
                  Semua Genre
                </button>
                {genreOptions.map((g) => (
                  <button
                    key={g}
                    onClick={() => { setActiveGenre(g); setShowGenreModal(false); setGenreSearch(''); }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm ${activeGenre === g ? 'bg-brand text-black font-semibold' : 'hover:bg-white/5'}`}
                  >
                    {g}
                  </button>
                ))}
                {genreOptions.length === 0 && (
                  <p className="text-gray-500 text-sm text-center py-4">Genre tidak ditemukan.</p>
                )}
              </div>
            </div>
          </div>
        )}

        <main className="grid grid-cols-2 gap-4 p-4">
          {paginated.map((game) => (
            <Link key={game.id} href={`/game/${game.slug}`} className="relative bg-white/5 rounded-2xl p-3 hover:bg-white/10 transition">
              {game.label && game.label !== '-' && (
                <span className="absolute top-2 left-2 text-[10px] bg-brand text-black font-bold px-2 py-0.5 rounded-full z-10">{game.label}</span>
              )}
              <img src={game.cover_image} alt={game.name} className="w-full h-28 object-cover rounded-xl mb-2" />
              <p className="font-semibold text-sm">{game.name}</p>
              <p className="text-xs text-gray-400">v{game.version} · {game.status || 'Ongoing'}</p>
            </Link>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-2 text-center text-gray-400 py-10">Belum ada game.</p>
          )}
        </main>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pb-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg text-sm bg-white/10 disabled:opacity-30"
            >
              ‹ Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-9 h-9 rounded-lg text-sm ${currentPage === n ? 'bg-brand text-black font-semibold' : 'bg-white/10 text-gray-300'}`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg text-sm bg-white/10 disabled:opacity-30"
            >
              Next ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
