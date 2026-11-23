/**
 * AniNexus Official TypeScript / JavaScript Client SDK
 * 
 * Lightweight, zero-dependency REST API client for the AniNexus Platform.
 * Features automatic error handling, rate-limit awareness, and full TypeScript types.
 * 
 * @author Shouvik Das
 * @license MIT
 */

export interface AniNexusOptions {
  baseUrl?: string;
  timeout?: number;
}

export interface ApiResponse<T = any> {
  status: string | number;
  data: T;
  timestamp?: string;
  rateLimit?: {
    limit: number;
    remaining: number;
    reset: number;
  };
}

export class AniNexus {
  private baseUrl: string;
  private timeout: number;

  constructor(options: AniNexusOptions = {}) {
    this.baseUrl = (options.baseUrl || 'https://ani-nexus.onrender.com/api/v1').replace(/\/$/, '');
    this.timeout = options.timeout || 10000;
  }

  private async request<T = any>(endpoint: string, params: Record<string, any> = {}): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`);
    
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        url.searchParams.append(key, String(val));
      }
    });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'AniNexus-Client-SDK/1.0'
        },
        signal: controller.signal
      });

      clearTimeout(timer);

      const rateLimitHeader = response.headers.get('x-ratelimit-remaining');
      const rateLimitLimit = response.headers.get('x-ratelimit-limit');
      const rateLimitReset = response.headers.get('x-ratelimit-reset');

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('AniNexus Rate Limit Exceeded: Maximum 90 requests per minute allowed.');
        }
        if (response.status === 410) {
          throw new Error('AniNexus Resource Expired (410 Gone): Requested award edition is outside the 5-year rolling retention policy.');
        }
        throw new Error(`AniNexus API Error [HTTP ${response.status}]: ${response.statusText}`);
      }

      const json = await response.json();

      return {
        ...json,
        rateLimit: rateLimitHeader ? {
          limit: Number(rateLimitLimit) || 90,
          remaining: Number(rateLimitHeader) || 0,
          reset: Number(rateLimitReset) || 0
        } : undefined
      };
    } catch (err: any) {
      clearTimeout(timer);
      if (err.name === 'AbortError') {
        throw new Error(`AniNexus Request Timeout: Exceeded ${this.timeout}ms limit.`);
      }
      throw err;
    }
  }

  // --- Master Franchise & Timelines ---
  async getSeries(slug: string) {
    return this.request(`/series/${slug}`);
  }

  async getTimeline(slug: string) {
    return this.request(`/series/${slug}/timeline`);
  }

  async getEpisodes(slug: string) {
    return this.request(`/series/${slug}/episodes`);
  }

  async getSeriesCharacters(slug: string) {
    return this.request(`/series/${slug}/characters`);
  }

  async getSeriesStaff(slug: string) {
    return this.request(`/series/${slug}/staff`);
  }

  // --- Granular Anime & Languages ---
  async getAnime(idOrSlug: string | number) {
    return this.request(`/anime/${idOrSlug}`);
  }

  async getLanguages(idOrSlug: string | number) {
    return this.request(`/anime/${idOrSlug}/languages`);
  }

  // --- Leaderboards & Seasons ---
  async getTop(type: 'trending' | 'popular' | 'rated' | 'movies' | 'airing' = 'trending', limit = 20) {
    return this.request('/top', { type, limit });
  }

  async getSeasonalNow(limit = 20) {
    return this.request('/seasons/now', { limit });
  }

  async getSeasonalUpcoming(limit = 20) {
    return this.request('/seasons/upcoming', { limit });
  }

  async getSeasonalArchive(year: number, season: 'winter' | 'spring' | 'summer' | 'fall', limit = 20) {
    return this.request(`/seasons/${year}/${season}`, { limit });
  }

  // --- Broadcast Calendar & Media ---
  async getSchedule() {
    return this.request('/schedule');
  }

  async getNews(limit = 20) {
    return this.request('/news', { limit });
  }

  async getArticles(limit = 20) {
    return this.request('/articles', { limit });
  }

  async getTrailers(limit = 20) {
    return this.request('/trailers', { limit });
  }

  // --- Awards Vault (5-Year Rolling) ---
  async getAwards() {
    return this.request('/awards');
  }

  async getAwardsLatest() {
    return this.request('/awards/latest');
  }

  async getAwardsYear(year: number) {
    return this.request(`/awards/${year}`);
  }

  // --- Characters & Staff ---
  async getCharacter(idOrSlug: string | number) {
    return this.request(`/characters/${idOrSlug}`);
  }

  async searchCharacters(query: string) {
    return this.request('/characters/search', { q: query });
  }

  async getStaff(idOrSlug: string | number) {
    return this.request(`/staff/${idOrSlug}`);
  }

  async searchStaff(query: string) {
    return this.request('/staff/search', { q: query });
  }

  // --- Search & Filters ---
  async search(query: string) {
    return this.request('/search', { q: query });
  }

  async getGenres() {
    return this.request('/genres');
  }

  async filter(params: { genre?: string; year?: number; format?: string; limit?: number }) {
    return this.request('/filter', params);
  }

  // --- Manga, Manhwa & Light Novels (Vault 2) ---
  async getMangaList(params: { format?: string; genre?: string; sort?: string; page?: number; limit?: number } = {}) {
    return this.request('/manga', params);
  }

  async getMangaTop(type: 'trending' | 'popular' | 'rated' | 'reading' = 'popular', limit = 20) {
    return this.request('/manga/top', { type, limit });
  }

  async getMangaTypes() {
    return this.request('/manga/types');
  }

  async getManhwa(limit = 20) {
    return this.request('/manga/manhwa', { limit });
  }

  async getManga(idOrSlug: string | number) {
    return this.request(`/manga/${idOrSlug}`);
  }

  async getMangaAdaptations(idOrSlug: string | number) {
    return this.request(`/manga/${idOrSlug}/adaptations`);
  }

  async getMangaChapters(idOrSlug: string | number, params: { limit?: number; page?: number; language?: string } = {}) {
    return this.request(`/manga/${idOrSlug}/chapters`, params);
  }

  async getSeriesAdaptations(slug: string) {
    return this.request(`/series/${slug}/adaptations`);
  }
}

export default AniNexus;
