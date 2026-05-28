import Link from "next/link";

import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      <Navbar />

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 h-100 w-100 rounded-full bg-cyan-500/20 blur-3xl"></div>

      <div className="absolute right-0 bottom-0 h-100 w-100 rounded-full bg-cyan-400/10 blur-3xl"></div>

      {/* HERO */}
      <section className="relative flex min-h-screen items-center justify-center px-6 py-20">

        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">

          {/* LEFT */}
          <div>

            <p className="mb-6 text-sm font-bold uppercase tracking-[0.4em] text-cyan-400">
              DOMIFLAME ESPORTS PRESENTS
            </p>

            <h1 className="text-5xl font-black leading-tight sm:text-6xl md:text-7xl">
              FFMSC
              <span className="block text-cyan-400">
                GRAND FINALS
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-gray-300">
              Official Free Fire Max LAN Tournament featuring
              professional player verification, digital ID cards,
              QR check-in system and premium esports production.
            </p>

            {/* BUTTONS */}
            <div className="mt-10 flex flex-wrap gap-5">

              <Link
                href="/dashboard"
                className="rounded-full bg-cyan-500 px-8 py-4 text-lg font-black text-black transition hover:scale-105 hover:bg-cyan-400"
              >
                REGISTER NOW
              </Link>

              <a
                href="#rules"
                className="rounded-full border border-cyan-400 px-8 py-4 text-lg font-bold text-cyan-300 transition hover:bg-cyan-400/10"
              >
                VIEW RULES
              </a>
            </div>

            {/* INFO */}
            <div className="mt-12 grid gap-6 sm:grid-cols-3">

              <div className="rounded-3xl border border-cyan-400/20 bg-white/5 p-5 backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
                  Teams
                </p>

                <h2 className="mt-3 text-4xl font-black">
                  500+
                </h2>
              </div>

              <div className="rounded-3xl border border-cyan-400/20 bg-white/5 p-5 backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
                  Mode
                </p>

                <h2 className="mt-3 text-4xl font-black">
                  LAN
                </h2>
              </div>

              <div className="rounded-3xl border border-cyan-400/20 bg-white/5 p-5 backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
                  Status
                </p>

                <h2 className="mt-3 text-4xl font-black text-cyan-400">
                  LIVE
                </h2>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative flex justify-center">

            <div className="absolute h-80 w-80 rounded-full bg-cyan-500/30 blur-3xl"></div>

            <div className="relative overflow-hidden rounded-[40px] border border-cyan-400/20 bg-white/5 p-8 backdrop-blur-xl">

              <div className="relative">

  {/* GLOW */}
  <div className="absolute inset-0 rounded-[40px] bg-cyan-500/20 blur-3xl"></div>

  {/* CARD */}
  <div className="relative overflow-hidden rounded-[40px] border border-cyan-400/20 bg-black/60 p-6 backdrop-blur-xl">

    {/* TOP */}
    <div className="flex items-center justify-between">

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400">
          OFFICIAL
        </p>

        <h2 className="mt-2 text-3xl font-black text-white">
          FFMSC 2026
        </h2>
      </div>

      <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-2">
        <p className="text-sm font-bold text-cyan-300">
          GRAND FINALS
        </p>
      </div>
    </div>

    {/* LOGO */}
    <div className="mt-10 flex justify-center">

      <img
        src="/ffmsc-logo.png"
        alt="FFMSC Logo"
        className="w-full max-w-sm object-contain"
      />
    </div>

    {/* BOTTOM */}
    <div className="mt-10 grid grid-cols-2 gap-4">

      <div className="rounded-3xl border border-cyan-400/20 bg-white/5 p-5">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
          ENTRY
        </p>

        <h3 className="mt-3 text-2xl font-black text-white">
          VERIFIED
        </h3>
      </div>

      <div className="rounded-3xl border border-cyan-400/20 bg-white/5 p-5">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
          ACCESS
        </p>

        <h3 className="mt-3 text-2xl font-black text-cyan-400">
          QR ID
        </h3>
      </div>
    </div>
  </div>
</div>

            </div>
          </div>
        </div>
      </section>

      {/* RULES */}
      <section
        id="rules"
        className="relative px-6 pb-24"
      >
        <div className="mx-auto max-w-7xl">

          <div className="mb-14 text-center">

            <p className="mb-4 text-sm font-bold uppercase tracking-[0.4em] text-cyan-400">
              FFMSC RULEBOOK
            </p>

            <h2 className="text-5xl font-black">
              Tournament Rules
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {[
              "Only registered players are allowed.",
              "QR verification required at LAN venue.",
              "Teams can have max 4 players + 1 substitute.",
              "No emulator or hacks allowed.",
              "Players must use real Free Fire UID.",
              "Admins can disqualify unfair teams instantly.",
            ].map((rule, index) => (
              <div
                key={index}
                className="rounded-[30px] border border-cyan-400/20 bg-white/5 p-6 backdrop-blur-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 text-xl font-black text-black">
                  {index + 1}
                </div>

                <p className="mt-6 text-lg leading-relaxed text-gray-300">
                  {rule}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="border-t border-cyan-400/10 px-6 py-16">

        <div className="mx-auto flex max-w-7xl flex-col gap-10 md:flex-row md:items-center md:justify-between">

          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-cyan-400">
              CONTACT
            </p>

            <h2 className="mt-4 text-4xl font-black">
              DOMIFLAME ESPORTS
            </h2>
          </div>

          <div className="space-y-3 text-gray-300">

            <p>
              Instagram: @domiflameesports
            </p>

            <p>
              Email: domiflameesports@gmail.com
            </p>

            <p>
              WhatsApp Support Available
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}