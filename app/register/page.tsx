import RegisterForm from "@/components/register-form"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-black text-green-400 flex items-center justify-center px-4 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="terminal-card p-8 animate-slide-in-up">
          <div className="text-center mb-8">
            <pre className="text-green-400 text-sm font-bold mb-4 animate-typing">
              {`╔══════════════════════════╗
║    REGISTER TERMINAL     ║
║     ASCII.SOCIAL v2.0    ║
╚══════════════════════════╝`}
            </pre>
            <div className="text-green-300 text-sm animate-slide-in-up" style={{ animationDelay: "0.5s" }}>
              <span className="text-green-400">{">"}</span> Створити новий акаунт
            </div>
          </div>

          <RegisterForm />

          <div className="mt-6 text-center text-sm animate-slide-in-up" style={{ animationDelay: "0.7s" }}>
            <span className="text-green-400">{">"}</span> Вже є акаунт?{" "}
            <Link href="/login" className="text-white hover:text-green-300 underline transition-colors duration-300">
              login --existing-user
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
