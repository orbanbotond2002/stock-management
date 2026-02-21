export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

type ErrorPayload =
  | { error?: string }
  | { error?: { code?: string; message?: string } }

async function readJsonSafely(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) return undefined
  try {
    return await response.json()
  } catch {
    return undefined
  }
}

function getErrorMessage(payload: unknown): string {
  if (!payload || typeof payload !== 'object') return 'Request failed'

  const p = payload as ErrorPayload

  if (typeof (p as { error?: unknown }).error === 'string') {
    return (p as { error: string }).error
  }

  const nested = (p as { error?: { message?: unknown } }).error
  if (nested && typeof nested === 'object') {
    const msg = (nested as { message?: unknown }).message
    if (typeof msg === 'string' && msg.length > 0) return msg
  }

  return 'Request failed'
}

function formatNonJsonError(status: number): string {
  if (status === 404) {
    return 'API route not found (check Vite proxy / backend URL)'
  }
  if (status === 502 || status === 503 || status === 504) {
    return 'Backend not reachable (check docker-compose services)'
  }
  return 'Request failed'
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...(options.headers ?? {}),
    },
  })

  if (response.status === 204) return undefined as T

  const payload = await readJsonSafely(response)

  if (!response.ok) {
    const message = payload
      ? getErrorMessage(payload)
      : formatNonJsonError(response.status)
    throw new ApiError(message, response.status)
  }

  return payload as T
}
