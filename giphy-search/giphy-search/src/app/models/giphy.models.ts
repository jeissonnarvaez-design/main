export interface GiphyImage {
  url: string;
  width: string;
  height: string;
  webp?: string;
}

export interface Gif {
  id: string;
  title: string;
  url: string;
  username: string;
  images: {
    fixed_width: GiphyImage;
    original: GiphyImage;
  };
}

export interface GiphyPagination {
  total_count: number;
  count: number;
  offset: number;
}

export interface GiphyResponse {
  data: Gif[];
  pagination: GiphyPagination;
  meta: { status: number; msg: string; response_id: string };
}

export interface SearchParams {
  q: string;
  limit?: number;
  offset?: number;
  rating?: 'g' | 'pg' | 'pg-13' | 'r';
  lang?: string;
}

export type HttpClientKind = 'axios' | 'fetch';
