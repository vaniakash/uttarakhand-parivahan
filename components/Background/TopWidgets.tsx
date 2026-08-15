"use client";
import { useState, useEffect } from "react";

export default function TopWidgets() {
  const [time, setTime] = useState("");
  const [travellers, setTravellers] = useState(1);

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }));
    };
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    // Generate a unique session ID for this browser tab
    const sessionId = Math.random().toString(36).substring(2, 15);
    
    // Ping presence API to register as active and get live count
    const updatePresence = async () => {
      try {
        const res = await fetch('/api/presence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId })
        });
        if (res.ok) {
          const data = await res.json();
          setTravellers(data.liveCount);
        }
      } catch (e) {
        // Silently ignore network errors for presence
      }
    };

    updatePresence(); // Initial ping
    // Send heartbeat every 5 seconds
    const presenceInterval = setInterval(updatePresence, 5000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(presenceInterval);
    };
  }, []);

  return (
    <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 font-mono select-none">
      <div className="ticket-panel rounded-md px-3 py-1 flex items-center justify-between min-w-[130px]">
        <span className="text-[10px] text-orange-600 font-bold uppercase">Time</span>
        <span className="text-xs font-bold text-gray-800 tracking-tighter ml-2">{time}</span>
      </div>
      
      <div className="ticket-panel rounded-md px-3 py-1 flex items-center justify-between min-w-[130px]">
        <span className="text-[10px] text-orange-600 font-bold uppercase">Travellers</span>
        <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5 ml-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> {travellers}
        </span>
      </div>
      
      <a 
        href="https://www.instagram.com/vani.env/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="ticket-panel rounded-md px-3 py-1 flex items-center justify-between min-w-[130px] hover:scale-105 hover:shadow-lg transition-transform cursor-pointer group"
      >
        <span className="text-[10px] text-orange-600 font-bold uppercase group-hover:animate-pulse">Follow</span>
        <span className="text-xs font-bold text-gray-800 ml-2">@vani.env</span>
      </a>
    </div>
  );
}
