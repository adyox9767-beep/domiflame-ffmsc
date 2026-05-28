"use client";

import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function VerifyPage({
  params,
  searchParams,
}: {
  params: {
    playerId: string;
  };
  searchParams: {
    team?: string;
  };
}) {

  const [loading, setLoading] =
    useState(true);

  const [player, setPlayer] =
    useState<any>(null);

  const [team, setTeam] =
    useState<any>(null);

  const verifyPlayer = async () => {
  try {
    const snapshot = await getDocs(collection(db, "registrations"));

    let foundPlayer = null;
    let foundTeam = null;

    snapshot.forEach((docItem) => {
      const data = docItem.data();

      // ✅ IMPORTANT: match team first (if QR has team id)
      if (searchParams?.team && docItem.id !== searchParams.team) {
        return;
      }

      const matched = data.players?.find(
        (p: any) => p.playerId === params.playerId
      );

      if (matched) {
        foundPlayer = matched;
        foundTeam = data;
      }
    });

    setPlayer(foundPlayer);
    setTeam(foundTeam);

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  // LOADING
  if (loading) {

    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">

        <h1 className="text-4xl font-black">
          Verifying Player...
        </h1>

      </main>
    );
  }

  // INVALID
  if (!player) {

    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6">

        <div className="rounded-[40px] border border-red-500/20 bg-white/5 p-10 text-center">

          <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-400">
            FFMSC SECURITY
          </p>

          <h1 className="mt-5 text-5xl font-black text-red-500">
            INVALID PLAYER
          </h1>

          <p className="mt-5 text-lg text-gray-300">
            This QR code is not valid.
          </p>

        </div>

      </main>
    );
  }

  // VALID
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 py-20 text-white">

      <div className="w-full max-w-2xl rounded-[40px] border border-cyan-400/20 bg-white/5 p-10">

        <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
          VERIFIED PLAYER
        </p>

        <h1 className="mt-5 text-5xl font-black">
          {player.name}
        </h1>

        <div className="mt-10 space-y-5">

          <div className="rounded-3xl border border-cyan-400/20 bg-black/30 p-5">

            <p className="text-sm text-gray-400">
              Team
            </p>

            <h2 className="mt-2 text-2xl font-black">
              {team.teamName}
            </h2>

          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-black/30 p-5">

            <p className="text-sm text-gray-400">
              Player UID
            </p>

            <h2 className="mt-2 text-2xl font-black">
              {player.uid}
            </h2>

          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-black/30 p-5">

            <p className="text-sm text-gray-400">
              Role
            </p>

            <h2 className="mt-2 text-2xl font-black">
              {player.role}
            </h2>

          </div>

          <div className="rounded-3xl border border-green-500/20 bg-green-500/10 p-5">

            <p className="text-sm text-green-300">
              Verification Status
            </p>

            <h2 className="mt-2 text-3xl font-black text-green-400">
              VALID PLAYER
            </h2>

          </div>

        </div>

      </div>
    </main>
  );
}