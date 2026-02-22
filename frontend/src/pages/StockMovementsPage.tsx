import { Card, CardContent, Container, Typography } from '@mui/material'
import { PageHeader } from '../components/PageHeader'

export function StockMovementsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 3, textAlign: 'left' }}>
      <PageHeader title="Stock Movements" subtitle="Placeholder" />

      <Card variant="outlined" sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Coming soon.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  )
}
