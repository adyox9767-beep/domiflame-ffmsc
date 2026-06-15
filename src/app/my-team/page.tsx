"use client";

import { useEffect, useState } from "react";

import {
  FaShieldAlt,
  FaWallet,
  FaTrophy,
  FaUsers,
  FaMars,
  FaVenus,
} from "react-icons/fa";

import { FaInstagram } from "react-icons/fa";

import "@fontsource/orbitron/700.css";
import "@fontsource/orbitron/900.css";

import { doc, updateDoc } from "firebase/firestore";
import { uploadToSupabase } from "@/utils/uploadToSupabase";

import Link from "next/link";

import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import {
  onAuthStateChanged,
} from "firebase/auth";

import { auth, db } from "@/lib/firebase";

import Navbar from "@/components/Navbar";

export default function MyTeamPage() {

  const [loading, setLoading] =
    useState(true);

    const [selectedPlayerIndex, setSelectedPlayerIndex] =
  useState<number | null>(null);

const [uploadingPhoto, setUploadingPhoto] =
  useState(false);
    
  const [team, setTeam] =
    useState<any>(null);

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {

          if (!user?.email) {
            setLoading(false);
            return;
          }

          try {

            const q = query(
              collection(
                db,
                "registrations"
              ),
              where(
                "captainEmail",
                "==",
                user.email
              )
            );

            const snapshot =
              await getDocs(q);

            if (!snapshot.empty) {

              setTeam({
                id:
                  snapshot.docs[0].id,
                ...snapshot.docs[0].data(),
              });
            }

          } catch (error) {

            console.error(error);

          } finally {

            setLoading(false);
          }
        }
      );

    return () => unsubscribe();

  }, []);

  const selectedPlayer =
  selectedPlayerIndex !== null
    ? team?.players?.[selectedPlayerIndex]
    : null;

const openPlayerDetails = (index: number) => {
  setSelectedPlayerIndex(index);
};

const closePlayerDetails = () => {
  setSelectedPlayerIndex(null);
};

