import { PlayWriteItalia } from "@/components/fonts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import Link from "next/link";

export default function Options() {
  return (
    <div className="flex flex-1 flex-col gap-10 items-center">
      <h1 className={`text-center text-6xl ${PlayWriteItalia.className}`}>Register</h1>
    <div className="flex items-center justify-center space-x-4">
      <Link href="/register/host">
        <Card className="w-[350px] place-self-center border-collapse  border-zinc-900 dark:border-collapse  dark:border-cyan-400 bg-slate-200 dark:bg-gray-800/50 dark:hover:bg-gray-800  ">
      <CardHeader>
        <CardTitle className={`${PlayWriteItalia.className} flex justify-center hover:text-sky-500 text-4xl`}>Moderator</CardTitle>
      </CardHeader>
      <CardContent className="text-justify">
      Create events, manage participants and track progress. Get detailed insights and feedback to improve your events.
        </CardContent>
    </Card>
    </Link>
      <Link href="/register/participant">
        <Card className="w-[350px] place-self-center border-collapse  border-zinc-900 dark:border-collapse  dark:border-cyan-400 bg-slate-200 dark:bg-gray-800/50 dark:hover:bg-gray-800">
      <CardHeader>
        <CardTitle className={`flex justify-center hover:text-sky-500 text-4xl ${PlayWriteItalia.className}`}>Participant</CardTitle>
      </CardHeader>
      <CardContent className="text-justify">
      Join events effortlessly and earn participation certificates. Stay informed and track your progress with ease!
        </CardContent>
    </Card>
    </Link>
    </div>
    </div>
    )
}