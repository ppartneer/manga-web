export interface Manga {
  id: string;
  title: string;
  description: string;
  coverFileName?: string;
  status: string;
  year?: number;
  authors: string[];
  tags: string[];
  rating?: string;
}

export interface Chapter {
  id: string;
  title: string;
  chapterNum: string;
  volumeNum: string;
  publishAt: string;
  pages: number;
}

export interface MangaDexResponse<T> {
  result: 'ok' | 'error';
  response: 'collection' | 'entity';
  data: T;
  limit?: number;
  offset?: number;
  total?: number;
}

export interface MangaDexManga {
  id: string;
  type: 'manga';
  attributes: {
    title: { [key: string]: string };
    description: { [key: string]: string };
    status: string;
    year: number;
    contentRating: string;
    tags: Array<{
      id: string;
      attributes: {
        name: { en: string };
      };
    }>;
  };
  relationships: Array<{
    id: string;
    type: 'author' | 'artist' | 'cover_art';
    attributes?: {
      fileName?: string;
      name?: string;
    };
  }>;
}

export interface MangaDexChapter {
  id: string;
  type: 'chapter';
  attributes: {
    title: string;
    chapter: string;
    volume: string;
    translatedLanguage: string;
    publishAt: string;
    pages: number;
  };
}
