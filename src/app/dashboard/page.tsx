"use client";

import { useEffect, useState } from "react";

import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";

import {
  sendEmailVerification,
} from "firebase/auth";

import { db } from "@/lib/firebase";

import { auth } from "@/lib/firebase";

import { onAuthStateChanged } from "firebase/auth";

import Navbar from "@/components/Navbar";

export default function DashboardPage() {

  // TEAM
  const [teamName, setTeamName] = useState("");

  const [captainName, setCaptainName] = useState("");

  const [captainUid, setCaptainUid] = useState("");

  const [captainEmail, setCaptainEmail] =
    useState("");

  const [captainAuthId, setCaptainAuthId] =
    useState("");

const [captainPhone, setCaptainPhone] =
  useState("");

const [paymentScreenshot, setPaymentScreenshot] =
  useState("");

const [emailVerified, setEmailVerified] =
  useState(false);

  const [uploadingImage, setUploadingImage] =
  useState(false);

  // TEAM LOGO URL
  const [teamLogo, setTeamLogo] =
    useState("");

  // PLAYERS
  const [players, setPlayers] = useState([
    {
      name: "",
      uid: "",
      role: "Player 1",
    },
    {
      name: "",
      uid: "",
      role: "Player 2",
    },
    {
      name: "",
      uid: "",
      role: "Player 3",
    },
    {
      name: "",
      uid: "",
      role: "Player 4",
    },
  ]);

  // STATES
  const [loading, setLoading] =
    useState(false);

  const [alreadyRegistered,
    setAlreadyRegistered] =
    useState(false);

  const [checkingRegistration,
    setCheckingRegistration] =
    useState(true);

  const [registrationOpen,
    setRegistrationOpen] =
    useState(true);

  const [acceptedRules,
    setAcceptedRules] =
    useState(false);

  // SEND VERIFICATION EMAIL
  const sendVerificationEmail =
    async () => {

      if (!auth.currentUser) return;

      try {

        await sendEmailVerification(
          auth.currentUser
        );

        alert(
          "Verification email sent"
        );

      } catch (error) {

        console.error(error);

        alert(
          "Failed to send verification email"
        );
      }
    };

  // AUTH CHECK
  useEffect(() => {
    
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {

          if (!user) {
            setCheckingRegistration(false);
            return;
          }

          setCaptainEmail(
            user.email || ""
          );

          setCaptainAuthId(
            user.uid
          );

          await user.reload();

setEmailVerified(
  auth.currentUser?.emailVerified || false
);

          // CHECK EXISTING REGISTRATION
          const existingQuery = query(
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

          const existingSnapshot =
            await getDocs(
              existingQuery
            );

          setAlreadyRegistered(
            !existingSnapshot.empty
          );

          // CHECK REGISTRATION STATUS
          const settingsRef = doc(
            db,
            "settings",
            "tournament"
          );

          const settingsSnap =
            await getDoc(
              settingsRef
            );

          if (
            settingsSnap.exists()
          ) {
            setRegistrationOpen(
              settingsSnap.data()
                .registrationOpen
            );
          }

          setCheckingRegistration(
            false
          );
        }
      );

    return () => unsubscribe();

  }, []);

  // UPDATE PLAYER
  const updatePlayer = (
    index: number,
    field: string,
    value: string
  ) => {

    const updatedPlayers =
      [...players];

    updatedPlayers[index] = {
      ...updatedPlayers[index],
      [field]: value,
    };

    setPlayers(updatedPlayers);
  };

  // ADD SUBSTITUTE
  const addSubstitute = () => {

    if (players.length >= 5) {
      return;
    }

    setPlayers([
      ...players,
      {
        name: "",
        uid: "",
        role: "Substitute",
      },
    ]);
  };
  
const handleImageUpload = async (
  e: React.ChangeEvent<HTMLInputElement>,
  type: "teamLogo" | "payment"
) => {

  const file =
    e.target.files?.[0];

  if (!file) return;

  try {

    setUploadingImage(true);

    const formData =
      new FormData();

    formData.append(
      "image",
      file
    );

    const response =
      await fetch(
        "https://api.imgbb.com/1/upload?key=0b79b9e9f039135617220379e656274c",
        {
          method: "POST",
          body: formData,
        }
      );

    const data =
      await response.json();

    const imageUrl =
      data.data.url;

    if (type === "teamLogo") {
      setTeamLogo(imageUrl);
    }

    if (type === "payment") {
      setPaymentScreenshot(
        imageUrl
      );
    }

  } catch (error) {

    console.error(error);

    alert(
      "Image upload failed"
    );

  } finally {

    setUploadingImage(false);
  }
};

  // SUBMIT
  const handleSubmit = async () => {

if (!emailVerified) {
  alert(
    "Please verify your email first"
  );
  return;
}

    if (
  !teamName ||
  !captainName ||
  !captainUid ||
  !captainPhone ||
  !paymentScreenshot ||
  !teamLogo
) {
      alert(
        "Please fill all team details"
      );
      return;
    }

    const invalidPlayer =
  players.find((player) => {

    const hasName =
      player.name.trim() !== "";

    const hasUid =
      player.uid.trim() !== "";

    return hasName !== hasUid;
  });

    if (invalidPlayer) {
      alert(
        "Please fill all player details"
      );
      return;
    }

    if (!acceptedRules) {
      alert(
        "Please accept tournament rules"
      );
      return;
    }

    try {

      setLoading(true);

const teamQuery = query(
  collection(db, "registrations"),
  where(
    "teamName",
    "==",
    teamName
  )
);

const teamSnapshot =
  await getDocs(teamQuery);

if (!teamSnapshot.empty) {
  alert("Team name already exists");
  setLoading(false);
  return;
}

      await addDoc(
        collection(
          db,
          "registrations"
        ),
        {
          tournament:
            "FFMSC 2026",

          status: "pending",

          captainPhone,

          paymentScreenshot,

          slotNumber: null,

          paymentStatus: "pending",

          cardReady: false,

          teamName,

          captainName,

          captainUid,

          captainEmail,

          captainAuthId,

          teamLogo,

          players,

          createdAt:
            new Date(),
        }
      );

      alert(
        "Registration Submitted Successfully"
      );
setAlreadyRegistered(true);

      // RESET
      setTeamName("");

      setCaptainName("");

      setCaptainUid("");

      setTeamLogo("");

      setCaptainPhone("");

      setPaymentScreenshot("");

      setAcceptedRules(false);

      setPlayers([
        {
          name: "",
          uid: "",
          role: "Player 1",
        },
        {
          name: "",
          uid: "",
          role: "Player 2",
        },
        {
          name: "",
          uid: "",
          role: "Player 3",
        },
        {
          name: "",
          uid: "",
          role: "Player 4",
        },
      ]);

    } catch (error) {

      console.error(error);

      alert(
        "Submission Failed"
      );

    } finally {

      setLoading(false);
    }
  };

  // LOADING
  if (checkingRegistration) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black">
        <h1 className="text-3xl font-black text-white">
          Checking Registration...
        </h1>
      </main>
    );
  }

  // CLOSED
  if (!registrationOpen) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6">

        <div className="max-w-xl rounded-[40px] border border-red-400/20 bg-white/5 p-10 text-center">

          <p className="text-sm font-bold uppercase tracking-[0.3em] text-red-400">
            FFMSC 2026
          </p>

          <h1 className="mt-5 text-5xl font-black text-white">
            Registration Closed
          </h1>

          <p className="mt-5 text-lg text-gray-300">
            Team registrations are currently closed by admins.
          </p>

        </div>

      </main>
    );
  }

  // ALREADY REGISTERED
  if (alreadyRegistered) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black px-6">

        <div className="max-w-xl rounded-[40px] border border-cyan-400/20 bg-white/5 p-10 text-center">

          <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
            DOMIFLAME ESPORTS
          </p>

          <h1 className="mt-5 text-5xl font-black text-white">
            Already Registered
          </h1>

          <p className="mt-5 text-lg text-gray-300">
            You already registered a team for FFMSC 2026.
          </p>

          <a
            href="/my-team"
            className="mt-8 inline-block rounded-full bg-cyan-500 px-8 py-4 text-lg font-black text-black transition hover:bg-cyan-400"
          >
            Go To My Team
          </a>

        </div>

      </main>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-black px-6 py-32 text-white">

        <div className="mx-auto max-w-5xl">

          {/* TITLE */}
          <div className="mb-10">

            <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
              FFMSC 2026
            </p>

            <h1 className="text-5xl font-black">
              Team Registration
            </h1>

            <p className="mt-4 text-gray-300">
              Register your team for the official DOMIFLAME ESPORTS LAN tournament.
            </p>
          </div>

