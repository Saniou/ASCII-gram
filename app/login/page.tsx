import LoginForm from "@/components/login-form"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black text-green-400 flex items-center justify-center px-4 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="terminal-card p-8 animate-slide-in-up">
          <div className="text-center mb-8">
            <pre className="text-green-400 text-sm font-bold mb-4 animate-typing">
              {`╔══════════════════════════╗
║      LOGIN TERMINAL      ║
║     ASCII.SOCIAL v2.0    ║
╚══════════════════════════╝`}
            </pre>
            <div className="text-green-300 text-sm animate-slide-in-up" style={{ animationDelay: "0.5s" }}>
              <span className="text-green-400">{">"}</span> Введіть дані для входу
            </div>
          </div>

          <LoginForm />

          <div className="mt-6 text-center text-sm animate-slide-in-up" style={{ animationDelay: "0.7s" }}>
            <span className="text-green-400">{">"}</span> Немає акаунта?{" "}
            <Link href="/register" className="text-white hover:text-green-300 underline transition-colors duration-300">
              register --new-user
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
