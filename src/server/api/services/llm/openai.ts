import OpenAI from "openai"
import type {
  ChatCompletionChunk,
  ChatCompletionMessageParam,
} from "openai/src/resources/chat/completions"
import { type ChatCompletionCreateParamsBase } from "openai/src/resources/chat/completions"
import type { Stream } from "openai/src/streaming"
import { type LLM } from "~/server/api/services/llm/llm"


export interface OpenAIProviderOptions
  extends Omit<ChatCompletionCreateParamsBase, "messages"> {
  apiKey: string
}

export class OpenAIProvider implements LLM {
  provider: OpenAI

  constructor(private readonly options: OpenAIProviderOptions) {
    this.provider = new OpenAI({
      apiKey: this.options.apiKey,
    })
  }
  async completion(content: string): Promise<string | null> {
    const completion = await this.provider.chat.completions.create({
      messages: [{ role: "user", content: content }],
      model: this.options.model,
    })

    return completion.choices[0]?.message.content ?? null
  }

  async chatCompletion(
    messages: ChatCompletionMessageParam[]
  ): Promise<Stream<ChatCompletionChunk>> {
    return this.provider.chat.completions.create({
      messages,
      model: this.options.model,
      stream: true,
    })
  }
}
