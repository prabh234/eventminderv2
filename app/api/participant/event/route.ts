import { MyPrisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const GET = async ()=>{
    try {
        const res = await MyPrisma.event.findMany({
            where:{
                status:false
            }
        })
        return NextResponse.json({res},{status:200,statusText:"Event Dilivered"})
    } catch (error) {
        return NextResponse.json({error},{status:500,statusText:"Something went wrong, Try againnp"})
        
    }
    
}

export const PUT = async (req:NextRequest)=>{
    const {eventid} = await req.json()
    const token = await getToken({req})
    try {
        if(!token?.sub) return NextResponse.json({error:"User not found"},{status:401,statusText:"Unauthorized"})
        const already = await MyPrisma.enrollment.findFirst({
            where:{
                eventId:eventid,
                studentId:token.sub
            }
        })
        if (already) {
            return NextResponse.json({error:"Already enrolled"},{status:302,statusText:"Already enrolled"})
        } else {
        const res = await MyPrisma.enrollment.create({
            data:{
                eventId:eventid,
                studentId: token.sub ,
            }
        })
        return NextResponse.json({res},{status:200,statusText:"Event Dilivered"})
        }
    } catch (error) {
        return NextResponse.json({error},{status:500,statusText:"Something went wrong, Try againnp"})
        
    }
    
}
