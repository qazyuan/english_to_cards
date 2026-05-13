<template>
  <section class="space-y-6">
    <div class="flex flex-wrap items-center gap-3">
      <button
        type="button"
        class="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
        @click="goHome"
      >
        ← 返回
      </button>
      <RouterLink
        v-if="errorMessage"
        to="/"
        class="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
      >
        回到首页
      </RouterLink>
    </div>

    <div
      v-if="hydrating"
      class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      <div class="space-y-4 animate-pulse">
        <div class="h-10 w-3/4 rounded-lg bg-gray-200 dark:bg-gray-700" />
        <div class="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700" />
        <div class="h-32 w-full rounded-lg bg-gray-100 dark:bg-gray-800" />
      </div>
    </div>

    <div
      v-else-if="errorMessage"
      class="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100"
    >
      <p class="font-medium">{{ errorMessage }}</p>
      <p class="mt-2 text-sm text-amber-800/90 dark:text-amber-200/80">
        请从首页点击新闻进入。若地址栏带有 <code class="rounded bg-white/60 px-1 dark:bg-gray-900/40">?g=</code>
        参数，刷新后仍可恢复（同一会话内）。直接打开 <code class="rounded bg-white/60 px-1 dark:bg-gray-900/40">/post</code> 则无法加载。
      </p>
    </div>

    <template v-else-if="post">
      <article class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div v-if="heroImage" class="aspect-[21/9] max-h-72 w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
          <img :src="heroImage" :alt="post.title" class="h-full w-full object-cover" loading="lazy" />
        </div>
        <div class="p-8">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
            <time :datetime="post.pubDate">{{ formattedPubDate }}</time>
            <span class="mx-2 text-gray-300 dark:text-gray-600">·</span>
            <span>BBC News · World</span>
          </p>
          <h1 class="mt-3 text-3xl font-black leading-tight text-gray-900 dark:text-gray-100">
            {{ post.title }}
          </h1>
          <a
            :href="post.link"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-4 inline-flex text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Read full story on BBC →
          </a>
          <div class="mt-6 h-px w-full bg-gray-100 dark:bg-gray-700" />
          <div
            class="mt-6 text-lg leading-relaxed text-gray-700 dark:text-gray-300"
            :class="articleLooksLikeHtml ? 'prose prose-gray max-w-none dark:prose-invert' : 'whitespace-pre-line'"
            v-html="articleDisplayHtml"
          />
        </div>
      </article>

      <div class="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/40">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
            ✨ 基于本篇 BBC 英文报道生成精读笔记（Groq 流式输出）。
          </p>
          <div class="flex flex-wrap gap-3">
            <button
              type="button"
              class="rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-bold text-white shadow transition-all hover:bg-gray-800 active:scale-95 disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
              :disabled="notesStreaming || !groqApiKeyConfigured"
              @click="runGroqReadingNotes"
            >
              {{ notesStreamText.length > 0 ? '重新生成' : '开始精读总结' }}
            </button>

            <button
              v-if="!notesStreaming && notesStreamText.length > 0"
              type="button"
              class="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-bold text-gray-900 shadow-sm transition-all hover:bg-gray-50 active:scale-95 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
              :disabled="isExporting"
              @click="downloadAsImage"
            >
              {{ isExporting ? '图片合成中...' : '📥 存图发小红书' }}
            </button>
          </div>
        </div>
        <p v-if="!groqApiKeyConfigured" class="mt-3 text-xs text-amber-700 dark:text-amber-400">
          请在 <code class="rounded bg-white/80 px-1 dark:bg-gray-950/50">.env</code> 中配置
          <code class="rounded bg-white/80 px-1 dark:bg-gray-950/50">VITE_GROQ_API_KEY</code> 后重启开发服务。
        </p>
        <p v-if="notesError" class="mt-3 text-sm text-red-600 dark:text-red-400">{{ notesError }}</p>
      </div>

      <div v-if="showNotesCard" class="overflow-x-auto pb-10">
        <div
          ref="exportCardRef"
          class="relative mx-auto flex min-h-[960px] w-[720px] flex-col bg-[#FAFAFA] text-gray-900 shadow-xl"
        >
          <div class="h-2 w-full bg-gray-900" />

          <div class="flex flex-grow flex-col px-12 pb-12 pt-14">
            <div class="mb-8 border-b-2 border-gray-200 pb-6">
              <h2 class="text-[40px] font-black leading-tight tracking-tight text-gray-900">
                {{ truncatedTitle }}
              </h2>
              <div class="mt-5 flex flex-wrap items-center gap-3">
                <span
                  class="rounded bg-gray-100 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-600"
                  >BBC World</span
                >
                <span class="font-mono text-[11px] uppercase tracking-widest text-gray-400">{{ formattedPubDate }}</span>
              </div>
            </div>

            <div class="flex-grow">
              <div v-if="notesTtfbLoading && notesStreamText.length === 0" class="mt-4 space-y-6">
                <div class="h-6 w-1/3 animate-pulse rounded bg-gray-200" />
                <div class="h-4 w-full animate-pulse rounded bg-gray-100" />
              </div>

              <div v-show="notesStreamText.length > 0" class="prose prose-gray prose-lg max-w-none 
         prose-h3:text-xl prose-h3:font-black prose-h3:text-gray-900 prose-h3:mt-8 prose-h3:mb-3
         prose-p:text-gray-700 prose-p:leading-loose prose-p:tracking-wide
         prose-strong:text-gray-900 prose-strong:font-black
         prose-ul:list-outside prose-ul:ml-4 prose-ul:mt-1 prose-ul:mb-6
         prose-li:pl-1 prose-li:m-0 prose-li:marker:text-gray-400" v-html="parsedNotes"></div>
            </div>

            <div class="mt-16 flex items-center justify-between border-t border-gray-200 pt-8">
              <div class="flex items-center gap-4">
                <img
                  :src="avatarUrl"
                  alt="Avatar"
                  class="h-14 w-14 rounded-full border-2 border-white object-cover shadow-sm"
                />
                <div>
                  <p class="text-2xl font-black tracking-tight text-gray-900">Yvonne 陪你学英语</p>
                  <p class="mt-0.5 text-[11px] font-bold uppercase tracking-widest text-gray-400">Daily Study Notes</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-[10px] font-bold uppercase leading-relaxed tracking-[0.2em] text-gray-300">
                  Focused · Consistent · Growing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import html2canvas from 'html2canvas'
