import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';


export async function middleware(request: NextRequest) {
    const cookieStore = await cookies();
    const access = cookieStore.get('access_token')?.value;

    if (!access) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/profile/:path*', '/profile'],
}
