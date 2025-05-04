'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
const ModeratorData = [
    {
        title: "Total Events",
        description: "An overview of the total number of events created so far.",
        count:100
    },
    {
        title: "Completed Events",
        description: "A summary of all events that have been successfully completed.",
        count:50
    },
    {
        title: "Allotted Certificates",
        description: "Details about certificates that have been issued for events.",
        count:210
    },
    {
        title: "Upcoming Events",
        description: "A list of events that are scheduled to take place in the future.",
        count:10
    },
];
const ParticipantData = [
    {
        title: "Available Events",
        description: "A list of events currently open for participation.",
        count:100
    },
    {
        title: "Attended",
        description: "The total number of events you have attended.",
        count:20
    },
    {
        title: "Certificates",
        description: "Certificates you have received for attending events.",
        count:15
    },
    {
        title: "Pending Certificates",
        description: "Certificates yet to be issued for attended events.",
        count:5
    },
];
export function CardDashboardModerator() {

return (
    <div className="flex gap-5 px-5 justify-around">
        {ModeratorData.map((card, index) => (
            <Card key={index} className="w-auto dark:bg-sky-400 bg-sky-400 dark:text-sky-800 text-sky-50">
                <CardHeader>
                    <CardTitle>{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="dark:text-gray-200 text-gray-800 text-5xl font-bold">{card.count}</CardContent>
                <CardFooter className="flex justify-between">
                    <CardDescription className="dark:text-slate-700 text-slate-200">{card.description}</CardDescription>
                </CardFooter>
            </Card>
        ))}
    </div>
);
}
export function CardDashboardParticipant() {

return (
    <div className="flex gap-5 px-5 justify-around">
        {ParticipantData.map((card, index) => (
            <Card key={index} className="w-auto dark:bg-sky-400 bg-sky-400 dark:text-sky-800 text-sky-50">
                <CardHeader>
                    <CardTitle>{card.title}</CardTitle>
                </CardHeader>
                <CardContent className="dark:text-gray-200 text-gray-800 text-5xl font-bold">{card.count}</CardContent>
                <CardFooter className="flex justify-between">
                    <CardDescription className="dark:text-slate-700 text-slate-200">{card.description}</CardDescription>
                </CardFooter>
            </Card>
        ))}
    </div>
);
}
