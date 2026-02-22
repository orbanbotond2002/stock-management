import { useQuery } from '@tanstack/react-query'
import { Container } from '@mui/material'
import { useParams } from 'react-router-dom'
import { fetchProductById } from '../api/products'
import { useAuth } from '../auth/useAuth'
import { ErrorAlert } from '../components/ErrorAlert'
import { PageHeader } from '../components/PageHeader'
import { ProductDetailContent } from '../components/products/ProductDetailContent'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { token } = useAuth()

  const productQuery = useQuery({
    queryKey: ['products', 'detail', token, id],
    queryFn: () => fetchProductById(token as string, id as string),
    enabled: Boolean(token && id),
  })

  const product = productQuery.data

  return (
    <Container maxWidth="lg" sx={{ py: 3, textAlign: 'left' }}>
      <PageHeader
        title="Product detail"
        subtitle={
          product ? `${product.sku} · ${product.name}` : id ? `ID: ${id}` : '—'
        }
      />
      <ErrorAlert error={productQuery.error} />

      <ProductDetailContent
        id={id}
        isLoading={productQuery.isLoading}
        product={product}
      />
    </Container>
  )
}
