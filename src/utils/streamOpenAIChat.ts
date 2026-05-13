/**
 * OpenAI-compatible Chat Completions streaming (SSE: lines starting with `data:`).
 */
export async function streamOpenAIChatCompletion(options: {
  baseUrl: string
  apiKey: string
  model: string
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>
  signal?: AbortSignal
  onDelta: (chunk: string) => void
}): Promise<void> {
  const url = `${options.baseUrl.replace(/\/$/, '')}/chat/completions`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${options.apiKey}`,
    },
    body: JSON.stringify({
      model: options.model,
      messages: options.messages,
      stream: true,
    }),
    signal: options.signal,
  })

  if (!response.ok) {
    let detail = ''
    try {
      const errJson = (await response.json()) as { error?: { message?: string } }
      detail = errJson.error?.message ?? ''
    } catch {
      try {
        detail = await response.text()
      } catch {
        detail = ''
      }
    }
    throw new Error(detail || `请求失败 (${response.status})`)
  }

  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('无法读取响应流')
  }

  const decoder = new TextDecoder()
  let buffer = ''

  const processLine = (line: string): void => {
    const trimmed = line.trim()
    if (!trimmed.startsWith('data:')) {
      return
    }
    const data = trimmed.slice(5).trim()
    if (data === '[DONE]') {
      return
    }
    try {
      const parsed = JSON.parse(data) as {
        choices?: Array<{ delta?: { content?: string } }>
      }
      const content = parsed.choices?.[0]?.delta?.content
      if (content) {
        options.onDelta(content)
      }
    } catch {
      // incomplete JSON line from split; ignore
    }
  }

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      processLine(line)
    }
  }

  if (buffer.trim()) {
    for (const line of buffer.split('\n')) {
      processLine(line)
    }
  }
}
