import { type Prompt } from "~/common/types/prompt"

export const serializePrompt = (raw: string | null) =>
  JSON.parse(raw ?? "") as Prompt
