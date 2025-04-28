import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <div>
        <footer className="dark:bg-[hsl(210,80%,16%)] text-white pt-4">
            <div className="container mx-auto text-center">
                <div className="">
                    <p className="mb-4">Your one-stop solution for event management.</p>
                    <div className="flex justify-center space-x-4 mb-4">
                        <Link href="/about-us" className="text-gray-400 hover:text-white">About Us</Link>
                        <Link href="/privacy-policy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
                        <Link href="/terms-services" className="text-gray-400 hover:text-white">Terms of Service</Link>
                    </div>
                </div>
            <p>&copy; {new Date().getFullYear()} EventMinder. All rights reserved.</p>
            </div>
        </footer>
    </div>
  )
}
