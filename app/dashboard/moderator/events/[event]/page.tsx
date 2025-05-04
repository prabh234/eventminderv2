"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
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
    const [date,setdate] = useState("");
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
            const start = new Date(res.data.startdt);
            const today = new Date();
            const eventDate = today.toDateString() === start.toDateString()
            const futureDate = today.toDateString() < start.toDateString()
            const pastDate = today.toDateString() > start.toDateString()
            if (eventDate) {
                setdate("today")
            } else if (futureDate) {
                setdate("future")
            } else if (pastDate) {
                setdate("past")
            }
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

    async function handleDelete(){
        await axios.post('/api/moderator/event/delete', { eventid: eventid });
        toast.success("Event Deleted", {
            description: "Event Deleted Successfully",
        });
        setTimeout(() => {
            window.location.href = "/dashboard/moderator/events";
        }, 2000);

    }
    function handleStart(){
        toast.success(date);
        if (date === "today"){
            router.push(`/dashboard/moderator/events/${eventid}/start`);
        } else{
            toast.error("Event cannot be started", {
                description: "Event can only be started on the date selected",
            });
        }
    }

    return (
        <div className="flex bg-cyan-100 dark:bg-cyan-950 flex-col p-5  rounded-2xl shadow-lg h-[80vh] m-10">
                {date === "today" ? <></>:date === "future" ?<p className="text-yellow-500 text-center text-sm">[ Note : This event is yet to start, you can only start on the date selected]</p> : <p className="text-red-500 text-center text-sm">[ Note : This event Date has already passed either edit event or delete event ]</p>}
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
                <div className="flex gap-3 items-baseline">
                    <Button variant="outline" className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500" onClick={() => window.location.href = `/dashboard/moderator/events/${eventid}/edit`}>
                        Edit Event
                    </Button>
                    <Button variant="outline" className="bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:text-white dark:hover:bg-red-500" onClick={() => handleDelete()}>
                        Delete Event
                    </Button>
                    <Button variant="outline" className="bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:text-white dark:hover:bg-emerald-500" onClick={() =>handleStart()}>
                        Start Event
                    </Button>

                </div>
            </div>
        </div>
    );
}
