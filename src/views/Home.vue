<template>
  <section class="space-y-6">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
        极简资讯阅读器
      </h1>
      <p class="text-sm text-gray-500 dark:text-gray-400">
        BBC News · World — live RSS via rss2json，点击卡片阅读全文。
      </p>
    </header>

    <div v-if="loading" class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <article
        v-for="n in 8"
        :key="n"
        class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <div class="aspect-[16/9] animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" />
        <div class="space-y-3 p-5">
          <div
            class="h-5 w-11/12 animate-pulse rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700"
          />
          <div
            class="h-3 w-24 animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700"
          />
          <div
            class="h-3 w-full animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700"
          />
        </div>
      </article>
    </div>

    <FetchErrorAlert v-else-if="errorMessage" :message="errorMessage" @reload="reloadFeed" />

    <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <article
        v-for="item in items"
        :key="item.guid"
        role="button"
        tabindex="0"
        class="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800"
        @click="openArticle(item)"
        @keydown.enter.prevent="openArticle(item)"
        @keydown.space.prevent="openArticle(item)"
      >
        <div class="relative aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-900">
          <img
            v-if="coverUrl(item)"
            :src="coverUrl(item)"
            :alt="item.title"
            class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div
            v-else
            class="flex h-full w-full items-center justify-center text-xs font-medium text-gray-400 dark:text-gray-500"
          >
            No image
          </div>
        </div>
        <div class="p-5">
          <time
            class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
            :datetime="item.pubDate"
          >
            {{ formatPubDate(item.pubDate) }}
          </time>
          <h2 class="mt-2 line-clamp-3 text-lg font-semibold leading-snug text-gray-900 dark:text-gray-100">
            {{ item.title }}
          </h2>
          <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {{ item.description }}
          </p>
          <span
            class="mt-4 inline-flex items-center text-sm font-medium text-indigo-600 transition group-hover:text-indigo-500 dark:text-indigo-400 dark:group-hover:text-indigo-300"
          >
            阅读全文
            <span class="ml-1 transition-transform group-hover:translate-x-0.5">→</span>
          </span>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter, type HistoryState } from 'vue-router'
import FetchErrorAlert from '../components/FetchErrorAlert.vue'
import type { Rss2JsonApiResponse, RssNewsItem } from '../types/post'
import { cacheArticleForDetail } from '../utils/articleCache'

const RSS_JSON_URL =
  'https://api.rss2json.com/v1/api.json?rss_url=http://feeds.bbci.co.uk/news/world/rss.xml'

const router = useRouter()
const items = ref<RssNewsItem[]>([])
const loading = ref<boolean>(false)
const errorMessage = ref<string>('')

const coverUrl = (item: RssNewsItem): string => {
  const t = item.thumbnail?.trim()
  if (t) {
    return t
  }
  return item.enclosure?.thumbnail?.trim() ?? ''
}

const formatPubDate = (pubDate: string): string => {
  const normalized = pubDate.includes('T') ? pubDate : pubDate.replace(' ', 'T')
  const d = new Date(normalized)
  if (Number.isNaN(d.getTime())) {
    return pubDate
  }
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d)
}

const fetchFeed = async (): Promise<void> => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(RSS_JSON_URL)
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }
    const data = (await response.json()) as Rss2JsonApiResponse
    if (data.status !== 'ok' || !Array.isArray(data.items)) {
      throw new Error('RSS 接口返回异常')
    }
    items.value = data.items
  } catch (error) {
    console.error(error)
    errorMessage.value = '资讯加载失败，请稍后重试。'
  } finally {
    loading.value = false
  }
}

const openArticle = (article: RssNewsItem): void => {
  cacheArticleForDetail(article)
  void router.push({
    name: 'post-detail',
    query: { g: article.guid },
    state: { article } as unknown as HistoryState,
    force: true,
  })
}

onMounted(() => {
  void fetchFeed()
})

const reloadFeed = (): void => {
  void fetchFeed()
}
</script>
