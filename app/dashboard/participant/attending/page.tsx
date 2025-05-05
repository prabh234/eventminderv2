import EventAttendingCards from "./events";

export default function AboutUs(){
    return(
        <main className='flex flex-1 flex-col gap-5 px-10  items-center '>
        <h1 className={`text-5xl`}>Attending Events</h1>
        <div className='flex flex-1 flex-wrap gap-4'>
            <EventAttendingCards/>
        </div>
        </main>
    )
}