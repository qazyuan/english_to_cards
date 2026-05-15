export interface GrammarAnalysis {
  structure: string
  mainTrunk: string
  secret: string
}

export interface VocabPoint {
  word: string
  partOfSpeech: string
  phonetic: string
  meaning: string
  exampleEn: string
  exampleZh: string
}

export interface IeltsSentenceBreakdown {
  translation: string
  grammar: GrammarAnalysis
  vocabulary: VocabPoint[]
}
