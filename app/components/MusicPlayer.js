'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function MusicPlayer() {
  const [musicUrl, setMusicUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('site_settings').select('bg_music_url').eq('id', 1).single();
      if (data?.bg_music_url) setMusicUrl(data.bg_music_url);
    }
    load();
  }, []);

  function toggleMusic() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  }

  if (!musicUrl) return null;

  return (
    <>
      <audio ref={audioRef} src={musicUrl} loop />
      <button
        onClick={toggleMusic}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-brand text-black shadow-lg flex items-center justify-center text-2xl"
        aria-label="Putar/berhenti musik"
      >
        {isPlaying ? '⏸' : '♪'}
      </button>
    </>
  );
}
