import { MyPrisma } from "@/prisma/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req:NextRequest) => {
    const token = await getToken({req})
    try {
        const res = await MyPrisma.enrollment.findMany({
            where:{
                studentId:token?.id,
                status:true
            },select:{
                id:true,
                studentId:true,
                status:true,
                event:{
                    select:{
                        eventname:true,
                        status:true,
                        description:true,
                        startdt:true,
                        enddt:true,
                        Certificatestatus:true 
                    }
                }
            }
        })
        console.log(res);
        if(res.length > 0 ) return NextResponse.json(res,{status:200})
        return NextResponse.json({message:"Not participated in any event"},{status:302})
    } catch (error) {
        return NextResponse.json({error},{status:500})
    }
}