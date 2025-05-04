"use client"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function  Page() {
  const router = useRouter()
  const {data:session} = useSession();
  const[role,setRole] = useState('');
useEffect(()=>{
  if(session){
      setRole(session.user.role.toLowerCase());
      router.push(`/dashboard/${role}`)
    }
  
},[session,router,role])
 return (
        <main className="flex flex-1 items-center justify-center min-h-[80vh]">
          <h1 className="">center</h1>
        </main>
    )
  }

