"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { uploadToSupabase } from "@/utils/uploadToSupabase";
import Navbar from "@/components/Navbar";

export default function DashboardPage() {
  const router = useRouter();

  const [teamName, setTeamName] = useState("");
  const [city, setCity] = useState("");
  const [captainName, setCaptainName] = useState("");
  const [captainEmail, setCaptainEmail] = useState("");
  const [captainAuthId, setCaptainAuthId] = useState("");
  const [captainPhone, setCaptainPhone] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [teamLogo, setTeamLogo] = useState("");

  const [players, setPlayers] = useState([
    { name: "", uid: "", role: "Player 1", gender: "" },
    { name: "", uid: "", role: "Player 2", gender: "" },
    { name: "", uid: "", role: "Player 3", gender: "" },
    { name: "", uid: "", role: "Player 4", gender: "" },
  ]);

  const [loading, setLoading] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(true);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [acceptedRules, setAcceptedRules] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      setCaptainEmail(user.email || "");
      setCaptainAuthId(user.uid);

      const existingQuery = query(
        collection(db, "registrations"),
        where("captainEmail", "==", user.email)
      );

      const existingSnapshot = await getDocs(existingQuery);
      setAlreadyRegistered(!existingSnapshot.empty);

      const settingsRef = doc(db, "settings", "tournament");
      const settingsSnap = await getDoc(settingsRef);

      if (settingsSnap.exists()) {
        setRegistrationOpen(settingsSnap.data().registrationOpen);
      }

      setCheckingRegistration(false);
    });

    return () => unsubscribe();
  }, [router]);

  const updatePlayer = (index: number, field: string, value: string) => {
    const updatedPlayers = [...players];

    updatedPlayers[index] = {
      ...updatedPlayers[index],
      [field]: value,
    };

    setPlayers(updatedPlayers);
  };

  const addSubstitute = () => {
    if (players.length >= 5) return;

    setPlayers([
      ...players,
      {
        name: "",
        uid: "",
        role: "Substitute",
        gender: "",
      },
    ]);
  };

  const removeSubstitute = () => {
    if (players.length <= 4) return;
    setPlayers(players.slice(0, -1));
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "teamLogo" | "payment"
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploadingImage(true);

      const folder = type === "teamLogo" ? "team-logos" : "payment-screenshots";

      const imageUrl = await uploadToSupabase(file, folder);

      if (type === "teamLogo") {
        setTeamLogo(imageUrl);
      }

      if (type === "payment") {
        setPaymentScreenshot(imageUrl);
      }
    } catch (error) {
      console.error(error);
      alert("Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async () => {
    if (
      !teamName.trim() ||
      !captainName.trim() ||
      !captainPhone.trim() ||
      !city ||
      !paymentScreenshot ||
      !teamLogo
    ) {
      alert("All field are mandatory");
      return;
    }

    const invalidPlayer = players.find((player) => {
      return !player.name.trim() || !player.uid.trim() || !player.gender?.trim();
    });

    if (invalidPlayer) {
      alert("Please fill all player details");
      return;
    }

    if (!acceptedRules) {
      alert("Please accept tournament rules");
      return;
    }

    try {
      setLoading(true);

      const teamQuery = query(
        collection(db, "registrations"),
        where("teamName", "==", teamName)
      );

      const teamSnapshot = await getDocs(teamQuery);

      if (!teamSnapshot.empty) {
        alert("Team name already exists");
        setLoading(false);
        return;
      }

      await addDoc(collection(db, "registrations"), {
        tournament: "FFMSC 2026",
        status: "pending",
        captainPhone,
        paymentScreenshot,
        slotNumber: null,
        paymentStatus: "pending",
        cardReady: false,
        teamName,
        captainName,
        captainEmail,
        captainAuthId,
        teamLogo,
        city,
        players,
        createdAt: new Date(),
      });

      alert("Registration Submitted Successfully");
      setAlreadyRegistered(true);

      setTeamName("");
      setCaptainName("");
      setTeamLogo("");
      setCaptainPhone("");
      setPaymentScreenshot("");
      setAcceptedRules(false);

      setPlayers([
        { name: "", uid: "", role: "Player 1", gender: "" },
        { name: "", uid: "", role: "Player 2", gender: "" },
        { name: "", uid: "", role: "Player 3", gender: "" },
        { name: "", uid: "", role: "Player 4", gender: "" },
      ]);
    } catch (error) {
      console.error(error);
      alert("Submission Failed");
    } finally {
      setLoading(false);
    }
  };

  if (checkingRegistration) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black">
        <h1 className="text-3xl font-black text-white">
          Checking Registration...
        </h1>
      </main>
    );
  }

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

    <main className="min-h-screen overflow-hidden bg-[#020506] px-4 pb-16 pt-24 text-white sm:px-6">
  <div className="pointer-events-none fixed left-0 top-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
  <div className="pointer-events-none fixed bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

  <div className="relative mx-auto max-w-[1220px] rounded-[28px] border border-cyan-400/20 bg-black/40 p-6 shadow-[0_0_45px_rgba(34,211,238,0.12)]">

    {/* HERO */}
    <section className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <div className="inline-flex items-center gap-3 rounded-xl border border-cyan-400/40 bg-cyan-400/5 px-5 py-3">
          <span className="text-cyan-400">⚙</span>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-white">
            FFMSC 2026
          </p>
        </div>

        <h1 className="mt-6 text-5xl font-black uppercase italic leading-none tracking-tight text-white md:text-7xl">
          Team{" "}
          <span className="text-cyan-400">
            Registration
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-300">
          Register your squad and be a part of India&apos;s most premium Free Fire LAN experience.
        </p>

        <div className="mt-7 flex flex-wrap gap-5 text-lg font-black uppercase tracking-[0.18em] text-cyan-400">
          <span>Ignite.</span>
          <span>✦</span>
          <span>Dominate.</span>
          <span>✦</span>
          <span>Conquer.</span>
        </div>
      </div>

      <div className="flex justify-center lg:justify-end">
        <img
          src="/ffmsc-logo.png"
          alt="FFMSC Logo"
          className="w-full max-w-[430px] object-contain"
        />
      </div>
    </section>

    {/* CITY SELECT */}
    <section className="mt-8 grid items-center gap-4 rounded-[20px] border border-cyan-400/20 bg-white/[0.03] p-5 lg:grid-cols-[260px_1fr_1fr]">
      <div className="flex items-center gap-4">
        <span className="text-3xl text-cyan-400">📍</span>
        <p className="text-lg font-black uppercase text-white">
          Tournament Cities
        </p>
      </div>

      {["MUMBAI", "LUCKNOW"].map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setCity(item)}
          className={`relative flex items-center justify-center rounded-2xl border px-8 py-6 text-lg font-black uppercase tracking-[0.08em] transition ${
            city === item
  ? "border-cyan-300 bg-cyan-400/10 text-white shadow-[0_0_40px_rgba(34,211,238,0.45)]"
              : item === "LUCKNOW"
              ? "border-cyan-400/40 bg-cyan-500/10 shadow-[0_0_25px_rgba(168,85,247,0.18)] text-white hover:border-cyan-300"
              : "border-cyan-400/30 bg-cyan-500/10 shadow-[0_0_25px_rgba(168,85,247,0.18)] text-white hover:border-cyan-300"
          }`}
        >
          <img
  src={
    item === "MUMBAI"
      ? "/cities/mumbai.png"
      : "/cities/lucknow.png"
  }
  alt={item}
