"use client";

import Image from "next/image";
import { useState } from "react";
import { videoSrc, videoUrl, type Video } from "@/data/festivales";
import { cn } from "@/lib/utils";

/**
 * Pantalla de cine: muestra el fotograma y solo carga el reproductor (YouTube sin cookies o Vimeo sin rastreo)
 * cuando se pulsa el botón de play.
 */
export function VideoScreen({ video, sizes, className, autoplay = false }: { video: Video; sizes: string; className?: string; autoplay?: boolean }) {
  const [playing, setPlaying] = useState(autoplay);

  return (
    <div className={cn("relative aspect-video w-full overflow-hidden bg-black", className)}>
      {playing ? (
        <iframe
          src={videoSrc(video)}
          title={video.title}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 block text-left" data-cursor="Play">
          <Image src={video.poster.src} alt="" fill sizes={sizes} className="object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]" />
          <span className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(0,0,0,0.05),rgba(0,0,0,0.6))]" aria-hidden="true" />
          <span className="absolute left-1/2 top-1/2 grid h-[clamp(4rem,9vw,6.5rem)] w-[clamp(4rem,9vw,6.5rem)] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-tutu text-noche shadow-[0_0_0_10px_rgba(191,225,248,0.18)] transition-[transform,box-shadow] duration-500 ease-[var(--ease-out-expo)] group-hover:scale-110 group-hover:shadow-[0_0_0_18px_rgba(191,225,248,0.14)]">
            <svg viewBox="0 0 24 24" className="ml-[8%] h-[38%] w-[38%]" fill="currentColor" aria-hidden="true">
              <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.4-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
            </svg>
          </span>
          <span className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 sm:inset-x-6 sm:bottom-5">
            <span className="text-sm font-medium text-white drop-shadow sm:text-base">{video.title}</span>
            <span className="shrink-0 text-xs uppercase tracking-[0.2em] text-white/70">{video.provider === "youtube" ? "YouTube" : "Vimeo"}</span>
          </span>
          <span className="sr-only">Reproducir el vídeo «{video.title}»</span>
        </button>
      )}
      <a href={videoUrl(video)} target="_blank" rel="noopener noreferrer" className="sr-only focus:not-sr-only focus:absolute focus:right-3 focus:top-3 focus:rounded-full focus:bg-white focus:px-3 focus:py-1 focus:text-sm focus:text-noche">
        Abrir en {video.provider === "youtube" ? "YouTube" : "Vimeo"}
      </a>
    </div>
  );
}
