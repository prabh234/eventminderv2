"use client"

import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Loader, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

interface FormSchema {
  title: string
  description: string
  start: Date
  end: Date
}

const formSchema: z.ZodType<FormSchema> = z.object({
  title: z.string().nonempty("Title Cannot be empty"),
  description: z.string().nonempty("Description is required").max(500,{message:"description too Large, write a short summery about event only"}),
  start: z.date().refine(date =>{ const today = new Date(); // Get the current date
  today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison
  return date >= today; }, { message: "Cannot choose a past date" }),
  end: z.date().refine(date =>{ const today = new Date(); // Get the current date
  today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison
  return date >= today; }, { message: "Cannot choose a past date in end event date" }),
})

export function EventEditForm({id}:{id:string}) {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      start: new Date(),
      end: new Date()
    },
  })

  // Fetch event data
  useEffect(() => {

    const fetchEventData = async () => {
      try {
        const { data } = await axios.get(`/api/moderator/event/update?id=${id}`)
        console.log(data);
        form.reset({
          title: data.res.eventname,
          description: data.res.description,
          start: new Date(data.res.startdt),
          end: new Date(data.res.enddt)
        })
        setInitialLoad(false)
      } catch (error) {
        console.error("Error fetching event data:", error)
        toast.error("Failed to load event data")
        // router.back()
      }
    }

    fetchEventData()
  }, [id, form, router])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)

    try {
      await axios.post(`/api/moderator/event/update`,{id,values})
      toast.success("Event updated successfully")
      router.back()
    } catch (error) {
      console.error(error)
      toast.error("Failed to update event")
    } finally {
      setLoading(false)
    }
  }

  if (initialLoad) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-[500px]">
        <div className="absolute inset-0 h-full w-full scale-[1] transform rounded-full bg-red-500/50 bg-gradient-to-r from-blue-500/40 to-teal-500/50 blur-3xl" />
        <div className="relative flex flex-1 h-full flex-col items-center overflow-hidden rounded-2xl border border-gray-800 py-8 shadow-xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 flex flex-col w-full max-w-md px-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="start"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Start Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        startYear={new Date().getFullYear() - 1}
                        endYear={new Date().getFullYear() + 5}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event End Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        startYear={new Date().getFullYear() - 1}
                        endYear={new Date().getFullYear() + 5}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={loading} type="submit">
                {loading ? (
                  <span className="flex gap-2">
                    <Loader className="animate-spin" />
                    Updating...
                  </span>
                ) : (
                  <span className="flex gap-2">
                    <UserPlus />
                    Update Event
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}







// "use client"

// import { Button } from "@/components/ui/button"
// import { DatePicker } from "@/components/ui/date-picker"
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { zodResolver } from "@hookform/resolvers/zod"
// import axios from "axios"
// import { Loader, UserPlus } from "lucide-react"
// import { useRouter, useSearchParams } from "next/navigation"
// import { useEffect, useState } from "react"
// import { useForm } from "react-hook-form"
// import { toast } from "sonner"
// import { z } from "zod"


// interface FormSchema {
//     title: string;
//     description: string;
//     start: Date;
//     end: Date;
  
// }

// const formSchema: z.ZodType<FormSchema> = z.object({
//   title: z.string().nonempty("Title Cannot be empty"),
//   description: z.string().nonempty("Description is required").max(500,{message:"description too Large, write a short summery about event only"}),
//   start: z.date().refine(date =>{ const today = new Date(); // Get the current date
//   today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison
//   return date >= today; }, { message: "Cannot choose a past date" }),
//   end: z.date().refine(date =>{ const today = new Date(); // Get the current date
//   today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison
//   return date >= today; }, { message: "Cannot choose a past date in end event date" }),
// })

// export function EventEditForm() {
//   const router = useRouter();
//     const searchParams = useSearchParams();
//     const [id, setId] = useState<string | null | undefined>();
//     const [event, setEvent] = useState(null)
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//         title:"",
//         description:"",
//         start:new Date,
//         end:new Date
//     },
//   })
// useEffect(() => {
//     const eventId = searchParams.get("eventId");
//     setId(eventId)
// }, [searchParams]);

// useEffect(() => {
//     async function fetchData() {
//         try {
//             const res = await axios.get(`/api/moderator/event/update?id=${id}`);
//             console.log("this runned");
            
//             setEvent(res.data)
//         } catch (error) {
//             console.error("Error fetching event data:", error);
//         }
//     }
//     if (id) {
//         fetchData();
//     }
// });
//   const [loading,setLoading] = useState(false);
// async function onSubmit(values: z.infer<typeof formSchema>) {


//   console.log(values);
//   setLoading(true);
//   try {
//     // const res = await axios.post("/api/moderator/event/update", { ...values, eventid: eventId });
//     // setLoading(false);
//     // console.log(eventId);
//     toast.success("Event has been updated successfully");
//     router.back()
//   } catch (error) {
//     setLoading(false);
//     console.log(error);
//       toast.error("Something went wrong, try again");
//     }
// }
//   return (
// <div className="flex items-center justify-center">
//       <div className="relative w-full">
//         <div className="absolute inset-0 h-full w-full scale-[1] transform rounded-full bg-red-500/50 bg-gradient-to-r from-blue-500/40 to-teal-500/50 blur-3xl" />
//         <div className="relative flex flex-1  h-full flex-col items-center  overflow-hidden rounded-2xl border border-gray-800 py-8 shadow-xl">

//       <Form {...form} >
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 flex flex-col" >
//           <FormField
//             control={form.control}
//             name="title"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Title</FormLabel>
//                 <FormControl>
//                   <Input placeholder="Title" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="description"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Discription</FormLabel>
//                 <FormControl>
//                   <Textarea placeholder="Description" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         <FormField
//           control={form.control}
//           name="start"
//           render={({ field }) => (
//             <FormItem>
//                 <FormLabel>Event Start Date</FormLabel>
//                 <FormControl>
//                 <DatePicker
//                   startYear={2025}
//                   endYear={new Date().getFullYear()}
//                   value={field.value}
//                   onChange={field.onChange}
//                 />
//                 </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="end"
//           render={({ field }) => (
//             <FormItem>
//                 <FormLabel>Event End Date</FormLabel>
//               <FormControl>
//                 <DatePicker
//                   startYear={2025}
//                   endYear={new Date().getFullYear()}
//                   value={field.value}
//                   onChange={field.onChange}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <Button disabled={loading} type="submit">{loading?<span className="flex gap-2"><Loader className="animate-spin" />loading...</span>:<span className="flex gap-2"><UserPlus />Register</span>}</Button>
//       </form>
//     </Form>
//         </div>
//       </div>
//     </div>
//     )
// }
