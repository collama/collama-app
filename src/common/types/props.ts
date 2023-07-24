export interface PageProps<TParams, TSearchParams = Record<string, string>> {
  params: TParams
  searchParams: TSearchParams
}
