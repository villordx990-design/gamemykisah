'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function Info({ label, value }) {
  return (
    <div className="bg-black/25 rounded-xl p-3">
      <p className="text-gray-400 text-xs">{label}</p>
      <p className="font-medium text-white">{value || '-'}</p>
    </div>
  );
}

export default function GameDetail() {
  const { slug } = useParams();
  const [game, setGame] = useState(null);
  const [settings, setSettings] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  function toggleMusic() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  }

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from('games').select('*').eq('slug', slug).single();
      if (error || !data) {
        setNotFound(true);
        return;
      }
      setGame(data);
      const { data: s } = await supabase.from('site_settings').select('*').eq('id', 1).single();
      setSettings(s);
    }
    load();
  }, [slug]);

  if (notFound) return <p className="p-6 text-center text-gray-400">Game tidak ditemukan.</p>;
  if (!game) return <p className="p-6 text-center text-gray-400">Memuat...</p>;

  const bgUrl = settings?.detail_background_image || settings?.background_image;
  const isVideoBg = bgUrl && /\.(mp4|webm|mov)(\?.*)?$/i.test(bgUrl);

  return (
    <div className="relative min-h-screen">
      {isVideoBg ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          src={bgUrl}
          className="fixed inset-0 w-full h-full object-cover -z-20"
        />
      ) : (
        <div
          className="fixed inset-0 -z-20"
          style={{
            backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      <div
        className="fixed inset-0 -z-10"
        style={{ backgroundColor: `rgba(0,0,0,${(settings?.bg_overlay ?? 60) / 100})` }}
      />

      <div className="relative max-w-xl mx-auto p-4">
        <img src={game.cover_image} alt={game.name} className="w-full rounded-2xl mb-4 object-cover max-h-72" />

        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold">{game.name}</h1>
            {game.label && game.label !== '-' && (
              <span className="text-xs bg-brand text-black font-bold px-2 py-1 rounded-full">{game.label}</span>
            )}
          </div>

          {game.genre && (
            <div className="flex flex-wrap gap-2 mb-3 mt-2">
              {game.genre.split(',').map((g) => (
                <span key={g} className="text-xs bg-white/10 px-2 py-1 rounded-full text-gray-200">{g.trim()}</span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 my-4 text-sm">
            <Info label="Developer" value={game.developer} />
            <Info label="Language" value="English, Indonesia" />
            <Info label="Versi" value={game.version} />
            <Info label="Status" value={game.status} />
            <Info label="Tanggal Rilis" value={game.release_date ? new Date(game.release_date).toLocaleDateString('id-ID') : '-'} />
            <Info label="Diupload" value={new Date(game.created_at).toLocaleDateString('id-ID')} />
          </div>

          <p className="text-gray-100 whitespace-pre-line">{game.synopsis}</p>
        </div>

        <div className="space-y-3 mt-4">
          {game.android_url && (
            <a href={game.android_url} className="btn-glow-green btn-shine flex items-center justify-center gap-2 bg-green-600 text-center py-3 rounded-xl font-semibold">
              <span>Download Versi Android</span>
              {game.android_size && <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full">{game.android_size}</span>}
            </a>
          )}
          {game.pc_url && (
            <a href={game.pc_url} className="btn-glow-blue btn-shine flex items-center justify-center gap-2 bg-blue-600 text-center py-3 rounded-xl font-semibold">
              <span>Download Versi PC</span>
              {game.pc_size && <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full">{game.pc_size}</span>}
            </a>
          )}
          {game.patch_url && (
            <a href={game.patch_url} className="btn-glow-purple btn-shine flex items-center justify-center gap-2 bg-purple-600 text-center py-3 rounded-xl font-semibold">
              <span>Download Patch</span>
              {game.patch_size && <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full">{game.patch_size}</span>}
            </a>
          )}
        </div>

        {settings?.tutorial_url && (
          <a href={settings.tutorial_url} target="_blank" rel="noreferrer" className="block text-center mt-4 text-brand underline">
            Lihat Tutorial Download & Install
          </a>
        )}
      </div>

      {settings?.bg_music_url && (
        <>
          <audio ref={audioRef} src={settings.bg_music_url} loop />
          <button
            onClick={toggleMusic}
            className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-brand text-black shadow-lg flex items-center justify-center text-2xl"
            aria-label="Putar/berhenti musik"
          >
            {isPlaying ? '⏸' : '♪'}
          </button>
        </>
      )}
    </div>
  );
}
