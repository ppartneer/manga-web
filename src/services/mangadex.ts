import { Manga, MangaDexResponse, MangaDexManga, Chapter, MangaDexChapter } from '../types/manga';

const API_BASE_URL = 'https://api.mangadex.org';
const COVER_BASE_URL = 'https://uploads.mangadex.org/covers';

export const fetchMangaList = async (params: string = ''): Promise<Manga[]> => {
  // Always prioritize Russian translations and results, and include common content ratings
  const defaultParams = 'availableTranslatedLanguage[]=ru&includes[]=cover_art&includes[]=author&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica';
  const response = await fetch(`${API_BASE_URL}/manga?${defaultParams}&${params}`);
  const json: MangaDexResponse<MangaDexManga[]> = await response.json();
  
  return json.data.map(transformManga);
};

export const fetchMangaDetails = async (id: string): Promise<Manga> => {
  const response = await fetch(`${API_BASE_URL}/manga/${id}?includes[]=cover_art&includes[]=author`);
  const json: MangaDexResponse<MangaDexManga> = await response.json();
  
  return transformManga(json.data);
};

export const fetchMangaChapters = async (mangaId: string, limit: number = 100, offset: number = 0): Promise<{ chapters: Chapter[], total: number }> => {
  // Prioritize Russian (ru) then English (en)
  const response = await fetch(
    `${API_BASE_URL}/manga/${mangaId}/feed?translatedLanguage[]=ru&translatedLanguage[]=en&limit=${limit}&offset=${offset}&order[chapter]=desc&includeExternalUrl=0`
  );
  const json: MangaDexResponse<MangaDexChapter[]> = await response.json();
  
  return {
    chapters: json.data.map(c => ({
      id: c.id,
      title: c.attributes.title || `Глава ${c.attributes.chapter}`,
      chapterNum: c.attributes.chapter,
      volumeNum: c.attributes.volume,
      publishAt: c.attributes.publishAt,
      pages: c.attributes.pages,
    })),
    total: json.total || 0
  };
};

export const fetchChapterPages = async (chapterId: string): Promise<{ hash: string, data: string[] }> => {
  const response = await fetch(`${API_BASE_URL}/at-home/server/${chapterId}`);
  const json = await response.json();
  return {
    hash: json.chapter.hash,
    data: json.chapter.data,
  };
};

const transformManga = (m: MangaDexManga): Manga => {
  const coverFileName = m.relationships.find(r => r.type === 'cover_art')?.attributes?.fileName;
  const authors = m.relationships
    .filter(r => r.type === 'author')
    .map(r => r.attributes?.name || '')
    .filter(Boolean);

  return {
    id: m.id,
    title: m.attributes.title.ru || m.attributes.title.en || Object.values(m.attributes.title)[0],
    description: m.attributes.description.ru || m.attributes.description.en || Object.values(m.attributes.description)[0],
    coverFileName,
    status: m.attributes.status,
    year: m.attributes.year,
    authors,
    tags: m.attributes.tags.map(t => t.attributes.name.en),
    rating: m.attributes.contentRating,
  };
};

export const getCoverUrl = (mangaId: string, fileName?: string) => 
  fileName ? `${COVER_BASE_URL}/${mangaId}/${fileName}.256.jpg` : 'https://placehold.co/400x600/121217/FFFFFF?text=No+Cover';

export const getPageUrl = (hash: string, fileName: string) => 
  `https://uploads.mangadex.org/data/${hash}/${fileName}`;
