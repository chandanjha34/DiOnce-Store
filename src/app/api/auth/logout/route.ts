import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('gggg');
    // This deletes the cookie from the browser
    (await (cookies())).delete('auth'); // Use the name of your authentication cookie
    return NextResponse.json({ message: 'Logout successful' }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: 'Error logging out' }, { status: 500 });
  }
}