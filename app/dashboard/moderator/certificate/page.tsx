"use client"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import axios from "axios";
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { toast } from "sonner";

export default function EventCompletedCards() {
    interface Event {
        id: string;
        eventname: string;
        description: string;
        startdt: string;
        enddt: string;
    }

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const GetEvents = useCallback(async () => {
        try {
            const response = await axios.get("/api/moderator/certificate");
            setEvents(response.data.res);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load completed events');
        } finally {
            setIsLoading(false);
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

    // Sort events by end date (newest first)
    const sortedEvents = [...events].sort((a, b) => 
        new Date(b.enddt).getTime() - new Date(a.enddt).getTime()
    );

    // Filter events based on search
    const filteredEvents = sortedEvents.filter(event =>
        event.eventname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-4 md:p-6 lg:p-8">
            {/* Search Bar */}
            <div className="mb-8 max-w-md mx-auto">
                <div className="relative">
                    <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-sky-500" />
                    <input
                        type="text"
                        placeholder="Search completed events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-sky-800 bg-white dark:bg-sky-950 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-600"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <AnimatePresence>
                        {filteredEvents.map((event, idx) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div
                                    className="relative group h-full w-full"
                                    onMouseEnter={() => setHoveredIndex(idx)}
                                    onMouseLeave={() => setHoveredIndex(null)}
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
                                        </CardFooter>
                                    </Card>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {!isLoading && filteredEvents.length === 0 && (
                <div className="col-span-full text-center py-12">
                    <h2 className="text-2xl font-medium text-gray-500 dark:text-sky-400">
                        {events.length === 0 ? "No completed events found" : "No matching events found"}
                    </h2>
                    <p className="text-gray-400 dark:text-sky-500 mt-2">
                        {events.length === 0 
                            ? "Completed events will appear here automatically" 
                            : "Try adjusting your search terms"}
                    </p>
                </div>
            )}
        </div>
    );
}