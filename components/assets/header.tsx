import Image from 'next/image'
import React from 'react'
import { ThemeSwitcher } from './my-theme'
import { fontdinerSwanky } from './fonts'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="">
    <div className="flex p-5 gap-2 justify-between">
        <Link href="/">
      <div className="flex flex-row gap-2">
      <Image src={"/emlogo.png"} alt="/emlogo.png" width={40} height={40} />
      <h1 className="text-3xl "><span className={`${fontdinerSwanky.className} text-4xl dark:text-cyan-500 text-sky-500`}>Event</span>Minder</h1>
      </div>
      </Link>
      <div className="flex flex-row-reverse gap-2">
        <ThemeSwitcher/>
      </div>
    </div>
    </header>
    
  )
}
