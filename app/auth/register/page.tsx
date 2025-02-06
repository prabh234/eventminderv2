import Link from "next/link";

export default function Options() {
  return (
    <div className="flex flex-1 items-center justify-center space-x-4">
        <Link href="/auth/register/host">HOST</Link>
        <Link href="/auth/register/participant">Participant</Link>
    </div>
    )
}