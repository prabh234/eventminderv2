import { MyPrisma } from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req:NextRequest) =>{
    const data = await req.json()
    const {token} = data;
    // console.log(token);
    try {
        const user = await MyPrisma.participant.findFirst({
            where:{
                emailVerifToken:token
            },
            select:{
                isVarified:true,
                email:true,
                emailVerifToken:true,
                verifiedExpire:true,
                role:true
            }
        }) || await MyPrisma.moderator.findFirst({
            where:{
                emailVerifToken:token
            },
            select:{
                isVarified:true,
                email:true,
                emailVerifToken:true,
                verifiedExpire:true,
                role:true
            }
        })
        // console.log(user)
        const date = Date.now()
        if (!user) {
        console.log("if runnning")
            return NextResponse.json({message:"Invalid Token"},{status:302})
        } else if(user.verifiedExpire && new Date(user.verifiedExpire) < new Date(date)){
        console.log("else toke expire runnning")
            return NextResponse.json({message:"token expired"},{status:302})
        }
        const role = user.role.toLocaleLowerCase()
        if (role === "moderator") {
            const res = await MyPrisma.moderator.update({
                where:{
                    email:user.email
                },
                data:{
                    isVarified:true,
                    emailVerifToken:null,
                    verifiedExpire:null

                }
            })
            return NextResponse.json({res},{status:200})
        } else {
            const res = await MyPrisma.participant.update({
                where:{
                    email:user.email
                },
                data:{
                    isVarified:true,
                    emailVerifToken:null,
                    verifiedExpire:null

                }
            })
            return NextResponse.json({res},{status:200})
        }
    } catch (error) {
    return NextResponse.json({error,message:"Something went Wrong"},{status:500})
    }
}