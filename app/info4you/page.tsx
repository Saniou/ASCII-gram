"use client";

import Link from "next/link";
import BackgroundAscii from "@/components/backgroundAscii"; // поправ шлях під твій проект
import Header from "@/components/header";
import BackArrow from "@/components/back-arrow";

export default function UpdatesPage() {

  return (
    <div className="relative min-h-screen bg-black text-green-400">
      <BackgroundAscii />
      <Header />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
        <div className="relative z-20">
          <BackArrow />
        </div>

        <Link
          href="/love"
          className="block terminal-card p-6 hover:bg-gray-900/30 animate-slide-in-up"
        >
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 border border-green-400 flex items-center justify-center">
              <span className="text-green-400 text-xl">♡♡♡</span>
            </div>

            <div className="flex-1">
              <div className="text-green-300 text-sm">
                <span className="text-green-400">{">"}</span> love()
              </div>
              <div className="text-green-500 text-xs mt-1">
                Create your own love letter
              </div>
            </div>

            <span className="text-green-400 text-sm">[OPEN]</span>
          </div>
        </Link>

        <Link
          href="/img-to-ascii"
          className="block terminal-card p-6 hover:bg-gray-900/30 animate-slide-in-up"
        >
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 border border-green-400 flex items-center justify-center">
              <span className="text-green-400 text-xl">🖼</span>
            </div>

            <div className="flex-1">
              <div className="text-green-300 text-sm">
                <span className="text-green-400">{">"}</span> img_to_ascii()
              </div>
              <div className="text-green-500 text-xs mt-1">
                Convert images into ASCII art
              </div>
            </div>

            <span className="text-green-400 text-sm">[OPEN]</span>
          </div>
        </Link>
        
        <Link
          href="/design-thing"
          className="block terminal-card p-6 hover:bg-gray-900/30 animate-slide-in-up"
        >
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 border border-green-400 flex items-center justify-center">
              <span className="text-green-400 text-xl">🎨</span>
            </div>

            <div className="flex-1">
              <div className="text-green-300 text-sm">
                <span className="text-green-400">{">"}</span> design_thing()
              </div>
              <div className="text-green-500 text-xs mt-1">
                Create your own design
              </div>
            </div>

            <span className="text-green-400 text-sm">[OPEN]</span>
          </div>
        </Link>

      </div>
    </div>
  );
}
