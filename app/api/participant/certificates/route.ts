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
                status:false,
                event:{
                    select:{
                        eventname:true,
                        description:true,
                        startdt:true,
                        enddt:true,
                        status:true,
                        Certificatestatus:true
                    }
                },
            }
        })
        console.log(res);
        if(res.length > 0 ){
            const certified = res.filter(data=>{
                if(data.event.Certificatestatus === true) return data
            })
            return NextResponse.json(certified,{status:200})
        }
        return NextResponse.json({message:"Not participated in any event"},{status:302})
    } catch (error) {
        return NextResponse.json({error},{status:500})
    }
}