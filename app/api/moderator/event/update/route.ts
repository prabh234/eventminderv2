import { MyPrisma } from "@/prisma/prisma"
import { NextRequest, NextResponse } from "next/server"

export const GET =async (req:NextRequest) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id")?.toString();
    console.log(id);
    try {
        const res = await MyPrisma.event.findFirst({
            where:{
                id:id
            }
        })
        console.log(res);
        return NextResponse.json({Message:"event deleted Successfully",res},{status:200,statusText:"Event Dilivered"})
    } catch (error) {
        return NextResponse.json({error},{status:500,statusText:"Something went wrong, Try againnp"})
    }
 };
export const POST = async (req:NextRequest)=>{
    try {
        const {id,values} = await req.json();
        console.log(id);
        console.log(values);
        
        await MyPrisma.event.update({
            where:{
                id:id
            },
            data:{
                eventname:values.title,
                description:values.description,
                startdt:values.start,
                enddt:values.end,
            }
        })
        return NextResponse.json({Message:"event updated Successfully"},{status:200,statusText:"Event Dilivered"})
    } catch (error) {
        return NextResponse.json({error},{status:500,statusText:"Something went wrong, Try againnp"})
        
    }
}