import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material'
import { useAuth } from '../auth/useAuth'
import { fetchStockOnHand, type StockOnHand } from '../api/reports'
import { PageHeader } from '../components/PageHeader'
import { ErrorAlert } from '../components/ErrorAlert'

type SortColumn = 'product' | 'sku' | 'warehouse' | 'location' | 'quantity'
type SortDirection = 'asc' | 'desc'
type SortKey = { col: SortColumn; dir: SortDirection }

const DEFAULT_SORT: SortKey[] = []

function getValue(row: StockOnHand, col: SortColumn): string | number {
  switch (col) {
    case 'product':
      return row.product.name.toLowerCase()
    case 'sku':
      return row.product.sku.toLowerCase()
    case 'warehouse':
      return row.warehouse.name.toLowerCase()
    case 'location':
      return (row.warehouse.location ?? '').toLowerCase()
    case 'quantity':
      return row.quantity
  }
}

export function StockReportPage() {
  const { token } = useAuth()
  const [search, setSearch] = useState('')
  const [sortKeys, setSortKeys] = useState<SortKey[]>(DEFAULT_SORT)

  const stockQuery = useQuery({
    queryKey: ['reports', 'stockOnHand', token],
    queryFn: () => fetchStockOnHand(token as string),
    enabled: Boolean(token),
  })

  function handleSort(col: SortColumn) {
    setSortKeys((prev) => {
      const idx = prev.findIndex((k) => k.col === col)
      if (idx === -1) {
        return [...prev, { col, dir: 'asc' }]
      }
      if (prev[idx].dir === 'asc') {
        return prev.map((k, i) => (i === idx ? { ...k, dir: 'desc' } : k))
      }
      const next = prev.filter((_, i) => i !== idx)
      return next.length > 0 ? next : DEFAULT_SORT
    })
  }

  const filtered = useMemo<StockOnHand[]>(() => {
    const rows = stockQuery.data ?? []
    const q = search.trim().toLowerCase()
    return q
      ? rows.filter(
          (r) =>
            r.product.name.toLowerCase().includes(q) ||
            r.product.sku.toLowerCase().includes(q) ||
            r.warehouse.name.toLowerCase().includes(q) ||
            (r.warehouse.location ?? '').toLowerCase().includes(q)
        )
      : rows
  }, [stockQuery.data, search])

  const sorted = useMemo<StockOnHand[]>(() => {
    return [...filtered].sort((a, b) => {
      for (const { col, dir } of sortKeys) {
        const av = getValue(a, col)
        const bv = getValue(b, col)
        const cmp = av < bv ? -1 : av > bv ? 1 : 0
        if (cmp !== 0) return dir === 'asc' ? cmp : -cmp
      }
      return 0
    })
  }, [filtered, sortKeys])

  const totalQuantity = useMemo(
    () => filtered.reduce((sum, r) => sum + r.quantity, 0),
    [filtered]
  )

  return (
    <Container maxWidth="lg" sx={{ py: 3, textAlign: 'left' }}>
      <ErrorAlert error={stockQuery.error} />
      <PageHeader
        title="Stock on Hand"
        subtitle="Current inventory levels by product and warehouse"
      />

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
              mb: 2,
            }}
          >
            <TextField
              size="small"
              placeholder="Search product or warehouse…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: 320 }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Chip
                label={`${filtered.length} entries`}
                size="small"
                variant="outlined"
              />
              <Chip
                label={`Total: ${totalQuantity.toLocaleString()} units`}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>
          </Box>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {(
                    [
                      {
                        col: 'product' as SortColumn,
                        label: 'Product',
                        align: 'left' as const,
                      },
                      {
                        col: 'sku' as SortColumn,
                        label: 'SKU',
                        align: 'left' as const,
                      },
                      {
                        col: 'warehouse' as SortColumn,
                        label: 'Warehouse',
                        align: 'left' as const,
                      },
                      {
                        col: 'location' as SortColumn,
                        label: 'Location',
                        align: 'left' as const,
                      },
                      {
                        col: 'quantity' as SortColumn,
                        label: 'Quantity',
                        align: 'right' as const,
                      },
                    ] as const
                  ).map(({ col, label, align }) => {
                    const keyIndex = sortKeys.findIndex((k) => k.col === col)
                    const isActive = keyIndex >= 0
                    const activeDir = isActive ? sortKeys[keyIndex].dir : 'asc'
                    return (
                      <TableCell
                        key={col}
                        align={align}
                        sortDirection={isActive ? activeDir : false}
                      >
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <TableSortLabel
                            active={isActive}
                            direction={activeDir}
                            onClick={() => handleSort(col)}
                          >
                            <strong>{label}</strong>
                          </TableSortLabel>
                          {isActive && sortKeys.length > 1 && (
                            <Typography
                              component="span"
                              sx={{
                                fontSize: '0.65rem',
                                color: 'text.secondary',
                                lineHeight: 1,
                              }}
                            >
                              {keyIndex + 1}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                    )
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {stockQuery.isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography variant="body2" color="text.secondary">
                        Loading…
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography variant="body2" color="text.secondary">
                        No stock records found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  sorted.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell>{row.product.name}</TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          fontFamily="monospace"
                          color="text.secondary"
                        >
                          {row.product.sku}
                        </Typography>
                      </TableCell>
                      <TableCell>{row.warehouse.name}</TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {row.warehouse.location ?? '—'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={row.quantity.toLocaleString()}
                          size="small"
                          color={
                            row.quantity === 0
                              ? 'error'
                              : row.quantity <= 5
                                ? 'warning'
                                : 'default'
                          }
                          variant={
                            row.quantity === 0 || row.quantity <= 5
                              ? 'filled'
                              : 'outlined'
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  )
}
