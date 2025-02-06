import { fontdinerSwanky } from "@/components/fonts";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Button } from "@/components/ui/button";
import { FlipWords } from "@/components/ui/flip-words";
import { LogInIcon, UserRoundPlus } from "lucide-react";
import Link from "next/link";

const words = ["Efficiency", "Precision", "Simplicity", "Control", "Ease"];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
    <main className="relative">
      <BackgroundLines className=" bg-black/5 flex flex-col items-center justify-center">
        <h1 className="text-4xl ">Welcome To</h1><br/>
        <h1 className="text-7xl "><span className={`${fontdinerSwanky.className} text-7xl dark:text-cyan-500 text-sky-500`}>Event</span>Minder</h1>
        <span className="text-lg" >StreamLine your events with <FlipWords className="text-lg" words={words} /></span><br/>
        <div className="relative">
        <div className="flex flex-row gap-2">
          <Link href="/auth/register"><Button><UserRoundPlus/> Register</Button></Link>
          <Link href="/auth/login"><Button><LogInIcon/> Log-In</Button></Link>
        </div>
        </div>
      </BackgroundLines>
    </main>
    </div>
  );
}
