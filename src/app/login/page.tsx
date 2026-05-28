"use client";

import { useState } from "react";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

import { useRouter } from "next/navigation";

import { adminEmails } from "@/lib/admin";

import { auth } from "@/lib/firebase";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // AFTER LOGIN
  const handleLoginRedirect = (
    user: any
  ) => {

    if (
      adminEmails.includes(
        user.email || ""
      )
    ) {

      router.push(
        "/admin-secure-portal-x92"
      );

    } else {

      router.push("/dashboard");
    }
  };

  // GOOGLE LOGIN
  const handleGoogleLogin = async () => {

    try {

      setLoading(true);

      const provider =
        new GoogleAuthProvider();

      const result =
        await signInWithPopup(
          auth,
          provider
        );

      // EMAIL VERIFY CHECK
      if (
        !result.user.emailVerified
      ) {

        await sendEmailVerification(
          result.user
        );

        alert(
          "Please verify your email first. Verification link sent again."
        );

        return;
      }

      handleLoginRedirect(
        result.user
      );

    } catch (error) {

      console.error(error);

      alert("Login Failed");

    } finally {

      setLoading(false);
    }
  };

  // EMAIL LOGIN
  const handleEmailLogin = async () => {

    try {

      setLoading(true);

      const result =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      // VERIFY CHECK
      if (
        !result.user.emailVerified
      ) {

        await sendEmailVerification(
          result.user
        );

        alert(
          "Please verify your email before login. Verification email sent again."
        );

        return;
      }

      handleLoginRedirect(
        result.user
      );

    } catch (error) {

      console.error(error);

      alert(
        "Invalid Credentials"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6">

      {/* GLOW */}
      <div className="absolute top-0 left-0 h-100 w-100 rounded-full bg-cyan-500/20 blur-3xl"></div>

      <div className="absolute bottom-0 right-0 h-100 w-100 rounded-full bg-cyan-400/20 blur-3xl"></div>

      {/* CARD */}
      <div className="relative w-full max-w-md rounded-[40px] border border-cyan-400/20 bg-white/5 p-10 backdrop-blur-xl">

        <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
          DOMIFLAME ESPORTS
        </p>

        <h1 className="text-5xl font-black text-white">
          Captain Login
        </h1>

        <p className="mt-4 text-gray-300">
          Login to access your FFMSC dashboard.
        </p>

        {/* EMAIL */}
        <div className="mt-10 space-y-5">

          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-2xl border border-cyan-400/20 bg-black/30 px-5 py-4 text-white outline-none"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-2xl border border-cyan-400/20 bg-black/30 px-5 py-4 text-white outline-none"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />

          <button
            onClick={
              handleEmailLogin
            }
            disabled={loading}
            className="w-full rounded-2xl bg-cyan-500 py-4 font-black text-black transition hover:bg-cyan-400 disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : "Login with Email"}
          </button>
        </div>

        {/* DIVIDER */}
        <div className="my-8 text-center text-sm text-gray-400">
          OR
        </div>

        {/* GOOGLE */}
        <button
          onClick={
            handleGoogleLogin
          }
          disabled={loading}
          className="w-full rounded-2xl border border-cyan-400/20 bg-white/5 py-4 font-bold text-white transition hover:bg-cyan-500/10 disabled:opacity-50"
        >
          Continue with Google
        </button>

        {/* SIGNUP */}
        <div className="mt-8 text-center">

          <a
            href="/signup"
            className="text-cyan-400"
          >
            Create New Account
          </a>

        </div>
      </div>
    </main>
  );
}