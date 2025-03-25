import { sendMail } from "@/lib/mailer";
import { MyPrisma } from "@/prisma/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
    const body = await request.json()
    console.log(body)
    // return NextResponse.json({message:"Registration Successful"},{status:201})
    try {
        const user= await MyPrisma.moderator.findFirst({
            where: {
                email: body.email
            }
        }) || await MyPrisma.participant.findFirst({
            where: {
                email: body.email
            }
        })
        if (user) {
            return NextResponse.json({message: "user already exists"},{status:400})
        } else {
            if (body.role === "moderator") {
                try {
                    const hash = await bcrypt.hashSync(body.password, 10)
                    const {email,id,role} = await MyPrisma.moderator.create({
                        data: {
                            email: body.email.toLowerCase(),
                            password: hash,
                            fname: body.fname,
                            lname: body.lname,
                            dateofbirth: body.dob,
                        }
                    })
                    await sendMail({email:email,UserId:id,emailType:"verify",role:role})
                    return NextResponse.json({message:"Registration Successful"},{status:201})
                } catch (error) {
                    return NextResponse.json({message: "Something went wrong, try again", error},{status:302,statusText:"error yaha hai"})
                }

            } else if (body.role === "participant") {
                try {
                    const hash = await bcrypt.hashSync(body.password, 10)
                    const {email,id,role}= await MyPrisma.participant.create({
                    data: {
                        email: body.email,
                        password: hash,
                        fname: body.fname,
                        lname: body.lname,
                        dateofbirth: body.dob,
                    }
                })
                    await sendMail({email:email,UserId:id,emailType:"verify",role:role})
                    return NextResponse.json({message:"Registration Successful"},{status:201})
                } catch (error) {
                    return NextResponse.json({message:"Something went wrong, try again",error},{status:302,statusText:"error yaha hai"})
                }
            }
            return NextResponse.json({message: "Invalid role"},{status:400})
        }
    } catch (error) {
        return NextResponse.json({message:"Something went wrong, try again",error},{status:500})
    }
}