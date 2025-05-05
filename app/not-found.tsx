"use client";
import Loading from '@/components/assets/loading';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status !== 'loading') {
      setIsLoading(false);
    }
  }, [status]);

  if (isLoading) {
    return <Loading/>
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-sky-950 p-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-4xl font-bold text-sky-950 dark:text-gray-100">
          404 - Page Not Found
        </h1>
          <Image src="/fourofour.gif" width={500} height={500} alt="not found" />
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {session ? 
            "The page you're looking for doesn't exist." : 
            "Please sign in to access this page."
          }
        </p>

        <button
          onClick={() => session ? router.push('/dashboard') : router.push('/')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
        >
          {session ? "Go to Dashboard" : "Return to Homepage"}
        </button>
      </div>
    </main>
  );
}