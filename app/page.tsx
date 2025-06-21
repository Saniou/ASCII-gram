"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Feed from "@/components/feed"
import NeonLoader from "@/components/NeonLoader"
import { fetchCurrentUser} from "@/lib/clientAuth";

type User = { id: string; username: string; email: string }

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showLoader, setShowLoader] = useState(true);
  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      setLoading(true)
      const res = await fetch("/api/auth/me")
      const data = await res.json()
      if (!data.user) {
        router.push("/login")
      } else {
        setUser(data.user)
      }
      setLoading(false)
    }
    fetchUser()
  }, [router])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  function onLoaderFinish() {
    fetchCurrentUser().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }

  if (loading) {
    return <NeonLoader duration={10000} onFinish={onLoaderFinish} />;
  }

  if (!user) {
    return <p>Redirecting to login...</p>;
  }


  if (!user) return null

  return (
    <div className="min-h-screen bg-black text-green-400 animate-fade-in">
      {/* Header */}
      <header className="border-b  border-green-400 sticky top-0 z-10 bg-black animate-slide-in-left">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <pre className="text-green-400 text-xs font-bold leading-tight whitespace-pre">
              {`    _    ____   ____ ___ ___       ____ ____      _    __  __        ___   ___  _
   / \\  / ___| / ___|_ _|_ _|     / ___|  _ \\    / \\  |  \\/  |      / _ \\ / _ \\/ |
  / _ \\ \\___ \\| |    | | | |_____| |  _| |_) |  / _ \\ | |\\/| |_____| | | | | | | |
 / ___ \\ ___) | |___ | | | |_____| |_| |  _ <  / ___ \\| |  | |_____| |_| | |_| | |
/_/   \\_\\____/ \\____|___|___|     \\____|_| \\_\\/_/   \\_\\_|  |_|      \\___/ \\___/|_|`}
            </pre>
            <span className="text-green-300 text-sm animate-slide-in-right">
              social
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm animate-slide-in-right">
              <span className="text-green-300">user@terminal:</span>
              <span className="text-white">~/{user.username}</span>
              <span className="text-green-400 animate-blink">_</span>
            </div>
            <button
              onClick={handleLogout}
              className="border border-red-400 px-3 py-1 hover:bg-red-400 hover:text-black text-xs transition-all btn-terminal animate-slide-in-right"
              style={{ animationDelay: "0.2s" }}
            >
              [LOGOUT]
            </button>
          </div>
        </div>
      </header>

      <Feed user={user} />
    </div>
  )
}
