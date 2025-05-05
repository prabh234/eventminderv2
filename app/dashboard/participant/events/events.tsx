"use client"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import axios from "axios";
import { AnimatePresence, motion } from 'framer-motion';
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { BiDotsVerticalRounded, BiSearch } from "react-icons/bi";

interface Event {
    id: string;
    eventname: string;
    description: string;
    startdt: string;
    enddt: string;
}

export default function EventCards() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const GetEvents = useCallback(async () => {
        try {
            const response = await axios.get("/api/participant/event");
            setEvents(response.data.res);
        } catch (err) {
            console.error(err);
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
        new Date(b.startdt).getTime() - new Date(a.startdt).getTime()
    );

    // Filter events based on search query
    const filteredEvents = sortedEvents.filter(event =>
        event.eventname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="px-4 md:px-6 lg:px-8 py-8">
            {/* Search Bar */}
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

                                    <Card className="h-full border border-gray-200 dark:border-sky-900/50 rounded-xl bg-white dark:bg-gradient-to-br from-sky-900/80 to-sky-900 transition-all hover:shadow-lg hover:-translate-y-1">
                                        <CardHeader className="pb-2">
                                            <h3 className="text-xl font-semibold text-sky-900 dark:text-sky-200 line-clamp-1">
                                                {event.eventname}
                                            </h3>
                                        </CardHeader>

                                        <CardContent className="pb-4">
                                            <p className="text-gray-600 dark:text-sky-300 line-clamp-3 text-sm">
                                                {event.description}
                                            </p>
                                        </CardContent>

                                        <CardFooter className="flex flex-col items-start gap-2 pt-4 border-t border-gray-100 dark:border-sky-900/50">
                                            <div className="flex justify-between w-full text-xs">
                                                <span className="text-gray-500 dark:text-sky-400">Start:</span>
                                                <span className="text-sky-700 dark:text-sky-300">
                                                    {formatDate(event.startdt)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between w-full text-xs">
                                                <span className="text-gray-500 dark:text-sky-400">End:</span>
                                                <span className="text-sky-700 dark:text-sky-300">
                                                    {formatDate(event.enddt)}
                                                </span>
                                            </div>
                                            <Link
                                                href={`/dashboard/participant/events/${event.id}`}
                                                className="w-full mt-2 flex items-center justify-center gap-1 text-sm font-medium text-sky-700 hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200 px-4 py-2 rounded-md hover:bg-sky-50/50 dark:hover:bg-sky-900/50 transition-colors"
                                            >
                                                View Details
                                                <BiDotsVerticalRounded className="h-4 w-4" />
                                            </Link>
                                        </CardFooter>
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
                            ? "Check back later for upcoming events" 
                            : "Try adjusting your search terms"}
                    </p>
                </div>
            )}
        </div>
    );
}