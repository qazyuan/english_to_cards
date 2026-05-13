/**
 * Types for https://api.rss2json.com/v1/api.json (BBC News World RSS).
 * @see https://rss2json.com/docs/api
 */

export interface Rss2JsonEnclosure {
  link?: string
  type?: string
  length?: number
  thumbnail?: string
}

/** Single article in the `items` array */
export interface RssNewsItem {
  title: string
  pubDate: string
  link: string
  guid: string
  author: string
  /** May be empty string when no image */
  thumbnail: string
  description: string
  content: string
  enclosure: Rss2JsonEnclosure
  categories: string[]
}

export interface Rss2JsonFeed {
  url: string
  title: string
  link: string
  author: string
  description: string
  image: string
}

export interface Rss2JsonApiResponse {
  status: string
  feed: Rss2JsonFeed
  items: RssNewsItem[]
}
