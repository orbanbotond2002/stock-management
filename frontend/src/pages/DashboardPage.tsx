import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Box, Container, Grid, Typography } from '@mui/material'
import { useAuth } from '../auth/useAuth'
import { fetchProducts, type Product } from '../api/products'
import { fetchWarehouses } from '../api/warehouses'
import { fetchStockOnHand } from '../api/reports'
import { PageHeader } from '../components/PageHeader'
import { ErrorAlert } from '../components/ErrorAlert'
import { StatCard } from '../components/dashboard/StatCard'
import { LowStockTable } from '../components/dashboard/LowStockTable'

type LowStockRow = {
  product: Product
  totalQuantity: number
}

export function DashboardPage() {
  const { token } = useAuth()

  const productsQuery = useQuery({
    queryKey: ['products', token],
    queryFn: () => fetchProducts(token as string),
    enabled: Boolean(token),
  })

  const warehousesQuery = useQuery({
    queryKey: ['warehouses', token],
    queryFn: () => fetchWarehouses(token as string),
    enabled: Boolean(token),
  })

  const stockOnHandQuery = useQuery({
    queryKey: ['reports', 'stockOnHand', token],
    queryFn: () => fetchStockOnHand(token as string),
    enabled: Boolean(token),
  })

  const lowStockTop10 = useMemo<LowStockRow[]>(() => {
    const products = productsQuery.data ?? []
    const currentStocks = stockOnHandQuery.data ?? []

    const totals = new Map<string, number>()
    for (const r of currentStocks) {
      totals.set(r.productId, (totals.get(r.productId) ?? 0) + r.quantity)
    }

    const ranked = products.map((p) => ({
      product: p,
      totalQuantity: totals.get(p.id) ?? 0,
    }))

    ranked.sort((a, b) => {
      if (a.totalQuantity !== b.totalQuantity)
        return a.totalQuantity - b.totalQuantity
      return a.product.name.localeCompare(b.product.name)
    })

    return ranked.slice(0, 10)
  }, [productsQuery.data, stockOnHandQuery.data])

  const firstError =
    productsQuery.error ?? warehousesQuery.error ?? stockOnHandQuery.error

  return (
    <Container maxWidth="lg" sx={{ py: 3, textAlign: 'left' }}>
      <ErrorAlert error={firstError} />
      <PageHeader title="Dashboard" subtitle="Quick overview" />

      <Box component="section" sx={{ mt: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.25 }}>
          Summary
        </Typography>

        <Grid container spacing={2}>
          <StatCard
            label="Products"
            value={productsQuery.data?.length ?? '—'}
            loading={productsQuery.isLoading}
          />
          <StatCard
            label="Warehouses"
            value={warehousesQuery.data?.length ?? '—'}
            loading={warehousesQuery.isLoading}
          />
        </Grid>
      </Box>

      <Box component="section" sx={{ mt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
          <Typography variant="subtitle1" fontWeight={700}>
            Low stock
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Top 10 lowest-stock products
          </Typography>
        </Box>

        {productsQuery.isLoading || stockOnHandQuery.isLoading ? (
          <Typography variant="body2" sx={{ mt: 1.25 }}>
            Loading…
          </Typography>
        ) : lowStockTop10.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.25 }}>
            No data.
          </Typography>
        ) : (
          <LowStockTable
            rows={lowStockTop10}
            loading={productsQuery.isLoading || stockOnHandQuery.isLoading}
          />
        )}
      </Box>
    </Container>
  )
}
