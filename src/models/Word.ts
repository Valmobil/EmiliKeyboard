export interface Word {
  id: string;
  text: string;
  originalText: string;
  imageUrl: string;
  imageAttribution?: string;
  createdAt: string;
}

export interface ImageResult {
  id: string;
  url: string;
  thumbnailUrl: string;
  title: string;
  attribution: string;
}
