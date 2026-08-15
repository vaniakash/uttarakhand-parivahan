import { NextResponse } from "next/server";
import { Song } from "@/lib/songs";

export async function GET() {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const PLAYLIST_ID = process.env.YOUTUBE_PLAYLIST_ID;

  if (!API_KEY || !PLAYLIST_ID) {
    return NextResponse.json({ error: "Missing API Configuration" }, { status: 500 });
  }

  try {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${PLAYLIST_ID}&key=${API_KEY}`;
    const response = await fetch(url, { next: { revalidate: 60 } }); // Cache for 60 seconds
    
    if (!response.ok) {
      throw new Error(`YouTube API returned ${response.status}`);
    }

    const data = await response.json();
    
    const playlist: Song[] = data.items.map((item: any) => {
      const snippet = item.snippet;
      // Handle potential missing thumbnails
      const thumbnail = snippet.thumbnails?.high?.url || 
                        snippet.thumbnails?.medium?.url || 
                        snippet.thumbnails?.default?.url || 
                        "";
      
      return {
        id: snippet.resourceId.videoId,
        title: snippet.title,
        artist: snippet.videoOwnerChannelTitle || "Unknown Artist",
        thumbnail: thumbnail
      };
    }).filter((song: Song) => song.title !== "Private video" && song.title !== "Deleted video");

    return NextResponse.json({ playlist });
  } catch (error) {
    console.error("Error fetching playlist:", error);
    return NextResponse.json({ error: "Failed to fetch playlist" }, { status: 500 });
  }
}
