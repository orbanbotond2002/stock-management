import {
  Button,
  Card,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import type { Product } from '../../api/products'

type Props = {
  products: Product[]
  isLoading: boolean
  isAdmin: boolean
  disableActions: boolean
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
}

export function ProductsTableCard({
  products,
  isLoading,
  isAdmin,
  disableActions,
  onEdit,
  onDelete,
}: Props) {
  return (
    <Card variant="outlined" sx={{ mt: 2 }}>
      <TableContainer>
        <Table size="small" sx={{ minWidth: 560 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 140, color: 'text.secondary' }}>
                SKU
              </TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>Name</TableCell>
              <TableCell
                align="right"
                sx={{ width: isAdmin ? 260 : 120, color: 'text.secondary' }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography variant="body2" sx={{ py: 1 }}>
                    Loading…
                  </Typography>
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 1 }}
                  >
                    No products.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              products.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell sx={{ fontVariantNumeric: 'tabular-nums' }}>
                    {p.sku}
                  </TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={1}
                      justifyContent="flex-end"
                    >
                      <Button
                        component={RouterLink}
                        to={`/products/${p.id}`}
                        size="small"
                        sx={{ textTransform: 'none' }}
                      >
                        View
                      </Button>
                      {isAdmin && (
                        <>
                          <Divider orientation="vertical" flexItem />
                          <Button
                            onClick={() => onEdit(p)}
                            size="small"
                            sx={{ textTransform: 'none' }}
                            disabled={disableActions}
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => onDelete(p)}
                            size="small"
                            color="error"
                            sx={{ textTransform: 'none' }}
                            disabled={disableActions}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </Stack>
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
