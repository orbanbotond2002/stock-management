import { Card, CardContent, Container, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <Container maxWidth="lg" sx={{ py: 3, textAlign: 'left' }}>
      <PageHeader
        title="Product detail"
        subtitle={id ? `ID: ${id}` : 'Placeholder'}
      />

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
