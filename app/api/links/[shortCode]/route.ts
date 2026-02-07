import { NextRequest, NextResponse } from 'next/server';
import { linkStorage } from '@/lib/storage';

export async function GET(
  request: NextRequest,
  { params }: { params: { shortCode: string } }
) {
  const { shortCode } = params;
  const link = linkStorage.getLink(shortCode);

  if (!link) {
    return NextResponse.json(
      { error: 'Link not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    link: {
      id: link.id,
      originalUrl: link.originalUrl,
      shortCode: link.shortCode,
      alias: link.alias,
      createdAt: link.createdAt,
      clicks: link.clicks,
      clickHistory: link.clickHistory,
    },
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { shortCode: string } }
) {
  const { shortCode } = params;
  const deleted = linkStorage.deleteLink(shortCode);

  if (!deleted) {
    return NextResponse.json(
      { error: 'Link not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}

