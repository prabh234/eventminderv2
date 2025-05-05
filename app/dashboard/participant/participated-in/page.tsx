import EventAttendedCards from "./events";

export default function AttendedEvents(){
    return(
        <main className='flex flex-1 flex-col gap-5 px-10  items-center '>
        <h1 className={`text-5xl`}>Attended Events</h1>
        <div className='flex flex-1 flex-wrap gap-4'>
            <EventAttendedCards/>
        </div>
        </main>
    )
}