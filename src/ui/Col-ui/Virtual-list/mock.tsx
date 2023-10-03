import * as React from "react"
import type { ListProps, ListRef } from "./List"
import { RawList } from "./List"

const List = React.forwardRef(function List(
  props: ListProps<any>,
  ref: React.Ref<ListRef>
) {
  return RawList({ ...props, virtual: false }, ref)
}) as <Item extends Record<string, any> = any>(
  props: React.PropsWithChildren<ListProps<Item>> & { ref?: React.Ref<ListRef> }
) => React.ReactElement

;(List as any).displayName = "List"

export default List
