import React from 'react'
import EventCompletedCards from './eventCard'
export default function EventsPage() {
    return (
        <main className='flex flex-1 flex-col gap-5 px-10  items-center '>
            <h1 className={`text-5xl`}>Completed Events</h1>
            <div className='flex flex-1 flex-wrap gap-4'>
                <EventCompletedCards/>
            </div>
        </main>
    )
}

