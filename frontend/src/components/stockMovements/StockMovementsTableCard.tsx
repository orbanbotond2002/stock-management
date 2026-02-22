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
import type { StockMovement } from '../../types'

type Props = {
  movements: StockMovement[]
  isLoading: boolean
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString()
}

export function StockMovementsTableCard({ movements, isLoading }: Props) {
  return (
    <Card variant="outlined" sx={{ mt: 2 }}>
      <TableContainer>
        <Table size="small" sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 190, color: 'text.secondary' }}>
                Date
              </TableCell>
              <TableCell sx={{ width: 110, color: 'text.secondary' }}>
                Type
              </TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>Product</TableCell>
              <TableCell
                align="right"
                sx={{ width: 110, color: 'text.secondary' }}
              >
                Qty
              </TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>Source</TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>Target</TableCell>
              <TableCell sx={{ width: 220, color: 'text.secondary' }}>
                Created by
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography variant="body2" sx={{ py: 1 }}>
                    Loading…
                  </Typography>
                </TableCell>
              </TableRow>
            ) : movements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 1 }}
                  >
                    No stock movements.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              movements.map((m) => (
                <TableRow key={m.id} hover>
                  <TableCell>{formatDate(m.createdAt)}</TableCell>
                  <TableCell>{m.type}</TableCell>
                  <TableCell>
                    {m.product?.sku} · {m.product?.name}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {m.quantity}
                  </TableCell>
                  <TableCell>{m.sourceWarehouse?.name ?? '—'}</TableCell>
                  <TableCell>{m.targetWarehouse?.name ?? '—'}</TableCell>
                  <TableCell>{m.creator?.email ?? '—'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}
