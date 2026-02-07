import { NextRequest, NextResponse } from 'next/server';
import { linkStorage } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, alias } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Validate alias if provided
    if (alias) {
      if (alias.length < 3 || alias.length > 20) {
        return NextResponse.json(
          { error: 'Alias must be between 3 and 20 characters' },
          { status: 400 }
        );
      }
      if (!/^[a-zA-Z0-9_-]+$/.test(alias)) {
        return NextResponse.json(
          { error: 'Alias can only contain letters, numbers, hyphens, and underscores' },
          { status: 400 }
        );
      }
    }

    const linkData = linkStorage.createLink(url, alias);
    
    // Get base URL - use production domain if available, otherwise use request origin
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
    const shortUrl = `${baseUrl}/${linkData.shortCode}`;

    return NextResponse.json({
      success: true,
      shortUrl,
      shortCode: linkData.shortCode,
      originalUrl: linkData.originalUrl,
      alias: linkData.alias,
      createdAt: linkData.createdAt,
      baseUrl, // Return baseUrl for client-side use
    });
  } catch (error: any) {
    if (error.message === 'Alias already exists') {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create short link' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const links = linkStorage.getAllLinks();
  return NextResponse.json({ links });
}

