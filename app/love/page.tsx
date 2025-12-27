"use client";

import BackgroundAscii from "@/components/backgroundAscii";
import Header from "@/components/header";
import BackArrow from "@/components/back-arrow";

export default function LovePage() {
    return (
        <div className="relative min-h-screen bg-black text-green-400 overflow-hidden">
            <BackgroundAscii />
            <Header />

            <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
                <div className="relative z-20">
                    <BackArrow />
                </div>

                {/* HERO */}
                <section className="terminal-card p-6 glow-green ascii-stars ascii-glow-soft animate-slide-in-up">
                    <div className="text-green-300 text-sm mb-3">
                        <span className="text-green-400">{">"}</span> universe.attach(target="you")
                    </div>

                    <h1 className="text-2xl md:text-4xl font-bold text-green-200 tracking-wide">
                        Ти — мій цілий Всесвіт
                    </h1>

                    <p className="text-green-300 mt-3 leading-relaxed max-w-3xl">
                        Я думав, що знаю, що таке “важливо”. А потім з’явилась ти — і все стало на свої місця.
                        Ти не просто почуття. Ти — мій дім у будь-якому місті, моя тиша після шуму, моя причина посміхатись,
                        навіть коли ніхто не бачить.
                    </p>

                    <div className="mt-5 text-green-500 text-xs">
                        <span className="text-green-400">{">"}</span> mode: romantic | truth: 100%
                    </div>
                </section>

                {/* VISUAL + LETTER */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* VISUAL */}
                    <section className="terminal-card p-6 ascii-stars animate-slide-in-up">
                        <div className="text-green-300 text-sm mb-3">
                            <span className="text-green-400">{">"}</span> constellation.render(name="HEART")
                        </div>

                        <div className="ascii-orbit">
                            <pre className="text-green-400 text-xs md:text-sm whitespace-pre leading-relaxed ascii-pulse">
                                {`                 .       *        .        *
        *                .   .               .
                 .                 *     .
   .     *                 .                 *
               .      .         .        .
                   *          .         *

                 .-""""""-.
               .'  .--.    '.
              /   /    \\     \\
             ;   |  ♥   |     ;
             |   |      |     |
             ;    \\    /     ;
              \\     '--'     /
               '.         .'
                 '-.....-'

        *         .            .          *
   .          *        .            .        .
             (ти — моє сузір’я, я — твоя орбіта)`}
                            </pre>
                        </div>

                        <div className="mt-4 text-green-500 text-xs">
                            <span className="text-green-400">{">"}</span> signal: stable | distance: irrelevant
                        </div>
                    </section>

                    {/* LETTER */}
                    <section className="terminal-card p-6 animate-slide-in-up">
                        <div className="text-green-300 text-sm mb-3">
                            <span className="text-green-400">{">"}</span> letter.txt
                        </div>

                        <pre className="text-green-300 text-sm whitespace-pre-wrap leading-relaxed">
                            {`Я хочу сказати тобі так, щоб ти відчула.

Коли я думаю про тебе — в мені стає світліше.
Наче хтось тихо вмикає лампу всередині,
і навіть найзвичайніший день має сенс.

Я кохаю тебе не “за щось”.
Я кохаю тебе — цілком.
Твою усмішку, твою ніжність, твою силу.
І навіть твою втому — бо я хочу бути тим,
хто обійме і скаже: “я поруч”.

Якщо ти колись засумніваєшся —
просто знай: у моєму світі ти завжди “головна”.
Ти — найкраще, що зі мною трапилось.`}
                        </pre>

                        <div className="mt-4 text-green-500 text-xs">
                            <span className="text-green-400">{">"}</span> status: i choose you
                        </div>
                    </section>
                </div>

                {/* FINAL SCENE */}
                <section className="terminal-card p-6 ascii-stars ascii-glow-soft animate-slide-in-up">
                    <div className="text-green-300 text-sm mb-3">
                        <span className="text-green-400">{">"}</span> vow.commit()
                    </div>

                    <pre className="text-green-400 text-sm whitespace-pre-wrap leading-relaxed">
                        {`Я хочу бути твоїм “спокійно”.
Твоїм “я вдома”.
Твоїм “з тобою все можна”.

І якщо цей текст — маленький сигнал у темряві,
то нехай він повторюється нескінченно:

                Я кохаю тебе.
                Я обираю тебе.
                Я поруч.`}
                    </pre>

                    <div className="mt-4 text-green-500 text-xs">
                        <span className="text-green-400">{">"}</span> end: no. this is forever.
                    </div>
                </section>
            </div>
        </div>
    );
}
