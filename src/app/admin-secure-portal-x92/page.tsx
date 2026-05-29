"use client";

import { useEffect, useState } from "react";

import { onAuthStateChanged } from "firebase/auth";

import { useRouter } from "next/navigation";

import { auth } from "@/lib/firebase";

import { adminEmails } from "@/lib/admin";

import { generatePlayerId } from "@/utils/generatePlayerId";

import { generateQr } from "@/utils/generateQr";

import { generateIdCardImage } from "@/utils/generateIdCard";

import { toPng } from "html-to-image";

import IdCardTemplate from "@/components/IdCardTemplate";

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

  const [selectedFinalCards, setSelectedFinalCards] =
  useState<{ [key: string]: File | null }>({});

const generatePlayerCard = async (player: any, team: any) => {

  const element = document.getElementById(
    `card-${player.playerId}`
  );

  if (!element) return;

  const imageUrl = await toPng(element);

  await updateDoc(doc(db, "registrations", team.id), {
    idCardImage: imageUrl,
  });

  alert("ID Card Generated");
};

const generatePngCard = async (player: any, team: any) => {

  const node = document.getElementById(`card-${player.playerId}`);

  if (!node) {
    alert("Card design not found");
    return;
  }

await new Promise((res) => setTimeout(res, 500));
  const domtoimage = (await import("dom-to-image-more")).default;

await new Promise((res) => setTimeout(res, 800));
const dataUrl = await domtoimage.toPng(node, {
  cacheBust: true,
  pixelRatio: 2,
});
  const res = await fetch(dataUrl);
  const blob = await res.blob();

const url = URL.createObjectURL(blob);

const a = document.createElement("a");
a.href = url;
a.download = `${player.name || "id-card"}.png`;
a.click();

URL.revokeObjectURL(url);
  await updateDoc(doc(db, "registrations", team.id), {
    "idCard.imageUrl": url,
    "idCard.status": "uploaded",
  });

  alert("PNG Generated");
};

