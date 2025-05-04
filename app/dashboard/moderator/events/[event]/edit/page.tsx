'use client'
import { loveLight } from "@/components/assets/fonts";
import { EventEditForm } from "./form";
import { use } from "react";

export default function EditPage({ params }: { params: Promise<{ event: string }> }) {
   const {event} = use(params)
  return (
  <main className="flex flex-col gap-6">
    <h1 className={`${loveLight.className} text-7xl text-center`}>Edit Event</h1>
    <EventEditForm id={event}/>
  </main>
  )
}
