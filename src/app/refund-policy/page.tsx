export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <div className="mx-auto max-w-5xl">

        <p className="mb-4 text-sm font-bold uppercase tracking-[0.4em] text-cyan-400">
          Cancellation & Refund Policy
        </p>

        <h1 className="text-5xl font-black">
          Refund Policy
        </h1>

        <div className="mt-10 space-y-6 rounded-[30px] border border-cyan-400/20 bg-white/5 p-8 backdrop-blur-xl text-gray-300 leading-relaxed">

          <p>
            Tournament registration fees are non-refundable after successful verification.
          </p>

          <p>
            Refunds may only be issued if an event is cancelled by DOMIFLAME ESPORTS.
          </p>

          <p>
            Teams removed for cheating, fake IDs or rule violations will not receive refunds.
          </p>

          <p>
            Refund processing timelines may vary depending on payment providers.
          </p>

        </div>
      </div>
    </main>
  );
}