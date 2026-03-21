import { Manga, MangaDexResponse, MangaDexManga, Chapter, MangaDexChapter } from '../types/manga';

const API_BASE_URL = '/mangadex-api';
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

export const fetchMangaChapters = async (mangaId: string, limit: number = 500, offset: number = 0): Promise<{ chapters: Chapter[], total: number }> => {
  // First fetch to get total & first batch
  const response = await fetch(
    `${API_BASE_URL}/manga/${mangaId}/feed?translatedLanguage[]=ru&limit=${limit}&offset=${offset}&order[chapter]=desc&includeExternalUrl=0`
  );
  const json: MangaDexResponse<MangaDexChapter[]> = await response.json();
  let allData = json.data;
  const total = json.total || 0;

  // Automatically fetch remaining chapters if there are more than the limit
  if (total > limit) {
    const promises = [];
    // Cap at 1500 chapters total to avoid MangaDex rate limiting (5 req/sec threshold)
    for (let currentOffset = limit; currentOffset < Math.min(total, 1500); currentOffset += limit) {
      promises.push(
        fetch(`${API_BASE_URL}/manga/${mangaId}/feed?translatedLanguage[]=ru&limit=${limit}&offset=${currentOffset}&order[chapter]=desc&includeExternalUrl=0`)
          .then(res => res.json())
      );
    }
    try {
      const results = await Promise.all(promises);
      results.forEach(res => {
        if (res.data) allData = allData.concat(res.data);
      });
    } catch (e) {
      console.warn("Some chapter pages failed to load due to rate limiting");
    }
  }
  
  return {
    chapters: allData.map(c => ({
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

export const fetchChapterPages = async (chapterId: string): Promise<{ baseUrl: string, hash: string, data: string[] }> => {
  const response = await fetch(`${API_BASE_URL}/at-home/server/${chapterId}`);
  const json = await response.json();
  return {
    baseUrl: json.baseUrl,
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

export const getCoverUrl = (mangaId: string, fileName?: string) => {
  if (!fileName) return 'https://placehold.co/400x600/121217/FFFFFF?text=No+Cover';
  return `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.256.jpg`;
};

export const getPageUrl = (baseUrl: string, hash: string, fileName: string) => {
  return `${baseUrl}/data/${hash}/${fileName}`;
};