const uploadPlayerPhoto = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file || selectedPlayerIndex === null || !team) {
    return;
  }

  try {
    setUploadingPhoto(true);

    const imageUrl = await uploadToSupabase(
      file,
      "ffmsc"
    );

    const updatedPlayers = [...team.players];

    updatedPlayers[selectedPlayerIndex] = {
      ...updatedPlayers[selectedPlayerIndex],
      photoUrl: imageUrl,
    };

    await updateDoc(doc(db, "registrations", team.id), {
      players: updatedPlayers,
    });

    setTeam({
      ...team,
      players: updatedPlayers,
    });

    alert("Player photo uploaded 👍");
  } catch (error) {
    console.error(error);
    alert("Photo upload failed");
  } finally {
    setUploadingPhoto(false);
  }
};

  // LOADING
  if (loading) {

    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">

        <h1 className="text-4xl font-black">
          Loading Team...
        </h1>

      </main>
    );
  }

  // NO TEAM
  if (!team) {

    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">

        <div className="text-center">

          <h1 className="text-5xl font-black">
            No Team Found
          </h1>

          <p className="mt-4 text-gray-400">
            You have not registered yet.
          </p>

        </div>

      </main>
    );
  }

  return (
  <>
    <Navbar />
    <main className="min-h-screen bg-[#020506] px-4 pb-10 pt-20 text-white sm:px-6 lg:pb-14 lg:pt-24">

  <div className="mx-auto max-w-[1120px]">

    {/* HERO TEAM CARD */}
    <div className="relative min-h-[205px] overflow-hidden rounded-[26px] border border-cyan-300/55 bg-[#020607] p-5 shadow-[0_0_18px_rgba(34,211,238,0.32),0_0_42px_rgba(34,211,238,0.12),inset_0_0_22px_rgba(34,211,238,0.07)] sm:p-6">

      <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-300/40 shadow-[0_0_14px_rgba(34,211,238,0.75)]" />
<div className="absolute -right-20 top-0 h-full w-[48%] border-l-2 border-cyan-300/90 bg-cyan-600/[0.05] shadow-[12px_0_35px_rgba(34,211,238,0.22)] skew-x-[-18deg]" />



      <div className="relative z-10 flex min-h-[160px] items-center justify-between gap-5">

        <div className="min-w-0">

          <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-400">
            › MY TEAM
          </p>

          <h1 className="mt-5 break-words font-['Orbitron'] text-4xl font-black uppercase leading-none tracking-tight text-white sm:text-6xl">
            {team.teamName}
          </h1>

          <p className="mt-4 text-lg font-semibold text-gray-300">
            Captain: <span className="text-white">{team.captainName}</span>
          </p>

  </div>

        {team.teamLogo && (
  <div className="relative hidden h-56 w-[360px] shrink-0 items-center justify-center overflow-hidden md:flex">

    <div className="absolute right-[-12px] top-1/2 h-[250px] w-[250px] -translate-y-1/2 rounded-full border border-cyan-400/10" />
    <div className="absolute right-[2px] top-1/2 h-[220px] w-[220px] -translate-y-1/2 rounded-full border border-cyan-400/18" />
    <div className="absolute right-[18px] top-1/2 h-[190px] w-[190px] -translate-y-1/2 rounded-full border border-cyan-400/35" />
    <div className="absolute right-[34px] top-1/2 h-[160px] w-[160px] -translate-y-1/2 rounded-full border-2 border-cyan-300/90 shadow-[0_0_36px_rgba(34,211,238,0.65)]" />

    <div className="absolute right-[84px] top-1/2 h-[145px] w-[145px] -translate-y-1/2 rounded-full bg-cyan-400/[0.08] blur-sm" />

        <div className="absolute right-[54px] top-1/2 h-[120px] w-[120px] -translate-y-1/2 rounded-full bg-black/60" />

    <img
      src={team.teamLogo}
      alt="Team Logo"
      className="absolute right-[54px] top-1/2 h-[120px] w-[120px] -translate-y-1/2 rounded-full border-[4px] border-black object-cover shadow-[0_0_22px_rgba(34,211,238,0.35)]"
    />

  </div>
)}
      </div>
    </div>

    {/* STATUS CARDS */}
    <div className="mt-5 grid gap-4 md:grid-cols-3">

      <div className="relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-[#081114] p-6 shadow-xl shadow-cyan-500/10 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-cyan-400">
  <div className="relative flex h-full items-center gap-5">

 <div className="relative h-[88px] w-[88px] shrink-0">
  <svg
    viewBox="0 0 100 100"
    className="absolute inset-0 h-full w-full overflow-visible"
  >
    <polygon
      points="50,4 90,27 90,73 50,96 10,73 10,27"
      fill="rgba(34,211,238,0.12)"
      stroke="rgba(34,211,238,0.95)"
      strokeWidth="3"
      style={{
        filter:
"drop-shadow(0 0 14px rgba(34,211,238,0.55))",
      }}
    />
  </svg>

  <div className="absolute inset-0 flex items-center justify-center text-cyan-300">
    <FaShieldAlt className="text-[32px]" />
  </div>
</div>

<div className="-mt-1">
    <p className="text-xs font-black uppercase tracking-[0.25em] text-gray-400">
      Registration
    </p>

<h2 className="mt-1 text-2xl font-black uppercase text-cyan-400">      {team.status || "Pending"}
    </h2>
  </div>

  <span className="ml-auto rounded-full border border-cyan-400/30 px-3 py-1 text-xs font-black text-cyan-300">
    ✓
  </span>

</div>
</div>

     <div className="relative overflow-hidden rounded-2xl border border-green-400/20 bg-[#081114] p-6 shadow-xl shadow-green-500/10 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-green-400">
  <div className="relative flex h-full items-center gap-5">

    <div className="relative h-[88px] w-[88px] shrink-0">
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        <polygon
          points="50,4 90,27 90,73 50,96 10,73 10,27"
          fill="rgba(34,197,94,0.12)"
          stroke="rgba(34,197,94,0.95)"
          strokeWidth="3"
          style={{
            filter:
              "drop-shadow(0 0 14px rgba(34,197,94,0.55))",
          }}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center text-green-300">
        <FaWallet className="text-[32px]" />
      </div>
    </div>

    <div className="-mt-1">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-gray-400">
        Payment
      </p>

      <h2 className="mt-1 text-2xl font-black uppercase text-green-400">
        {team.paymentStatus || "Pending"}
      </h2>
    </div>

    <span className="ml-auto rounded-full border border-green-400/30 px-3 py-1 text-xs font-black text-green-300">
      ✓
    </span>

  </div>
</div>

     <div className="relative overflow-hidden rounded-2xl border border-yellow-400/20 bg-[#081114] p-6 shadow-xl shadow-yellow-500/10 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-yellow-400">
  <div className="relative flex h-full items-center gap-5">

    <div className="relative h-[88px] w-[88px] shrink-0">
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        <polygon
          points="50,4 90,27 90,73 50,96 10,73 10,27"
          fill="rgba(234,179,8,0.12)"
          stroke="rgba(234,179,8,0.95)"
          strokeWidth="3"
          style={{
            filter:
              "drop-shadow(0 0 14px rgba(234,179,8,0.55))",
          }}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center text-yellow-300">
        <FaTrophy className="text-[32px]" />
      </div>
    </div>

    <div className="-mt-1">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-gray-400">
        Slot Number
      </p>

      <h2 className="mt-1 text-3xl font-black uppercase text-yellow-400">
        {team.slotNumber || "Pending"}
      </h2>
    </div>

    <span className="ml-auto rounded-full border border-yellow-400/30 px-3 py-1 text-xs font-black text-yellow-300">
      ✓
    </span>

  </div>
</div>

    </div>

    {/* TEAM ROSTER */}
    <div className="mt-8">

      <div className="mb-4 flex items-center justify-between gap-4">
  <div className="rounded-xl border-l-4 border-cyan-400 bg-white/[0.04] px-5 py-3">
    <h2 className="font-['Orbitron'] text-2xl font-black uppercase tracking-wide text-white">
      Team Roster
    </h2>
  </div>

  <span className="flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-black uppercase tracking-wide text-cyan-300 shadow-lg shadow-cyan-400/10">
  <FaUsers className="text-base" />
  {team.players?.length || 0} Members
</span>
</div>

      <div className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-[#071014] shadow-2xl shadow-cyan-500/10">

<div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
<div className="pointer-events-none absolute -right-20 bottom-10 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />

        {team.players?.map((player: any, index: number) => (

          <div
  key={index}
  onClick={() => openPlayerDetails(index)}
  className="relative group grid cursor-pointer grid-cols-[52px_52px_1fr] items-center gap-3 border-b border-white/10 px-4 py-3 transition last:border-b-0 hover:bg-cyan-400/5 sm:grid-cols-[60px_64px_1fr_130px_1fr]"
>

            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-sm font-black text-cyan-300 shadow-lg shadow-cyan-400/10">
  <div className="absolute inset-0 rounded-2xl bg-cyan-400/10 blur-md" />
  <span className="relative">
    {String(index + 1).padStart(2, "0")}
  </span>
</div>

<div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/40 shadow-lg shadow-black/30 sm:h-14 sm:w-14">
  {player.photoUrl ? (
    <img
      src={player.photoUrl}
      alt={player.name}
      className="h-full w-full rounded-full object-cover"
    />
  ) : (
    <span className="text-lg font-black uppercase text-cyan-300">
      {(player.name || "P").charAt(0)}
    </span>
  )}
</div>

              <div className="min-w-0"> 
               <h3 className="truncate text-xl font-black uppercase tracking-tight text-white">
                {player.name || "Player Name"}
              </h3>

              <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-gray-500">
                UID:
                <span className="ml-2 font-bold text-cyan-300">
                  {player.uid || "-"}
                </span>
              </p>
            </div>

            <p className="hidden items-center gap-2 text-sm font-semibold text-gray-300 sm:flex">
  {(player.gender || "").toLowerCase() === "female" ? (
    <FaVenus className="text-pink-400" />
  ) : (
    <FaMars className="text-cyan-400" />
  )}

  {player.gender || "-"}
</p>

            <div className="col-span-2 flex justify-start sm:col-span-1 sm:justify-end">
  <span className="max-w-full break-all rounded-lg border border-cyan-400/20 bg-cyan-400/5 px-3 py-2 text-xs font-black tracking-wide text-cyan-300">
    {player.playerId || "ID Pending"}
  </span>
</div>
          </div>
        ))}

      </div>
    </div>

  </div>
</main>

{selectedPlayer && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-md">
    <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-cyan-400/30 bg-[#071014] p-6 text-white shadow-2xl shadow-cyan-500/20">

      <button
        onClick={closePlayerDetails}
        className="absolute right-4 top-4 rounded-full border border-white/20 px-4 py-2 text-sm font-black text-white hover:bg-white/10"
      >
        ✕
      </button>

      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex flex-col items-center">
          <div className="h-36 w-36 overflow-hidden rounded-full border-4 border-cyan-400 bg-black shadow-xl shadow-cyan-400/30">
            {selectedPlayer.photoUrl ? (
              <img
                src={selectedPlayer.photoUrl}
                alt={selectedPlayer.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-5xl font-black text-cyan-300">
                {(selectedPlayer.name || "P").charAt(0)}
              </div>
            )}
          </div>

          <label className="mt-5 cursor-pointer rounded-full bg-cyan-400 px-5 py-3 text-sm font-black text-black hover:bg-cyan-300">
            {uploadingPhoto ? "Uploading..." : "Upload Photo"}
            <input
              type="file"
              accept="image/*"
              onChange={uploadPlayerPhoto}
              className="hidden"
              disabled={uploadingPhoto}
            />
          </label>
        </div>

        <div className="flex-1">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400">
            Player Details
          </p>

          <h2 className="mt-3 font-['Orbitron'] text-4xl font-black uppercase">
            {selectedPlayer.name || "Player Name"}
          </h2>

          <div className="mt-5 grid gap-3 text-sm">
            <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              UID:{" "}
              <span className="font-black text-cyan-300">
                {selectedPlayer.uid || "-"}
              </span>
            </p>

            <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              Gender:{" "}
              <span className="font-black text-cyan-300">
                {selectedPlayer.gender || "-"}
              </span>
            </p>

            <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              Player ID:{" "}
              <span className="font-black text-cyan-300">
                {selectedPlayer.playerId || "ID Pending"}
              </span>
            </p>
          </div>

          {selectedPlayer.finalCardUrl ? (
            <div className="mt-6">
              <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-cyan-400">
                Final ID Card
              </p>

              <img
                src={selectedPlayer.finalCardUrl}
                alt="Final ID Card"
                className="max-h-[320px] w-full rounded-2xl border border-cyan-400/20 object-contain"
              />

              <a
                href={selectedPlayer.finalCardUrl}
                target="_blank"
                download
                className="mt-4 inline-block rounded-full bg-green-400 px-6 py-3 text-sm font-black text-black hover:bg-green-300"
              >
                Download ID Card
              </a>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-4 text-sm font-bold text-yellow-300">
              COMING SOON
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}

<footer className="bg-[#020506] px-4 pb-6 pt-2 text-white sm:px-6">
  <div className="relative mx-auto max-w-[1120px] overflow-hidden rounded-t-[28px] border border-cyan-400/20 bg-[#050a0c] px-8 py-5 shadow-[0_0_30px_rgba(34,211,238,0.08)]">

    <div className="absolute -left-10 top-0 h-full w-16 skew-x-[-28deg] border-r border-cyan-400/25 bg-cyan-400/[0.03]" />

    <div className="absolute -right-10 top-0 h-full w-16 skew-x-[28deg] border-l border-cyan-400/25 bg-cyan-400/[0.03]" />

    <div className="relative flex flex-col gap-5 text-center md:flex-row md:items-center md:justify-between md:text-left">

      <div className="flex items-center justify-center gap-3 md:justify-start">
        <img
  src="/domiflame-symbol.png"
  alt="Domiflame"
  className="h-12 w-12 object-contain"
/>

        <div>
          <p className="font-['Orbitron'] text-sm font-black uppercase tracking-wide text-white">
            DOMIFLAME ESPORTS
          </p>
          <p className="mt-1 text-xs text-gray-400">
           IGNITE. DOMINATE. CONQUER.
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        © 2026 FFMSC. All rights reserved.
      </p>

      <div className="flex items-center gap-5">
  <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">
    FOLLOW US
  </p>

  <a
    href="https://www.instagram.com/domiflame.in"
    target="_blank"
    rel="noopener noreferrer"
    className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-400/20 bg-white/[0.03] text-cyan-300 transition hover:border-cyan-400 hover:shadow-[0_0_18px_rgba(34,211,238,0.45)]"
  >
    <FaInstagram />
  </a>

  <a
    href="https://www.instagram.com/domiflame.ffm"
    target="_blank"
    rel="noopener noreferrer"
    className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-400/20 bg-white/[0.03] text-cyan-300 transition hover:border-cyan-400 hover:shadow-[0_0_18px_rgba(34,211,238,0.45)]"
  >
    <FaInstagram />
  </a>
</div>

    </div>
  </div>
</footer>

    </>
  );
}