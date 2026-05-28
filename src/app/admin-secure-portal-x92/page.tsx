"use client";

import { useEffect, useState } from "react";

import { onAuthStateChanged } from "firebase/auth";

import { useRouter } from "next/navigation";

import { auth } from "@/lib/firebase";

import { adminEmails } from "@/lib/admin";

import { generatePlayerId } from "@/utils/generatePlayerId";

import { generateQr } from "@/utils/generateQr";

import {
  collection,
  getDocs,
  updateDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function AdminPage() {

  const router = useRouter();

const [registrations, setRegistrations] = useState<any[]>([]);

const [checkingAdmin, setCheckingAdmin] = useState(true);

const [registrationOpen, setRegistrationOpen] =
  useState(true);

const [slotInputs, setSlotInputs] =
  useState<{ [key: string]: string }>({});

  // FETCH DATA
  const fetchRegistrations = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, "registrations")
      );

      const data: any[] = [];

      querySnapshot.forEach((docItem) => {
        data.push({
          id: docItem.id,
          ...docItem.data(),
        });
      });

      setRegistrations(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTournamentSettings = async () => {

  try {

    const settingsRef = doc(
      db,
      "settings",
      "tournament"
    );

    const settingsSnap =
      await getDoc(settingsRef);

    if (settingsSnap.exists()) {

      setRegistrationOpen(
        settingsSnap.data().registrationOpen
      );

    } else {

      await setDoc(settingsRef, {
        registrationOpen: true,
      });

      setRegistrationOpen(true);
    }

  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!adminEmails.includes(user.email || "")) {
      router.push("/");
      return;
    }

    setCheckingAdmin(false);
  });

  return () => unsubscribe();
}, [router]);

 useEffect(() => {

  fetchRegistrations();

  fetchTournamentSettings();

}, []);

if (checkingAdmin) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <h1 className="text-3xl font-black text-black">
        Checking Admin Access...
      </h1>
    </main>
  );
}

  // APPROVE
 const approveTeam = async (team: any) => {
  try {

    const updatedPlayers = await Promise.all(
      team.players.map(async (player: any) => {

        const playerId = generatePlayerId();

        const qrData =
  `https://domiflame-ffmsc.vercel.app/verify/${playerId}`;

        const qrCode = await generateQr(qrData);

        return {
          ...player,
          playerId,
          qrCode,
          approved: true,
        };
      })
    );

    await updateDoc(
      doc(db, "registrations", team.id),
      {
        status: "approved",

        approvedAt: new Date(),

        players: updatedPlayers,
      }
    );

    fetchRegistrations();

    alert("Team Approved & ID Cards Generated");

  } catch (error) {
    console.error(error);
  }
};

  // REJECT
  const rejectTeam = async (id: string) => {
    try {
      await updateDoc(doc(db, "registrations", id), {
        status: "rejected",
      });

      fetchRegistrations();

      alert("Team Rejected");
    } catch (error) {
      console.error(error);
    }
  };

  // APPROVE PAYMENT
const approvePayment = async (
  teamId: string
) => {

  try {

    await updateDoc(
      doc(
        db,
        "registrations",
        teamId
      ),
      {
        paymentStatus:
          "approved",
      }
    );

    fetchRegistrations();

    alert(
      "Payment Approved"
    );

  } catch (error) {

    console.error(error);
  }
};
// ASSIGN SLOT
const assignSlot = async (
  teamId: string
) => {

  try {

    const slotNumber =
      slotInputs[teamId];

    if (!slotNumber) {
      alert(
        "Enter slot number"
      );
      return;
    }

    await updateDoc(
      doc(
        db,
        "registrations",
        teamId
      ),
      {
        slotNumber,
      }
    );

    fetchRegistrations();

    alert(
      "Slot Assigned"
    );

  } catch (error) {

    console.error(error);
  }
};

