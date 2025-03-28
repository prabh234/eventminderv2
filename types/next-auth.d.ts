import 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    role: string
    email: string
    name:string
        
  }
  interface Session {
        user:{
            id?: string
            role?: string
            email?: string
            name?:string
        } & defaultSession['user']
    }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    email: string
    name:string
        
  }
}