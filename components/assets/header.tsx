import Image from 'next/image'
import Link from 'next/link'
import { fontdinerSwanky, PlayWriteItalia } from './fonts'
import { ThemeSwitcher } from './my-theme'

export default function Header() {
  return (
    <header className="bg-transparent z-10">
    <nav className="flex p-5 gap-2 justify-between bg-rose-600/0">
        <Link href="/">
      <div className="flex flex-row gap-2">
      <Image src={"/emlogo2.png"} alt="/emlogo.png" width={40} height={40} />
      <h1 className="text-3xl "><span className={`${fontdinerSwanky.className} text-4xl animate-text bg-gradient-to-r dark:from-blue-300 dark:via-sky-500 dark:to-sky-300 from-blue-500 via-sky-800 to-sky-500 bg-clip-text text-transparent font-black`}>Event</span>Minder</h1>
      </div>
      </Link><div className="flex flex-row items-center gap-5">
        <Link className={`${PlayWriteItalia.className} border-cyan-500  hover:border-b-2 `} href='/login'>Login</Link>
        <Link className={`${PlayWriteItalia.className} border-cyan-500  hover:border-b-2 `} href='/register'>Register</Link>
        <ThemeSwitcher/>
      </div> 
      
    </nav>
    </header>
    
  )
}