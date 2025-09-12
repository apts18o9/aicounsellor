'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Dummy auth logic; replace with real API call
    if (email && password) {
      router.push('/chat');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0D1117] text-white relative px-4">
      {/* Optional grid background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:40px_40px] opacity-10" />

      <div className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Sign in to your account
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="space-y-6"
        >
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-[#161B22] text-white px-3 py-2 placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
              placeholder="you@example.com"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-[#161B22] text-white px-3 py-2 placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
              placeholder="••••••••"
            />
          </div>

          {/* Sign in Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
          >
            Sign in
          </button>
        </form>

        {/* Sign up redirect */}
        <div className="mt-6 text-center text-sm text-gray-400">
          Not a member?{' '}
          <button
            onClick={() => router.push('/signup')}
            className="text-blue-400 hover:text-blue-300 font-medium transition duration-300"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
