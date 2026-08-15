"use client";

import { useEffect, useRef, useState } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { loadYouTubeAPI } from "@/lib/youtubePlayer";

export default function YouTubeEngine() {
  const { currentSong, next } = usePlayer();
  const playerDivRef = useRef<HTMLDivElement>(null);
  const [isApiReady, setIsApiReady] = useState(false);
  const [initialId, setInitialId] = useState<string | null>(null);
  const nextRef = useRef(next);

  // Keep nextRef up to date without triggering effects
  useEffect(() => {
    nextRef.current = next;
  }, [next]);

  // Load API once
  useEffect(() => {
    loadYouTubeAPI().then(() => setIsApiReady(true));
  }, []);

  // Lock in the first available song ID so we only initialize the iframe once
  useEffect(() => {
    if (currentSong && !initialId) {
      setInitialId(currentSong.id);
    }
  }, [currentSong, initialId]);

  // Initialize the player exactly once when both the API and the first song are ready
  useEffect(() => {
    if (!isApiReady || !playerDivRef.current || !initialId) return;

    const ytPlayer = new (window as any).YT.Player(playerDivRef.current, {
      height: "0",
      width: "0",
      videoId: initialId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        rel: 0,
        modestbranding: 1,
      },
      events: {
        onReady: (event: any) => {
          if (typeof (window as any).registerYouTubePlayer === 'function') {
            (window as any).registerYouTubePlayer(event.target);
          }
        },
        onStateChange: (event: any) => {
          if (event.data === 0) { // ENDED
            nextRef.current(); // Auto-play next song
          }
        },
      },
    });

    return () => {
      if (ytPlayer.destroy) {
        try {
          ytPlayer.destroy();
        } catch (e) {}
      }
    };
  }, [isApiReady, initialId]); 

  return (
    <div className="sr-only" aria-hidden="true">
      <div ref={playerDivRef} />
    </div>
  );
}
