"use client";

import { useRouter } from "next/navigation";

export default function BackArrow() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-green-400 hover:text-green-300 transition"
      aria-label="Go back"
    >
      <span className="text-xl">{`←`}</span>
      <span className="text-sm">{`back()`}</span>
    </button>
  );
}