import type { RssNewsItem } from '../types/post'
import { loadArticleFromCache } from '../utils/articleCache'

import avatarUrl from '../assets/avatar.png'

const GROQ_CHAT_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'


const READING_SYSTEM_PROMPT = `你是一个专业的技术英语导师。请针对提供的英文段落，生成一张适合手机端阅读的双语精读卡片。

【排版极其重要】：请严格按照以下格式输出，绝对不能漏掉任何一个 ### 标记！

### 📖 原文段落
（请直接把输入的英文原样输出一遍，不加任何修改）

### 🇨🇳 中文翻译
（请提供地道、信达雅的高质量中文翻译，语言要优美）

### 💡 核心词汇
（请提取3-5个核心词汇。为了防止排版错乱，每个单词必须作为独立的 ### 标题输出！）

### 1. 单词 [音标]：中文释义
- 原句：文中原句
- 解析：深度用法解析

### 2. 单词 [音标]：中文释义
- 原句：文中原句
- 解析：深度用法解析`

const router = useRouter()
const route = useRoute()

const post = ref<RssNewsItem | null>(null)
const hydrating = ref(true)
const errorMessage = ref('')

const notesRequested = ref(false)
const notesStreamText = ref('')
const notesStreaming = ref(false)
const notesTtfbLoading = ref(false)
const notesError = ref('')
const isExporting = ref(false)
const exportCardRef = ref<HTMLElement | null>(null)
const parsedNotes = ref('')
let notesAbort: AbortController | null = null

const groqApiKey = computed(() => import.meta.env.VITE_GROQ_API_KEY?.trim() ?? '')
const groqApiKeyConfigured = computed(() => groqApiKey.value.length > 0)
const showNotesCard = computed(() => notesRequested.value)

watch(
  notesStreamText,
  (md) => {
    try {
      const html = marked.parse(md, { async: false })
      parsedNotes.value = typeof html === 'string' ? html : String(html)
    } catch {
      parsedNotes.value = ''
    }
  },
  { immediate: true },
)

const truncatedTitle = computed(() => {
  if (!post.value?.title) return 'READING NOTES'
  return post.value.title.length > 48 ? `${post.value.title.slice(0, 48)}…` : post.value.title
})

const formattedPubDate = computed(() => {
  const raw = post.value?.pubDate
  if (!raw) return ''
  const normalized = raw.includes('T') ? raw : raw.replace(' ', 'T')
  const d = new Date(normalized)
  if (Number.isNaN(d.getTime())) return raw
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(d)
})

const heroImage = computed(() => {
  const p = post.value
  if (!p) return ''
  const t = p.thumbnail?.trim()
  if (t) return t
  return p.enclosure?.thumbnail?.trim() ?? ''
})

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

const articlePlain = computed(() => {
  const p = post.value
  if (!p) return ''
  const raw = (p.content || p.description || '').trim()
  return raw
})

const articleLooksLikeHtml = computed(() => /<\/?[a-z][\s\S]*>/i.test(articlePlain.value))

const articleDisplayHtml = computed(() => {
  const raw = articlePlain.value
  if (!raw) return ''
  if (articleLooksLikeHtml.value) {
    return raw
  }
  const escaped = raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
  return escaped.replace(/\n/g, '<br />')
})

