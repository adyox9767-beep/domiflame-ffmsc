export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-24 text-white">
      <div className="mx-auto max-w-5xl">

        <p className="mb-4 text-sm font-bold uppercase tracking-[0.4em] text-cyan-400">
          About Us
        </p>

        <h1 className="text-5xl font-black">
          DOMIFLAME ESPORTS
        </h1>

        <div className="mt-10 rounded-[30px] border border-cyan-400/20 bg-white/5 p-8 backdrop-blur-xl">

          <p className="text-lg leading-relaxed text-gray-300">
            DOMIFLAME ESPORTS is a competitive esports organization focused on organizing premium Free Fire Max tournaments, LAN events, esports productions and professional player verification systems.
          </p>

          <p className="mt-6 text-lg leading-relaxed text-gray-300">
            Our mission is to create secure, fair and high-quality tournaments for esports players across India.
          </p>

          <p className="mt-6 text-lg leading-relaxed text-gray-300">
            We provide tournament registration systems, QR verification access, digital player IDs and competitive event management.
          </p>

        </div>
      </div>
    </main>
  );
}