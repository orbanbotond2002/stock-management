import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import type { ProductStock } from '../../api/products'

type Props = {
  stocks: ProductStock[]
}

export function ProductStockByWarehouseCard({ stocks }: Props) {
  return (
    <Card variant="outlined" sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
          Stock by warehouse
        </Typography>
      </CardContent>

      <TableContainer>
        <Table size="small" sx={{ minWidth: 560 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'text.secondary' }}>Warehouse</TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>Location</TableCell>
              <TableCell
                align="right"
                sx={{ width: 120, color: 'text.secondary' }}
              >
                Quantity
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stocks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 1 }}
                  >
                    No stock records.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              stocks.map((s) => (
                <TableRow key={s.id} hover>
                  <TableCell>{s.warehouse.name}</TableCell>
                  <TableCell>{s.warehouse.location ?? '—'}</TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {s.quantity}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}
