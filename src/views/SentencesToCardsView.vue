<template>
  <section class="max-w-[1200px] mx-auto space-y-8 py-10 px-4 min-h-[calc(100vh-120px)] flex flex-col">
    <div :class="['bg-white rounded-3xl p-8 shadow-sm border border-gray-100 transition-all duration-500', result ? 'mt-0' : 'mt-10']">
      <h1 class="text-2xl font-black text-gray-900 mb-6">🎯 雅思长难句 AI 拆解流水线</h1>
      <textarea
        v-model="inputText"
        rows="4"
        class="w-full rounded-2xl border-gray-200 bg-gray-50 p-5 text-gray-700 focus:border-indigo-500 focus:ring-indigo-500 text-[15px] resize-none mb-6"
        placeholder="请在此处粘贴需要拆解的雅思长难句原句..."
      ></textarea>

      <div class="flex items-center gap-4">
        <button
          @click="runAnalysis"
          :disabled="loading || !inputText.trim()"
          class="flex-1 bg-gray-900 text-white rounded-xl py-3.5 font-bold text-[15px] transition hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'AI 深度拆解中...' : '开始 AI 深度拆解 ✨' }}
        </button>

        <button
          v-if="result"
          @click="downloadAllCards"
          :disabled="isExporting"
          class="flex-1 bg-indigo-500 text-white rounded-xl py-3.5 font-bold text-[15px] shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-600 disabled:opacity-50"
        >
          <span v-if="isExporting" class="animate-spin inline-block mr-2">⏳</span>
          {{ isExporting ? '打包图片中...' : '📥 一键存图 (ZIP 下载)' }}
        </button>
      </div>
      <p v-if="errorMessage" class="text-red-500 mt-4 text-sm">{{ errorMessage }}</p>
    </div>

    <div v-if="result" class="flex flex-wrap justify-center gap-6 pb-8">
      
      <div ref="card1Ref" class="w-[360px] h-[480px] shrink-0 bg-[#FAFAFA] shadow-xl relative flex flex-col overflow-hidden">
        <div class="h-1.5 w-full bg-indigo-500 shrink-0"></div>
        <div class="px-5 pt-5 pb-4 flex flex-col h-full">
          <div class="border-b border-gray-200 pb-2 shrink-0 flex items-center justify-between">
            <h2 class="text-lg font-black tracking-tight text-gray-900">原句精读</h2>
            <span class="bg-indigo-50 text-indigo-600 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest">IELTS · Translation</span>
          </div>
          
          <div class="mt-5 space-y-5">
            <div class="text-[13px] font-bold text-gray-900 leading-relaxed overflow-hidden max-h-[140px]">
              {{ inputText }}
            </div>
            <div class="text-[12px] text-gray-600 leading-relaxed border-l-[3px] border-indigo-200 pl-3 bg-indigo-50/30 py-3 pr-3 rounded-r-lg">
              {{ result.translation }}
            </div>
          </div>

          <div class="mt-auto pt-2.5 border-t border-gray-200 flex justify-between items-center shrink-0">
            <div class="flex items-center gap-2">
              <img :src="avatarUrl" alt="Avatar" class="w-7 h-7 rounded-full border border-white shadow-sm object-cover" />
              <div>
                <p class="text-[12px] font-black tracking-tight text-gray-900">Yvonne陪你学英语</p>
                <p class="text-[7px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">IELTS Daily</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-[7px] font-bold text-gray-300 leading-tight uppercase tracking-[0.2em]">Focused<br/>Consistent</p>
            </div>
          </div>
        </div>
      </div>

      <div ref="card2Ref" class="w-[360px] h-[480px] shrink-0 bg-[#FAFAFA] shadow-xl relative flex flex-col overflow-hidden">
        <div class="h-1.5 w-full bg-rose-500 shrink-0"></div>
        <div class="px-5 pt-5 pb-4 flex flex-col h-full">
          <div class="border-b border-gray-200 pb-2 shrink-0 flex items-center justify-between">
            <h2 class="text-lg font-black tracking-tight text-gray-900">语法骨架与从句</h2>
            <span class="bg-rose-50 text-rose-600 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest">Grammar Analysis</span>
          </div>
          
          <div class="mt-4 space-y-3">
            <div class="bg-white p-3.5 rounded-xl shadow-sm border border-gray-100">
              <div class="inline-block px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded mb-1.5 leading-none">结构分析</div>
              <p class="text-[11px] text-gray-700 leading-relaxed font-mono tracking-tight">
                {{ result.grammar.structure }}
              </p>
            </div>
            <div class="bg-white p-3.5 rounded-xl shadow-sm border border-gray-100">
              <div class="inline-block px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded mb-1.5 leading-none">句子主干</div>
              <p class="text-[11px] text-gray-700 leading-relaxed">
                {{ result.grammar.mainTrunk }}
              </p>
            </div>
            <div class="bg-rose-50 p-3.5 rounded-xl shadow-sm border border-rose-100">
              <div class="inline-block px-2 py-1 bg-rose-500 text-white text-[10px] font-bold rounded mb-1.5 leading-none">破解秘诀</div>
              <p class="text-[11px] text-rose-800 leading-relaxed font-medium">
                {{ result.grammar.secret }}
              </p>
            </div>
          </div>

          <div class="mt-auto pt-2.5 border-t border-gray-200 flex justify-between items-center shrink-0">
            <div class="flex items-center gap-2">
              <img :src="avatarUrl" alt="Avatar" class="w-7 h-7 rounded-full border border-white shadow-sm object-cover" />
              <div>
                <p class="text-[12px] font-black tracking-tight text-gray-900">Yvonne陪你学英语</p>
                <p class="text-[7px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">IELTS Daily</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-[7px] font-bold text-gray-300 leading-tight uppercase tracking-[0.2em]">Focused<br/>Consistent</p>
            </div>
          </div>
        </div>
      </div>

      <div ref="card3Ref" class="w-[360px] h-[480px] shrink-0 bg-[#FAFAFA] shadow-xl relative flex flex-col overflow-hidden">
        <div class="h-1.5 w-full bg-amber-500 shrink-0"></div>
        <div class="px-5 pt-5 pb-4 flex flex-col h-full">
          <div class="border-b border-gray-200 pb-2 shrink-0 flex items-center justify-between">
            <h2 class="text-lg font-black tracking-tight text-gray-900">核心提分词汇</h2>
            <span class="bg-amber-50 text-amber-600 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest">Core Vocabulary</span>
          </div>
          
          <div class="mt-4 space-y-4">
            <ul class="space-y-3.5">
              <li v-for="(word, index) in result.vocabulary" :key="index" class="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                <div class="flex items-baseline flex-wrap gap-x-1.5 gap-y-1 mb-1.5">
                  <span class="text-[14px] font-black text-gray-900">{{ word.word }}</span>
                  <span class="text-[10px] text-gray-400 font-bold italic">{{ word.partOfSpeech }}</span>
                  <span class="text-[10px] text-gray-500 font-mono">{{ word.phonetic }}</span>
                  <span class="text-[11px] font-bold text-amber-600 ml-0.5">{{ word.meaning }}</span>
                </div>
                <div class="space-y-1 pl-2 border-l-[2px] border-amber-200 mt-1.5">
                  <p class="text-[10px] text-gray-600 leading-relaxed">
                    <span class="font-bold text-gray-400 mr-1">例句:</span>{{ word.exampleEn }}
                  </p>
                  <p class="text-[10px] text-gray-600 leading-relaxed">
                    <span class="font-bold text-gray-400 mr-1">翻译:</span>{{ word.exampleZh }}
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div class="mt-auto pt-2.5 border-t border-gray-200 flex justify-between items-center shrink-0">
            <div class="flex items-center gap-2">
              <img :src="avatarUrl" alt="Avatar" class="w-7 h-7 rounded-full border border-white shadow-sm object-cover" />
              <div>
                <p class="text-[12px] font-black tracking-tight text-gray-900">Yvonne陪你学英语</p>
                <p class="text-[7px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">IELTS Daily</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-[7px] font-bold text-gray-300 leading-tight uppercase tracking-[0.2em]">Focused<br/>Consistent</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import html2canvas from 'html2canvas'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import avatarUrl from '../assets/avatar.png'
