"use client";

import HeroArt from "@/components/Background/HeroArt";
import PlayerBar from "@/components/Player/PlayerBar";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-black selection:bg-orange-200">
      <HeroArt />
      <PlayerBar />
    </main>
  );
}
