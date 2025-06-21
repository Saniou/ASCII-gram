import { useState, useEffect, useRef } from "react";

export default function BackgroundAscii() {
  const [lines, setLines]       = useState<string[]>([]);
  const [cursorOn, setCursorOn] = useState(true);

  const printInterval  = useRef<ReturnType<typeof setInterval>  | null>(null);
  const pauseTimeout   = useRef<ReturnType<typeof setTimeout>   | null>(null);
  const resumeTimeout  = useRef<ReturnType<typeof setTimeout>   | null>(null);
  const cursorInterval = useRef<ReturnType<typeof setInterval>  | null>(null);

  const makeLine = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{};':|,.<>/?";
    const len   = Math.floor(Math.random() * (80 - 5)) + 5; 
    let s = "";
    for (let i = 0; i < len; i++) {
      s += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return s;
  };

  useEffect(() => {

    const print = () => setLines((l) => {
      const next = [...l, makeLine()];
      if (next.length > 200) next.shift();
      return next;
    });

    printInterval.current = setInterval(print, 30);

    cursorInterval.current = setInterval(
      () => setCursorOn((v) => !v),
      500
    );

    return () => {
      if (printInterval.current) clearInterval(printInterval.current);
      if (pauseTimeout.current)  clearTimeout(pauseTimeout.current);
      if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
      if (cursorInterval.current) clearInterval(cursorInterval.current);
    };
  }, []);

  useEffect(() => {
    const schedulePause = () => {
      const delay = (Math.random() * 15 + 10) * 1000; 
      pauseTimeout.current = setTimeout(() => {
        if (printInterval.current) {
          clearInterval(printInterval.current);
          printInterval.current = null;
        }
        resumeTimeout.current = setTimeout(() => {
          if (!printInterval.current) {
            printInterval.current = setInterval(() => {
              setLines((l) => {
                const next = [...l, makeLine()];
                if (next.length > 200) next.shift();
                return next;
              });
            }, 30);
          }
          schedulePause();
        }, 2000);
      }, delay);
    };

    schedulePause();
    return () => {
      if (pauseTimeout.current)  clearTimeout(pauseTimeout.current);
      if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden text-green-900 text-[10px] font-mono leading-[1.1] opacity-40"
    >
      {lines.map((line, i) => (
        <div key={i}>{line}</div>
      ))}
      <div className="absolute bottom-2 left-2">
        {cursorOn ? <span className="inline-block w-2">_</span> : null}
      </div>
    </div>
  );
}
