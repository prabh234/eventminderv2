"use client"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import axios from "axios";
import { AnimatePresence, motion } from 'motion/react';
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { CiPlay1 } from "react-icons/ci";
export default function EventCratedCards(){
    interface Event {
        id: string;
        eventname: string;
        description: string;
        startdt:string;
        enddt:string;
    }
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const [events, setEvents] = useState<Event[]>([])
    const GetEvents = useCallback(async () => {
        try{
        const events = await axios.post("/api/moderator/event");
            setEvents(events.data.res);
        } catch(err){
            console.log(err);
        }
    }, []);

    useEffect(() => {
        GetEvents();
    }, [GetEvents]);
    return(

        <div className="grid grid-cols-1 md:grid-cols-3  lg:grid-cols-4 py-10">

            {events.length > 0 ? events.map((event,idx)=>{
                return(
                    <div
                        key={idx}
                        className="relative group  block p-2 h-full w-full"
                        onMouseEnter={() => setHoveredIndex(idx)}
                        onMouseLeave={() => setHoveredIndex(null)}>
                    <AnimatePresence>
                        {hoveredIndex === idx && (
                          <motion.span
                            className="absolute inset-0 h-full w-full bg-cyan-400/35 dark:bg-gradient-to-bl from-sky-900/80 to-sky-800 block  rounded-3xl"
                            layoutId="hoverBackground"
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: 1,
                                transition: { duration: 0.15 },
                            }}
                            exit={{
                                opacity: 0,
                                transition: { duration: 0.15, delay: 0.2 },
                            }}
                        />
                        )}
                    </AnimatePresence>
                    <Card className="w-80 rounded-2xl border border-transparent flex flex-col justify-between dark:bg-gradient-to-br from-sky-700 to-cyan-900/65 h-full p-4 overflow-hidden relative z-20" key={event.id}>
                        <CardHeader className="text-4xl">{event.eventname}</CardHeader>
                        <CardContent>{event.description.length > 100 ? event.description.slice(0,100) + "..." : event.description}</CardContent>
                        <CardFooter className="flex justify-end items-center">
                            <Link className="flex gap-1 items-center bg-sky-600 hover:bg-sky-500 pl-3 pr-2 rounded-md py-1" href={`/dashboard/moderator/events/${event.id}`}>Edit<BiDotsVerticalRounded/></Link>
                        </CardFooter>
                    </Card>
                    </div>
                )
            }):(
                <div className="">
                    <h1 className="">No Events Created yet</h1>
                </div>
            )}
        </div>
        )
}