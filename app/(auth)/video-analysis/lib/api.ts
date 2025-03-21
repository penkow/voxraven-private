import { FilterSettings, SearchResponse } from './types';

const API_ENDPOINTS = {
  SEARCH: 'http://localhost:8001/search',
  WEBHOOK: 'http://n8n.selfhost.penkow.com/webhook/1678f755-1999-44f9-918f-e33728648565'
} as const;

export async function searchVideos(filters: FilterSettings): Promise<SearchResponse> {
  const response = await fetch(API_ENDPOINTS.SEARCH, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: filters.topic,
      min_views: filters.minViews,
      min_results: filters.minVideoCount,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch video results');
  }

  return response.json();
}

export async function generateResults(topic: string): Promise<SearchResponse> {
  const response = await fetch(API_ENDPOINTS.WEBHOOK, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input: topic }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate results');
  }

  return response.json();
} 