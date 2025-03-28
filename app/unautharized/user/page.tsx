"use client"
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const UserPage = () => {
    const router = useRouter();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);

        const redirectTimer = setTimeout(() => {
            router.push('/dashboard');
        }, 5000);

        return () => {
            clearInterval(timer);
            clearTimeout(redirectTimer);
        };
    }, [router]);

    return (
        <div>
            <h1>Unauthorized Access</h1>
            <p>You will be redirected to the login page in {countdown} seconds.</p>
        </div>
    )
};

export default UserPage;