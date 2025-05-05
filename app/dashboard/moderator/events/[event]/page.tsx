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
  const [eventId, setEventId] = useState<string | null>(null);
  const [CurrentEvent, setEvent] = useState<EventResponse | null>(null);
  const [dateStatus, setDateStatus] = useState<"today" | "future" | "past">("future");
  const router = useRouter();

  // Unwrap params using useEffect
  useEffect(() => {
    async function unwrapParams() {
      const resolvedParams = await params;
      setEventId(resolvedParams.event);
    }
    unwrapParams();
  }, [params]);

  const getAdjustedDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const EventData = useCallback(async () => {
    if (!eventId) return;

    try {
      const res = await axios.get('/api/moderator/event', { params: { eventid: eventId } });
      setEvent(res.data);

      const today = new Date();
      const startDate = getAdjustedDate(res.data.startdt);
      const todayDate = getAdjustedDate(today.toISOString());

      if (startDate.getTime() === todayDate.getTime()) {
        setDateStatus("today");
      } else if (startDate > todayDate) {
        setDateStatus("future");
      } else {
        setDateStatus("past");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load event data");
    }
  }, [eventId]);

  useEffect(() => {
    EventData();
  }, [EventData]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  async function handleDelete() {
    try {
      await axios.post('/api/moderator/event/delete', { eventid: eventId });
      toast.success("Event Deleted Successfully");
      router.push("/dashboard/moderator/events");
    } catch (err) {
      toast.error("Failed to delete event");
      console.error(err);
    }
  }

  function handleStart() {
    if (dateStatus === "today") {
      router.push(`/dashboard/moderator/events/${eventId}/start`);
    } else {
      toast.error("Event cannot be started", {
        description: dateStatus === "future"
          ? "Event can only be started on the start date"
          : "This event date has already passed",
      });
    }
  }

  return (
    <div className="flex flex-col bg-gray-50 dark:bg-gray-900 p-6 rounded-xl shadow-sm min-h-[80vh] m-4 lg:m-8 gap-6">
      <div className="space-y-2">
        {dateStatus !== "today" && (
          <p className={`text-center text-sm px-4 py-2 rounded-lg ${
            dateStatus === "future"
              ? "bg-amber-100/50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
              : "bg-rose-100/50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300"
          }`}>
            {dateStatus === "future"
              ? "Note: This event is yet to start - you can only start it on the selected date"
              : "Note: This event date has passed - edit or delete the event"}
          </p>
        )}
        <h1 className="text-4xl lg:text-5xl font-bold text-center text-gray-900 dark:text-gray-100">
          {CurrentEvent?.eventname}
        </h1>
      </div>

      <div className="flex-1 space-y-6">
        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          {CurrentEvent?.description}
        </p>

        <div className="space-y-2 text-gray-700 dark:text-gray-300">
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

      <div className="flex flex-col lg:flex-row justify-between gap-4 lg:items-center">
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => router.push(`/dashboard/moderator/events/${eventId}/edit`)}
            variant="outline"
            className="bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Edit Event
          </Button>
          <Button
            onClick={handleDelete}
            variant="outline"
            className="text-white bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600"
          >
            Delete Event
          </Button>
        </div>

        <Button
          onClick={handleStart}
          disabled={dateStatus !== "today"}
          className="bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start Event
        </Button>
      </div>
    </div>
  );
}