{/* EMAIL VERIFY */}
{!emailVerified && (

  <div className="mb-10 rounded-[30px] border border-yellow-500/30 bg-yellow-500/10 p-6">

    <h2 className="text-2xl font-black text-yellow-300">
      Verify Your Email
    </h2>

    <p className="mt-3 text-yellow-100">
      Please verify your email before registering your team.
    </p>

    <button
      onClick={sendVerificationEmail}
      className="mt-5 rounded-full bg-yellow-400 px-6 py-3 font-black text-black"
    >
      Send Verification Email
    </button>

  </div>
)}

          {/* FORM */}
          <div className="rounded-[40px] border border-cyan-400/20 bg-white/5 p-10">

            {/* TEAM INFO */}
            <div className="grid gap-6 md:grid-cols-2">

              <input
                type="text"
                placeholder="Team Name"
                value={teamName}
                onChange={(e) =>
                  setTeamName(
                    e.target.value
                  )
                }
                className="rounded-2xl border border-cyan-400/20 bg-black/30 px-4 py-4 text-white outline-none"
              />

              <input
                type="text"
                placeholder="Captain Name"
                value={captainName}
                onChange={(e) =>
                  setCaptainName(
                    e.target.value
                  )
                }
                className="rounded-2xl border border-cyan-400/20 bg-black/30 px-4 py-4 text-white outline-none"
              />

              <input
                type="text"
                placeholder="Captain UID"
                value={captainUid}
                onChange={(e) =>
                  setCaptainUid(
                    e.target.value
                  )
                }
                className="rounded-2xl border border-cyan-400/20 bg-black/30 px-4 py-4 text-white outline-none"
              />

              <input
                type="text"
                placeholder="Captain WhatsApp Number"
                value={captainPhone}
                onChange={(e) =>
                  setCaptainPhone(
                    e.target.value
                  )
                }
                className="rounded-2xl border border-cyan-400/20 bg-black/30 px-4 py-4 text-white outline-none"
             />

              {/* TEAM LOGO */}
              <div className="rounded-3xl border border-cyan-400/20 bg-black/30 p-5">

                <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
                  Team Logo URL
                </p>

                <input
  type="file"
  accept="image/*"
  onChange={(e) =>
    handleImageUpload(
      e,
      "teamLogo"
    )
  }
  className="w-full rounded-2xl border border-cyan-400/20 bg-black/30 px-4 py-4 text-white outline-none"
