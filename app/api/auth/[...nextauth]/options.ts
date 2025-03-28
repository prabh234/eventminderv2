import { MyPrisma } from "@/prisma/prisma"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { compare } from "bcryptjs"
import NextAuth, { NextAuthOptions } from "next-auth"
import Credentials from "next-auth/providers/credentials"

 export const options:NextAuthOptions = {
  adapter: PrismaAdapter(MyPrisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: {},
        pasword: {}
      },
      async authorize(credentials: Record<"pasword" | "email", string> | undefined): Promise<{ name: string; id: string; role: string; email: string } | null>{
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
            console.log("if runed")
            throw new Error("User not found")
          } else if(user.password){
            const usp =  user.password;
            const csp =  credentials.pasword;
             const compared =await compare(csp,usp)
            console.log(usp + " " + csp);
            if (compared) {
              console.log("if password runed")
              return {...user, name: (user.fname + " " + user.lname) || "", id: user.id.toString(), role: user.role.toString(), email: user.email}
            } else {
              console.log("els password runed")
              throw new Error("Password incorrect")
            }
          }
          return null;
        } catch (err) {
            console.log("catch runed")
          console.log(err)
          throw new Error("" + err)
        }
      }
    })
  ],
 pages:{
  signIn: "/login",
  signOut: "logout",
 },
  session:{
    strategy: "jwt",
  },
  callbacks:{
    async jwt({ token, user }) {
      if (user) {
        console.log(user);
        
        token.id = user.id;
        token.role = user.role;
        token.name = user.name
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.image = token.image;
      return session;
    }
  }

}
export default NextAuth(options)