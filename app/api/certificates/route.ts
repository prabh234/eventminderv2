import { MyPrisma } from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req:NextRequest) => {
    const data = await req.nextUrl.searchParams.get('id')
    console.log(data);
    try {
        const res = await MyPrisma.enrollment.findUnique({
            where:{
                id: parseInt(data || "3")
            },select:{
                id:true,
                event:{
                    select:{
                        eventname:true,
                        description:true,
                        startdt:true,
                        enddt:true,
                        host:{
                            select:{
                                fname:true,
                                lname:true
                            }
                        }
                    }
                },
                attendee:{
                    select:{
                        fname:true,
                        lname:true
                    }
                }
            }
        })
            return NextResponse.json(res,{status:200})
    } catch (error) {
        return NextResponse.json({error},{status:500})
    }
}