import type { IeltsSentenceBreakdown } from '../types/sentenceBreakdown'

const inputText = ref('')
const result = ref<IeltsSentenceBreakdown | null>(null)
const loading = ref(false)
const errorMessage = ref('')

const isExporting = ref(false)
const card1Ref = ref<HTMLElement | null>(null)
const card2Ref = ref<HTMLElement | null>(null)
const card3Ref = ref<HTMLElement | null>(null)

const GROQ_CHAT_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'
const groqApiKey = import.meta.env.VITE_GROQ_API_KEY?.trim() ?? ''

// 核心改动：彻底改变 Card 2 的 JSON 约束，使其严格输出结构、主干和秘诀
const SYSTEM_PROMPT = `你是一个资深的雅思阅读名师。请对用户输入的英文长难句进行深度拆解，必须返回合法的 JSON 格式数据。

【排版防溢出警告】：
1. grammar 的解释必须极其精炼，严禁出现大段废话。
2. vocabulary 必须提供一个极简的英文例句（不超过8个单词）和对应的中文翻译。

请严格按照以下 JSON 结构输出：
{
  "translation": "此处填写信达雅的优美中文翻译",
  "grammar": {
    "structure": "保留原句英文单词，用括号标注成分，如：The psychological profile (主语) ... of a person (定语) [who...] (定语从句) has...been associated with (谓语) ...",
    "mainTrunk": "用中文写出提取后的句子主干，如：从事军队工作的人的心理特征，历史上一直与...相关。",
    "secret": "用一两句话总结破解这个句子的秘诀，如：先找谓语动词 (has been associated)，再把 person 后面的从句剥离出去，提取出主干。"
  },
  "vocabulary": [
    {
      "word": "单词",
      "partOfSpeech": "词性(如 v., n., adj.)",
      "phonetic": "[音标]",
      "meaning": "简短释义",
      "exampleEn": "极简英文例句",
      "exampleZh": "例句的中文翻译"
    }
  ]
}
注意：vocabulary 提取 3 个核心词汇。`

