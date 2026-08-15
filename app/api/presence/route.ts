import { NextResponse } from 'next/server';

// In-memory store for active sessions (Works perfectly in dev and single-instance deployments)
// Map of sessionId -> lastSeenTimestamp
const activeSessions = new Map<string, number>();

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json();
    
    if (sessionId) {
      activeSessions.set(sessionId, Date.now());
    }

    // Clean up stale sessions (not seen in the last 10 seconds)
    const now = Date.now();
    for (const [id, lastSeen] of activeSessions.entries()) {
      if (now - lastSeen > 10000) {
        activeSessions.delete(id);
      }
    }

    return NextResponse.json({ liveCount: activeSessions.size });
  } catch (error) {
    return NextResponse.json({ liveCount: Math.max(1, activeSessions.size) });
  }
}
