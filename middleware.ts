import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth_key')?.value;
  const id = req.cookies.get('auth_id')?.value;

  if (!token || !id) return NextResponse.redirect(new URL('/', req.url));

  // https://nextjs.org/docs/messages/node-module-in-edge-runtime
  // const next = verifyToken(token);
  // if (!next) return NextResponse.redirect(new URL('/', req.url));

  const nextResp = NextResponse.next();
  return nextResp;
}

export const config = {
  matcher: ['/quiz/:path*', '/api/:path*'],
};
