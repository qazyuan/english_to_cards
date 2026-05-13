<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100">
    <header class="border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-700 dark:bg-gray-800/80">
      <div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
        <RouterLink to="/" class="text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100">
          Minimal Reader
        </RouterLink>
      </div>
    </header>
    <main class="mx-auto max-w-4xl px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>
