import { MyPrisma } from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (req:NextRequest)=>{
    const FormData = await req.json()
    console.log(FormData);
    // return NextResponse.json({},{status:200})
    try {
        const res = await MyPrisma.event.create({
            data: {
              eventname:FormData.title,
              description:FormData.description,
              startdt:FormData.start,
              enddt:FormData.end,
              hostId:FormData.userId,
              }
        })
        return NextResponse.json({...res,message:"Event Created Successfully"},{status:200,statusText:"Event Created Successfully"})
    } catch (error) {
        return NextResponse.json({error},{status:500,statusText:"Something went wrong, Try againnp"})
        
    }
}