<template>
  <section class="max-w-[1200px] mx-auto space-y-8 py-10 px-4 min-h-[calc(100vh-120px)] flex flex-col">
    <div :class="['bg-white rounded-3xl p-8 shadow-sm border border-gray-100 transition-all duration-500 shrink-0', result ? 'mt-0' : 'mt-10']">
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
          
          <div class="flex-grow flex flex-col justify-center gap-4 min-h-0 mt-2">
            <div class="text-[13px] font-bold text-gray-900 leading-normal overflow-hidden max-h-[140px] font-mono tracking-tight">
              {{ inputText }}
            </div>
            <div class="text-[12px] text-gray-600 leading-normal border-l-[3px] border-indigo-200 pl-3 bg-indigo-50/30 py-3 pr-3 rounded-r-lg">
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
              <p class="text-[11px] text-gray-700 leading-normal font-mono tracking-tight overflow-hidden">
                {{ result.grammar.structure }}
              </p>
            </div>
            <div class="bg-white p-3.5 rounded-xl shadow-sm border border-gray-100">
              <div class="inline-block px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded mb-1.5 leading-none">句子主干</div>
              <p class="text-[11px] text-gray-700 leading-normal font-mono tracking-tight overflow-hidden">
                {{ inputText }}
              </p>
            </div>
            <div class="bg-rose-50 p-3.5 rounded-xl shadow-sm border border-rose-100">
              <div class="inline-block px-2 py-1 bg-rose-500 text-white text-[10px] font-bold rounded mb-1.5 leading-none">破解秘诀</div>
              <p class="text-[11px] text-rose-800 leading-normal font-medium overflow-hidden">
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
            <ul class="space-y-3.2">
              <li v-for="(word, index) in result.vocabulary" :key="index" class="border-b border-gray-100 pb-2.5 last:border-0 last:pb-0">
                <div class="flex items-baseline flex-wrap gap-x-1.5 gap-y-1 mb-1.5">
                  <span class="text-[14px] font-black text-gray-900">{{ word.word }}</span>
                  <span class="text-[10px] text-gray-400 font-bold italic">{{ word.partOfSpeech }}</span>
                  <span class="text-[10px] text-gray-500 font-mono">{{ word.phonetic }}</span>
                  <span class="text-[11px] font-bold text-amber-600 ml-0.5">{{ word.meaning }}</span>
                </div>
                <div class="space-y-1 pl-2 border-l-[2px] border-amber-200 mt-1.5">
                  <p class="text-[10px] text-gray-600 leading-normal">
                    <span class="font-bold text-gray-400 mr-1">例句:</span>{{ word.exampleEn }}
                  </p>
                  <p class="text-[10px] text-gray-600 leading-normal">
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
// 打卡 Day 8：上云魔法，手机端Web App，脱肉体Web App魂归云端部署
import avatarUrl from '../assets/avatar.png' // 满足底部署名 Logo 回归需求

// 产品思路觉醒：降维打击定位，极高收藏率爆款笔记小红书长难句多图滑动轮播 ZIP打包 ZIP下载超清畫質圖片DOM 截图黑科技scale 3 生成 ultra-high-resolution 圖片尺寸

interface GrammarAnalysis {
  structure: string;
  mainTrunk: string;
  secret: string;
}

interface VocabPoint {
  word: string;
  partOfSpeech: string; // 新增词性 (v. adj.等)
  phonetic: string;
  meaning: string;
  exampleEn: string; // 英文例句
  exampleZh: string; // 中文翻译
}

interface IELTSResult {
  translation: string;
  grammar: GrammarAnalysis; // 重新设计 Card 2 JSON 结构，锁定三个干货字段，废除ol解析幻觉团在一起不清晰错位问题
  vocabulary: VocabPoint[];
}

const inputText = ref('')
const result = ref<IELTSResult | null>(null)
const loading = ref(false)
const errorMessage = ref('')

