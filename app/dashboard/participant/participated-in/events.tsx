"use client"
import { Card } from "@/components/ui/card";
import axios from "axios";
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { toast } from "sonner";

interface Event {
    id: string;
    studentId: string;
    status: boolean;
    event: {
        eventname: string;
        description: string;
        startdt: string;
        enddt: string;
        status: boolean;
        Certificatestatus: boolean;
    }
}

export default function EventAttendedCards() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    const GetEvents = useCallback(async () => {
        try {
            const response = await axios.get("/api/participant/participated");
            setEvents(response.data);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 302) {
                setEvents([]);
                toast.info('No events found');
            } else {
                console.error(err);
                toast.error('Failed to load events');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        GetEvents();
    }, [GetEvents]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Sort events by start date (newest first)
    const sortedEvents = [...events].sort((a, b) => 
        new Date(b.event.startdt).getTime() - new Date(a.event.startdt).getTime()
    );

    // Filter events based on search query
    const filteredEvents = sortedEvents.filter(event =>
        event.event.eventname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.event.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
            </div>
        );
    }

    return (
        <div className="px-4 md:px-6 lg:px-8 py-8">
            <div className="mb-8 max-w-md mx-auto">
                <div className="relative">
                    <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-sky-800 bg-white dark:bg-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                </div>
            </div>

            {filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <AnimatePresence>
                        {filteredEvents.map((event, idx) => (
                            <div
                                key={event.id}
                                className="relative group h-full w-full"
                                onMouseEnter={() => setHoveredIndex(idx)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <AnimatePresence>
                                        {hoveredIndex === idx && (
                                            <motion.span
                                                className="absolute inset-0 h-full w-full bg-sky-100/40 dark:bg-sky-900/30 block rounded-xl"
                                                layoutId="hoverBackground"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            />
                                        )}
                                    </AnimatePresence>

                                    <Card className="h-full border border-gray-200 dark:border-sky-900/50 rounded-xl bg-white dark:bg-gradient-to-br from-sky-900/80 to-sky-900 transition-all hover:shadow-lg hover:-translate-y-1 p-4">
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-semibold text-sky-900 dark:text-sky-200 line-clamp-1">
                                                {event.event.eventname}
                                            </h3>
                                            <p className="text-gray-600 dark:text-sky-300 line-clamp-3 text-sm">
                                                {event.event.description}
                                            </p>
                                            <div className="flex flex-col gap-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500 dark:text-sky-400">Start:</span>
                                                    <span className="text-sky-700 dark:text-sky-300">
                                                        {formatDate(event.event.startdt)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500 dark:text-sky-400">End:</span>
                                                    <span className="text-sky-700 dark:text-sky-300">
                                                        {formatDate(event.event.enddt)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500 dark:text-sky-400">Enrolled:</span>
                                                    <span className={`${
                                                        event.status
                                                            ? 'text-emerald-600 dark:text-emerald-400' 
                                                            : 'text-rose-600 dark:text-rose-400'
                                                    }`}>
                                                        {event.status ? 'Attended' : 'Not-Attended'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500 dark:text-sky-400">Certificate:</span>
                                                    <span className={`${
                                                        event.event.Certificatestatus 
                                                            ? 'text-emerald-600 dark:text-emerald-400' 
                                                            : 'text-amber-600 dark:text-amber-400'
                                                    }`}>
                                                        {event.event.Certificatestatus ? 'Issued' : 'Pending'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            </div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-96 text-center">
                    <h2 className="text-2xl font-medium text-gray-500 dark:text-sky-400">
                        {events.length === 0 ? "No Events Available" : "No Matching Events Found"}
                    </h2>
                    <p className="text-gray-400 dark:text-sky-500 mt-2">
                        {events.length === 0 
                            ? "You're not currently attending any events" 
                            : "Try adjusting your search terms"}
                    </p>
                </div>
            )}
        </div>
    );
}