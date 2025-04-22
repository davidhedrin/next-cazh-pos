// export { auth as middleware } from "@/lib/auth-setup"
// import { auth } from "@/lib/auth-setup"
 
// export default auth((req) => {
//   if (!req.auth && req.nextUrl.pathname !== "/auth") {
//     const newUrl = new URL("/auth", req.nextUrl.origin)
//     return Response.redirect(newUrl)
//   }
// });

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  if (!token) {
    return redirectTo(request, "/auth");
  }
  return NextResponse.next();
}

function redirectTo(request: NextRequest, url: string) {
  const loginUrl = new URL(url, request.nextUrl.origin);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/apps/:path*",
    "/system-config/:path*",
    "/example/:path*",
  ],
}