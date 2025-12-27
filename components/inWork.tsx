"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
    title?: string;
    subtitle?: string;
};

export default function AsciiWorkInProgress({
    title = "Work in progress",
    subtitle = "Building something beautiful for you…",
}: Props) {
    const frames = useMemo(
        () => [
            {
                bar: "[#---------]",
                art: `
        .     *         .        *       .
   *        .     .       .        .        *
        .        ____        .       *
   .           .'/ __ \\'.          .
             / /_/  \\_\\ \\      *       .
      *      |  __  __  |   .         *
             | |  ||  | |        .
   .         | |__||__| |    .         .
             |  __  __()|  *
      .      | |  ||  | |        .   *
             | |  ||  | |   .         
             | |__||__| |        .
             |__________|  .     *
        *        .       .      .     *
`,
            },
            {
                bar: "[###-------]",
                art: `
        .     *         .        *       .
   *     .        .   ____   .      .      *
        .         .  / __ \\        .   *
   .              / /_/  \\_\\ \\   .        .
      *           |  __  __  |        * 
                  | |  ||  | |
   .              | |__||__| |     .      .
              *   |  __  __()|  .     *
      .           | |  ||  | |        .   
                  | |  ||  | |   .         
   .              | |__||__| |       .   *
                  |__________|   .
        *      .        .      .      . 
`,
            },
            {
                bar: "[#####-----]",
                art: `
        .     *        .        *        .
   *        .     .        .        .      *
        .       ____      .     .      *
   .          .' __ '.         .      .
      *      / /_.._\\ \\    *      .    
             |  ____  |        .
   .         | |    | |   .           *
             | |____| |        .
      .      |  ____()|   *       .    
             | |    | |        .       
   .         | |    | |   .         .   
             | |____| |        .     *
             |________|   .        .
        *        .        .      .      *
`,
            },
            {
                bar: "[#######---]",
                art: `
        .     *        .         *       .
   *     .      ____        .        .     *
        .     .' __ '.    .      *      .
   .         / /_.._\\ \\        .      .
      *      |  ____  |   *         .    
             | |    | |        .
   .         | |____| |    .        *    
             |  ____()|        .
      .      | |    | |   *        .     
             | |    | |        .         
   .         | |    | |    .         .   
             | |____| |        .     *   
             |________|   .        .
        *        .        .      .      *
`,
            },
            {
                bar: "[#########-]",
                art: `
        .     *        .        *        .
   *        .     .     ____      .      *
        .          .  .' __ '.   .   *   
   .              / /_.._\\ \\        .   .
      *           |  ____  |    *        
                  | |    | |        .
   .              | |____| |   .      *  
             *    |  ____()|        .
      .           | |    | |   *     .   
                  | |    | |       .      
   .              | |    | |   .      .   
                  | |____| |       .   *  
                  |________|   .       .
        *        .        .      .      *
`,
            },
            {
                bar: "[##########]",
                art: `
        .     *        .        *        .
   *        .     .    DONE ✔     .      *
        .        ____        .        .
   .          .' __ '.      .      .     
      *      / /_.._\\ \\   *      .       
             |  ____  |        .
   .         | |    | |   .       *      
             | |____| |        .
      .      |  ____()|   *     .        
             | |    | |        .         
   .         | |    | |   .      .        
             | |____| |        .    *     
             |________|   .      .
        *        .        .      .      *
`,
            },
        ],
        []
    );

    const [i, setI] = useState(0);

    useEffect(() => {
        const t = setInterval(() => {
            setI((x) => (x + 1) % frames.length);
        }, 650);
        return () => clearInterval(t);
    }, [frames.length]);

    const frame = frames[i];

    const spinner = ["|", "/", "—", "\\"][i % 4];

    return (
        <div className="ascii-stars">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="text-green-300 text-sm">
                        <span className="text-green-400">{">"}</span> {title}
                    </div>
                    <div className="text-green-500 text-xs mt-1">{subtitle}</div>
                </div>

                <div className="text-green-400 text-sm font-mono select-none">
                    {spinner} {frame.bar}
                </div>
            </div>

            <div className="ascii-sep my-4" />

            <pre className="text-green-400 text-xs md:text-sm whitespace-pre leading-relaxed ascii-pulse">
                {frame.art.trimEnd()}
            </pre>

            <div className="ascii-sep my-4" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="terminal-card p-3">
                    <div className="text-green-300">
                        <span className="text-green-400">{">"}</span> status
                    </div>
                    <div className="text-green-500 mt-1">compiling feelings…</div>
                </div>

                <div className="terminal-card p-3">
                    <div className="text-green-300">
                        <span className="text-green-400">{">"}</span> ETA
                    </div>
                    <div className="text-green-500 mt-1">as soon as your smile appears</div>
                </div>

                <div className="terminal-card p-3">
                    <div className="text-green-300">
                        <span className="text-green-400">{">"}</span> output
                    </div>
                    <div className="text-green-500 mt-1">something worth waiting for</div>
                </div>
            </div>
        </div>
    );
}
