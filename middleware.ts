import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(req: NextRequest,res:NextResponse) {
  const token = await getToken({ req })
  const isPublicRoute = req.nextUrl.pathname ==="/" ||
                        req.nextUrl.pathname ==="/login" ||
                        req.nextUrl.pathname ==="/register" ||
                        req.nextUrl.pathname ==="/register/host" ||
                        req.nextUrl.pathname ==="/register/participant" ||
                        req.nextUrl.pathname ==="/register/verify"
  const ProtectedPath = req.nextUrl.pathname.startsWith(`/dashboard/${token?.role}`) || req.nextUrl.pathname.startsWith("/dashboard")
    if(!token && isPublicRoute){
      return res.ok
    } else if(!token && ProtectedPath){
      return NextResponse.redirect(new URL("/",req.url))
    } else if(token && isPublicRoute){
      return NextResponse.redirect(new URL("/dashboard",req.url))
    }
    // else if(token && hostRole){
    //   if(token.role === "participant" ||token.role ===  "admin"){
    //   return NextResponse.redirect(new URL("/unautharized/user",req.url))
    //   }
    // } else if(token && participantRole){
    //   if(token.role === "Moderator" || token.role === "admin"){
    //   return NextResponse.redirect(new URL("/unautharized/user",req.url))
    //   }
    // } else if(token && adminRole){
    //   if(token.role === "moderator" || token.role === "host"){
    //   return NextResponse.redirect(new URL("/unautharized/user",req.url))
    //   }
    // }
  }

export const config = {
  matcher: [
    "/",
    "/login",
    "/register/:path*",
    "/dashboard/:path*",
    "/admin"
    ] 
  }