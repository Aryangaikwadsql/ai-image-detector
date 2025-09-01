import Detector from "@/components/detector"

export default function Page() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center p-4">
      {/* subtle grain overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-soft-light"
        style={{
          backgroundImage: "url('/images/noise.png')",
          backgroundSize: "300px 300px",
        }}
      />
      <div className="relative w-full max-w-xl">
        <header className="mb-6 text-center">
          <h1 className="font-sans text-pretty text-2xl font-semibold tracking-tight md:text-3xl">
            AI Image Detector v1.0
          </h1>
          <p className="mt-2 font-mono text-sm text-zinc-400">Retro-grade analysis. Modern accuracy.</p>
        </header>

        <Detector />

        <footer className="mt-8 text-center">
          <p className="font-mono text-xs text-zinc-500">Powered by AI Detection Engine</p>
        </footer>
      </div>
    </main>
  )
}
