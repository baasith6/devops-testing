import { NextRequest, NextResponse } from 'next/server';
import { linkStorage } from '@/lib/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: { shortCode: string } }
) {
  const { shortCode } = params;
  const link = linkStorage.getLink(shortCode);

  if (!link) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Track click
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  linkStorage.trackClick(shortCode, ip, userAgent);

  // Redirect to original URL
  return NextResponse.redirect(link.originalUrl);
}

