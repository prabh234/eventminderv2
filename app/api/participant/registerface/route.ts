import { MyPrisma } from '@/prisma/prisma';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// interface RegisterRequest {
//   descriptor: Float32Array[];
// }
export const GET = async (req:NextRequest) => {
  const token = await getToken({req})

    if (!token) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    try {
  const data = await MyPrisma.participant.findFirst({
    where:{
      id:token.id
    },
    select:{
      Face:true,
      FaceRegistered:true
    }
  })
  return NextResponse.json({...data},{status:200})
    } catch (error) {
  return NextResponse.json(error,{status:500})
    }
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const token = await getToken({req})
  try {

    if (!data && !token) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    const IsFaceRegistered = await MyPrisma.participant.findFirst({
      where:{
        id:token?.id
      },
      select:{
        FaceRegistered:true
      }
    })
    console.log(IsFaceRegistered);
    if(IsFaceRegistered?.FaceRegistered) return NextResponse.json("face already registered",{status:302})
    try {
    const face = await MyPrisma.participant.update({
      where:{
        id:token?.id
      },
      data: {
        Face:data.descriptor,
        FaceRegistered:{
          set:true
        }
      }
    });

    return NextResponse.json({face},{status:200});
    } catch (error) {
      return NextResponse.json(error,{status:500,statusText:"face registration failed"})
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}