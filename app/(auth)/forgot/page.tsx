import React from 'react'
import { ForgotForm } from './reset'

export default function Forgot() {
  return (
    <div className="flex flex-1 flex-col h-[80vh] items-center justify-center">
      <div className="border-2 border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center gap-4  shadow-xl">
        <h1 className="">Forgot Password</h1>
        <p className="text-gray-500">Please enter your email address to reset your password.</p>
        <ForgotForm/>
        </div>
    </div>
  )
}
