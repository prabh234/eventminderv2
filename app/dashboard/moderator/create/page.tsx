import { loveLight } from "@/components/assets/fonts";
import { EventForm } from "./form";

export default function AboutUs(){
    return(
        <main className="flex flex-col gap-6">
            <h1 className={`${loveLight.className} text-7xl text-center`}>Create Event</h1>
           <EventForm/>
        </main>
    )
}