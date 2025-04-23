"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader, LogIn } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
   type: z.enum(["Moderator", "Participant"], {
    required_error: "You need to select a type.",
  }),
  })

export function ForgotForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },

  })

  const [loading,setLoading] = useState(false)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    console.log(values);
    
    }
  return (
   
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-80 flex flex-col">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="abc@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>You are</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Moderator" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Moderator
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Partiicipant" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Participant
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading} type="submit">{loading?<span className="flex gap-2"><Loader className="animate-spin"/>Loading...</span>:<span className="flex gap-2"><LogIn/>Send Reset Link</span>}</Button>
      </form>
    </Form>
    
  )
}
