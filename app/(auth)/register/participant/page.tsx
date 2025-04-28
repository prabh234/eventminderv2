import { Creep } from "@/components/assets/fonts";
import Image from "next/image";
import { ParticipantForm } from './form';
import { Meteors } from "@/components/ui/meteors";

export default function Host() {
return (
  <div className="flex min-h-[80dvh]">
    <div className="flex flex-1 items-center justify-center border-r border-gray-500">
      <Image src={"/pat.jpg"} alt="img" className="w-96 h-96" width={16} height={16} />
    </div>
    <div className=" flex flex-1 relative flex-col h-[80vh] items-center  justify-center">
      <div className=" dark:bg-sky-950/90 dark:shadow-sky-800 overflow-hidden shadow-sky-500 bg-sky-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-4  shadow-2xl">
          <div className="relative w-full max-w-xl">
                <div className="flex flex-col items-center justify-center gap-4">
                    <h1 className={`text-6xl ${Creep.className}`}>Participant</h1>
                    <ParticipantForm/>
                    <Meteors number={20} />
                </div>
              </div>
          </div>
        </div>
      </div>
)
}