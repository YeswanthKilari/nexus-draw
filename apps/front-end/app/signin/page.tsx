"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Home() {
    const Router = useRouter()
    return (
      
    <div className="flex w-full h-screen overflow-hidden text-white">
      <div className="w-[60%] bg-[#080808] flex items-center justify-center">
        <div className="w-[80%] h-[80%] dark:bg-black bg-blue-300 rounded-xl overflow-hidden">
          <video
            className="w-full h-full object-cover  rounded-xl"
            src="/img_video/signin.mp4" 
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      </div>

      <div className="w-[40%] bg-[#080808] pt-6 pr-6 pb-6 pl-0 flex flex-col gap-6">
          {/* Theme Toggle */}
          <div className="flex justify-end">
            
          </div>

          <div className="w-full flex flex-col items-center mt-20">
            <h1 className="text-4xl font-bold text-center">Welcome Back</h1>
            <p className="text-[#8a8895] mt-2 text-sm">
              Already have an account?{" "}
                      <span className="text-blue-300 cursor-pointer hover:underline" onClick={
                          () => Router.push('/signup')
              }>Sign up</span>
            </p>
          </div>

          {/* Form */}
          <form className="w-[80%] mx-auto flex flex-col gap-4 p-4 rounded-xl shadow-md">
            <div className="flex gap-3">
              <Input
                className="border border-white h-11 rounded-2xl"
                id="name"
                placeholder="Name"
              />
              <Input
                className="border border-white h-11 rounded-2xl"
                id="lastName"
                type="text"
                placeholder="Last name"
              />
            </div>
            <Input
              className="border border-white h-11 rounded-2xl"
              id="username"
              placeholder="Username"
            />
            <Input
              className="border border-white h-11 rounded-2xl"
              id="password"
              type="password"
              placeholder="Password"
            />
            <Button className="w-full h-11 mt-2 bg-[#6e59b7] hover:bg-[#7d6bca] transition">
              Submit
            </Button>
          </form>
      </div>
      </div>

  )
}
