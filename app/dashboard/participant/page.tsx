'use client'
import FaceRegister from "@/components/assets/registerForm";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { CardDashboardParticipant } from '@/components/ui/my-components/dashboard-cards';
import QrGenerate from '@/components/ui/my-components/qrgenerate';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

// const guide = [
//   {no:1, heading:"Lightning check", sub:"Ensure even lighting without shadows"},
//   {no:2, heading:"Lightning check", sub:"Ensure even lighting without shadows"},
//   {no:3, heading:"Lightning check", sub:"Ensure even lighting without shadows"},
//   {no:4, heading:"Lightning check", sub:"Ensure even lighting without shadows"},
//   {no:5, heading:"Lightning check", sub:"Ensure even lighting without shadows"},
//   {no:6, heading:"Lightning check", sub:"Ensure even lighting without shadows"},
// ]

export default function ParticipantDashboard() {
  const{data:session} =  useSession();
  const [FaceRegistered,setFace] = useState(true)
  if(!session) console.log("no sesion");
  const IsFaceRegistered = async ()=>{
      axios.get('/api/participant/registerface').then(res=>setFace(res.data.FaceRegistered)).catch((e)=>console.log(e))
    }
  useEffect(() => {
    IsFaceRegistered()
  }, []);
  return (
    <>
    {session && <>
      {FaceRegistered ? <div className="flex flex-col flex-1 space-y-5">
        <CardDashboardParticipant/>
        <div className="flex-1 flex justify-center">
          <div className="dark:bg-sky-800 bg-sky-400 w-[340px] p-5 flex flex-col items-center justify-center rounded-2xl shadow-xl">
            <QrGenerate size={300} id={session.user.id}/>
            <h1 className="text-xl font-semibold mt-2 dark:text-cyan-300 text-cyan-800">Name: {session.user.name}</h1>
            <p className="text-md text-white text-justify">This QR can be used for marking attendence in events</p>
          </div>
        </div>
      </div> : <div className='flex flex-1 flex-col px-10 items-center justify-center'>
        <div className="top-5 right-5 w-full dark:bg-sky-950/95 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-yellow-400 text-center">📸 Face Registration Guide</h3>
        <h1 className={`dark:text-red-400 text-red-600  text-center`}>The participant must register his/her face in order to Participate in events</h1>
        
        <div className="space-y-3">
          <div className={`flex items-start gap-3`}>
            <div className="flex-shrink-0 w-6 h-6 dark:bg-blue-600 bg-blue-600 text-white rounded-full flex items-center justify-center">1</div>
            <div>
              <p className="text-lg font-medium dark:text-sky-400 text-blue-900">Lighting Check</p>
              <p className="text-sm dark:text-gray-200 text-gray-600">Ensure even lighting without shadows</p>
            </div>
          </div>

          <div className={`flex items-start gap-3`}>
            <div className="flex-shrink-0 w-6 h-6 dark:bg-blue-600 bg-blue-600 text-white rounded-full flex items-center justify-center">2</div>
            <div>
              <p className="text-lg font-medium dark:text-sky-400 text-blue-900">Positioning</p>
              <p className="text-sm dark:text-gray-200 text-gray-600">Center your face in the frame</p>
              <p className="text-sm dark:text-gray-200 text-gray-600">Keep shoulders visible</p>
            </div>
          </div>

          <div className={`flex items-start gap-3`}>
            <div className="flex-shrink-0 w-6 h-6 dark:bg-blue-600 bg-blue-600 text-white rounded-full flex items-center justify-center">3</div>
            <div>
              <p className="text-lg font-medium dark:text-sky-400 text-blue-900">Preparation</p>
              <p className="text-sm dark:text-gray-200 text-gray-600">Remove hats & glasses</p>
              <p className="text-sm dark:text-gray-200 text-gray-600">Neutral expression please</p>
            </div>
          </div>
          <div className={`flex items-start gap-3`}>
            <div className="flex-shrink-0 w-6 h-6 dark:bg-blue-600 bg-blue-600 text-white rounded-full flex items-center justify-center">4</div>
            <div>
              <p className="text-lg font-medium dark:text-sky-400 text-blue-900">Recognition Guide</p>
              <p className="text-sm dark:text-gray-200 text-gray-600">Wait for a blue box to appear for scanning the face</p>
              <p className="text-sm dark:text-gray-200 text-gray-600">Registration might be slow so do not press register button multiple times</p>
            </div>
          </div>

          <div className={`flex flex-1 items-center justify-center gap-3`}>
        <AlertDialog>
          <BackgroundGradient className="w-60" containerClassName="max-w-fit">
            <AlertDialogTrigger className="dark:bg-sky-900 bg-slate-100 w-full hover:dark:bg-sky-950 hover:bg-sky-600 px-3 py-2 rounded-full">Register Face</AlertDialogTrigger>
          </BackgroundGradient>
          <AlertDialogContent className='bg-rose-500 dark:bg-rose-500 min-w-fit flex items-center flex-col '>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center" >Register Your Face</AlertDialogTitle>
                <FaceRegister/>
            </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="dark:bg-sky-800 bg-sky-400 dark:hover:bg-sky-600 hover:bg-sky-600" >Go Back</AlertDialogCancel>
                </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
          </div>
        </div>
        </div>

        </div>
        </div>
        }
    </> }
    </>
    
  )
}
