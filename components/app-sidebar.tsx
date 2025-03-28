"use client"
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail
} from "@/components/ui/sidebar"
import {
  BookText,
  CalendarCheck,
  CalendarPlus,
  Info,
  LetterText,
  PencilRuler,
  ScrollText,
  SquareTerminal
} from "lucide-react"
import { useSession } from "next-auth/react"

const data = {
  ModeratorNav: [
    {
      title: "Event Management",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Create New",
          icon:CalendarPlus,
          url: "/dashboard/moderator/create",
        },
        {
          title: "Edit Created",
          icon:PencilRuler,
          url: "/dashboard/moderator/events",
        },
        {
          title: "View Hosted",
          icon:CalendarCheck,
          url: "/dashboard/moderator/completed",
        },
      ],
    },
    {
      title: "Certification",
      url: "#",
      icon: ScrollText,
      items: [
        {
          title: "Alotment",
          url: "/dashboard/moderator/certificate",
        },
        {
          title: "Attendence Tracking",
          url: "#",
        },
      ],
    },
  ],
  ParticpantNav: [
    {
      title: "Event Management",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "All Events",
          icon:CalendarPlus,
          url: "/dashboard/participant/events",
        },
        {
          title: "Participated in",
          icon:PencilRuler,
          url: "/dashboard/participant/attending",
        },
      ],
    },
    {
      title: "Certification",
      url: "#",
      icon: ScrollText,
      items: [
        {
          title: "alloted certificates",
          url: "/dashboard/participant/certificates",
        },
        {
          title: "Attendence Tracking",
          url: "/dashboard/participant/participated-in",
        },
      ],
    },
  ],
  projects: [
    {
      name: "About Us",
      url: "/dashboard/about-us",
      icon: Info,
    },
    {
      name: "Contact Us",
      url: "/dashboard/contact-us",
      icon: LetterText,
    },
    {
      name: "Description",
      url: "/dashboard/website-description",
      icon: BookText,
    },
  ],
}

export  function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
const {data:session} = useSession()
    const user : {name:string,email:string,avatar:string} = {name:session?.user.name,
                  email:session?.user.email,
                  avatar:session?.user.profile || ""
                }
    const Initials = (user.name || "").split(" ").map(word => word[0]?.toUpperCase() || "").join("")
  return (
    <>
      {session?.user?.role === "Moderator" ? (
        <Sidebar className="" collapsible="icon" {...props}>
          <SidebarContent>
            <NavMain items={data.ModeratorNav} />
            <NavProjects projects={data.projects} />
          </SidebarContent>
          <SidebarFooter>
            <NavUser user={{ ...user, initials: Initials }} />
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
      ) : (
        <Sidebar className="" collapsible="icon" {...props}>
          <SidebarContent>
            <NavMain items={data.ParticpantNav} />
            <NavProjects projects={data.projects} />
          </SidebarContent>
          <SidebarFooter>
            <NavUser user={{ ...user, initials: Initials }} />
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
      )}
    </>
  )
}
