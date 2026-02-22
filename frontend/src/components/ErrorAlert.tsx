import { Box } from '@mui/material'

type Props = {
  error: unknown
}

export function ErrorAlert({ error }: Props) {
  if (!error) return null
  const message =
    error instanceof Error ? error.message : 'Something went wrong'
  return (
    <Box className="errorBox" sx={{ mt: 1.5 }}>
      {message}
    </Box>
  )
}
