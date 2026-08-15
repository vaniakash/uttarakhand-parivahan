"use client";

import TopWidgets from "./TopWidgets";

export default function HeroArt() {
  return (
    <div className="fixed inset-0 z-0 bg-black">
      {/* Main Bus Video Background */}
      <video
        src="https://res.cloudinary.com/dvkb2m5e/video/upload/v1786813266/ukparivahan_bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover object-bottom opacity-90"
      />
      
      <TopWidgets />

      {/* Massive Title */}
      <div className="absolute top-0 left-0 right-0 pt-10 md:pt-16 flex justify-center px-4 pointer-events-none">
        <h1 className="font-yatra title-stroke text-5xl md:text-7xl lg:text-[100px] text-center leading-tight tracking-tight uppercase drop-shadow-2xl">
          उत्तराखंड परिवहन
        </h1>
      </div>
    </div>
  );
}
