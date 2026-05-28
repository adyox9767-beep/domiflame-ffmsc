export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <div className="mx-auto max-w-5xl">

        <p className="mb-4 text-sm font-bold uppercase tracking-[0.4em] text-cyan-400">
          Terms & Conditions
        </p>

        <h1 className="text-5xl font-black">
          Tournament Terms
        </h1>

        <div className="mt-10 space-y-6 rounded-[30px] border border-cyan-400/20 bg-white/5 p-8 backdrop-blur-xl text-gray-300 leading-relaxed">

          <p>
            All players must provide valid Free Fire IDs during registration.
          </p>

          <p>
            Any use of hacks, cheats, exploits or unfair gameplay will result in instant disqualification.
          </p>

          <p>
            Tournament organizers reserve the right to remove teams violating tournament rules.
          </p>

          <p>
            Players must complete verification and QR check-in before entering LAN events.
          </p>

          <p>
            Admin decisions during tournaments will be final and binding.
          </p>

        </div>
      </div>
    </main>
  );
}