const uploadFinalPlayerCard = async (
  team: any,
  playerIndex: number
) => {
  const key = `${team.id}-${playerIndex}`;
  const file = selectedFinalCards[key];

  if (!file) {
    alert("Please select a file first");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(
      "https://api.imgbb.com/1/upload?key=0b79b9e9f039135617220379e656274c",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    const imageUrl = data.data.url;

    const updatedPlayers = [...team.players];

    updatedPlayers[playerIndex] = {
      ...updatedPlayers[playerIndex],
      finalCardUrl: imageUrl,
      finalCardUploaded: true,
    };

    await updateDoc(doc(db, "registrations", team.id), {
      players: updatedPlayers,
    });

    setSelectedFinalCards({
      ...selectedFinalCards,
      [key]: null,
    });

    alert("Final player card uploaded");
    fetchRegistrations();
  } catch (error) {
    console.error(error);
    alert("Card upload failed");
  }
};

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
console.log("REGISTRATIONS DATA:", data);
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
    const slotNumber = Math.floor(Math.random() * 100) + 1;

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

console.log("PLAYERS BEFORE SAVE:", updatedPlayers);

const downloadRawCardData = (team: any) => {
  const cardData = {
    teamName: team.teamName,
    slotNumber: team.slotNumber,
    captainName: team.captainName,
    players: team.players,
    teamId: team.id,
  };

  const blob = new Blob(
    [JSON.stringify(cardData, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${team.teamName}-ID-CARD.json`;
  a.click();
};

    const markCardReady = async (team: any) => {
  try {
    await updateDoc(doc(db, "registrations", team.id), {
      "idCard.status": "ready_for_design",
    });

    fetchRegistrations();
    alert("Card design ke liye ready ho gaya 👍");
  } catch (error) {
    console.error(error);
  }
};

console.log("FINAL PLAYERS SAVING:", updatedPlayers);

    await updateDoc(doc(db, "registrations", team.id), {
      status: "approved",
      approvedAt: new Date(),
      slotNumber,
players: updatedPlayers.map((p) => ({
  name: p.name,
  uid: p.uid,
  role: p.role,
  gender: p.gender || "",
  playerId: p.playerId,
  qrCode: p.qrCode,
  finalCardUrl: p.finalCardUrl || "",
  finalCardUploaded: p.finalCardUploaded || false,
  approved: true,
})),
      // 👇 IMPORTANT (ID CARD START HERE)
      idCard: {
        status: "generated",
        imageUrl: "",
      },
    });

    fetchRegistrations();
    alert("Team approve ho gayi 👍");
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

const generateCardState = async (team: any) => {
  try {
    await updateDoc(doc(db, "registrations", team.id), {
      idCard: {
        status: "ready_to_design",
      },
    });

    fetchRegistrations();
    alert("Card ready for admin design");
  } catch (error) {
    console.error(error);
  }
};

const downloadRawCardData = (team: any) => {
  const cardData = {
    teamName: team.teamName,
    slotNumber: team.slotNumber,
    captainName: team.captainName,
    captainUid: team.captainUid,
    captainPhone: team.captainPhone,
    players: team.players,
    teamId: team.id,
  };

  const blob = new Blob(
    [JSON.stringify(cardData, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${team.teamName}-ID-CARD.json`;
  a.click();

  URL.revokeObjectURL(url);
};

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        
        {/* HEADER */}
        <div className="mb-12 text-center">

  <p className="text-sm font-bold uppercase tracking-[0.5em] text-cyan-400">
    DOMIFLAME ESPORTS
  </p>

  <h1 className="mt-4 text-6xl font-black text-white">
    CONTROL CENTER
  </h1>

  <p className="mt-6 text-gray-400 text-lg">
    FFMSC 2026 Tournament Management System
  </p>

  <div className="mt-6 flex justify-center gap-4 text-sm text-gray-500">
    <span>• Registrations</span>
    <span>• Payments</span>
    <span>• Slots</span>
    <span>• ID Cards</span>
  </div>

</div>

        {/* TOURNAMENT CONTROL */}
<div className="mb-10 rounded-[30px] border border-cyan-400/30 bg-white/5 p-8 backdrop-blur-xl shadow-[0_0_80px_rgba(34,211,238,0.15)]">

  <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-600">
    Registration Control
  </p>

<span className="text-cyan-400 font-black tracking-widest animate-pulse">
  LIVE REGISTRATION SYSTEM
</span>

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

<a
  href={team.teamLogo}
  target="_blank"
  download
  className="mt-3 inline-block rounded-full bg-cyan-500 px-4 py-2 text-sm font-bold text-black"
>
  Download Logo
</a>

                  <p className="mt-3 text-gray-700">
                    Captain: {team.captainName}
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

    <a
  href={team.paymentScreenshot}
  target="_blank"
  download
  className="mt-3 inline-block rounded-full bg-green-500 px-4 py-2 text-sm font-bold text-black"
>
  Download Screenshot
</a>

  </div>
)}

                {/* ACTIONS */}
               <div className="flex flex-wrap gap-4"> 

<button
  onClick={() => approveTeam(team)}
  className="bg-blue-500 px-6 py-3 rounded text-white font-bold"
>
  Approve Team (Generate ID + QR)
</button>

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

                    <p className="mt-2 text-purple-600">
  Gender: {player.gender || "-"}
</p>

                    <button
                     onClick={() => generatePngCard(player, team)}
                     className="bg-green-500 px-4 py-2 rounded"
>
                     Generate PNG
                      </button>

                      <div className="mt-4">
  <p className="mb-2 text-sm font-bold text-black">
    Upload Final Designed Card
  </p>

  <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0] || null;

    setSelectedFinalCards({
      ...selectedFinalCards,
      [`${team.id}-${index}`]: file,
    });
  }}
  className="w-full rounded-xl border border-cyan-200 px-3 py-2 text-black"
/>

{selectedFinalCards[`${team.id}-${index}`] && (
  <button
    onClick={() =>
      uploadFinalPlayerCard(team, index)
    }
    className="mt-3 rounded-full bg-cyan-500 px-4 py-2 font-bold text-black"
  >
    Upload Final Card
  </button>
)}
</div>

{player.finalCardUrl && (
  <div className="mt-4">
    <img
      src={player.finalCardUrl}
      alt="Final Card"
      className="w-full rounded-2xl border border-cyan-200"
    />

    <a
      href={player.finalCardUrl}
      target="_blank"
      download
      className="mt-3 inline-block rounded-full bg-cyan-500 px-4 py-2 font-bold text-black"
    >
      Download Final Card
    </a>
  </div>
)}

{player.playerId && (
  <p className="mt-2 break-all text-sm text-green-600">
    ID: {player.playerId}
  </p>
)}

<div
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    opacity: 0,
    pointerEvents: "none"
  }}
>
  <div id={`card-${player.playerId}`}>
    <IdCardTemplate player={player} team={team} />
  </div>
</div>

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