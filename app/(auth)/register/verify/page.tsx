'use client'
import { useEffect, useState } from 'react'
import axios from "axios"
import Link from "next/link"
// import { useRouter } from 'next/navigation'

export default function Verify() { 
    const [token, setToken] = useState("")
    const [isVerified, setIsVerified] = useState(false)
    const [err, setErr] = useState(false)
    // const router = useRouter();

    const verifyEmail = async () => {
        try {
            const res = await axios.post("/api/auth/verifyemail", { token })
            setIsVerified(true);
            console.log(res);
        } catch (error: unknown) {
            setErr(true)
            if (axios.isAxiosError(error) && error.response) {
                console.log(error.response.data);
            } else {
                console.log(error);
            }
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
        <div>
            {isVerified ? (
                <p>Your email has been verified successfully!</p>
            ) : err ? (
                <p>There was an error verifying your email. Please try again.</p>
            ) : (
                <p>Verifying your email...</p>
            )}
            <Link href="/login">Go to Login</Link>
        </div>
    )
}