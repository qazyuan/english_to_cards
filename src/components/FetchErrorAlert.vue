<template>
  <div
    class="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/40"
    role="alert"
  >
    <div class="flex items-start gap-3">
      <span
        class="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/60 dark:text-red-300"
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" class="h-4 w-4 fill-none stroke-current">
          <path
            d="M12 9v4m0 4h.01M10.29 3.86l-8 14A1 1 0 003.16 19h16.68a1 1 0 00.87-1.5l-8-14a1 1 0 00-1.74 0z"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.8"
          />
        </svg>
      </span>
      <div class="min-w-0 flex-1">
        <p class="text-sm font-medium text-red-700 dark:text-red-200">加载失败</p>
        <p class="mt-1 text-sm text-red-600/90 dark:text-red-300/90">{{ message }}</p>
        <button
          type="button"
          class="mt-3 inline-flex items-center rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200 dark:hover:bg-red-900/50"
          @click="emit('reload')"
        >
          重新加载
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string
}>()

const emit = defineEmits<{
  reload: []
}>()
</script>
