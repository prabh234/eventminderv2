import { MyPrisma } from '@/prisma/prisma';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// interface RegisterRequest {
//   descriptor: Float32Array[];
// }
export const GET = async () => {
  const data = MyPrisma.participant.findMany({
  })
  return NextResponse.json(data)
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

    const face = await MyPrisma.participant.update({
      where:{
        id:token?.id
      },
      data: {
        Face:data,
        FaceRegistered:{
          set:true
        }
      }
    });

    return NextResponse.json({face},{status:200});
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}