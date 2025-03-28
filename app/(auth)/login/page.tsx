'use client'

import { LoginForm } from "./form";

const Page = () => {
  return (
    <div className="flex flex-1 flex-col w-full h-screen items-center justify-center">
      <h1 className={`text-6xl `}>Login</h1>
      <LoginForm/>
    </div>
  )
}
export default Page;