"use client";

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

    <header className="fixed top-0 z-50 w-full border-b border-cyan-400/10 bg-black/70 backdrop-blur-xl">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-3"
        >

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500 text-xl font-black text-black">
            D
          </div>

          <div>

            <h1 className="text-lg font-black tracking-widest text-white">
              DOMIFLAME
            </h1>

            <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">
              ESPORTS
            </p>

          </div>
        </Link>

        {/* DESKTOP */}
        <nav className="hidden items-center gap-8 lg:flex">

          <a
            href="#rules"
            className="text-sm font-bold uppercase tracking-[0.2em] text-gray-300 transition hover:text-cyan-400"
          >
            Rules
          </a>

          {!user && (
            <>
              <Link
                href="/login"
                className="text-sm font-bold uppercase tracking-[0.2em] text-gray-300 transition hover:text-cyan-400"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="text-sm font-bold uppercase tracking-[0.2em] text-gray-300 transition hover:text-cyan-400"
              >
                Create Account
              </Link>
            </>
          )}

          <Link
            href="/admin-secure-portal-x92"
            className="text-sm font-bold uppercase tracking-[0.2em] text-gray-300 transition hover:text-cyan-400"
          >
            Admin
          </Link>

          <Link
            href={
              user
                ? "/dashboard"
                : "/signup"
            }
            className="rounded-full bg-cyan-500 px-6 py-3 text-sm font-black uppercase tracking-[0.15em] text-black transition hover:scale-105 hover:bg-cyan-400"
          >
            Register Team
          </Link>

          {user && (
            <button
              onClick={
                handleSignOut
              }
              className="rounded-full border border-red-400 px-5 py-3 text-sm font-black uppercase tracking-[0.15em] text-red-400 transition hover:bg-red-500 hover:text-white"
            >
              Logout
            </button>
          )}

        </nav>

        {/* MOBILE */}
        <div className="flex items-center gap-3 lg:hidden">

          <Link
            href={
              user
                ? "/dashboard"
                : "/signup"
            }
            className="rounded-full bg-cyan-500 px-5 py-3 text-sm font-black uppercase tracking-[0.15em] text-black"
          >
            Register
          </Link>

          {user && (
            <button
              onClick={
                handleSignOut
              }
              className="rounded-full border border-red-400 px-4 py-3 text-xs font-black uppercase tracking-[0.15em] text-red-400"
            >
              Logout
            </button>
          )}

        </div>

      </div>

    </header>
  );
}