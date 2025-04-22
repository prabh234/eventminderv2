import { MyPrisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req:NextRequest)=>{
    const data = await req.nextUrl.searchParams.get("eventid")
    try {
        const res = await MyPrisma.event.findUnique({
            where:{
                id:data as string,
            },
            include:{
                host:{
                    select:{
                        id:true,
                        fname:true,
                        lname:true,
                        department:true,
                        email:true,
                    }
                }
            }
        })
        return NextResponse.json({...res},{status:200,statusText:"Event Dilivered"})
    } catch (error) {
        return NextResponse.json({error},{status:500,statusText:"Something went wrong, Try againnp"})
        
    }
    
}

export const POST = async (req:NextRequest)=>{
    const token = await getToken({req})
    // return NextResponse.json({},{status:200})
    if (!token) {
        return NextResponse.json({message:"Unauthorized"},{status:401,statusText:"Unauthorized"})
    }
    try {
        const res = await MyPrisma.event.findMany({
            where: {
                hostId:token?.id,
            },
            select:{
                id:true,
                eventname:true,
                description:true,
                startdt:true,
                enddt:true,
            }
              
        })
        return NextResponse.json({res},{status:200,statusText:"Event Dilivered"})
    } catch (error) {
        return NextResponse.json({error},{status:500,statusText:"Something went wrong, Try againnp"})
        
    }
}