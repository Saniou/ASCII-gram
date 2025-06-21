"use client";

import { useEffect } from "react";

interface NeonLoaderProps {
  duration?: number;          
  onFinish?: () => void;      
}

export default function NeonLoader({
  duration = 6000,
  onFinish,
}: NeonLoaderProps) {
  useEffect(() => {
    const timer = setTimeout(() => onFinish?.(), duration);
    return () => clearTimeout(timer);
  }, [duration, onFinish]);

  return (
    <div className="neon-loader-wrapper">
      <div className="neon-bar">
        <div className="neon-fill" />
      </div>
      <div className="neon-text">Loading......</div>

      <style jsx>{`
               .neon-loader-wrapper {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: #000;
          z-index: 10000;
        }

        .neon-bar {
          width: 80%;
          max-width: 400px;
          height: 6px;
          background: rgb(11, 253, 71);
          border: 1px solid rgba(14, 122, 0, 0.6);
          box-shadow:
            0 0 8px rgba(102, 255, 0, 0.7),
            inset 0 0 4px rgba(0, 255, 21, 0.9);
          overflow: hidden;
          position: relative;
        }

        .neon-fill {
          height: 100%;
          width: 0;
          background: linear-gradient(
            to right,
            rgba(0, 129, 58, 0.9),
            rgba(27, 206, 255, 0.9),
            rgba(0, 150, 255, 0.9)
          );
          box-shadow:
            0 0 12px rgba(0, 255, 255, 0.8),
            0 0 20px rgba(0, 255, 255, 0.6);
          animation: fillBar ${duration}ms linear forwards;
        }

        .neon-text {
          margin-top: 12px;
          font-family: monospace;
          font-size: 14px;
          color:rgb(58, 255, 51);
          text-shadow:
            0 0 4pxrgb(0, 153, 0),
            0 0 8pxrgb(129, 255, 26),
            0 0 12pxrgb(53, 255, 35);
        }

        @keyframes fillBar {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
