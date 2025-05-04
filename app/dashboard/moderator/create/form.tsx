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
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"


interface FormSchema {
    title: string;
    description: string;
    start: Date;
    end: Date;
  
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

export function EventForm() {
  const router = useRouter();
  const {data:session} = useSession()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        title:"",
        description:"",
        start:new Date,
        end:new Date
    },
  })

  const [loading,setLoading] = useState(false);
async function onSubmit(values: z.infer<typeof formSchema>) {
  if (!session || !session.user || !session.user.id) {
    toast.error("Session not loaded. Please try again.");
    return;
  }

  console.log(values);
  setLoading(true);
  try {
    const res = await axios.post("/api/moderator/event/create", { ...values, userId: session.user.id });
    setLoading(false);
    console.log(res);
    router.push("/dashboard/moderator/events");
    toast.success("Event has been created successfully");
  } catch (error) {
    setLoading(false);
    console.log(error);
      toast.error("Something went wrong, try again");
    }
}
  return (
<div className="flex items-center justify-center">
      <div className="relative w-full max-w-[500px]">
        <div className="absolute inset-0 h-full w-full scale-[1] transform rounded-full bg-red-500/50 bg-gradient-to-r from-blue-500/40 to-teal-500/50 blur-3xl" />
        <div className="relative flex flex-1  h-full flex-col items-center  overflow-hidden rounded-2xl border border-gray-800 py-8 shadow-xl">

      <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 flex flex-col w-full max-w-md px-4" >
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
                <FormLabel>Discription</FormLabel>
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
                  startYear={2025}
                  endYear={new Date().getFullYear()}
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
                  startYear={2025}
                  endYear={new Date().getFullYear()}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading} type="submit">{loading?<span className="flex gap-2"><Loader className="animate-spin" />loading...</span>:<span className="flex gap-2"><UserPlus />Create</span>}</Button>
      </form>
    </Form>
        </div>
      </div>
    </div>
    )
}
