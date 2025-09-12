'use client';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-[#0D1117] text-white flex flex-col justify-between">
      {/* Top Navbar */}
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2">
          {/* Logo Icon Placeholder */}
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-black text-sm font-bold">
            🧠
          </div>
          <span className="text-lg font-semibold">Oration AI</span>
        </div>

        <div className='flex gap-3'>
          <button
            onClick={() => router.push('/login')}
            className="bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-gray-200 transition"
          >
           Login
          </button>

          <button
            onClick={() => router.push('/signup')}
            className="bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-gray-200 transition"
          >
            Signup
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex-grow flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight text-gray-100">
          Your Personal AI <br />
          Career Counselor
        </h1>
        <p className="mt-6 max-w-xl text-gray-400 text-lg sm:text-xl">
          Unify your professional journey. Oration AI helps you with expert guidance,
          interview prep, and planning your next career move — all in one place.
        </p>
      </div>

      {/* Optional Background Grid Effect */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:40px_40px] opacity-10" />
    </div>
  );
}
