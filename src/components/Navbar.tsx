"use client";

import Image from "next/image";

import Link from "next/link";

import {
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  useEffect,
  useState,
} from "react";

import { auth } from "@/lib/firebase";

import { useRouter } from "next/navigation";

export default function Navbar() {

  const router = useRouter();

const [accountOpen, setAccountOpen] = useState(false);

  const [user,
    setUser] =
    useState<any>(null);

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser) => {

          setUser(currentUser);
        }
      );

    return () => unsubscribe();

  }, []);

  const handleSignOut =
    async () => {

      try {

        await signOut(auth);

        router.push("/login");

      } catch (error) {

        console.error(
          "Error signing out:",
          error
        );
      }
    };

  return (

    <header className="fixed top-0 z-50 w-full border-b border-cyan-400/10 bg-transparent backdrop-blur-xl">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        {/* LOGO */}
        <Link
  href="/"
  className="flex items-center"
>
  <Image
    src="/logo.png"
    alt="Domiflame Esports"
    width={220}
    height={70}
    priority
    className="h-auto w-[170px] sm:w-[210px] object-contain"
  />
</Link>

        {/* DESKTOP */}
        <nav className="hidden items-center gap-8 lg:flex">

          <a
            href="#rules"
            className="text-sm font-bold uppercase tracking-[0.2em] text-gray-300 transition hover:text-cyan-400"
          >
            Rules
          </a>

          {user && (
  <Link
    href="/my-team"
    className="text-sm font-bold uppercase tracking-[0.2em] text-gray-300 transition hover:text-cyan-400"
  >
    My Team
  </Link>
)}

          {user && (
  <div className="relative">
    <button
      onClick={() => setAccountOpen(!accountOpen)}
      className="rounded-full border border-cyan-400 px-5 py-3 text-sm font-black uppercase tracking-[0.15em] text-cyan-400"
    >
      Account
    </button>

    {accountOpen && (
      <div className="absolute right-0 mt-4 w-48 rounded-2xl border border-cyan-400/20 bg-black p-4 shadow-xl">
        <Link
          href="/my-team"
          className="block rounded-xl px-4 py-3 text-sm font-bold text-white hover:bg-white/10"
        >
          My Team
        </Link>

        <button
          onClick={handleSignOut}
          className="mt-2 w-full rounded-xl px-4 py-3 text-left text-sm font-bold text-red-400 hover:bg-red-500/10"
        >
          Logout
        </button>
      </div>
    )}
  </div>
)}

        </nav>

        {/* MOBILE */}
        <div className="flex items-center gap-3 lg:hidden">

{user && (
  <Link
    href="/my-team"
    className="rounded-full bg-cyan-500 px-4 py-3 text-xs font-black uppercase tracking-[0.15em] text-black"
  >
    My Team
  </Link>
)}

          {user && (
  <div className="relative">
    <button
      onClick={() => setAccountOpen(!accountOpen)}
      className="rounded-full border border-cyan-400 px-5 py-3 text-sm font-black uppercase tracking-[0.15em] text-cyan-400"
    >
      Account
    </button>

    {accountOpen && (
      <div className="absolute right-0 mt-4 w-48 rounded-2xl border border-cyan-400/20 bg-black p-4 shadow-xl">
        <Link
          href="/my-team"
          className="block rounded-xl px-4 py-3 text-sm font-bold text-white hover:bg-white/10"
        >
          My Team
        </Link>

        <button
          onClick={handleSignOut}
          className="mt-2 w-full rounded-xl px-4 py-3 text-left text-sm font-bold text-red-400 hover:bg-red-500/10"
        >
          Logout
        </button>
      </div>
    )}
  </div>
)}

        </div>

      </div>

    </header>
  );
}