// TOGGLE REGISTRATION
const toggleRegistration = async () => {
  try {

    const settingsRef = doc(
      db,
      "settings",
      "tournament"
    );

    await updateDoc(settingsRef, {
      registrationOpen: !registrationOpen,
    });

    setRegistrationOpen(!registrationOpen);

  } catch (error) {
    console.error(error);
  }
};

  return (
    <main className="min-h-screen bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        
        {/* HEADER */}
        <div className="mb-12">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-cyan-600">
            DOMIFLAME ESPORTS
          </p>

          <h1 className="text-5xl font-black text-black">
            Admin Dashboard
          </h1>

          <p className="mt-4 text-gray-700">
            Manage FFMSC tournament registrations and approvals.
          </p>
        </div>

        {/* TOURNAMENT CONTROL */}
<div className="mb-10 rounded-[40px] border border-cyan-200 bg-white p-8 shadow-[0_0_60px_rgba(34,211,238,0.08)]">

  <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-600">
    Registration Control
  </p>

  <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

    <div>

      <h2 className="text-4xl font-black text-black">
        {registrationOpen
          ? "REGISTRATION OPEN"
          : "REGISTRATION CLOSED"}
      </h2>

      <p className="mt-3 text-gray-700">
        Control FFMSC registrations manually.
      </p>

    </div>

    <button
      onClick={toggleRegistration}
      className={`rounded-full px-8 py-4 text-lg font-black transition ${
        registrationOpen
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-cyan-500 text-black hover:bg-cyan-400"
      }`}
    >
      {registrationOpen
        ? "Close Registration"
        : "Open Registration"}
    </button>

  </div>
</div>

        {/* CARDS */}
        <div className="space-y-8">
          {registrations.map((team) => (
            <div
              key={team.id}
              className="rounded-[40px] border border-cyan-200 bg-white p-8 shadow-[0_0_60px_rgba(34,211,238,0.08)]"
            >
              
              {/* TOP */}
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-600">
                    {team.status}
                  </p>

                  <h2 className="mt-3 text-4xl font-black text-black">
                    {team.teamName}
                  </h2>

{team.teamLogo && (

  <img
    src={team.teamLogo}
    alt="Team Logo"
    className="mt-5 h-24 w-24 rounded-full border-4 border-cyan-400 object-cover"
  />
)}

                  <p className="mt-3 text-gray-700">
                    Captain: {team.captainName}
                  </p>

                  <p className="text-gray-700">
                    UID: {team.captainUid}
                  </p>

<p className="mt-3 text-sm text-gray-600">
  WhatsApp:
  {team.captainPhone}
</p>

<p className="mt-2 text-sm text-gray-600">
  Payment:
  {team.paymentStatus}
</p>

{team.slotNumber && (
  <p className="mt-2 text-sm font-bold text-cyan-600">
    Slot:
    {team.slotNumber}
  </p>
)}

                </div>

{team.paymentScreenshot && (

  <div className="mt-6">

    <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-cyan-600">
      Payment Screenshot
    </p>

    <img
      src={
        team.paymentScreenshot
      }
      alt="Payment"
      className="h-64 rounded-3xl border border-cyan-200 object-cover"
    />

  </div>
)}

                {/* ACTIONS */}
               <div className="flex flex-wrap gap-4"> 

                <button
  onClick={() =>
    approvePayment(
      team.id
    )
  }
  disabled={
    team.paymentStatus ===
    "approved"
  }
  className={`rounded-full px-6 py-3 font-semibold transition ${
    team.paymentStatus ===
    "approved"
      ? "bg-green-500 text-white"
      : "bg-yellow-400 text-black hover:bg-yellow-300"
  }`}
>
  {team.paymentStatus ===
  "approved"
    ? "Payment Approved"
    : "Approve Payment"}
</button>

               <button
  onClick={() => approveTeam(team)}
  disabled={
  team.paymentStatus !==
  "approved"
}
  className={`rounded-full px-6 py-3 font-semibold transition
  ${
    team.status === "approved"
      ? "bg-green-500 text-white"
      : "bg-cyan-500 text-white hover:bg-cyan-600"
  }`}
>
  {
  team.status === "approved"
    ? "Approved"
    : "Generate Cards"
}
</button>

                  <button
  onClick={() => rejectTeam(team.id)}
  disabled={team.status === "rejected"}
  className={`rounded-full px-6 py-3 font-semibold transition
  ${
    team.status === "rejected"
      ? "bg-red-500 text-white"
      : "border border-red-300 text-red-500 hover:bg-red-50"
  }`}
>
  {team.status === "rejected"
    ? "Rejected"
    : "Reject"}
</button>

<div className="flex items-center gap-3">

  <input
    type="text"
    placeholder="Slot"
    value={
      slotInputs[team.id] || ""
    }
    onChange={(e) =>
      setSlotInputs({
        ...slotInputs,
        [team.id]:
          e.target.value,
      })
    }
    className="rounded-2xl border border-cyan-200 px-4 py-3 outline-none"
  />

  <button
    onClick={() =>
      assignSlot(team.id)
    }
    className="rounded-full bg-cyan-500 px-5 py-3 font-bold text-white"
  >
    Save Slot
  </button>

</div>

                </div>
              </div>

              {/* PLAYERS */}
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {team.players?.map((player: any, index: number) => (
                  <div
                    key={index}
                    className="rounded-3xl border border-cyan-100 p-5"
                  >
                    <p className="font-bold text-black">
                      {player.name || "Unnamed Player"}
                    </p>

                    <p className="mt-2 text-gray-700">
                      UID: {player.uid || "-"}
                    </p>

                    <p className="mt-2 text-cyan-600">
                      {player.role}
                    </p>

{player.playerId && (
  <p className="mt-2 break-all text-sm text-green-600">
    ID: {player.playerId}
  </p>
)}

                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}