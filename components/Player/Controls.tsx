"use client";

import { usePlayer } from "@/context/PlayerContext";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

export default function Controls() {
  const { isPlaying, togglePlay, next, prev } = usePlayer();

  return (
    <div className="flex items-center gap-6 justify-center">
      <button 
        onClick={prev}
        className="text-white/70 hover:text-white transition-colors p-2"
        aria-label="Previous track"
      >
        <SkipBack size={24} fill="currentColor" />
      </button>

      <button 
        onClick={togglePlay}
        className="w-14 h-14 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-transform"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause size={28} fill="currentColor" />
        ) : (
          <Play size={28} fill="currentColor" className="ml-1" />
        )}
      </button>

      <button 
        onClick={next}
        className="text-white/70 hover:text-white transition-colors p-2"
        aria-label="Next track"
      >
        <SkipForward size={24} fill="currentColor" />
      </button>
    </div>
  );
}
