import "./globals.css";
import React from "react";
import { SparklesCore } from "@/components/ui/sparkles";
import Hero from "../components/Hero";

export default function Home() {
  return (
    <div className="h-screen w-full flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={10}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
      <div>
        <Hero />
      </div>
    </div>
  );
}