/>

                {teamLogo && (
                  <div className="mt-6 flex justify-center">

                    <img
                      src={teamLogo}
                      alt="Team Logo"
                      className="h-28 w-28 rounded-full border-4 border-cyan-400 object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* PLAYERS */}
            <div className="mt-14">

              <h2 className="text-3xl font-black">
                Players
              </h2>

              <div className="mt-6 space-y-6">

                {players.map(
                  (
                    player,
                    index
                  ) => (

                    <div
                      key={index}
                      className="grid gap-4 rounded-3xl border border-cyan-400/20 p-6 md:grid-cols-3"
                    >

                      <input
                        type="text"
                        placeholder="Player IGN"
                        value={player.name}
                        onChange={(e) =>
                          updatePlayer(
                            index,
                            "name",
                            e.target.value
                          )
                        }
                        className="rounded-2xl border border-cyan-400/20 bg-black/30 px-4 py-4 text-white outline-none"
                      />

                      <input
                        type="text"
                        placeholder="Player UID"
                        value={player.uid}
                        onChange={(e) =>
                          updatePlayer(
                            index,
                            "uid",
                            e.target.value
                          )
                        }
                        className="rounded-2xl border border-cyan-400/20 bg-black/30 px-4 py-4 text-white outline-none"
                      />

                      <div className="flex items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-4 font-semibold text-cyan-400">

                        {player.role}

                      </div>
                    </div>
                  )
                )}
              </div>

              {/* ADD SUBSTITUTE */}
              <button
                onClick={
                  addSubstitute
                }
                className="mt-6 rounded-full border border-cyan-500 px-6 py-3 font-semibold text-cyan-400 transition hover:bg-cyan-500 hover:text-black"
              >
                + Add Substitute
              </button>
            </div>

{/* PAYMENT */}
<div className="mt-12 rounded-[35px] border border-cyan-400/20 bg-white/5 p-8">

  <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
    ENTRY PAYMENT
  </p>

  <h2 className="mt-4 text-4xl font-black">
    ₹500 Per Team
  </h2>

  <div className="mt-8 grid gap-8 lg:grid-cols-2">

    {/* QR */}
    <div className="rounded-3xl border border-cyan-400/20 bg-black/30 p-6">

      <img
        src="/upi-qr.jpeg"
        alt="UPI QR"
        className="mx-auto w-full max-w-xs rounded-3xl"
      />

      <div className="mt-6 space-y-3">

        <p className="text-lg font-bold">
          UPI ID: madhubalasingh094@ibl
        </p>

        <p className="text-lg font-bold">
          UPI Name: CHANDA RAVINDRA SINGH
        </p>

      </div>
    </div>

    {/* SCREENSHOT */}
    <div>

      <p className="text-lg font-bold text-white">
        Upload Payment Screenshot URL
      </p>

      <p className="mt-2 text-gray-400">
        Upload screenshot on imgbb.com and paste image URL here.
      </p>

      <input
  type="file"
  accept="image/*"
  onChange={(e) =>
    handleImageUpload(
      e,
      "payment"
    )
  }
  className="mt-5 w-full rounded-2xl border border-cyan-400/20 bg-black/30 px-4 py-4 text-white outline-none"
/>

      {paymentScreenshot && (
        <img
          src={paymentScreenshot}
          alt="Payment"
          className="mt-6 rounded-3xl border border-cyan-400/20"
        />
      )}
    </div>

  </div>
</div>

            {/* RULES */}
            <div className="mt-12 rounded-[35px] border border-cyan-400/20 bg-white/5 p-8">

              <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
                TOURNAMENT RULES
              </p>

              <div className="mt-6 space-y-4 text-gray-300">

                <p>
                  • Only real Free Fire IDs are allowed.
                </p>

                <p>
                  • QR verification is mandatory at LAN venue.
                </p>

                <p>
                  • Teams can have 4 players + 1 substitute only.
                </p>

                <p>
                  • Emulator, hacks or unfair play will result in direct ban.
                </p>

                <p>
                  • Admin decisions will be final.
                </p>
              </div>

              {/* CHECKBOX */}
              <label className="mt-8 flex cursor-pointer items-center gap-4">

                <input
                  type="checkbox"
                  checked={
                    acceptedRules
                  }
                  onChange={(e) =>
                    setAcceptedRules(
                      e.target.checked
                    )
                  }
                  className="h-5 w-5 accent-cyan-500"
                />

                <span className="font-semibold text-white">
                  I accept all FFMSC tournament rules
                </span>
              </label>
            </div>

            {/* SUBMIT */}
            <button
              onClick={handleSubmit}
disabled={
  loading ||
  uploadingImage
}              className="mt-12 w-full rounded-2xl bg-cyan-500 py-4 text-lg font-black text-black transition hover:bg-cyan-400 disabled:opacity-50"
            >
              {uploadingImage
  ? "Uploading Image..."
  : loading
  ? "Submitting..."
  : "Submit Registration"}
            </button>

          </div>
        </div>
      </main>
    </>
  );
}