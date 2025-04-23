"use client";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
interface EventResponse {
  id: string;
  eventname: string;
  description: string;
  startdt: string;
  enddt: string;
  host: {
    id: string;
    fname: string;
    lname: string;
    department: string;
    email: string;
  };
}

export default function Event({ params }: { params: Promise<{ event: string }> }) {
    const [eventid, setEventId] = useState<string | null>(null);
    const [CurrentEvent, setEvent] = useState<EventResponse | null>(null);
    const router = useRouter();
    useEffect(() => {
        async function unwrapParams() {
            const resolvedParams = await params;
            setEventId(resolvedParams.event);
        }
        unwrapParams();
    }, [params]);

    const EventData = useCallback(async () => {
        if (!eventid) return;
        try {
            const res = await axios.get('/api/moderator/event', { params: { eventid } });
            setEvent(res.data);
        } catch (err) {
            console.log(err);
        }
    }, [eventid]);

    useEffect(() => {
        EventData();
    }, [EventData]);

    const Startdate = new Date(CurrentEvent?.startdt || "");
    const Enddate = new Date(CurrentEvent?.enddt || "");
    
    const StartDate = Startdate.toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
    });
    const EndDate = Enddate.toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
    });

    async function handleStart(){
        try {
             await axios.put("/api/participant/event", {eventid});
            toast.success("Participated in the event successfully", {
                description: "You will be notified when the event starts",
            });
            
            router.back();
        } catch (error) {
            if ((error as AxiosError).response?.status === 302) {
                toast.error("Already enrolled in the event", {
                    description: "You are already enrolled in this event",
                })
            router.back();
            } else if ((error as AxiosError).response?.status === 401) {
            toast.error("Something went wrong, please try again", {
                description: "We are unable to process your request at this time",
            });
        }
        }
    }

    return (
        <div className="flex bg-cyan-100 dark:bg-cyan-950 flex-col p-5  rounded-2xl shadow-lg h-[80vh] m-10">
            <h1 className="text-5xl text-center font-semibold">{CurrentEvent?.eventname}</h1>
            <div className="flex flex-1 flex-col">
                <p className="text-lg">{CurrentEvent?.description}</p>
            </div>

            <div className="flex justify-between items-baseline">
                <div className="flex gap-1 flex-col">
                    <p className="text-sm">Start Date: {StartDate}</p>
                    <p className="text-sm">End Date: {EndDate}</p>
                    <p className="">Host: {CurrentEvent?.host.fname + " " + CurrentEvent?.host.lname}</p>
                </div>
                    <Button variant="outline" className="bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:text-white dark:hover:bg-emerald-500" onClick={() =>handleStart()}>
                        Participate
                    </Button>
            </div>
        </div>
    );
}
