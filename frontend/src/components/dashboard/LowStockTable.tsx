import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import type { Product } from '../../api/products'

type LowStockRow = {
  product: Product
  totalQuantity: number
}

type Props = {
  rows: LowStockRow[]
  loading: boolean
}

export function LowStockTable({ rows, loading }: Props) {
  if (loading) {
    return (
      <Typography variant="body2" sx={{ mt: 1.25 }}>
        Loading…
      </Typography>
    )
  }

  if (rows.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1.25 }}>
        No data.
      </Typography>
    )
  }

  return (
    <Card variant="outlined" sx={{ mt: 1.25 }}>
      <TableContainer>
        <Table size="small" sx={{ minWidth: 560 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 36, color: 'text.secondary' }}>
                #
              </TableCell>
              <TableCell sx={{ width: 140, color: 'text.secondary' }}>
                SKU
              </TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>Product</TableCell>
              <TableCell
                align="right"
                sx={{ width: 120, color: 'text.secondary' }}
              >
                Total stock
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow key={row.product.id} hover>
                <TableCell sx={{ color: 'text.secondary' }}>
                  {idx + 1}
                </TableCell>
                <TableCell>{row.product.sku}</TableCell>
                <TableCell>{row.product.name}</TableCell>
                <TableCell
                  align="right"
                  sx={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {row.totalQuantity}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}
