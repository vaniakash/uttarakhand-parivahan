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
      <div className="absolute top-[45%] md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-full max-w-[340px] md:max-w-[400px] px-4 mt-8 md:mt-12">
        <div className="ticket-panel rounded-[2rem] flex flex-col items-center px-6 pt-8 pb-4 gap-4 shadow-2xl relative">
          
          {/* Top Ticket Perforation Line */}
          <div className="absolute top-0 left-6 bottom-0 w-px border-l border-dashed border-gray-400 opacity-30 pointer-events-none" />
          
          {/* Circular Album Art */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[#2b4c3b] relative shrink-0 bg-black/10 flex items-center justify-center shadow-lg">
            {isLoading ? (
              <Loader2 className="animate-spin text-gray-400" size={32} />
            ) : currentSong ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                   src={currentSong.thumbnail} 
                   alt="" 
                   className={`w-full h-full object-cover transition-transform duration-[10s] ease-linear ${isPlaying ? 'scale-110' : ''}`} 
                />
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/10 animate-pulse rounded-full" />
                )}
              </>
            ) : (
              <div className="w-full h-full bg-[#d4c5b0]" />
            )}
          </div>
          
          {/* Titles */}
          <div className="flex flex-col items-center w-full min-w-0 px-2 mt-2">
             <h2 className="text-xl md:text-2xl font-bold truncate text-[#5c2b18] leading-tight font-serif text-center w-full">
               {isLoading ? "Loading Ticket..." : currentSong?.title || "No Ticket"}
             </h2>
             <p className="text-[10px] md:text-xs text-[#2b4c3b] font-bold uppercase tracking-widest truncate font-mono mt-1 w-full text-center">
               {isLoading ? "PLEASE WAIT" : currentSong?.artist || "UNKNOWN"}
             </p>
          </div>

          {/* Progress Bar Row */}
          <div className="flex w-full items-center gap-3 mt-2">
             <span className="text-[10px] font-mono font-bold text-gray-600 w-8 text-right">{formatTime(progress)}</span>
             <div className="relative flex-1 h-1.5 bg-[#d4c5b0] rounded-full cursor-pointer group flex items-center">
               <div className="absolute left-0 top-0 bottom-0 bg-[var(--color-accent-yellow)] rounded-full" style={{ width: `${percentage}%` }} />
               <div 
                  className="absolute h-3.5 w-3.5 rounded-full bg-[var(--color-accent-yellow)] shadow border-2 border-white top-1/2 -translate-y-1/2 -ml-[7px] transition-transform group-hover:scale-125"
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
             <span className="text-[10px] font-mono font-bold text-gray-600 w-8">{formatTime(duration)}</span>
          </div>

          {/* Controls Row */}
          <div className="flex items-center gap-6 md:gap-8 justify-center w-full mt-2">
             <button onClick={prev} disabled={isLoading || !currentSong} className="p-2 hover:text-black text-[#5c2b18] disabled:opacity-50 transition-colors"><SkipBack size={18} fill="currentColor" /></button>
             <button onClick={togglePlay} disabled={isLoading || !currentSong} className="w-14 h-14 md:w-16 md:h-16 shrink-0 bg-[var(--color-accent-yellow)] rounded-full flex items-center justify-center shadow-md hover:scale-105 text-[#5c2b18] border border-orange-300 disabled:opacity-50 disabled:hover:scale-100 transition-transform">
                {isLoading ? <Loader2 size={24} className="animate-spin" /> : (isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />)}
             </button>
             <button onClick={next} disabled={isLoading || !currentSong} className="p-2 hover:text-black text-[#5c2b18] disabled:opacity-50 transition-colors"><SkipForward size={18} fill="currentColor" /></button>
             {/* Small visual volume icon for aesthetics as in screenshot */}
             <div className="p-2 text-[#5c2b18] opacity-70"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg></div>
          </div>

          {/* Tags Row */}
          <div className="flex items-center justify-center gap-2 flex-wrap font-mono text-[9px] font-bold text-gray-600 mt-4 w-full px-2">
             <span className="px-2.5 py-1 rounded-full border border-gray-400 opacity-70">NIGHT</span>
             <span className="px-2.5 py-1 rounded-full border border-gray-400 opacity-70">RAIN</span>
             <span className="px-2.5 py-1 rounded-full border border-gray-400 opacity-70">NATI</span>
             <span className="px-2.5 py-1 rounded-sm border border-[#2b4c3b] text-[#2b4c3b] shadow-[2px_2px_0_#2b4c3b]">ASK</span>
             <span className="ticket-stamp px-3 py-1 -rotate-6 ml-2 bg-white font-black text-[var(--color-accent-red)] border border-red-500 shadow-sm flex items-center gap-1 text-[10px]">🎟 TICKET</span>
          </div>

          {/* Hamburger Menu (Bottom Center) */}
          <button onClick={() => setSidebarOpen(true)} className="mt-3 p-2 hover:bg-black/5 rounded-full text-[#5c2b18] transition-colors">
             <Menu size={20} />
          </button>
        </div>
      </div>
      
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
