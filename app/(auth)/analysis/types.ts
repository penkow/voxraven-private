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

