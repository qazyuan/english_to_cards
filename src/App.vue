<template>
  <div class="min-h-screen bg-gradient-to-b from-rose-50 via-white to-violet-50 text-gray-900 transition-colors duration-300 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 dark:text-gray-100">
    <header class="border-b border-rose-100/80 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-900/90">
      <div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <RouterLink
          to="/"
          class="bg-gradient-to-r from-rose-600 to-violet-600 bg-clip-text text-base font-bold tracking-tight text-transparent dark:from-rose-400 dark:to-violet-400"
        >
          雅思长难句 · 多图生成器
        </RouterLink>
        <span class="hidden text-xs text-gray-500 sm:inline dark:text-gray-400">小红书风卡片 · 一键 ZIP 存图</span>
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
