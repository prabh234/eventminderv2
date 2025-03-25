"use client"
import Image from 'next/image'
import Link from 'next/link'
import { fontdinerSwanky, PlayWriteItalia } from './fonts'
import { ThemeSwitcher } from './my-theme'
import { signOut, useSession } from 'next-auth/react'

export default function Header() {
  const {data:session} = useSession();
  return (
    <header className="bg-transparent">
    <nav className="flex p-5 gap-2 justify-between bg-rose-600/0">
        <Link href="/">
      <div className="flex flex-row gap-2">
      <Image src={"/emlogo2.png"} alt="/emlogo.png" width={40} height={40} />
      <h1 className="text-3xl "><span className={`${fontdinerSwanky.className} text-4xl dark:text-cyan-500 text-sky-500`}>Event</span>Minder</h1>
      </div>
      </Link>
      {session ? (<div className="flex flex-row items-center gap-5">
        <Link className={`${PlayWriteItalia.className} border-cyan-500  hover:border-b-2 `} href='/dashboard'>Dashboard</Link>
        <Link className={`${PlayWriteItalia.className} border-cyan-500  hover:border-b-2 `} href="/login" onClick={() => signOut()}>Logout</Link>
        <ThemeSwitcher/>
      </div>): <div className="flex flex-row items-center gap-5">
        <Link className={`${PlayWriteItalia.className} border-cyan-500  hover:border-b-2 `} href='/login'>Login</Link>
        <Link className={`${PlayWriteItalia.className} border-cyan-500  hover:border-b-2 `} href='/register'>Register</Link>
        <ThemeSwitcher/>
      </div> }
      
    </nav>
    </header>
    
  )
}
