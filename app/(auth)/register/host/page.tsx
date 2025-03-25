import { Phiolosopher } from "@/components/assets/fonts";
import { Meteors } from "@/components/ui/meteors";
import Image from "next/image";
import { HostForm } from "./form";

export default function Host() {
  return (
    <div className="flex min-h-[80dvh]">
      <div className="flex flex-1 items-center justify-center border-r border-gray-500">
        <Image src={"/hostsvg.svg"} alt="img" className="w-96 h-96" width={16} height={16} />
        <Meteors/>
      </div>
      <div className="flex flex-1 items-center flex-col gap-10">
        <h1 className={`text-6xl ${Phiolosopher.className}`} >Moderator</h1>
        <HostForm/>
      </div>
    </div>
  )
}