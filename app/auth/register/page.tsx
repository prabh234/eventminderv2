import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import Link from "next/link";
export default function Options() {
  return (
    <div className="flex flex-1 items-center justify-center space-x-4">
      <Link href="/auth/register/host">
        <Card className="w-[350px] place-self-center border-collapse  border-zinc-900 dark:border-collapse  dark:border-cyan-400 bg-slate-200 dark:bg-gray-800/50 dark:hover:bg-gray-800  ">
      <CardHeader>
        <CardTitle className="flex justify-center hover:text-sky-500 text-4xl">Host</CardTitle>
      </CardHeader>
      <CardContent className="text-justify">
      Effortless event management with automated attendance tracking. Empower your community today!
        </CardContent>
    </Card>
    </Link>
      <Link href="/auth/register/participant">
        <Card className="w-[350px] place-self-center border-collapse  border-zinc-900 dark:border-collapse  dark:border-cyan-400 bg-slate-200 dark:bg-gray-800/50 dark:hover:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex justify-center hover:text-sky-500 text-4xl">Participant</CardTitle>
      </CardHeader>
      <CardContent className="text-justify">
      Join events effortlessly and earn participation certificates. Stay informed and track your progress with ease!
        </CardContent>
    </Card>
    </Link>
    </div>
    )
}