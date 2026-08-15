"use client";

import { usePlayer } from "@/context/PlayerContext";
import { X, MapPin, Loader2 } from "lucide-react";

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { playlist, currentIndex, playSong, isPlaying, isLoading } = usePlayer();
  
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] ticket-panel shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="p-4 border-b border-[var(--color-ticket-border)] bg-white/40 flex items-center justify-between relative overflow-hidden">
           <div className="flex flex-col relative z-10">
              <h3 className="font-yatra text-3xl text-[var(--color-accent-red)] leading-none mb-1">पहाड़ी सूची</h3>
              <div className="flex gap-4 font-mono text-[10px] font-bold text-gray-600">
                <span className="flex items-center gap-1"><MapPin size={10}/> Route UK-07</span>
                <span>Seat WINDOW</span>
              </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full relative z-10 text-[var(--color-ticket-text)]">
              <X size={24} />
           </button>
           
           {/* Stamp Decoration */}
           <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12 pointer-events-none">
             <span className="font-yatra text-7xl text-[var(--color-accent-red)]">UK</span>
           </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2 scrollbar-thin">
           {isLoading ? (
             <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2">
               <Loader2 className="animate-spin" size={32} />
               <p className="font-mono text-xs font-bold">Fetching Live Records...</p>
             </div>
           ) : playlist.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2">
               <p className="font-mono text-xs font-bold">No Records Found</p>
             </div>
           ) : (
             playlist.map((song, index) => {
               const active = index === currentIndex;
               return (
                 <div 
                   key={song.id} 
                   className={`flex items-center gap-3 p-2 rounded-md hover:bg-black/5 cursor-pointer ${active ? 'bg-orange-100/50' : ''}`}
                   onClick={() => playSong(index)}
                 >
                    <span className="font-mono text-xs font-bold text-gray-400 w-5 text-right">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold truncate ${active ? 'text-[var(--color-accent-red)]' : 'text-[var(--color-ticket-text)]'}`}>
                        {song.title}
                      </p>
                      <p className="text-[10px] text-gray-500 uppercase truncate font-mono">
                        {song.artist}
                      </p>
                    </div>
                    {active && isPlaying && (
                      <div className="w-2 h-2 rounded-full bg-[var(--color-accent-red)] animate-pulse" />
                    )}
                 </div>
               )
             })
           )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--color-ticket-border)] bg-[var(--color-ticket-bg)] text-center">
           <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ticket-text)] font-bold">
             Not Transferable • Conductor's Copy
           </p>
           <p className="font-mono text-[8px] uppercase tracking-widest text-gray-500 font-bold mt-1">
             ALL INDIA PERMIT VALID FOR MEMORIES
           </p>
        </div>
      </div>
    </>
  );
}
