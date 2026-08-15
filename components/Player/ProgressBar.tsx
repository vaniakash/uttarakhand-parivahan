"use client";

import { usePlayer } from "@/context/PlayerContext";

function formatTime(seconds: number) {
  if (isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export default function ProgressBar() {
  const { progress, duration, seekTo } = usePlayer();

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seekTo(Number(e.target.value));
  };

  const percentage = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-3 w-full group">
      <span className="text-xs text-white/50 w-10 text-right font-mono">
        {formatTime(progress)}
      </span>
      
      <div className="relative flex-1 h-2 bg-white/10 rounded-full overflow-hidden flex items-center">
        <div 
          className="absolute left-0 top-0 bottom-0 bg-accent rounded-full pointer-events-none"
          style={{ width: `${percentage}%` }}
        />
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={progress}
          onChange={handleSeek}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      <span className="text-xs text-white/50 w-10 font-mono">
        {formatTime(duration)}
      </span>
    </div>
  );
}
