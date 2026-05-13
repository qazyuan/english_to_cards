<template>
  <div
    class="w-full min-w-0 max-w-lg mx-auto px-4 py-5 sm:px-6 sm:py-6 bg-white/80 dark:bg-gray-800/90 rounded-2xl shadow-lg flex flex-col items-stretch gap-4 sm:gap-5"
  >
    <h2 class="text-lg sm:text-xl font-semibold text-blue-700 dark:text-blue-200 text-center sm:text-left">
      每日英语阅读打卡
    </h2>

    <div
      v-if="showCelebration"
      role="status"
      class="rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-3 sm:px-4 dark:border-amber-500/40 dark:from-amber-950/50 dark:to-orange-950/40"
    >
      <p class="text-center text-sm font-medium text-amber-900 dark:text-amber-100">
        🎉 已连续打卡超过 10 天，太棒了！继续保持！
      </p>
    </div>

    <div class="flex flex-col w-full min-w-0 gap-3 sm:gap-3.5">
      <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 w-full">
        <span class="text-sm sm:text-base text-gray-500 dark:text-gray-300 shrink-0">外刊：</span>
        <span class="text-sm sm:text-base font-medium text-gray-800 dark:text-gray-100 text-right break-words min-w-0 flex-1 sm:flex-none">
          {{ target.magazineName }}
        </span>
      </div>
      <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 w-full">
        <span class="text-sm sm:text-base text-gray-500 dark:text-gray-300 shrink-0">总页数：</span>
        <span class="text-sm sm:text-base font-medium text-blue-600 dark:text-blue-200">
          {{ target.totalPages }} 页
        </span>
      </div>
      <div
        class="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 w-full"
      >
        <span class="text-sm sm:text-base text-gray-500 dark:text-gray-300 shrink-0">已读：</span>
        <div class="flex flex-wrap items-center justify-end gap-2 min-w-0 sm:ml-auto">
          <span class="text-sm sm:text-base font-medium text-green-600 dark:text-green-300 tabular-nums">
            {{ target.readPages }} / {{ target.totalPages }} 页
          </span>
          <button
            type="button"
            @click="incrementReadPages"
            class="shrink-0 px-2.5 py-1 rounded-md bg-green-100 dark:bg-green-700/80 text-green-700 dark:text-green-100 text-xs sm:text-sm hover:bg-green-200 dark:hover:bg-green-600 transition"
          >
            +1
          </button>
        </div>
      </div>
      <div
        class="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 w-full pt-3 border-t border-gray-200 dark:border-gray-700"
      >
        <span class="text-sm sm:text-base text-gray-500 dark:text-gray-300 shrink-0">连续打卡：</span>
        <div class="flex flex-wrap items-center justify-end gap-2 min-w-0 sm:ml-auto">
          <span class="text-sm sm:text-base font-semibold text-indigo-700 dark:text-indigo-200 tabular-nums">
            {{ streak }} 天
          </span>
          <button
            type="button"
            @click="incrementStreak"
            class="shrink-0 px-2.5 py-1 rounded-md bg-indigo-100 dark:bg-indigo-700/80 text-indigo-700 dark:text-indigo-100 text-xs sm:text-sm hover:bg-indigo-200 dark:hover:bg-indigo-600 transition"
          >
            +1
          </button>
        </div>
      </div>
    </div>

    <section class="w-full pt-3 border-t border-gray-200 dark:border-gray-700">
      <h3 class="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-100 mb-2">
        历史打卡记录
      </h3>
      <ul class="space-y-2">
        <li
          v-for="item in records"
          :key="item.id"
          class="rounded-lg bg-gray-50 dark:bg-gray-700/50 px-3 py-2 flex flex-wrap items-center justify-between gap-2"
        >
          <span class="text-xs sm:text-sm text-gray-600 dark:text-gray-200">
            {{ item.checkInDate }}
          </span>
          <span class="text-xs sm:text-sm font-medium text-indigo-700 dark:text-indigo-200">
            阅读 {{ item.readingMinutes }} 分钟
          </span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

interface Target {
  id: number
  magazineName: string
  totalPages: number
  readPages: number
}

interface CheckInRecord {
  id: number
  checkInDate: string
  readingMinutes: number
}

const CELEBRATION_THRESHOLD = 10

const target = reactive<Target>({
  id: 1,
  magazineName: 'The Economist',
  totalPages: 30,
  readPages: 0,
})

const records = ref<CheckInRecord[]>([
  { id: 1, checkInDate: '2026-04-28', readingMinutes: 35 },
  { id: 2, checkInDate: '2026-04-29', readingMinutes: 42 },
  { id: 3, checkInDate: '2026-04-30', readingMinutes: 28 },
  { id: 4, checkInDate: '2026-05-01', readingMinutes: 50 },
  { id: 5, checkInDate: '2026-05-02', readingMinutes: 40 },
  { id: 6, checkInDate: '2026-05-03', readingMinutes: 32 },
  { id: 7, checkInDate: '2026-05-04', readingMinutes: 38 },
  { id: 8, checkInDate: '2026-05-05', readingMinutes: 45 },
  { id: 9, checkInDate: '2026-05-06', readingMinutes: 36 },
  { id: 10, checkInDate: '2026-05-07', readingMinutes: 41 },
  { id: 11, checkInDate: '2026-05-08', readingMinutes: 47 },
])

const streak = ref<number>(records.value.length)

const showCelebration = computed(() => streak.value > CELEBRATION_THRESHOLD)

function incrementReadPages(): void {
  if (target.readPages < target.totalPages) {
    target.readPages += 1
  }
}

function incrementStreak(): void {
  streak.value += 1
  records.value.unshift({
    id: Date.now(),
    checkInDate: new Date().toISOString().slice(0, 10),
    readingMinutes: 30 + Math.floor(Math.random() * 31),
  })
}
</script>
