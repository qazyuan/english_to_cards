/** Groq JSON mode 返回的句子拆解结构 */
export interface VocabularyItem {
  word: string
  phonetic: string
  definition: string
}

export interface SentenceBreakdownJson {
  translation: string
  grammarAnalysis: string
  vocabulary: VocabularyItem[]
}
