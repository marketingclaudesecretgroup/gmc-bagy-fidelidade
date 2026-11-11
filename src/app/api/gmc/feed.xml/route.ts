import { NextResponse } from 'next/server';
import { GMCFeedGenerator } from '@/lib/services/gmc-feed-generator';

export const dynamic = 'force-dynamic';

export async function GET() {
  const xmlContent = GMCFeedGenerator.generateXmlFeed();

  return new NextResponse(xmlContent, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=180, s-maxage=300',
      'X-Robots-Tag': 'noindex'
    }
  });
}
