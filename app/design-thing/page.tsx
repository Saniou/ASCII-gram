"use client";

import BackArrow from "@/components/back-arrow";
import BackgroundAscii from "@/components/backgroundAscii";
import AsciiWorkInProgress from "@/components/inWork";

export default function UpdatesPage() {
    return (
        <div className="relative min-h-screen bg-black text-green-400">
            <BackgroundAscii />
            <div className="relative z-20">
                <BackArrow />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
                <section className="terminal-card p-6 animate-slide-in-up">
                    <AsciiWorkInProgress
                        title="system.update()"
                        subtitle="Building something beautiful for you…"
                    />
                </section>
            </div>
        </div>
    );
}
