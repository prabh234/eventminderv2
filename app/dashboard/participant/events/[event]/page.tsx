
"use client";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Loading from "@/components/assets/loading";

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
    const router = useRouter();
    const [CurrentEvent, setEvent] = useState<EventResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPastEvent, setIsPastEvent] = useState(false);
    const [isParticipating, setIsParticipating] = useState(false);

    // Properly unwrap the params promise
    const resolvedParams = use(params);
    const eventId = resolvedParams.event;

    const getAdjustedDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    const EventData = useCallback(async () => {
        try {
            const res = await axios.get('/api/moderator/event', { params: { eventid: eventId } });
            setEvent(res.data);
            
            // Date validation
            const today = new Date();
            const endDate = getAdjustedDate(res.data.enddt);
            const todayDate = getAdjustedDate(today.toISOString());
            setIsPastEvent(endDate < todayDate);

        } catch (err) {
            console.error(err);
            toast.error("Failed to load event data");
        } finally {
            setIsLoading(false);
        }
    }, [eventId]);

    useEffect(() => {
        EventData();
    }, [EventData]);

    // ... rest of the component remains the same ...
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    async function handleStart() {
        setIsParticipating(true);
        try {
            await axios.put("/api/participant/event", { eventid: eventId });
            toast.success("Participated successfully", {
                description: "You'll receive updates about the event",
            });
            router.back();
        } catch (error) {
            if ((error as AxiosError).response?.status === 302) {
                toast.error("Already enrolled", {
                    description: "You're already participating in this event",
                });
            } else {
                toast.error("Participation failed", {
                    description: "Please try again later",
                });
            }
        } finally {
            setIsParticipating(false);
        }
    }

    if (isLoading) {
        return <Loading/>
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col bg-gray-50 dark:bg-gray-900 p-6 rounded-xl shadow-lg min-h-[80vh] m-4 lg:m-8"
        >
            <div className="flex justify-between items-start mb-6">
                <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200"
                >
                    ← Go Back
                </Button>
            </div>

            <div className="space-y-8 flex-1">
                <h1 className="text-4xl lg:text-5xl font-bold text-center dark:text-gray-100 text-gray-900">
                    {CurrentEvent?.eventname}
                </h1>

                <div className="space-y-4">
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        {CurrentEvent?.description}
                    </p>

                    <div className="space-y-2 dark:text-gray-300 text-gray-700">
                        <p className="text-sm">
                            <span className="font-medium">Start:</span> {formatDate(CurrentEvent?.startdt || "")}
                        </p>
                        <p className="text-sm">
                            <span className="font-medium">End:</span> {formatDate(CurrentEvent?.enddt || "")}
                        </p>
                        <p>
                            <span className="font-medium">Host:</span> {CurrentEvent?.host.fname} {CurrentEvent?.host.lname}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4 items-center">
                {isPastEvent && (
                    <p className="text-red-500 dark:text-red-400 text-sm text-center">
                        This event has already ended
                    </p>
                )}
                
                <Button
                    onClick={handleStart}
                    disabled={isPastEvent || isParticipating}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isParticipating ? "Processing..." : "Participate"}
                </Button>
            </div>
        </motion.div>
    );
}