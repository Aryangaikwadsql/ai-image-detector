"use client"

import type React from "react"

import { useRef, useState } from "react"
import RadialMeter from "./radial-meter"

type ApiResponse = {
  score: number
  label: "AI-Generated" | "Human-Captured" | "Uncertain"
  reason: string
}

type DisplayResult = {
  verdict:
    | "AI-Generated"
    | "Human-Captured"
    | "Most Likely AI-Generated"
    | "Most Likely Human-Captured"
    | "Uncertain – borderline case"
  score: number
  reason: string
}

const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

export default function Detector() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<DisplayResult | null>(null)

  // optional sounds
  const clickSound = useRef<HTMLAudioElement | null>(null)
  const doneSound = useRef<HTMLAudioElement | null>(null)

  const safePlay = async (el: HTMLAudioElement | null) => {
    if (!el) return
    const src = el.getAttribute("src") || ""
    if (!src) return

    // Infer MIME type from extension
    const ext = src.split(".").pop()?.toLowerCase()
    const mime = ext === "ogg" ? "audio/ogg" : ext === "wav" ? "audio/wav" : "audio/mpeg" // default to mp3

    // Ensure browser reports support for this type
    if (typeof el.canPlayType !== "function" || el.canPlayType(mime) === "") return

    try {
      // If we don't have current data yet, try to load and wait for canplay (with error fallback)
      if (el.readyState < 2 /* HAVE_CURRENT_DATA */) {
        await new Promise<void>((resolve) => {
          const onCanPlay = () => {
            cleanup()
            resolve()
          }
          const onError = () => {
            cleanup()
            resolve() // resolve anyway; we'll no-op on play below
          }
          const cleanup = () => {
            el.removeEventListener("canplay", onCanPlay)
            el.removeEventListener("error", onError)
          }
          el.addEventListener("canplay", onCanPlay, { once: true })
          el.addEventListener("error", onError, { once: true })
          try {
            el.load()
          } catch {
            // ignore
            cleanup()
            resolve()
          }
        })
      }

      try {
        el.currentTime = 0
      } catch {
        // ignore
      }

      // Play and swallow any rejections
      const p = el.play()
      if (p && typeof p.then === "function") {
        await p.catch(() => {})
      }
    } catch {
      // swallow synchronous NotSupportedError
    }
  }

  const playClick = () => {
    void safePlay(clickSound.current)
  }
  const playDone = () => {
    void safePlay(doneSound.current)
  }

  const onFiles = (files?: FileList | null) => {
    if (!files || files.length === 0) return
    const f = files[0]
    setError(null)
    setResult(null)

    if (!f.type.startsWith("image/")) {
      setError("Please upload a valid image file.")
      return
    }
    if (f.size > MAX_SIZE_BYTES) {
      setError("Image is too large. Please select a file under 5MB.")
      return
    }
    setFile(f)
    const url = URL.createObjectURL(f)
    setPreviewUrl(url)
  }

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onFiles(e.dataTransfer.files)
  }

  const handleBrowse = () => {
    playClick()
    inputRef.current?.click()
  }

  const analyze = async () => {
    if (!file) {
      setError("Please select an image first.")
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const fd = new FormData()
      fd.append("image", file)
      const res = await fetch("/api/detect", {
        method: "POST",
        body: fd,
      })
      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || "Request failed")
      }
      const data: ApiResponse = await res.json()
      const display = toDisplay(data)
      setResult(display)
      playDone()
    } catch (err: any) {
      setError(err?.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  const toDisplay = (resp: ApiResponse): DisplayResult => {
    const s = Math.max(0, Math.min(100, Math.round(resp.score)))
    let verdict: DisplayResult["verdict"]
    if (s < 35) verdict = "Human-Captured"
    else if (s < 45) verdict = "Most Likely Human-Captured"
    else if (s <= 55) verdict = "Uncertain – borderline case"
    else if (s <= 65) verdict = "Most Likely AI-Generated"
    else verdict = "AI-Generated"
    return { verdict, score: s, reason: resp.reason }
  }

  return (
    <section className="rounded-xl border border-zinc-800 bg-neutral-900/50 p-4 shadow-sm backdrop-blur">
      {/* Hidden file input */}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => onFiles(e.target.files)} />

      {/* Uploader */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        className="group relative rounded-lg border border-dashed border-zinc-700/80 p-4 transition-colors hover:border-zinc-500"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">Input</span>
          </div>

          {!previewUrl ? (
            <>
              <button
                onClick={handleBrowse}
                className="rounded-md bg-neutral-800 px-4 py-2 font-sans text-sm font-medium text-zinc-100 shadow-sm ring-1 ring-inset ring-zinc-700 transition hover:bg-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
              >
                Click to upload
              </button>
              <p className="font-mono text-xs text-zinc-400">…or drag & drop an image here</p>
            </>
          ) : (
            <div className="w-full">
              <div className="overflow-hidden rounded-md border border-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl || "/placeholder.svg?height=300&width=300&query=uploaded%20image%20preview"}
                  alt="Uploaded preview"
                  className="max-h-72 w-full bg-neutral-950 object-contain"
                />
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={handleBrowse}
                  className="rounded-md border border-zinc-700 bg-neutral-800 px-3 py-1.5 font-sans text-sm text-zinc-100 transition hover:bg-neutral-700"
                >
                  Change image
                </button>
                <button
                  onClick={analyze}
                  disabled={loading}
                  className={`inline-flex items-center gap-2 rounded-md px-4 py-2 font-sans text-sm font-semibold text-neutral-950 transition shadow-sm disabled:opacity-60 ${loading ? "bg-zinc-400" : "bg-emerald-400 hover:bg-emerald-300"}`}
                >
                  Analyze
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status / Results */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-zinc-800 p-4">
          <h2 className="font-sans text-sm font-semibold text-zinc-200">Detection Score</h2>
          <div className="mt-3 flex items-center justify-center">
            <RadialMeter
              value={result?.score ?? 0}
              colorClass={
                result
                  ? result.score <= 45
                    ? "text-zinc-400"
                    : result.score <= 55
                      ? "text-amber-300"
                      : "text-emerald-400"
                  : "text-emerald-400"
              }
              trackClass="text-zinc-800"
            />
          </div>
          <p className="mt-2 text-center font-mono text-xs text-zinc-400">0% human • 100% AI</p>
        </div>

        <div className="rounded-lg border border-zinc-800 p-4">
          <h2 className="font-sans text-sm font-semibold text-zinc-200">Result</h2>

          {/* Loading */}
          {loading && (
            <div
              role="status"
              aria-live="polite"
              className="mt-3 rounded-md border border-zinc-800 bg-neutral-900 px-3 py-2 font-mono text-sm text-zinc-300"
            >
              <span className="inline-flex items-center gap-2">
                <span className="relative inline-block">
                  Analyzing
                  <span className="ml-1 inline-block w-3 animate-pulse text-center">…</span>
                </span>
                <span className="ml-2 h-2 w-2 animate-pulse rounded-full bg-amber-300/80" />
              </span>
              <div className="mt-3 h-2 overflow-hidden rounded border border-zinc-800 bg-neutral-800">
                <span
                  className="block h-full bg-amber-300/80"
                  style={{ width: "40%", animation: "retro-scan 1.1s linear infinite" }}
                />
              </div>
              <p className="mt-2 text-xs text-zinc-500">Retro engine engaged. Please wait.</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div
              role="alert"
              className="mt-3 rounded-md border border-amber-400/30 bg-neutral-900 px-3 py-2 font-mono text-sm text-amber-300"
            >
              {error}
            </div>
          )}

          {/* Result */}
          {result && !loading && (
            <div className="mt-3 rounded-md border border-zinc-800 bg-neutral-900 px-3 py-3">
              <p
                className={`font-sans text-balance text-base font-semibold ${
                  result.verdict.includes("AI") ? "text-emerald-300" : "text-zinc-100"
                }`}
              >
                {result.verdict}
              </p>
              <p className="mt-2 font-mono text-xs text-zinc-400">{result.reason}</p>
            </div>
          )}
        </div>
      </div>

      {/* Optional Sounds */}
      <audio ref={clickSound} src="/sounds/click.mp3" preload="none" aria-hidden="true" />
      <audio ref={doneSound} src="/sounds/chime.mp3" preload="none" aria-hidden="true" />

      <style jsx>{`
        @keyframes retro-scan {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </section>
  )
}
