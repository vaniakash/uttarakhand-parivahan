"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { Song } from "@/lib/songs";

interface PlayerContextType {
  playlist: Song[];
  currentSong: Song | null;
  currentIndex: number;
  isPlaying: boolean;
  progress: number;
  duration: number;
  isLoading: boolean;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seekTo: (seconds: number) => void;
  playSong: (index: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch playlist on mount
  useEffect(() => {
    async function fetchPlaylist() {
      try {
        const res = await fetch('/api/playlist');
        if (res.ok) {
          const data = await res.json();
          setPlaylist(data.playlist || []);
        } else {
          console.error("Failed to fetch playlist");
        }
      } catch (error) {
        console.error("Error fetching playlist:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPlaylist();
  }, []);

  const currentSong = playlist.length > 0 ? playlist[currentIndex] : null;
  const playerRef = useRef<any>(null); // For YT player instance

  // We expose a global function for the YouTubeEngine to register itself
  useEffect(() => {
    (window as any).registerYouTubePlayer = (player: any) => {
      playerRef.current = player;
    };
  }, []);

  // Update YouTube player when song/play state changes
  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.loadVideoById === 'function' && currentSong) {
      if (isPlaying) {
         playerRef.current.loadVideoById(currentSong.id);
      } else {
         playerRef.current.cueVideoById(currentSong.id);
      }
    }
  }, [currentIndex, currentSong]);

  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      if (isPlaying) playerRef.current.playVideo();
      else playerRef.current.pauseVideo();
    }
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const next = () => {
    if (playlist.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
  };
  
  const prev = () => {
    if (playlist.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  };

  const playSong = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  const seekTo = (seconds: number) => {
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(seconds, true);
      setProgress(seconds);
    }
  };

  // Poll for progress
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying && playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        setProgress(playerRef.current.getCurrentTime());
        setDuration(playerRef.current.getDuration() || 0);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <PlayerContext.Provider
      value={{
        playlist,
        currentSong,
        currentIndex,
        isPlaying,
        progress,
        duration,
        isLoading,
        togglePlay,
        next,
        prev,
        seekTo,
        playSong,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be used within PlayerProvider");
  return context;
};
