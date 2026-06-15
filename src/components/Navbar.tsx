"use client";

import Image from "next/image";

import Link from "next/link";

import {
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  FaUsers,
  FaSignOutAlt,
  FaPhoneAlt,
  FaCheckCircle,
} from "react-icons/fa";

import {
  useEffect,
  useState,
} from "react";

import { auth, db } from "@/lib/firebase";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { useRouter } from "next/navigation";

export default function Navbar() {

  const router = useRouter();

const [accountOpen, setAccountOpen] = useState(false);

  const [user,
    setUser] =
    useState<any>(null);

    const [team, setTeam] =
  useState<any>(null);

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(
    auth,
    async (currentUser) => {
      setUser(currentUser);

      if (!currentUser?.email) {
        setTeam(null);
        return;
      }

      try {
        const q = query(
          collection(db, "registrations"),
          where("captainEmail", "==", currentUser.email)
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const teamData = {
            id: snapshot.docs[0].id,
            ...snapshot.docs[0].data(),
          };

          console.log("NAVBAR TEAM:", teamData);

          setTeam(teamData);
        } else {
          console.log("No team found for navbar");
          setTeam(null);
        }
      } catch (error) {
        console.error("Navbar team fetch error:", error);
      }
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

    <header className="fixed top-0 z-50 w-full border-b border-cyan-400/15 bg-[#020506]/95 backdrop-blur-xl">

      <div className="mx-auto flex max-w-[1320px] items-center justify-between px-6 py-4">

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
        <nav className="hidden flex-1 items-center justify-center gap-12 lg:flex">

  <Link
    href="/"
    className="text-sm font-black uppercase tracking-[0.18em] text-white transition hover:text-cyan-400"
  >
    Home
  </Link>

  <a
    href="/#rules"
    className="text-sm font-black uppercase tracking-[0.18em] text-white transition hover:text-cyan-400"
  >
    Rules
  </a>

  <Link
    href="/contact"
    className="text-sm font-black uppercase tracking-[0.18em] text-white transition hover:text-cyan-400"
  >
    Contact
  </Link>

</nav>

{user && (
  <div className="relative hidden lg:block">
    <button
      onClick={() => setAccountOpen(!accountOpen)}
      className="rounded-full border border-cyan-400/70 px-6 py-3 text-sm font-black uppercase tracking-[0.15em] text-white shadow-[0_0_14px_rgba(34,211,238,0.15)]"
    >
      Account
    </button>

    {accountOpen && (
  <div className="absolute right-0 mt-5 w-[340px] overflow-hidden rounded-[26px] border border-cyan-400/50 bg-[#061013]/95 text-white shadow-[0_0_35px_rgba(34,211,238,0.25)] backdrop-blur-xl">

    <div className="absolute left-0 top-0 h-10 w-10 border-l-2 border-t-2 border-cyan-300" />
    <div className="absolute right-0 top-0 h-10 w-10 border-r-2 border-t-2 border-cyan-300" />

    <div className="p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-cyan-400/70 bg-black shadow-[0_0_22px_rgba(34,211,238,0.35)]">
          <img
  src={team?.teamLogo || "/logo.png"}
  alt="Team Logo"
  className="h-full w-full object-cover"
/>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-['Orbitron'] text-2xl font-black uppercase text-white">
              {team?.teamName || "Account"}
            </h3>
            <FaCheckCircle className="text-cyan-400" />
          </div>

          <p className="mt-1 text-lg font-bold text-cyan-400">
            {team?.captainName || "Captain"}
          </p>

          <p className="mt-2 flex items-center gap-2 text-sm text-gray-300">
            <FaPhoneAlt className="text-cyan-400" />
           {team?.captainPhone || "No phone"}
          </p>
        </div>
      </div>

      <div className="mt-6 h-px w-full bg-cyan-400/25" />

      <Link
        href="/my-team"
        onClick={() => setAccountOpen(false)}
        className="mt-4 flex items-center justify-between rounded-2xl px-4 py-4 transition hover:bg-cyan-400/10 hover:shadow-[0_0_18px_rgba(34,211,238,0.16)]"
      >
        <div className="flex items-center gap-4">
          <FaUsers className="text-2xl text-cyan-300" />

          <div>
            <p className="font-['Orbitron'] text-lg font-black uppercase text-white">
              My Squad
            </p>
            <p className="mt-1 text-xs text-gray-400">
              View and manage your squad
            </p>
          </div>
        </div>

        <span className="text-3xl text-white">
          ›
        </span>
      </Link>
    </div>

    <button
      onClick={handleSignOut}
      className="flex w-full items-center gap-5 border-t border-red-400/40 bg-red-500/10 px-8 py-6 text-left transition hover:bg-red-500/15"
    >
      <FaSignOutAlt className="text-3xl text-red-400" />

      <div>
        <p className="font-['Orbitron'] text-xl font-black uppercase text-red-400">
          Logout
        </p>
        <p className="mt-1 text-sm text-red-300">
          Sign out from your account
        </p>
      </div>
    </button>

    <div className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-red-400" />
    <div className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-red-400" />
  </div>
)}

  </div>
)}

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