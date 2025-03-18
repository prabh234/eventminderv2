import { MyPrisma } from "@/prisma/prisma"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import NextAuth, { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { compare } from "bcryptjs"

 export const options:NextAuthOptions = {
  adapter: PrismaAdapter(MyPrisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: {label: "Email", type: "email"},
        password: {label: "Password", type: "password"}
      },
      async authorize(credentials: Record<"password" | "email", string> | undefined): Promise<{ id: string, email: string, role:string } | null>{
        try {
          if (!credentials) {
            return null
          }
          const user = await MyPrisma.moderator.findUnique({
            where: {
              email: credentials.email
            } 
          }) || await MyPrisma.participant.findUnique({
            where: {
              email: credentials.email
            }
          })
          if (!user) {
            throw new Error("User not found")
          }
          const isPasswordCorrect = await compare(credentials.password, user.password)
          if (isPasswordCorrect) {
            return {id: user.id.toString(), email: user.email, role: user.role}
          } else {
            throw new Error("Password incorrect")
          }
        } catch (error) {
          console.log(error)
          throw new Error("An error occurred" + error)
        }
      }
  })
  ],
 pages:{
  signIn: "/auth/signin",
  signOut: "/auth/signout",
 },
  session:{
    strategy: "jwt",
  },
  callbacks:{
    async jwt(token, user){
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session(session, token){
      session.id = token.id
      return session
    }
  }

}
export default NextAuth(options)