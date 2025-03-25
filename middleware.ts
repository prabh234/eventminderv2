import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(req: NextRequest,res:NextResponse) {
  const isPublicRoute = req.nextUrl.pathname ==="/" ||
                        req.nextUrl.pathname ==="/login" ||
                        req.nextUrl.pathname ==="/register" ||
                        req.nextUrl.pathname ==="/register/host" ||
                        req.nextUrl.pathname ==="/register/participant" ||
                        req.nextUrl.pathname ==="/register/verify"
  const ProtectedPath = req.nextUrl.pathname.startsWith("/dashboard")
  const hostRole = req.nextUrl.pathname.startsWith("/dashboard/host")
  console.log(hostRole);
  const token = await getToken({ req })
    if(!token && isPublicRoute){
      return res.ok
    } else if(!token && ProtectedPath){
      return NextResponse.redirect(new URL("/login",req.url))
    } else if(token && isPublicRoute){
      return NextResponse.redirect(new URL("/dashboard",req.url))
    }
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