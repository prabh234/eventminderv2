import { MyPrisma } from "@/prisma/prisma"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req:NextRequest)=>{
    try {
        const data = await req.json()
        await MyPrisma.event.delete({
            where:{
                id:data.eventid as string,
            }
        })
        return NextResponse.json({Message:"event deleted Successfully"},{status:200,statusText:"Event Dilivered"})
    } catch (error) {
        return NextResponse.json({error},{status:500,statusText:"Something went wrong, Try againnp"})
        
    }
}