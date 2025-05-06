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
// import { CardDashboardParticipant } from '@/components/ui/my-components/dashboard-cards';
import Loading from "@/components/assets/loading";
import QrGenerate from '@/components/ui/my-components/qrgenerate';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const GuideItem = ({ number, title, children }: { number: number; title: string; children: React.ReactNode }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-start gap-4 p-4 rounded-xl dark:bg-sky-900/50 bg-sky-100/50 backdrop-blur-sm"
  >
    <div className="flex-shrink-0 w-8 h-8 dark:bg-sky-600 bg-sky-500 text-white rounded-full flex items-center justify-center font-bold">
      {number}
    </div>
    <div className="space-y-2">
      <h3 className="text-lg font-semibold dark:text-sky-300 text-sky-700">{title}</h3>
      <div className="space-y-1 text-sm dark:text-sky-100/80 text-sky-800">
        {children}
      </div>
    </div>
  </motion.div>
);

export default function ParticipantDashboard() {
  const { data: session } = useSession();
  const [faceRegistered, setFaceRegistered] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const checkFaceRegistration = async () => {
    try {
      const res = await axios.get('/api/participant/registerface');
      setFaceRegistered(res.data.FaceRegistered);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) checkFaceRegistration();
  }, [session]);
  if (isLoading || !session) return <Loading/>

  return (
    <main className="container mx-auto p-4 md:p-6 lg:p-8">
      {faceRegistered ? (
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="dark:bg-gradient-to-br from-sky-900 to-sky-800 bg-sky-100 p-6 rounded-2xl shadow-lg"
          >
            <div className="flex flex-col items-center gap-6">
              <QrGenerate size={280} id={session.user.id} />
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold dark:text-sky-100 text-sky-800">
                  {session.user.name}
                </h2>
                <p className="dark:text-sky-300 text-sky-600 text-sm max-w-prose">
                  Use this QR code for attendance verification at event check-ins
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-8">
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h1 className="text-3xl font-bold dark:text-sky-200 text-sky-800">
              Face Registration Required
            </h1>
            <p className="dark:text-rose-300 text-rose-600 font-medium">
              Complete face registration to participate in events
            </p>
          </motion.header>

          <div className="space-y-6">
            <GuideItem number={1} title="Lighting & Positioning">
              <>
                <p>• Ensure even lighting without shadows</p>
                <p>• Face the camera directly</p>
                <p>• Keep shoulders visible</p>
              </>
            </GuideItem>

            <GuideItem number={2} title="Preparation">
              <>
                <p>• Remove hats & glasses</p>
                <p>• Maintain neutral expression</p>
                <p>• Avoid face coverings</p>
              </>
            </GuideItem>

            <GuideItem number={3} title="Registration Process">
              <>
                <p>• Wait for blue detection frame</p>
                <p>• Hold still during scanning</p>
                <p>• Process may take 10-15 seconds</p>
              </>
            </GuideItem>

            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="flex justify-center"
            >
              <AlertDialog>
                <BackgroundGradient containerClassName="rounded-full">
                  <AlertDialogTrigger className="px-8 py-3 dark:bg-sky-800 bg-white dark:text-sky-100 text-sky-800 rounded-full font-semibold hover:dark:bg-sky-700 hover:bg-sky-50 transition-colors duration-200">
                    Begin Registration
                  </AlertDialogTrigger>
                </BackgroundGradient>
                <AlertDialogContent className="dark:bg-sky-900 bg-white max-w-md rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-center text-xl dark:text-sky-200 text-sky-800">
                      Face Registration
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                    <FaceRegister />
                    <AlertDialogFooter className="sm:justify-center">
                    <AlertDialogCancel className="dark:bg-sky-800 dark:hover:bg-sky-700 bg-sky-100 hover:bg-sky-200 dark:text-sky-200 text-sky-800">
                      Cancel
                    </AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </motion.div>
          </div>
        </div>
      )}
    </main>
  );
}