"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Feed from "@/components/feed"
import NeonLoader from "@/components/NeonLoader"
import { fetchCurrentUser} from "@/lib/clientAuth";
import Header from "@/components/header"

type User = { id: string; username: string; email: string }

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
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

  return (
    <div className="min-h-screen bg-black text-green-400 animate-fade-in">
      {/* Header */}
      <Header/>
      <Feed user={user} />
    </div>
  )
}
