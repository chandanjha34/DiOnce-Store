import connect from '../../../../../dbConfig/dbConfig'
import User from '../../../../../models/userModel'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'



export async function POST(request: NextRequest) {
    try {
        connect()
        const reqBody = await request.json()
        const { username, email, password } = reqBody

        const user = await User.findOne({ email })

        if (user) {
            return NextResponse.json({ error: "User already exists" ,status: 400, success:false })
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })
        console.log("response from server",newUser);
        // send verification email
console.log('checkpoint 1')
        await newUser.save();
console.log('checkpoint 2')

        return NextResponse.json({
            message: "User created succesfully",
            success: true,
            newUser,
        })

    } catch (error) {
if (error instanceof Error) {
    return NextResponse.json({ error: error.message ,status: 400, success:false} );
  }
  return NextResponse.json({ error: 'Unknown error' ,status: 400, success:false} );
    }
}