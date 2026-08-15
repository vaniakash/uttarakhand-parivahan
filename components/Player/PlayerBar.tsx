"use client";

import { usePlayer } from "@/context/PlayerContext";
import { Play, Pause, SkipBack, SkipForward, Menu, Loader2 } from "lucide-react";
import { useState } from "react";
import Sidebar from "../Playlist/Sidebar";

function formatTime(seconds: number) {
  if (isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export default function PlayerBar() {
  const { currentSong, isLoading, isPlaying, togglePlay, next, prev, progress, duration, seekTo } = usePlayer();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const percentage = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <>
      <div className="absolute top-48 md:top-64 left-1/2 -translate-x-1/2 z-40 w-full max-w-3xl px-4">
        <div className="ticket-panel rounded-full h-16 md:h-20 flex items-center px-2 pr-6 justify-between gap-4">
          
          {/* Left: Album Art */}
          <div className="flex items-center gap-3 w-1/4 max-w-[200px]">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-[#d4c5b0] relative shrink-0 bg-black/10 flex items-center justify-center">
              {isLoading ? (
                <Loader2 className="animate-spin text-gray-400" size={24} />
              ) : currentSong ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={currentSong.thumbnail} alt="" className="w-full h-full object-cover" />
                  {isPlaying && (
                    <div className="absolute inset-0 bg-black/20 animate-pulse rounded-full" />
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gray-300" />
              )}
            </div>
            <div className="hidden sm:flex flex-col min-w-0">
               <h2 className="text-xs md:text-sm font-bold truncate text-[var(--color-ticket-text)] leading-tight font-serif">
                 {isLoading ? "Loading Ticket..." : currentSong?.title || "No Ticket"}
               </h2>
               <p className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-wider truncate font-mono">
                 {isLoading ? "PLEASE WAIT" : currentSong?.artist || "UNKNOWN"}
               </p>
            </div>
          </div>

          {/* Center: Controls & Mini Progress */}
          <div className="flex-1 flex items-center gap-2 md:gap-4 justify-center">
             <button onClick={prev} disabled={isLoading || !currentSong} className="p-1 hover:text-black text-[var(--color-ticket-text)] hidden sm:block disabled:opacity-50"><SkipBack size={16} fill="currentColor" /></button>
             <button onClick={togglePlay} disabled={isLoading || !currentSong} className="w-10 h-10 md:w-12 md:h-12 shrink-0 bg-[var(--color-accent-yellow)] rounded-full flex items-center justify-center shadow-md hover:scale-105 text-black border border-orange-300 disabled:opacity-50 disabled:hover:scale-100">
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : (isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />)}
             </button>
             <button onClick={next} disabled={isLoading || !currentSong} className="p-1 hover:text-black text-[var(--color-ticket-text)] hidden sm:block disabled:opacity-50"><SkipForward size={16} fill="currentColor" /></button>

             {/* Tiny Progress Bar */}
             <div className="flex-1 flex items-center gap-2 max-w-[200px] ml-2">
               <span className="text-[10px] font-mono font-bold text-gray-600 w-8 text-right hidden lg:block">{formatTime(progress)}</span>
               <div className="relative flex-1 h-1.5 bg-[#d4c5b0] rounded-full cursor-pointer group flex items-center">
                 <div className="absolute left-0 top-0 bottom-0 bg-[var(--color-accent-yellow)] rounded-full" style={{ width: `${percentage}%` }} />
                 <div 
                    className="absolute h-3 w-3 rounded-full bg-[var(--color-accent-yellow)] shadow border border-white top-1/2 -translate-y-1/2 -ml-1.5 transition-transform group-hover:scale-125"
                    style={{ left: `${percentage}%` }}
                 />
                 <input
                   type="range"
                   min={0}
                   max={duration || 100}
                   value={progress}
                   onChange={(e) => seekTo(Number(e.target.value))}
                   disabled={isLoading || !currentSong}
                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                 />
               </div>
               <span className="text-[10px] font-mono font-bold text-gray-600 w-8 hidden lg:block">{formatTime(duration)}</span>
             </div>
          </div>

          {/* Right: Tags & Menu */}
          <div className="flex items-center gap-3 md:gap-4 shrink-0">
             {/* Tags */}
             <div className="hidden lg:flex items-center gap-1.5 font-mono text-[10px] font-bold text-gray-500">
                <span className="px-2 py-0.5 border border-gray-400 rounded-full">GARHWALI</span>
                <span className="px-2 py-0.5 border border-gray-400 rounded-full">UK07</span>
                <span className="px-2 py-0.5 border border-gray-400 rounded-full">NIGHT</span>
                <span className="ticket-stamp px-1.5 py-0.5 -rotate-6 ml-2 bg-white font-black text-[var(--color-accent-red)]">TICKET</span>
             </div>

             {/* Menu Toggle */}
             <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-black/5 rounded-full text-[var(--color-ticket-text)]">
                <Menu size={24} />
             </button>
          </div>

        </div>
      </div>
      
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
