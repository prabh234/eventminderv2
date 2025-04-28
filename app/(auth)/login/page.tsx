'use client'

import { Creep } from "@/components/assets/fonts";
import { LoginForm } from "./form";
import { Meteors } from "@/components/ui/meteors";

const Page = () => {
  return (
    <div className=" flex flex-1 relative flex-col h-[80vh] items-center  justify-center">
          <div className=" dark:bg-sky-950/90 dark:shadow-sky-800 overflow-hidden shadow-sky-500 bg-sky-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-4  shadow-2xl">
              <div className="relative w-full max-w-xl">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <h1 className={`text-6xl ${Creep.className}`}>Login</h1>
                        <LoginForm/>
                        <Meteors number={20} />
                    </div>
                  </div>
              </div>
            </div>
  )
}
export default Page;