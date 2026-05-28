"use client";

import { useEffect, useState } from "react";

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

export default function MyTeamPage() {

  const [loading, setLoading] =
    useState(true);
    
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

const cardReady = team?.idCard?.imageUrl && team.idCard.imageUrl !== "";

    return () => unsubscribe();

  }, []);

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
    <main className="min-h-screen bg-black px-6 py-24 text-white">

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="rounded-[40px] border border-cyan-400/20 bg-white/5 p-10">

          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
                MY TEAM
              </p>

              <h1 className="mt-4 text-5xl font-black">
                {team.teamName}
              </h1>

              <p className="mt-4 text-gray-300">
                Captain:
                {" "}
                {team.captainName}
              </p>

            </div>

            {team.teamLogo && (

              <img
                src={team.teamLogo}
                alt="Team Logo"
                className="h-36 w-36 rounded-full border-4 border-cyan-400 object-cover"
              />
            )}

          </div>

        </div>

        {/* STATUS */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">

          <div className="rounded-[35px] border border-cyan-400/20 bg-white/5 p-8">

            <p className="text-sm uppercase tracking-[0.3em] text-gray-400">
              Registration
            </p>

            <h2 className="mt-4 text-3xl font-black text-cyan-400">
              {team.status}
            </h2>

          </div>

          <div className="rounded-[35px] border border-cyan-400/20 bg-white/5 p-8">

            <p className="text-sm uppercase tracking-[0.3em] text-gray-400">
              Payment
            </p>

            <h2 className="mt-4 text-3xl font-black text-green-400">
              {team.paymentStatus}
            </h2>

          </div>

          <div className="rounded-[35px] border border-cyan-400/20 bg-white/5 p-8">

            <p className="text-sm uppercase tracking-[0.3em] text-gray-400">
              Slot Number
            </p>

            <h2 className="mt-4 text-3xl font-black text-yellow-400">

              {team.slotNumber || "Pending"}

            </h2>

          </div>

        </div>

{team?.idCard?.status === "uploaded" && (  <div className="mt-12 rounded-[35px] border border-cyan-400/20 bg-white/5 p-8">

    <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
      ID CARD
    </p>

    <img
      src={team.idCard.imageUrl}
      className="mt-6 w-full rounded-3xl border border-cyan-400/20"
    />

    <div className="mt-6 flex gap-4">

      <a
        href={team.idCard.imageUrl}
        download
        className="rounded-full bg-cyan-500 px-6 py-3 font-bold text-black"
      >
        Download Card
      </a>

    </div>

  </div>
)}

        {/* PLAYERS */}
        <div className="mt-12">

          <h2 className="text-4xl font-black">
            Players
          </h2>

          <div className="mt-8 grid gap-8 md:grid-cols-2">

            {team.players?.map(
              (
                player: any,
                index: number
              ) => (

                <div
                  key={index}
                  className="rounded-[35px] border border-cyan-400/20 bg-white/5 p-8"
                >

                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
                    {player.role}
                  </p>

                  <h3 className="mt-4 text-3xl font-black">
                    {player.name}
                  </h3>

                  <p className="mt-4 text-gray-300">
                    UID:
                    {" "}
                    {player.uid}
                  </p>

                  {player.playerId && (

                    <>
                      <p className="mt-4 break-all text-sm text-green-400">

                        {player.playerId}

                      </p>

                      <div className="mt-6 flex flex-wrap gap-4">

                        <a
                          href={`/verify/${player.playerId}`}
                          target="_blank"
                          className="rounded-full border border-cyan-400 px-6 py-3 font-bold text-cyan-400 transition hover:bg-cyan-500 hover:text-black"
                        >
                          Verify
                        </a>

                      </div>
                    </>
                  )}

                </div>
              )
            )}

          </div>

        </div>

      </div>
    </main>
  );
}