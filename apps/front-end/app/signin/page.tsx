"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { HTTP_BACKEND } from "../config"
import { useAuth } from "../hooks/useAuth"

export default function SignIn() {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAuth();

    useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/signin");
    }
  }, [authLoading, isAuthenticated, router]);


  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${HTTP_BACKEND}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Login failed")
      }

      const data = await res.json()
      localStorage.setItem("token", data.token)

      router.push("/dashboard") 
    } catch (err : any) {
      alert("There is an error: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex w-full h-screen overflow-hidden text-white">
      <div className="w-[60%] bg-[#080808] flex items-center justify-center">
        <div className="w-[80%] h-[80%] bg-black rounded-xl overflow-hidden">
          <video
            className="w-full h-full object-cover rounded-xl"
            src="/img_video/signin.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      </div>

      <div className="w-[40%] bg-[#080808] pt-6 pr-6 pb-6 pl-0 flex flex-col gap-6">
        <div className="flex justify-end"></div>

        <div className="w-full flex flex-col items-center mt-20">
          <h1 className="text-4xl font-bold text-center">Welcome Back</h1>
          <p className="text-[#8a8895] mt-2 text-sm">
            Don’t have an account?{" "}
            <span
              className="text-blue-300 cursor-pointer hover:underline"
              onClick={() => router.push("/signup")}
            >
              Sign up
            </span>
          </p>
        </div>

        <form
          className="w-[80%] mx-auto flex flex-col gap-4 p-4 rounded-xl shadow-md"
          onSubmit={handleSubmit}
        >
          <Input
            className="border border-white h-11 rounded-2xl"
            id="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />
          <Input
            className="border border-white h-11 rounded-2xl"
            id="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            className="border border-white h-11 rounded-2xl"
            id="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            className="w-full h-11 mt-2 bg-[#6e59b7] hover:bg-[#7d6bca] transition"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  )
}
