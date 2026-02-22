import { Card, CardContent, Grid, Typography } from '@mui/material'

type Props = {
  label: string
  value: number | string
  loading?: boolean
}

export function StatCard({ label, value, loading }: Props) {
  return (
    <Grid item xs={12} sm={6}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
          <Typography
            variant="h4"
            fontWeight={800}
            letterSpacing="-0.02em"
            sx={{ mt: 0.5 }}
          >
            {loading ? '…' : value}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  )
}
