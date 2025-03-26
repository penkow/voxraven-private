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

export interface PagedSearch {
  query?: string;
  page?: number;
  pageSize?: number;
}

export interface VideoInfo {
  id: string;
  title: string;
  description: string;
  thumbnails: any[];
  duration: number;
  view_count: number;
  published_at: string;
  channel_title: string;
  like_count: number;
  comment_count: number;
  tags: string[];
  category_id: string;
  video_id: string;
  url: string;
}
export interface VideoThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface ProjectData {
  project: Project;
  videosData: VideoData[];
}

export interface Project {
  id: string;
  title: string;
  videos: string[];
}

export interface VideoData {
  info: VideoInfo;
  summary: string;
  targetAudience: string;
  painPoints: string;
  empathyMap: string;
  commentsAnalysis: string;
}
