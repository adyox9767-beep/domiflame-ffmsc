"use client";

import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function AdminScanPage() {
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(onScanSuccess, onScanError);

    async function onScanSuccess(decodedText: string) {
      try {
        const playerId = decodedText.split("/").pop();

        const q = query(
          collection(db, "registrations")
        );

        const snapshot = await getDocs(q);

        let found = false;

        snapshot.forEach((docSnap) => {
          const team = docSnap.data();

          team.players?.forEach((player: any) => {
            if (player.playerId === playerId) {
              found = true;

              if (team.status !== "approved") {
                setResult({
                  status: "DENIED ❌",
                  message: "Team not approved",
                });
              } else {
                setResult({
                  status: "ENTRY ALLOWED ✔",
                  message: team.teamName,
                });
              }
            }
          });
        });

        if (!found) {
          setResult({
            status: "INVALID ❌",
            message: "Fake / Unknown Player",
          });
        }

      } catch (err) {
        console.error(err);
      }
    }

    function onScanError(err: any) {
      // ignore scan errors
    }

    return () => {
      scanner.clear();
    };
  }, []);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">

      <h1 className="text-4xl font-black mb-6">
        LAN ENTRY SCANNER
      </h1>

      {/* CAMERA VIEW */}
      <div id="reader" className="w-80 rounded-xl overflow-hidden" />

      {/* RESULT */}
      {result && (
        <div className="mt-10 text-center">
          <h2 className="text-3xl font-black">
            {result.status}
          </h2>
          <p className="mt-3 text-gray-300">
            {result.message}
          </p>
        </div>
      )}

    </main>
  );
}