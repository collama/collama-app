import {
  OpenAIProvider,
  type OpenAIProviderOptions,
} from "~/server/api/services/llm/openai"

export interface LLM {
  completion(content: string): Promise<string | null>
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