const isExporting = ref(false)
const card1Ref = ref<HTMLElement | null>(null)
const card2Ref = ref<HTMLElement | null>(null)
const card3Ref = ref<HTMLElement | null>(null)

const GROQ_CHAT_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'
const groqApiKey = import.meta.env.VITE_GROQ_API_KEY?.trim() ?? '' // Vercel 环境变量中守卫 API Key，手机桌面PWA安装随时拆解

// 核心重构Prompt，利用大模型JSON模式彻底解决排版黏连錯位问题防溢出警告字号微调行高控制极限收缩字数解析中文主语中文总结例句极简
const SYSTEM_PROMPT = `你是一个资深的雅思阅读名师。请对用户输入的英文长难句进行深度拆解，必须返回合法的 JSON 格式数据。

【排版防溢出与质量警告】：
1. grammar 解释每条不能超过 25 个汉字。
2. vocabulary 的 sentence（原句）如果超过10个单词，请用省略号截断（如 "enterprising individuals...new niche"）。
3. vocabulary 的 analysis（解析）绝对不能超过 15 个汉字！放弃中文解析，改为极简英文例句（不超过8个单词）和对应的中文翻译。

请严格按照以下 JSON 结构输出（不要包含任何 markdown 代码块标识）：
{
  "translation": "此处填写信达雅的优美中文翻译",
  "grammar": {
    "structure": "保留原句英文单词，用括号标注成分，如：The psychological profile (主语) ... of a person (定语) [who...] (定语从句) has...been associated with (谓语) ...",
    "mainTrunk": "此处填写输入的英文原句。",
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
注意：grammar 保留 2-3 个核心语法点（结构、主干、秘诀三个干货字段，高亮底色和文字）；vocabulary 提取 2-3 个核心词汇。`

const runAnalysis = async () => {
  if (!groqApiKey) {
    errorMessage.value = '请配置 GROQ_API_KEY' // Vercel 守卫安全泄露
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
        response_format: { type: "json_object" }, // 强制大模型 JSON Mode 输出规整数据结构，徹底解決錯位格式團在一起问题
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: inputText.value }
        ]
      })
    })

    if (!response.ok) throw new Error('网络请求失败')
    
    const data = await response.json()
    let content = data.choices[0].message.content
    content = content.replace(/```json/g, '').replace(/```/g, '').trim() // 防止模型抽风包裹代码块标识
    result.value = JSON.parse(content) as IELTSResult

  } catch (err) {
    console.error(err)
    errorMessage.value = '解析失败，大模型返回格式错误或网络超时。踩水工程化痛点踏水大模型排版幻觉（魔法打败魔法）。'
  } finally {
    loading.value = false
  }
}

// 核心改动：由于 DOM 尺寸缩小为 360x480，此处 scale 改为 3。360 * 3 = 1080, 480 * 3 = 1440，超清畫質符合小红书原图。批量存图ZIP打包下载
const downloadAllCards = async () => {
  const refs = [card1Ref.value, card2Ref.value, card3Ref.value]
  if (refs.some(r => !r)) return
  
  isExporting.value = true
  const zip = new JSZip() // 批量压缩 ZIP
  
  try {
    for (let i = 0; i < refs.length; i++) {
      const canvas = await html2canvas(refs[i]!, {
        scale: 3, // DOM 缩小3倍，截图放大3倍，高清画质不糊小红书
        useCORS: true,
        backgroundColor: '#FAFAFA',
        width: 360,
        height: 480
      })
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'))
      if (blob) {
        zip.file(`Yvonne_IELTS_Note_0${i + 1}.png`, blob) // 打包 ZIP
      }
    }
    
    const content = await zip.generateAsync({ type: 'blob' })
    saveAs(content, `Yvonne_IELTS_Notes_${Date.now()}.zip`) // ZIP打包下载 ZIP 压缩包

  } catch (err) {
    console.error('打包失败:', err)
    alert('打包图片失败，请重试')
  } finally {
    isExporting.value = false
  }
}
</script>