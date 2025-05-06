'use client'
import { useEffect, useState } from 'react'
import axios from "axios"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

export default function Verify() {
    const [token, setToken] = useState("")
    const [isVerified, setIsVerified] = useState(false)
    const [err, setErr] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter();

    const verifyEmail = async () => {
        setIsLoading(true)
        try {
            const res = await axios.post("/api/auth/verifyemail", { token })
            setIsVerified(true);
            console.log(res);
            setTimeout(() => {
                router.push('/login')
            }, 2000)
        } catch (error: unknown) {
            setErr(true)
            if (axios.isAxiosError(error) && error.response) {
                console.log(error.response.data);
            } else {
                console.log(error);
            }
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(()=>{
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "")
    }, [])

    useEffect(() => {
        if (token.length > 0) {
            verifyEmail();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])

    return (
        <div className="min-h-[88vh] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                {isLoading && !err ? (
                    <div className="flex flex-col items-center">
                        <Loader2 className="h-12 w-12 text-blue-500 dark:text-blue-400 animate-spin mb-4" />
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Verifying Your Email</h2>
                        <p className="text-gray-600 dark:text-gray-300">Please wait while we verify your email address...</p>
                    </div>
                ) : isVerified ? (
                    <div className="flex flex-col items-center">
                        <CheckCircle2 className="h-12 w-12 text-green-500 dark:text-green-400 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Email Verified Successfully!</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">Your email has been verified. You&#39;ll be redirected to login shortly.</p>
                        <Link 
                            href="/login" 
                            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                        >
                            Go to Login
                        </Link>
                    </div>
                ) : err ? (
                    <div className="flex flex-col items-center">
                        <AlertCircle className="h-12 w-12 text-red-500 dark:text-red-400 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Verification Failed</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">There was an error verifying your email. The token may be invalid or expired.</p>
                        <div className="flex flex-col space-y-3 w-full">
                            <Link 
                                href="/login" 
                                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                            >
                                Go to Login
                            </Link>
                            <Link 
                                href="/signup" 
                                className="w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 rounded-md transition duration-200"
                            >
                                Sign Up Again
                            </Link>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    )
}