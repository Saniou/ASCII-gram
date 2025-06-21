import { logout } from "@/lib/actions"
import { redirect } from "next/navigation"

export default async function LogoutPage() {
  await logout()
  redirect("/login")
}
