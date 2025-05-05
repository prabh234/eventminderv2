import { MyPrisma } from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET =async (req:NextRequest) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id')?.toString();
    try {
        const res = await MyPrisma.enrollment.findMany({
            where:{
                eventId:id
            },select:{
                status:true,
                attendee:{
                    select:{
                        Face:true,
                        email:true,
                        fname:true,
                        lname:true,
                        id:true,
                    }
                }
            }
        })
        if (res.length > 0 ) {
            return NextResponse.json({res},{status:200})
        } else {
            return NextResponse.json({Message:"No One participated"},{status:300})
        }
    } catch (error) {
    return NextResponse.json({Message:"something went wrong",error},{status:500})
    }
};


export const POST = async (req:NextRequest) => { 
    const {
        eventId,
        userId,
    } = await req.json();
    
    try {
        const enrolId = await MyPrisma.enrollment.findFirst({
            where:{
                eventId:eventId,
                studentId:userId
            },select:{
                id:true
            }
        })
        const update = await MyPrisma.enrollment.update({
            where:{
                id:enrolId?.id
            },
            data: {
                status: {set:true} // Assuming 'status' is the field you want to update
            }
        })
        
        return NextResponse.json({update},{status:200})
    } catch (error) {
        return NextResponse.json({error},{status:500})
        
    }
};