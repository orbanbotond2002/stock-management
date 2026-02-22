import { Card, CardContent, Typography } from '@mui/material'

type Props = {
  description?: string | null
}

export function ProductDescriptionCard({ description }: Props) {
  const normalized = description?.trim() ? description : '—'

  return (
    <Card variant="outlined" sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="caption" color="text.secondary">
          Description
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          {normalized}
        </Typography>
      </CardContent>
    </Card>
  )
}
