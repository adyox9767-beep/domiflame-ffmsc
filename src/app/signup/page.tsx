"use client";

import { useState } from "react";

import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import Navbar from "@/components/Navbar";

import { auth } from "@/lib/firebase";

import { useRouter } from "next/navigation";

export default function SignupPage() {

  const router = useRouter();

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSignup = async () => {

    if (
      !name ||
      !phone ||
      !email ||
      !password
    ) {
      alert("Please fill all fields");
      return;
    }

    try {

      setLoading(true);

      const result =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      // SAVE NAME
      await updateProfile(
        result.user,
        {
          displayName: name,
        }
      );

      alert(
        "Account created successfully."
      );

      router.push("/login");

    } catch (error: any) {

      console.error(error);

      alert(
        error.message ||
        "Signup failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
  <>
    <Navbar />
    <main className="flex min-h-screen items-center justify-center bg-black px-6 py-32">

      {/* GLOW */}
      <div className="absolute top-0 left-0 h-100 w-100 rounded-full bg-cyan-500/20 blur-3xl"></div>

      <div className="absolute bottom-0 right-0 h-100 w-100 rounded-full bg-cyan-400/20 blur-3xl"></div>

      {/* CARD */}
      <div className="relative w-full max-w-xl rounded-[40px] border border-cyan-400/20 bg-white/5 p-10 backdrop-blur-xl">

        <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
          DOMIFLAME ESPORTS
        </p>

        <h1 className="mt-4 text-5xl font-black text-white">
          Create Account
        </h1>

        <p className="mt-4 text-gray-300">
          Create your FFMSC captain account to register your team.
        </p>

        {/* FORM */}
        <div className="mt-10 space-y-5">

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-cyan-400/20 bg-black/30 px-5 py-4 text-white outline-none"
          />

          <input
            type="text"
            placeholder="WhatsApp Number"
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-cyan-400/20 bg-black/30 px-5 py-4 text-white outline-none"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-cyan-400/20 bg-black/30 px-5 py-4 text-white outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-cyan-400/20 bg-black/30 px-5 py-4 text-white outline-none"
          />

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full rounded-2xl bg-cyan-500 py-4 text-lg font-black text-black transition hover:bg-cyan-400 disabled:opacity-50"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </div>

        {/* LOGIN */}
        <div className="mt-8 text-center">

          <a
            href="/login"
            className="text-cyan-400"
          >
            Already have an account? Login
          </a>

        </div>
      </div>
    </main>
    </>
  );
}