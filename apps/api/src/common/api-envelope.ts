export interface ApiEnvelope<T> {
  data: T
  meta: Record<string, unknown>
}

export interface ApiError {
  code: string
  message: string
  details: unknown[]
}

export interface ApiErrorEnvelope {
  error: ApiError
}

export function envelope<T>(data: T, meta: Record<string, unknown> = {}): ApiEnvelope<T> {
  return { data, meta }
}
