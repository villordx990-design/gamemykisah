'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function Info({ label, value }) {
  return (
    <div className="bg-white/5 rounded-xl p-3">
      <p className="text-gray-400 text-xs">{label}</p>
      <p className="font-medium">{value || '-'}</p>
    </div>
  );
}

export default function GameDetail() {
  const { slug } = useParams();
  const [game, setGame] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from('games').select('*').eq('slug', slug).single();
      if (error || !data) {
        setNotFound(true);
        return;
      }
      setGame(data);
    }
    load();
  }, [slug]);

  if (notFound) return <p className="p-6 text-center text-gray-400">Game tidak ditemukan.</p>;
  if (!game) return <p className="p-6 text-center text-gray-400">Memuat...</p>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <img src={game.cover_image} alt={game.name} className="w-full rounded-2xl mb-4 object-cover max-h-72" />
      <h1 className="text-2xl font-bold">{game.name}</h1>

      <div className="grid grid-cols-2 gap-3 my-4 text-sm">
        <Info label="Developer" value={game.developer} />
        <Info label="Size" value={game.size} />
        <Info label="Versi" value={game.version} />
        <Info label="Diupload" value={new Date(game.created_at).toLocaleDateString('id-ID')} />
      </div>

      <p className="text-gray-300 mb-6 whitespace-pre-line">{game.synopsis}</p>

      <div className="space-y-3">
        {game.android_url && (
          <a href={game.android_url} className="block bg-green-600 text-center py-3 rounded-xl font-semibold">
            Download Versi Android
          </a>
        )}
        {game.pc_url && (
          <a href={game.pc_url} className="block bg-blue-600 text-center py-3 rounded-xl font-semibold">
            Download Versi PC
          </a>
        )}
        {game.patch_url && (
          <a href={game.patch_url} className="block bg-purple-600 text-center py-3 rounded-xl font-semibold">
            Download Patch
          </a>
        )}
      </div>

      {game.tutorial_url && (
        <a href={game.tutorial_url} target="_blank" rel="noreferrer" className="block text-center mt-4 text-brand underline">
          Lihat Tutorial Download & Install
        </a>
      )}
    </div>
  );
}
