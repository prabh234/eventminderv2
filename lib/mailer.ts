import { v4 as uuidv4 } from 'uuid';
import { MyPrisma } from "@/prisma/prisma";
import nodemailer from 'nodemailer';

export const sendMail = async ({email,role,emailType,UserId}:{email:string,role:string,emailType:string,UserId:string}) => {
    try {
        const token = uuidv4();
        if (emailType === 'verify' && role === 'Participant') {
            await MyPrisma.participant.findUnique({
                where: {
                    id:UserId
                },
            }).then(async (user) => {
                if (user) {
                    await MyPrisma.participant.update({
                        where: {
                            id: user.id
                        },
                        data: {
                            emailVerifToken: token,
                            verifiedExpire: new Date(Date.now() + 24 * 60 * 60 * 1000)
                        }
                    })
                }
            })
        } else if (emailType === 'verify' && role === 'Moderator') {
            await MyPrisma.moderator.findUnique({
                where: {
                    id:UserId
                },
                }).then(async (user) => {
                if (user) {
                    await MyPrisma.moderator.update({
                        where: {
                            id: user.id
                        },
                        data: {
                            emailVerifToken: token,
                            verifiedExpire: new Date(Date.now() + 24 * 60 * 60 * 1000)
                        }
                    })
                }
            })
        } else if (emailType === 'reset' ) {
            const user = await MyPrisma.participant.findUnique({
                where: {
                    id:UserId
                },
            }) || await MyPrisma.moderator.findUnique({
                where: {
                    id:UserId
                },
            })
            if (user) {
                await MyPrisma.participant.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        resetPassword: token
                    }
                })
            }
        }

            // Looking to send emails in production? Check out our Email API/SMTP product!
            const transport = nodemailer.createTransport({
                host: "sandbox.smtp.mailtrap.io",
                port: 2525,
                auth: {
                    user: "0892c84d2b4008",
                    pass: "ae9b546b2626a6"
                }
            });

            const mailOptions = {
                from: 'verifyEmail@eventMinder.com',
                to: email,
                subject: emailType === 'verify' ? 'Verify your email' : 'Reset your password',
                html: emailType === 'verify' ? `<p className="">Please Verify your email by clicking the provided link <a href="${process.env.Domain}/register/verify?token=${token}" >Verify</a> </p>`:`<p className="">Please Verify your email by clicking the provided link <a href="${process.env.Domain}/resetPassword?token=${token}" >reset</a> </p>`
            };
            const mail = await transport.sendMail(mailOptions);
            return mail
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error(String(error));
        }
        
    }

}