function buildUserPromptForGroq(p: RssNewsItem): string {
  const bodyText = stripHtml((p.content || p.description || '').trim())
  return [
    '【体裁】BBC News World 英文报道（RSS）',
    '',
    `【标题】${p.title}`,
    `【发布时间】${p.pubDate}`,
    `【原文链接】${p.link}`,
    '',
    '【正文 / 摘要】',
    bodyText || '(正文为空，请仅根据标题与链接做有限推断，并明确说明信息不足。)',
  ].join('\n')
}

async function consumeSseStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  signal: AbortSignal,
  onDelta: (s: string) => void,
  onFirstNetworkChunk: () => void,
): Promise<void> {
  const decoder = new TextDecoder()
  let buffer = ''
  let sawChunk = false

  const processLine = (line: string): void => {
    const trimmed = line.trim()
    if (!trimmed.startsWith('data:')) return
    const data = trimmed.slice(5).trim()
    if (data === '[DONE]') return
    try {
      const parsed = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }> }
      const c = parsed.choices?.[0]?.delta?.content
      if (c) onDelta(c)
    } catch {
      /* ignore partial JSON */
    }
  }

  while (true) {
    const { done, value } = await reader.read()
    if (signal.aborted) {
      await reader.cancel().catch(() => {})
      throw new DOMException('Aborted', 'AbortError')
    }
    if (done) break
    if (!sawChunk && value !== undefined && value.byteLength > 0) {
      sawChunk = true
      onFirstNetworkChunk()
    }
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) processLine(line)
  }
  if (buffer.trim()) {
    for (const line of buffer.split('\n')) processLine(line)
  }
}

const downloadAsImage = async (): Promise<void> => {
  if (!exportCardRef.value) return
  isExporting.value = true
  try {
    const canvas = await html2canvas(exportCardRef.value, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#FAFAFA',
      width: 720,
    })
    const link = document.createElement('a')
    link.download = `Yvonne_English_Notes_${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch {
    alert('存图失败，请重试')
  } finally {
    isExporting.value = false
  }
}

const abortNotes = (): void => {
  notesAbort?.abort()
  notesAbort = null
}

const runGroqReadingNotes = async (): Promise<void> => {
  const p = post.value
  if (!p || !groqApiKeyConfigured.value) return

  abortNotes()
  notesAbort = new AbortController()
  const signal = notesAbort.signal

  notesRequested.value = true
  notesStreamText.value = ''
  notesError.value = ''
  notesStreaming.value = true
  notesTtfbLoading.value = true

  try {
    const res = await fetch(GROQ_CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${groqApiKey.value}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        stream: true,
        messages: [
          { role: 'system', content: READING_SYSTEM_PROMPT },
          { role: 'user', content: buildUserPromptForGroq(p) },
        ],
      }),
      signal,
    })

    if (!res.ok) {
      let detail = ''
      try {
        const errJson = (await res.json()) as { error?: { message?: string } }
        detail = errJson.error?.message ?? ''
      } catch {
        detail = await res.text().catch(() => '')
      }
      throw new Error(detail || `Groq 请求失败 (${res.status})`)
    }

    const reader = res.body?.getReader()
    if (!reader) {
      throw new Error('无法读取响应流')
    }

    await consumeSseStream(
      reader,
      signal,
      (chunk) => {
        notesStreamText.value += chunk
      },
      () => {
        notesTtfbLoading.value = false
      },
    )

    if (notesTtfbLoading.value) {
      notesTtfbLoading.value = false
    }
  } catch (e: unknown) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      notesTtfbLoading.value = false
      return
    }
    console.error(e)
    notesError.value = e instanceof Error ? e.message : '精读笔记生成失败，请稍后重试。'
    notesTtfbLoading.value = false
  } finally {
    notesStreaming.value = false
    notesAbort = null
  }
}

function resetNotesForNewArticle(): void {
  abortNotes()
  notesStreamText.value = ''
  parsedNotes.value = ''
  notesRequested.value = false
  notesError.value = ''
  notesTtfbLoading.value = false
  notesStreaming.value = false
}

function resolveArticleFromRoute(): RssNewsItem | null {
  const st = history.state as { article?: RssNewsItem }
  if (st?.article && typeof st.article.title === 'string' && typeof st.article.link === 'string') {
    return st.article
  }
  const g = route.query.g
  const guid = typeof g === 'string' ? g : Array.isArray(g) ? g[0] : ''
  if (guid) {
    return loadArticleFromCache(guid)
  }
  return null
}

function applyArticleFromRoute(): void {
  const article = resolveArticleFromRoute()
  if (article) {
    post.value = article
    errorMessage.value = ''
  } else {
    post.value = null
    errorMessage.value = '未找到文章数据。'
  }
}

onMounted(() => {
  applyArticleFromRoute()
  hydrating.value = false
})

watch(
  () => route.query.g,
  (guid, prevGuid) => {
    if (guid === prevGuid) return
    resetNotesForNewArticle()
    hydrating.value = true
    applyArticleFromRoute()
    void nextTick(() => {
      hydrating.value = false
    })
  },
)

onUnmounted(() => {
  abortNotes()
})

const goHome = (): void => {
  void router.push({ name: 'home' })
}
</script>
