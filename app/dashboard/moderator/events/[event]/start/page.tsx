'use client'
import { AttendanceTable } from "@/components/assets/atendTable";
import FaceAndQrRecognizer from "@/components/assets/faceandqr";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import axios from "axios";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { toast } from "sonner";

export default function EventPage({ params }: { params: Promise<{ event: string }> }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const {event} = use(params);
  const router = useRouter()
  async function endEvent(){
    try {
    await axios.put(`/api/moderator/event?eventid=${event}`);
    toast.success("event ended");
    router.push(`/dashboard/moderator/events/${event}/end`);
      
    } catch (error) {
      console.error(error);
      toast.error("something went wrong try again");
      router.refresh();
    }
  }
  return (
    <main className="flex flex-1 flex-col">

    <div className="flex">
      <div className="bg-card rounded-xl flex-1 p-6 shadow-sm">
        <FaceAndQrRecognizer 
          eventid={event}
          onAttendanceMarked={() => setRefreshKey(prev => prev + 1)}
        />
      </div>
      
      <div className="bg-card rounded-xl max-h-[80vh] p-10 flex-1 shadow-sm">
        <AttendanceTable 
          eventid={event} 
          refreshKey={refreshKey}
        />
      </div>
    </div>
    <div className="flex items-center justify-center">
      <AlertDialog>
            <AlertDialogTrigger className="dark:bg-rose-900 bg-rose-400 w-60 dark:text-white text-black hover:dark:bg-rose-950 hover:bg-rose-600 px-3 py-2 rounded-full">End Event</AlertDialogTrigger>
          <AlertDialogContent className='bg-slate-300 dark:bg-slate-700 min-w-fit flex items-center flex-col '>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center dark:text-white text-black" >End Event?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will end the event and cannot be undone. Are you sure you want to end the event?
              </AlertDialogDescription>
            </AlertDialogHeader>
            
                <AlertDialogFooter>
                  <AlertDialogCancel className="dark:bg-zinc-800 bg-zinc-400 dark:hover:bg-zinc-600 hover:bg-zinc-600" >Go Back</AlertDialogCancel>
                  <AlertDialogAction className="dark:bg-red-800 bg-red-400 dark:text-white text-slate-800 dark:hover:bg-red-600 hover:bg-red-600" onClick={()=>endEvent()} >End Event</AlertDialogAction>
                </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </div>
    </main>
  )
}