import type { RssNewsItem } from '../types/post'

const STORAGE_PREFIX = 'minimal-reader:rss-article:'

export function articleStorageKey(guid: string): string {
  return `${STORAGE_PREFIX}${encodeURIComponent(guid)}`
}

export function cacheArticleForDetail(article: RssNewsItem): void {
  try {
    sessionStorage.setItem(articleStorageKey(article.guid), JSON.stringify(article))
  } catch (e) {
    console.warn('[reader] sessionStorage unavailable', e)
  }
}

export function loadArticleFromCache(guid: string): RssNewsItem | null {
  try {
    const raw = sessionStorage.getItem(articleStorageKey(guid))
    if (!raw) return null
    const parsed = JSON.parse(raw) as RssNewsItem
    if (parsed && typeof parsed.title === 'string' && typeof parsed.link === 'string') {
      return parsed
    }
  } catch {
    /* ignore */
  }
  return null
}