const runAnalysis = async () => {
  if (!groqApiKey) {
    errorMessage.value = '请配置 GROQ_API_KEY'
    return
  }
  
  loading.value = true
  errorMessage.value = ''
  result.value = null

  try {
    const response = await fetch(GROQ_CHAT_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        Authorization: `Bearer ${groqApiKey}` 
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        response_format: { type: "json_object" }, 
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: inputText.value }
        ]
      })
    })

    if (!response.ok) throw new Error('网络请求失败')
    
    const data = await response.json()
    let content = data.choices[0].message.content
    content = content.replace(/```json/g, '').replace(/```/g, '').trim()
    result.value = JSON.parse(content) as IeltsSentenceBreakdown

  } catch (err) {
    console.error(err)
    errorMessage.value = '解析失败，大模型返回格式错误或网络超时。'
  } finally {
    loading.value = false
  }
}

const downloadAllCards = async () => {
  const refs = [card1Ref.value, card2Ref.value, card3Ref.value]
  if (refs.some(r => !r)) return
  
  isExporting.value = true
  const zip = new JSZip()
  
  try {
    for (let i = 0; i < refs.length; i++) {
      const canvas = await html2canvas(refs[i]!, {
        scale: 3, 
        useCORS: true,
        backgroundColor: '#FAFAFA',
        width: 360,
        height: 480
      })
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'))
      if (blob) {
        zip.file(`IELTS_Note_0${i + 1}.png`, blob)
      }
    }
    
    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, `Yvonne_IELTS_Notes_${Date.now()}.zip`)

  } catch (err) {
    console.error('打包失败:', err)
    alert('打包图片失败，请重试')
  } finally {
    isExporting.value = false
  }
}
</script>