className="h-18 w-18 object-contain"/>
          <span className="ml-4 text-xl font-black uppercase tracking-[0.12em]">
  {item}
</span>

          {city === item && (
            <span className="absolute right-4 top-4 text-cyan-300">
              ✓
            </span>
          )}
        </button>
      ))}
    </section>

          <section className="mt-10 grid gap-8 lg:grid-cols-2">
            <div className="rounded-[32px] border border-cyan-400/20 bg-white/[0.04] p-7">
              <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-400">
                Team Information
              </p>

              <div className="mt-6 space-y-5">
                <input
                  type="text"
                  placeholder="Team Name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full rounded-2xl border border-cyan-400/20 bg-black/40 px-5 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-300"
                />

                <div className="rounded-[26px] border border-dashed border-cyan-400/30 bg-cyan-400/[0.03] p-6">
                  <p className="text-sm font-black uppercase tracking-[0.25em] text-cyan-400">
                    Team Logo
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "teamLogo")}
                    className="mt-5 w-full rounded-2xl border border-cyan-400/20 bg-black/40 px-4 py-4 text-white outline-none"
                  />

                  {teamLogo && (
                    <div className="mt-6 flex items-center gap-4">
                      <img
                        src={teamLogo}
                        alt="Team Logo"
                        className="h-24 w-24 rounded-2xl border-2 border-cyan-400 object-cover"
                      />
                      <p className="font-bold text-cyan-300">Logo uploaded</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-cyan-400/20 bg-white/[0.04] p-7">
              <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-400">
                Captain Information
              </p>

              <div className="mt-6 space-y-5">
                <input
                  type="text"
                  placeholder="Captain Real Name"
                  value={captainName}
                  onChange={(e) => setCaptainName(e.target.value)}
                  className="w-full rounded-2xl border border-cyan-400/20 bg-black/40 px-5 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-300"
                />

                <input
                  type="text"
                  placeholder="Captain WhatsApp Number"
                  value={captainPhone}
                  onChange={(e) => setCaptainPhone(e.target.value)}
                  className="w-full rounded-2xl border border-cyan-400/20 bg-black/40 px-5 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-cyan-300"
                />

                <div className="rounded-2xl border border-cyan-400/20 bg-black/30 px-5 py-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                    Captain Email
                  </p>
                  <p className="mt-1 break-all font-bold text-cyan-300">
                    {captainEmail || "Loading..."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-10 rounded-[36px] border border-cyan-400/20 bg-white/[0.04] p-8">
            <div className="flex items-center justify-between gap-5">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-400">
                  Players Details
                </p>
                <h2 className="mt-3 text-4xl font-black uppercase">
                  Squad Roster
                </h2>
              </div>

              {players.length === 4 ? (
                <button
                  type="button"
                  onClick={addSubstitute}
                  className="rounded-full border border-cyan-400/40 px-6 py-3 font-black text-cyan-300 transition hover:bg-cyan-400 hover:text-black"
                >
                  + Add Substitute
                </button>
              ) : (
                <button
                  type="button"
                  onClick={removeSubstitute}
                  className="rounded-full border border-red-400/40 px-6 py-3 font-black text-red-300 transition hover:bg-red-500 hover:text-white"
                >
                  - Remove Substitute
                </button>
              )}
            </div>

            <div className="mt-8 space-y-4">
              {players.map((player, index) => (
                <div
                  key={index}
                  className="grid gap-4 rounded-[26px] border border-cyan-400/15 bg-black/35 p-5 md:grid-cols-[150px_1fr_1fr_180px]"
                >
                  <div className="flex items-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 font-black uppercase text-cyan-300">
                    {player.role}
                  </div>

                  <input
                    type="text"
                    placeholder="Player IGN"
                    value={player.name}
                    onChange={(e) => updatePlayer(index, "name", e.target.value)}
                    className="rounded-2xl border border-cyan-400/20 bg-black/40 px-5 py-4 text-white outline-none placeholder:text-gray-500 focus:border-cyan-300"
                  />

                  <input
                    type="text"
                    placeholder="Player UID"
                    value={player.uid}
                    onChange={(e) => updatePlayer(index, "uid", e.target.value)}
                    className="rounded-2xl border border-cyan-400/20 bg-black/40 px-5 py-4 text-white outline-none placeholder:text-gray-500 focus:border-cyan-300"
                  />

                  <select
                    value={player.gender}
                    onChange={(e) =>
                      updatePlayer(index, "gender", e.target.value)
                    }
                    className="rounded-2xl border border-cyan-400/20 bg-black/40 px-5 py-4 text-white outline-none focus:border-cyan-300"
                  >
                    <option value="">Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10 grid gap-8 lg:grid-cols-3">
            <div className="rounded-[32px] border border-cyan-400/20 bg-white/[0.04] p-7">
              <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-400">
                Entry Fee
              </p>

              <h2 className="mt-5 text-5xl font-black text-white">₹500</h2>

              <p className="mt-3 text-gray-400">Per Team Registration Fee</p>

              <div className="mt-6 rounded-[26px] border border-cyan-400/20 bg-black/40 p-5">
                <img
                  src="/upi-qr.jpeg"
                  alt="UPI QR"
                  className="mx-auto w-full max-w-[220px] rounded-2xl"
                />

                <p className="mt-5 break-all text-sm font-bold text-cyan-300">
                  UPI ID: madhubalasingh094@ibl
                </p>

                <p className="mt-2 text-sm font-bold text-gray-300">
                  UPI Name: CHANDA RAVINDRA SINGH
                </p>
              </div>
            </div>

            <div className="rounded-[32px] border border-cyan-400/20 bg-white/[0.04] p-7">
              <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-400">
                Payment Screenshot
              </p>

              <p className="mt-4 text-gray-400">
                Upload payment proof after completing UPI payment.
              </p>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "payment")}
                className="mt-6 w-full rounded-2xl border border-cyan-400/20 bg-black/40 px-4 py-4 text-white outline-none"
              />

              {paymentScreenshot && (
                <img
                  src={paymentScreenshot}
                  alt="Payment"
                  className="mt-6 max-h-64 w-full rounded-2xl border border-cyan-400/20 object-cover"
                />
              )}
            </div>

            <div className="rounded-[32px] border border-cyan-400/20 bg-white/[0.04] p-7">
              <p className="text-sm font-black uppercase tracking-[0.28em] text-cyan-400">
                Tournament Rules
              </p>

              <div className="mt-5 space-y-4 text-sm leading-relaxed text-gray-300">
                <p>• Only real Free Fire IDs are allowed.</p>
                <p>• QR verification is mandatory at LAN venue.</p>
                <p>• Teams can have 4 players + 1 substitute only.</p>
                <p>• Emulator, hacks or unfair play will result in direct ban.</p>
                <p>• Admin decisions will be final.</p>
              </div>

              <label className="mt-7 flex cursor-pointer items-start gap-4 rounded-2xl border border-cyan-400/20 bg-black/35 p-4">
                <input
                  type="checkbox"
                  checked={acceptedRules}
                  onChange={(e) => setAcceptedRules(e.target.checked)}
                  className="mt-1 h-5 w-5 accent-cyan-500"
                />

                <span className="font-bold text-white">
                  I accept all FFMSC tournament rules
                </span>
              </label>
            </div>
          </section>

          <button
            onClick={handleSubmit}
            disabled={loading || uploadingImage}
            className="mt-10 w-full rounded-[26px] bg-cyan-400 py-5 text-xl font-black uppercase tracking-[0.25em] text-black shadow-[0_0_35px_rgba(34,211,238,0.45)] transition hover:scale-[1.01] hover:bg-cyan-300 disabled:opacity-50"
          >
            {uploadingImage
              ? "Uploading Image..."
              : loading
              ? "Submitting..."
              : "Submit Registration"}
          </button>
        </div>
      </main>
    </>
  );
}