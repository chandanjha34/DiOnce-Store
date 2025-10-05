import connect from '../../../../../dbConfig/dbConfig'
import User from '../../../../../models/userModel'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { createHmac } from "crypto";
import { cookies } from "next/headers";



connect()

export async function POST(request: NextRequest) {
    const secret = process.env.SESSION_SECRET as string;
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
        console.log('user exists')
        const validPassword = await bcryptjs.compare(password,user.password);
    
        if (!validPassword) {
            return NextResponse.json({ 
                error: "Mismatched Password",
                success: false,
                status: 404
             })
        }

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }

        const response = NextResponse.json({
            message: "Login successfully",
            success: true,
            tokenData
        })
        return response
        

    } catch (error) {
        if (error instanceof Error) {
    return NextResponse.json({ error: error.message,  status: 500, success:false });
  }
  return NextResponse.json({ error: 'Unknown error',  status: 500, success:false });
    }
}