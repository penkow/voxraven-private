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
  projectId?: string;
  transcript?: string;
  summary?: string;
  targetAudience?: string;
  painPoints?: string;
  empathyMap?: string;
  commentsAnalysis?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  title: string;
  videos: VideoInfo[];
  synthesis: Synthesis[];
  createdAt: string;
  updatedAt: string;
}

export interface Synthesis {
  id: string;
  synthesis: string;
  createdAt: string;
  updatedAt: string;
  projectId: string;
} 