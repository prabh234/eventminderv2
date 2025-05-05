import React from 'react'
import { DoughnutChart } from './chart'
import { MyPrisma } from '@/prisma/prisma'
import { Button } from '@/components/ui/button' // Assuming you're using a UI library

const fetchData = async (params: string) => {
    "use server"
    return await MyPrisma.enrollment.findMany({
        where: {
            eventId: params
        }
    })
}

export default async function EndEvent({ params }: { params: Promise<{ event: string }> }) {
    const { event } = await params
    const data = await fetchData(event)
    const present = data.filter(event => event.status === true)
    const result = { present: present.length, absent: data.length - present.length }
    
    return (
        <main className='flex flex-1 flex-col md:flex-row gap-6 p-4 md:p-8'>
            {/* Chart Section */}
            <div className="flex flex-1 min-h-[400px]">
                <DoughnutChart data={result} />
            </div>
            
            {/* Next Steps Card */}
            <div className="flex flex-1">
                <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/50 p-6 flex flex-col">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                        Event Completed Sucessfully
                    </h3>
                    
                    <div className="space-y-4 mb-6">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mt-0.5">
                                <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">1</span>
                            </div>
                            <div>
                                <h4 className="text-base font-medium text-gray-800 dark:text-gray-200">Review Attendance</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Verify the attendance data shown in the chart matches your expectations.
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mt-0.5">
                                <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">2</span>
                            </div>
                            <div>
                                <h4 className="text-base font-medium text-gray-800 dark:text-gray-200">Generate Certificates</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Generate certificates with a single click, Its optional you can generate certificates later
                                </p>
                            </div>
                        </div>
                        
                        {/* <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mt-0.5">
                                <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">3</span>
                            </div>
                            <div>
                                <h4 className="text-base font-medium text-gray-800 dark:text-gray-200">Notify Participants</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Send follow-up emails to absent participants if needed.
                                </p>
                            </div>
                        </div> */}
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white">
                                Generate Certificate
                            </Button>
                            <Button variant="outline" className="w-full sm:w-auto dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
                                Dashboard
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}