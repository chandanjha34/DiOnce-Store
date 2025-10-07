import connect from '../../../../../dbConfig/dbConfig'
import User from '../../../../../models/userModel'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'



connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const {email, password } = reqBody
        console.log(reqBody);

        const user = await User.findOne({ email })

        if (!user) {
            return NextResponse.json({
                error: "User not regsitered",
                success: false,
                status: 400
            })
        }
        console.log('user exists');
        console.log(user);


        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }

        return NextResponse.json({
            message: "Login successfully",
            success: true,
            tokenData
        })
        

    } catch (error) {
        if (error instanceof Error) {
    return NextResponse.json({ error: error.message,  status: 500, success:false });
  }
  return NextResponse.json({ error: 'Unknown error',  status: 500, success:false });
    }
}