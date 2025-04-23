"use client";
import { useState,useEffect } from 'react';

export default function Start() {
    const [eventid, setEventId] = useState<string | null>(null);
    useEffect(function() {
        const urlParams = new URLSearchParams(window.location.search);
        const eventid = urlParams.get('eventid');
        setEventId(eventid);
    }, [eventid]);
  return (
    <div>
        <h1 className="text-4xl">{eventid}</h1>
    </div>
  )
}
