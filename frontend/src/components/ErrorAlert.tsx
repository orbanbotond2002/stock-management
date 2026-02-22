import { Box } from '@mui/material'
import { ApiError } from '../api/http'

type Props = {
  error: unknown
}

export function ErrorAlert({ error }: Props) {
  if (!error) return null

  const message = (() => {
    if (error instanceof ApiError)
      return `${error.message} (HTTP ${error.status})`
    if (error instanceof Error) return error.message
    return 'Something went wrong'
  })()

  return (
    <Box className="errorBox" sx={{ mt: 1.5 }}>
      {message}
    </Box>
  )
}
