'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Signup() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("http://localhost:3001/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name + " " + lastName,
          username,
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Signup failed")
        return
      }

      router.push("/signin")
    } catch (err) {
      setError("Something went wrong")
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

        <div className="w-full flex flex-col items-center mt-20 mr-40">
          <h1 className="text-4xl font-bold text-center">Create Your Account</h1>
          <p className="text-[#8a8895] mt-2 text-sm">
            Already have an account?{' '}
            <span
              onClick={() => {
                router.push('/signin')
              }}
              className="text-blue-300 cursor-pointer hover:underline"
            >
              Sign in
            </span>
          </p>
        </div>

        <form
          onSubmit={handleSignup}
          className="w-[80%] mx-auto flex flex-col gap-4 p-4 rounded-xl shadow-md"
        >
          <div className="flex gap-3">
            <Input
              className="border border-white h-11 rounded-2xl"
              id="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              className="border border-white h-11 rounded-2xl"
              id="lastName"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <Input
            className="border border-white h-11 rounded-2xl"
            id="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            className="border border-white h-11 rounded-2xl"
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            className="w-full h-11 mt-2 bg-[#6e59b7] hover:bg-[#7d6bca] transition"
          >
            Submit
          </Button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </div>
    </div>
  )
}
