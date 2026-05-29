"use client";

import { useEffect, useState } from "react";
import { sendEmailVerification, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function EmailVerifyPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      await user.reload();

      if (!auth.currentUser?.emailVerified) {
        setShow(true);
      }
    });

    return () => unsub();
  }, []);

  const sendVerify = async () => {
    if (!auth.currentUser) return;

    await sendEmailVerification(auth.currentUser);
    alert("Verification email sent");
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 px-6">
      <div className="max-w-md rounded-[35px] border border-yellow-400/30 bg-black p-8 text-center text-white">
        <h2 className="text-3xl font-black text-yellow-300">
          Verify Your Email
        </h2>

        <p className="mt-4 text-gray-300">
          Team register karne se pehle email verify karna zaroori hai.
        </p>

        <button
          onClick={sendVerify}
          className="mt-6 rounded-full bg-yellow-400 px-6 py-3 font-black text-black"
        >
          Send Verification Email
        </button>

        <button
          onClick={() => setShow(false)}
          className="mt-4 block w-full text-sm text-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  );
}