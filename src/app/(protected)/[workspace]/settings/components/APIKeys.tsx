import { api } from "~/trpc/server-http"

export default async function APIKeys() {
  const apiKeys = await api.apiKey.getAll.query()
  return (
    <div>
      {apiKeys.map((key) => (
        <div key={key.id}>
          {key.provider} - {key.hint}
        </div>
      ))}
    </div>
  )
}
