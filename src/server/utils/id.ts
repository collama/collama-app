import { Snowflake } from "@theinternetfolks/snowflake"
import { encode } from "js-base64"

const DEFAULT_TIMESTAMP = 1689350545
const DEFAULT_SHARD_ID = 4

export const generateId = () => {
  const id = Snowflake.generate({
    timestamp: DEFAULT_TIMESTAMP,
    shard_id: DEFAULT_SHARD_ID,
  })

  return encode(id)
}
