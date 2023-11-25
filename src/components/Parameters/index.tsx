"use client"

import { type FC, useCallback, useMemo } from "react"
import { type TaskRevisionProps } from "~/app/(protected)/[workspace]/[task]/page"
import { ParameterItem, StopItem } from "~/components/Parameters/ParameterItem"
import { useAwaitedFn } from "~/hooks/useAwaited"
import { useParameterActions } from "~/store/taskStore"
import { api } from "~/trpc/client"
import { Select, type SelectOption } from "~/ui/Select"

const seeds = [
  {
    id: "temperature",
    name: "Temperature",
    content: "Controls “creativity”.",
    description:
      "At 0, the model will always choose the most likely next token. For creative applications try 0.7 or above so the model may generate more surprising text.",
    moreDetail: "Default is 1",
    defaultValue: 0,
    step: 0.1,
    max: 2,
    min: 0,
  },
  {
    id: "maxTokens",
    name: "Max tokens",
    content: "The maximum number of tokens to generate.",
    description:
      "One token is roughly four characters of English. Use -1 to use the model's maximum.",
    defaultValue: -1,
    step: 1,
    max: 8000,
    min: -1,
  },
  {
    id: "presencePenalty",
    name: "Presence penalty",
    content: "Increase new topics.",
    description:
      "Penalize new tokens that have occurred in the text so far, increasing the likelihood of new topics.",
    defaultValue: 0,
    moreDetail: "Default is 0",
    step: 0.1,
    max: 2,
    min: -2,
  },
  {
    id: "frequencyPenalty",
    name: "Frequency penalty",
    content: "Decrease repetition.",
    description:
      "Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the chances the model will repeat the same line verbatim.",
    defaultValue: 0,
    moreDetail: "Default is 0",
    step: 0.1,
    max: 2,
    min: -2,
  },
  {
    id: "topP",
    name: "Top P",
    content: "Sampled probability mass.",
    description:
      "Limits token sampling to be from the top-P most likely fraction e.g. 0.1 = top 10% probability mass. Can constrain the diversity of the generated text.",
    defaultValue: 0,
    moreDetail:
      "Default is 1. OpenAI recommend altering either this or temperature, but not both.",
    step: 0.01,
    max: 1,
    min: 0.01,
  },
]

const STOP_VALUE = {
  id: "stopSequences",
  name: "Stop sequences",
  content: "Sequences to stop further text generation.",
  description:
    "Enter up to 4 sequences. The returned text will not contain the sequence.",
  limit: 4,
}

export interface Parameter {
  model: string
  temperature: number
  maxTokens: number
  stopSequences: string[]
  topP: number
  frequencyPenalty: number
  presencePenalty: number
  extra?: Record<string, string>
}

export const Parameters = ({ taskRevision }: TaskRevisionProps) => {
  const { append, updateParameter, updateModel } = useParameterActions()
  const { data: models, loading } = useAwaitedFn(api.model.getAll.query)

  const modelOpt = useMemo(() => {
    return models
      ? models.map((model) => ({
          label: model.name,
          value: model.id,
        }))
      : []
  }, [loading])

  // useEffect(() => {
  //   append({...taskRevision.par}})
  // }, [])

  const onModelChange = useCallback((model: string) => {
    updateModel(model)
  }, [])

  const onParameterChange = useCallback((value: number, id: string) => {
    updateParameter(id as keyof Parameter, value)
  }, [])

  const onStopChange = useCallback((values: string[], id: string) => {
    updateParameter(id as keyof Parameter, values)
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div className="p-6 pt-1.5">
      <div className="flex flex-wrap gap-2">
        <ModelItem
          defaultValue={modelOpt[0]}
          options={modelOpt}
          onChange={onModelChange}
        />
        {seeds.map((item) => (
          <ParameterItem
            key={item.name}
            {...item}
            onChange={onParameterChange}
          />
        ))}
        <StopItem onChange={onStopChange} {...STOP_VALUE} />
      </div>
    </div>
  )
}

interface ModelItemProps {
  options: SelectOption[]
  defaultValue?: SelectOption
  onChange?: (value: string, selected: SelectOption) => void
}

const ModelItem: FC<ModelItemProps> = ({ options, onChange, defaultValue }) => {
  return (
    <div className="inline-flex select-none items-center border rounded-lg border-gray-300 hover:border-gray-400">
      <span className="text-sm px-1.5 bg-zinc-100 ">Model</span>

      <Select
        onChange={(value, selected) => onChange?.(value, selected)}
        defaultValue={defaultValue}
        options={options}
        className="border-0 py-0 text-sm overflow-y-auto"
      />
    </div>
  )
}
