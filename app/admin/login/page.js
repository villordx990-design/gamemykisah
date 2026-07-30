'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      return;
    }
    router.push('/admin');
    router.refresh();
  }

  return (
    <form onSubmit={handleLogin} className="max-w-sm mx-auto mt-20 p-6 bg-white/5 rounded-2xl space-y-4">
      <h1 className="text-xl font-bold text-brand">Admin Login</h1>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        className="w-full bg-white/10 p-3 rounded-xl"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
        className="w-full bg-white/10 p-3 rounded-xl"
      />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button className="w-full bg-brand text-black font-semibold py-3 rounded-xl">Masuk</button>
    </form>
  );
}
