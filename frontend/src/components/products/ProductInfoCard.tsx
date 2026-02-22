import { Card, CardContent, Typography } from '@mui/material'

type Props = {
  message: string
  muted?: boolean
}

export function ProductInfoCard({ message, muted }: Props) {
  return (
    <Card variant="outlined" sx={{ mt: 3 }}>
      <CardContent>
        <Typography
          variant="body2"
          color={muted ? 'text.secondary' : undefined}
        >
          {message}
        </Typography>
      </CardContent>
    </Card>
  )
}
