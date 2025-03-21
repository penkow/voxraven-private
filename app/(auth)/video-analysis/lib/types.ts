export interface VideoResult {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  videoUrl: string;
  viewerNeeds: ViewerNeed[];
}

export interface ViewerNeed {
  need: string;
  quotes: string[];
}

export interface Comment {
  text: string;
  author: string;
  likes: number;
}

export interface ProgressMessage {
  start: number;
  end: number;
  message: string;
}

export interface FilterSettings {
  topic: string;
  minViews: number;
  minVideoCount: number;
}

export interface SearchResponse {
  videos: VideoResult[];
  // Add any other response fields here
} 