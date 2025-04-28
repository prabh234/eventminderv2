import { fontdinerSwanky } from "@/components/assets/fonts";
import Footer from "@/components/assets/footer";
import Header from "@/components/assets/header";
import { FlipWords } from "@/components/ui/flip-words";
import { Vortex } from "@/components/ui/vortex";
import { LogInIcon, UserRoundPlus } from "lucide-react";
import Link from "next/link";

const words = ["Efficiency", "Precision", "Simplicity", "Control", "Ease"];

export default function Home() {

  return (
    <div className="flex flex-1  my-background-image flex-col">
      <Header/>
    <main className="">
      <div className="overflow-clip flex items-center justify-center flex-col py-32 ">
    <Vortex
      backgroundColor="#002a4500"
      className="flex items-center justify-center flex-col "
      particleCount={300}
      baseRadius={3}
      rangeRadius={4}
      baseHue={150}
    >
        <h1 className="text-4xl ">Welcome To</h1><br/>
        <h1 className="text-7xl "><span className={`${fontdinerSwanky.className} text-7xl animate-text bg-gradient-to-r dark:from-blue-300 dark:via-sky-500 dark:to-sky-300 from-blue-500 via-sky-800 to-sky-500 bg-clip-text text-transparent font-black`}>Event</span>Minder</h1>
        <span className="text-lg" >StreamLine your events with <FlipWords className="text-lg" words={words} /></span><br/>
        <div className="relative">
        <div className="flex flex-row gap-2">
          <Link href="/login">
          <button className="p-[3px] relative">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-emerald-600 rounded-lg" />
            <div className="px-8 py-2 flex gap-2  dark:bg-white bg-black rounded-[6px]  relative group transition duration-200 dark:text-black text-white dark:hover:bg-transparent hover:bg-transparent">
              <LogInIcon/> Log-In
            </div>
          </button>
          </Link>
          <Link href="/register">
          <button className="p-[3px] relative">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-emerald-600 rounded-lg" />
            <div className="px-8 py-2 flex gap-2  dark:bg-white bg-black rounded-[6px]  relative group transition duration-200 dark:text-black text-white dark:hover:bg-transparent hover:bg-transparent">
              <UserRoundPlus/> register
            </div>
          </button>
          </Link>
        </div>
        </div>
    </Vortex>
      </div>
    </main>
    <Footer/>
    </div>
  );
}
