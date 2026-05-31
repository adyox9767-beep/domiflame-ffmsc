export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <div className="mx-auto max-w-5xl">

        <p className="mb-4 text-sm font-bold uppercase tracking-[0.4em] text-cyan-400">
          Contact Us
        </p>

        <h1 className="text-5xl font-black">
          Contact DOMIFLAME
        </h1>

        <div className="mt-10 space-y-6 rounded-[30px] border border-cyan-400/20 bg-white/5 p-8 backdrop-blur-xl">

          <div>
            <h2 className="text-xl font-bold text-cyan-400">
              Email
            </h2>

            <p className="mt-2 text-lg text-gray-300">
              domiflamesupport@gmail.com
       </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-cyan-400">
              Instagram
            </h2>

            <p className="mt-2 text-lg text-gray-300">
              @domiflame.in
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-cyan-400">
              WhatsApp
            </h2>

            <p className="mt-2 text-lg text-gray-300">
              +91 9900871329
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}