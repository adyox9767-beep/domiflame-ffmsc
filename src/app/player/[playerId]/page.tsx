"use client";

import { useRef } from "react";

import { useParams } from "next/navigation";

import { useEffect, useState } from "react";

import Image from "next/image";

import { auth } from "@/lib/firebase";

import { onAuthStateChanged } from "firebase/auth";

import { adminEmails } from "@/lib/admin";

import { useRouter } from "next/navigation";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function PlayerCardPage() {

  const [playerData, setPlayerData] = useState<any>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  const params = useParams();

  const playerId = params.playerId as string;

  const router = useRouter();

const [checkingAdmin, setCheckingAdmin] =
  useState(true);

  // FETCH PLAYER
  const fetchPlayer = async () => {
    try {

      const querySnapshot = await getDocs(
        collection(db, "registrations")
      );

      let foundPlayer = null;

      querySnapshot.forEach((docItem) => {

        const data = docItem.data();

        const matchedPlayer = data.players?.find(
          (player: any) =>
            player.playerId === playerId
        );

        if (matchedPlayer) {
          foundPlayer = {
            ...matchedPlayer,
            teamName: data.teamName,
          };
        }
      });

      setPlayerData(foundPlayer);

    } catch (error) {
      console.error(error);
    }
  };

  // DOWNLOAD
  const downloadCard = async () => {

  if (!cardRef.current) return;

  try {

    // import module without TypeScript declaration by casting to any
    const domtoimage = (await import("dom-to-image-more")) as any;

    const dataUrl = await domtoimage.default.toPng(cardRef.current, {
      quality: 1,
      bgcolor: "#ffffff",
    });

    const link =
      document.createElement("a");

    link.download =
      `${playerData.playerId}.png`;

    link.href = dataUrl;

    link.click();

  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {

  const unsubscribe =
    onAuthStateChanged(auth, (user) => {

      if (!user) {
        router.push("/login");
        return;
      }

      if (
        !adminEmails.includes(
          user.email || ""
        )
      ) {
        router.push("/");
        return;
      }

      setCheckingAdmin(false);
    });

  return () => unsubscribe();

}, [router]);

if (checkingAdmin) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black text-white">
      Checking Admin Access...
    </main>
  );
}

  useEffect(() => {
    if (playerId) {
      fetchPlayer();
    }
  }, [playerId]);

  if (!playerData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#e9ecef] text-black">
        Loading Player Card...
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#e9ecef] px-6 py-20">

      {/* CARD */}
      <div
        ref={cardRef}
        className="w-[950px] overflow-hidden rounded-3xl bg-white shadow-2xl"
      >

        <div className="flex">

          {/* LEFT SIDE */}
          <div className="flex w-[340px] flex-col bg-[#11d9ff] px-8 py-8">

            {/* TOP */}
            <div className="flex items-center justify-between">

              <div>
                <p className="text-[22px] font-black leading-none text-black">
                  FFMSC
                </p>

                <p className="mt-1 text-sm font-bold uppercase tracking-[0.2em] text-black">
                  GRAND FINALS
                </p>
              </div>

              <div className="rounded-full border-2 border-black px-4 py-2 text-sm font-black text-black">
                2026
              </div>
            </div>

            {/* PLAYER */}
            <div className="mt-10">

              <p className="text-sm font-black uppercase tracking-[0.3em] text-black">
                Official Identity Card
              </p>

              <h1 className="mt-4 text-7xl font-black uppercase leading-none text-black">
                PLAYER
              </h1>
            </div>

            {/* IMAGE */}
            <div className="mt-10 overflow-hidden rounded-[24px] border-4 border-black bg-white">

              <div className="flex h-[360px] items-center justify-center bg-[#d9d9d9] text-[120px] font-black text-black">

                {playerData.name?.charAt(0)}

              </div>
            </div>

            {/* VERIFIED */}
            <div className="mt-8 rounded-[20px] border-2 border-black bg-white px-6 py-4 text-center">

              <p className="text-lg font-black uppercase tracking-[0.2em] text-black">
                VERIFIED PLAYER
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-1 flex-col px-10 py-10">

            {/* TOP RIGHT */}
            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-black uppercase tracking-[0.3em] text-[#11d9ff]">
                  Player ID
                </p>

                <h2 className="mt-2 text-5xl font-black text-black">
                  {playerData.playerId}
                </h2>
              </div>

              <div className="flex items-center gap-4 rounded-[24px] border-2 border-[#11d9ff] bg-[#eefdff] px-6 py-5">

  <Image
 src="/logos/ffmsc.png"
    alt="FFMSC"
    width={90}
    height={90}
    className="object-contain"
  />

  <div>

    <h2 className="text-5xl font-black text-[#11d9ff]">
      FFMSC
    </h2>

    <p className="mt-2 text-lg font-black uppercase text-black">
      Strike Cup
    </p>
  </div>
</div>
            </div>

            {/* NAME */}
            <div className="mt-14">

              <p className="text-sm font-black uppercase tracking-[0.3em] text-[#11d9ff]">
                Player Name
              </p>

              <h1 className="mt-3 text-6xl font-black uppercase leading-none text-black">
                {playerData.name}
              </h1>
            </div>

            {/* TEAM */}
            <div className="mt-12">

              <p className="text-sm font-black uppercase tracking-[0.3em] text-[#11d9ff]">
                Team Name
              </p>

              <h2 className="mt-3 text-5xl font-black uppercase text-black">
                {playerData.teamName}
              </h2>
            </div>

            {/* BOTTOM */}
            <div className="mt-auto flex items-end justify-between pt-14">

              {/* QR */}
              <div className="rounded-[24px] border-2 border-gray-300 p-5">

                <img
                  src={playerData.qrCode}
                  alt="QR Code"
                  className="h-52 w-52"
                />
              </div>

<div className="ml-10 flex flex-1 flex-col justify-end">

  {/* DOMIFLAME */}
  <div className="rounded-[24px] border-2 border-[#11d9ff] bg-[#effcff] px-8 py-6">

    <p className="text-sm font-black uppercase tracking-[0.3em] text-[#11d9ff]">
      Organized By
    </p>

    <div className="mt-4 flex items-center gap-4">

  <Image
    src="/logos/domiflame.png"
    alt="DOMIFLAME"
    width={60}
    height={60}
    className="object-contain"
  />

  <h2 className="text-4xl font-black text-black">
    DOMIFLAME ESPORTS
  </h2>
</div>

    <p className="mt-2 text-lg font-semibold text-gray-700">
      Official FFMSC Tournament Organizer
    </p>
  </div>

  {/* DOWNLOAD */}
  <button
    onClick={downloadCard}
    className="mt-6 rounded-full bg-[#11d9ff] px-8 py-5 text-xl font-black text-black transition hover:scale-105"
  >
    Download ID Card
  </button>
</div>

            </div>

          </div>
        </div>
      </div>
    </main>
  );
}