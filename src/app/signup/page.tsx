'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { trpc } from '@/lib/trpc';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Get the signup mutation from tRPC.
  const signupMutation = trpc.auth.signup.useMutation({
    onSuccess: () => {
      alert('Account created successfully! Please sign in.');
      router.push('/login');
    },
    onError: (error) => {
      console.error("Signup failed:", error);
      alert(error.message);
    }
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    signupMutation.mutate({ email, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0D1117] text-white relative px-4">
      {/* Optional grid background for visual effect */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:40px_40px] opacity-10" />

      {/* Main card wrapper */}
      <div className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl p-8">
        {/* Header section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Create an Account</h2>
          <p className="text-gray-400">Enter your details to get started.</p>
        </div>

        {/* Form section */}
        <form onSubmit={handleSignup} className="space-y-6 mt-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-gray-800/50 text-white px-3 py-2 placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-gray-800/50 text-white px-3 py-2 placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
            disabled={signupMutation.status === 'pending'}
          >
            {signupMutation.status === 'pending' ? 'Creating Account...' : 'Sign Up'}
          </button>
          {signupMutation.status === 'error' && (
            <p className="text-center text-red-500 text-sm mt-4">
              {signupMutation.error?.message}
            </p>
          )}
        </form>

        {/* Redirect to login page */}
        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <button
            onClick={() => router.push('/login')}
            className="text-blue-400 hover:text-blue-300 font-medium transition duration-300"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}