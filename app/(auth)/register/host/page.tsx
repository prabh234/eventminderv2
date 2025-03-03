import { PlayWriteItalia } from "@/components/fonts";
import { HostForm } from "./form";

export default function Host() {
  return (
    <div className="flex flex-1 items-center flex-col gap-4">

        <h1 className={`text-6xl ${PlayWriteItalia.className}`} >Moderator</h1>
        <HostForm/>
    </div>
  )
}