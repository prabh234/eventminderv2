"use client";
import { Phiolosopher } from "@/components/assets/fonts";
import { BackgroundGradient } from "@/components/ui/background-gradient";
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
      <h1 className={`text-center text-6xl ${Phiolosopher.className}`}>Register</h1>
    <div className="flex items-center justify-center space-x-4">
      <BackgroundGradient className="w-fit p-1" containerClassName="w-fit ">
      <Link href="/register/host">
        <Card className="w-[350px] rounded-3xl  bg-slate-200 dark:bg-sky-900 dark:hover:bg-sky-950">
      <CardHeader>
        <CardTitle className={`${Phiolosopher.className} flex justify-center hover:text-sky-500 text-4xl`}>Moderator</CardTitle>
      </CardHeader>
      <CardContent className="text-justify">
      Create events, manage participants and track progress. Get detailed insights and feedback to improve your events.
        </CardContent>
    </Card>
    </Link>
     </BackgroundGradient>
    <BackgroundGradient className="w-fit p-1" containerClassName="w-fit p-1">
      <Link href="/register/participant">
        <Card className="w-[350px] place-self-center border-collapse  bg-slate-200 dark:bg-sky-900 dark:hover:bg-sky-950">
      <CardHeader>
        <CardTitle className={`flex justify-center hover:text-sky-500 text-4xl ${Phiolosopher.className}`}>Participant</CardTitle>
      </CardHeader>
      <CardContent className="text-justify">
      Join events effortlessly and earn participation certificates. Stay informed and track your progress with ease!
        </CardContent>
    </Card>
    </Link>
    </BackgroundGradient>
    </div>
    </div>
    )
}