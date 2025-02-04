"use client"

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from './ui/button'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
    variant="ghost"
    
    className='rounded-full w-10 h-10 hover:bg-cyan-200/40 dark:hover:bg-gray-800'
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
    </Button>
  )
}