import { SearchResponse } from "../video-analysis/lib/types";
import { PagedSearch } from "./types";

const API_ENDPOINTS = {
  SEARCH: "http://localhost:3000/videoInfo",
  WEBHOOK:
    "http://n8n.selfhost.penkow.com/webhook/1678f755-1999-44f9-918f-e33728648565",
} as const;

// const d = {
//   title:
//     "An Ace of a Spade #spade #repair #restoration #handtools #spade #elm #ash #oak #beech",
//   url: "https://www.youtube.com/watch?v=dPQKy5hlGzA",
//   views: "1833117",
//   likes: "129481",
//   comments: "1027",
//   upload_date: "2025-03-13T16:21:32Z",
//   short_description: "",
//   hq_thumbnail_url: {
//     url: "https://i.ytimg.com/vi/dPQKy5hlGzA/maxresdefault.jpg",
//     width: 1280,
//     height: 720,
//   },
// };

interface VideoThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface FoundVideo {
  title: string;
  description: string;
  published_at: string;
  channel_title: string;
  view_count: string;
  like_count: string;
  comment_count: string;
  duration: string;
  tags: string[];
  thumbnails: VideoThumbnail[];
  category_id: string;
  video_id: string;
  url: string;
}

export async function searchVideos(
  filters: PagedSearch
): Promise<FoundVideo[]> {
  const response = await fetch(API_ENDPOINTS.SEARCH, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: filters.query,
      page: filters.page || 1,
      page_size: filters.pageSize || 10,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch video results");
  }

  const data = await response.json();

  return data.videos;
}

export async function generateResults(topic: string): Promise<SearchResponse> {
  const response = await fetch(API_ENDPOINTS.WEBHOOK, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ input: topic }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate results");
  }

  return response.json();
}
