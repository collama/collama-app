import type { ChatCompletionMessageParam } from "openai/src/resources/chat/completions"
import type { ChatCompletionChunk } from "openai/src/resources/chat/completions"
import type { Stream } from "openai/src/streaming"
import {
  OpenAIProvider,
  type OpenAIProviderOptions,
} from "~/server/api/services/llm/openai"

export interface LLM {
  completion(content: string): Promise<string | null>
  chatCompletion(
    messages: ChatCompletionMessageParam[]
  ): Promise<Stream<ChatCompletionChunk>>
}

export type ProviderType = "openai"
export type ProviderConfig = ProviderType extends "openai"
  ? OpenAIProviderOptions
  : unknown

export const createProvider = (
  type: ProviderType,
  options: ProviderConfig
): LLM => {
  const providers = {
    openai: new OpenAIProvider(options),
  } as Record<ProviderType, LLM>

  return providers[type]
}
