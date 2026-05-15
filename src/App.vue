<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100">
    <header class="border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-700 dark:bg-gray-800/80">
      <div class="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <RouterLink
          to="/"
          class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100"
        >
          Minimal Reader
        </RouterLink>
        <nav class="flex flex-wrap items-center gap-2">
          <RouterLink
            to="/"
            class="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            active-class="!bg-gray-900 !text-white dark:!bg-gray-100 dark:!text-gray-900"
          >
            资讯阅读
          </RouterLink>
          <RouterLink
            to="/sentences-to-cards"
            class="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            active-class="!bg-indigo-600 !text-white dark:!bg-indigo-500"
          >
            长难句多图
          </RouterLink>
        </nav>
      </div>
    </header>
    <main class="mx-auto max-w-5xl px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>
