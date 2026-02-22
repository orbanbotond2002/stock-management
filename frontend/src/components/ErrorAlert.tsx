import { useEffect, useMemo, useState } from 'react'
import { Alert, Box } from '@mui/material'
import { ApiError } from '../api/http'

type Props = {
  error: unknown
}

export function ErrorAlert({ error }: Props) {
  const message = useMemo(() => {
    if (!error) return null
    if (typeof error === 'string' && error.trim().length > 0) return error
    if (error instanceof ApiError) return error.message
    if (error instanceof Error) return error.message
    return 'Something went wrong'
  }, [error])

  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    setDismissed(false)
  }, [message])

  if (!message || dismissed) return null

  return (
    <Box sx={{ mb: 2 }}>
      <Alert severity="error" onClose={() => setDismissed(true)}>
        {message}
      </Alert>
    </Box>
  )
}
