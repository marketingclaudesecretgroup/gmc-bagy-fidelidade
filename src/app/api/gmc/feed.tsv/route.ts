import { NextResponse } from 'next/server';
import { GMCFeedGenerator } from '@/lib/services/gmc-feed-generator';

export const dynamic = 'force-dynamic';

export async function GET() {
  const tsvContent = GMCFeedGenerator.generateTsvFeed();

  return new NextResponse(tsvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/tab-separated-values; charset=utf-8',
      'Content-Disposition': 'inline; filename="gmc_loyalty_feed.tsv"',
      'Cache-Control': 'public, max-age=180, s-maxage=300'
    }
  });
}
