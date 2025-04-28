"use client"

import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { EyeIcon, EyeOffIcon, Loader, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    fname:z.string().nonempty("First name is required"),
    lname:z.string().nonempty("last name is required"),
  dob: z.date().refine(date => {
    const age = new Date().getFullYear() - date.getFullYear();
    return age >= 15;
  }, {
    message: "You must be at least 15 years old.",
  }),
  password: z.string()
        .min(6, "Password must be at least 6 characters long")
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, "Password must contain at least one letter, one number, and one special character"),
      })

export function ParticipantForm() {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        fname:"",
        lname:"",
        email: "",
        password: "",
        dob: new Date(),
    },
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading,setLoading] = useState(false);
  async function onSubmit(values: z.infer<typeof formSchema>) {
      setLoading(true)
    try{
      await axios.post("/api/auth/register", {role:"participant",...values})
      setLoading(false)
      router.push('/register/verify')
      router.refresh()
    } catch (error) {
      if(axios.isAxiosError(error) &&  error.response?.status === 400){
      setLoading(false)
        toast.error("User already exists")
        router.push('/login')
        router.refresh()
      } else {
      setLoading(false)
        toast.error("Something went wrong, try again")
        router.refresh()
      }
    }
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 flex flex-col min-w-[300px]">
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="fname"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="First Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lname"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Last Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="abc@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DatePicker
                  startYear={1900}
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl className="relative">
                <div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...field}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading} type="submit">{loading?<span className="flex gap-2"><Loader className="animate-spin" />loading...</span>:<span className="flex gap-2"><UserPlus />Register</span>}</Button>
      </form>
    </Form>
    
  )
}
