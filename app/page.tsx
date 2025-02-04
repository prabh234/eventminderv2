import { fontdinerSwanky } from "@/components/fonts";
import { ThemeSwitcher } from "@/components/my-theme";
import { BackgroundLines } from "@/components/ui/background-lines";
import { FlipWords } from "@/components/ui/flip-words";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
    <header className="">
    <div className="flex p-5 gap-2 justify-between">
      <div className="flex flex-row gap-2">
      <Image src={"/emlogo.png"} alt="/emlogo.png" width={40} height={40} />
      <h1 className="text-3xl "><span className={`${fontdinerSwanky.className} text-4xl dark:text-cyan-500 text-sky-500`}>Event</span>Minder</h1>
      </div>
      <div className="flex flex-row-reverse gap-2">
        <ThemeSwitcher/>
      </div>
    </div>
    </header>
    <main className="relative ">
      <BackgroundLines className=" flex flex-col items-center justify-center">
        <h1 className="text-4xl ">Welcome To</h1><br/>
        <h1 className="text-7xl "><span className={`${fontdinerSwanky.className} text-7xl dark:text-cyan-500 text-sky-500`}>Event</span>Minder</h1>
        <FlipWords className="text-l  px-10" words={["EventMinder"]} />
      </BackgroundLines>
    </main>
    </div>
  );
}
