import React, { useState } from 'react';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    const fallbackUser = [
      { id: 'usr-1', email: 'ali.admin@ytms.app' },
      { id: 'usr-2', email: 'ahmed.editor@ytms.app' },
      { id: 'usr-3', email: 'sarah.script@ytms.app' },
      { id: 'usr-4', email: 'usman.research@ytms.app' },
      { id: 'usr-5', email: 'maya.uploader@ytms.app' }
    ].find((user) => user.email === normalizedEmail);

    if (fallbackUser && password === '123456') {
      onLogin(fallbackUser.id);
      return;
    }

    setError('Invalid email or password. Try any seeded email with password 123456.');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-black/40">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-2xl font-semibold text-white">
            YT
          </div>
          <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to the YouTube Management Studio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none ring-0"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white outline-none ring-0"
              placeholder="Enter password"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition hover:bg-red-500"
          >
            Sign in
          </button>
        </form>

        <div className="mt-6 rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-400">
          Demo credentials: use any seeded email and password <span className="font-semibold text-white">123456</span>
        </div>
      </div>
    </div>
  );
}
