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
import type { Warehouse } from '../../types'

type Props = {
  warehouses: Warehouse[]
  isLoading: boolean
  isAdmin: boolean
  disableActions: boolean
  onEdit: (warehouse: Warehouse) => void
  onDelete: (warehouse: Warehouse) => void
}

export function WarehousesTableCard({
  warehouses,
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
              <TableCell sx={{ color: 'text.secondary' }}>Name</TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>Location</TableCell>
              <TableCell
                align="right"
                sx={{ width: isAdmin ? 200 : 80, color: 'text.secondary' }}
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
            ) : warehouses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 1 }}
                  >
                    No warehouses.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              warehouses.map((w) => (
                <TableRow key={w.id} hover>
                  <TableCell>{w.name}</TableCell>
                  <TableCell>{w.location ?? '—'}</TableCell>
                  <TableCell align="right">
                    {isAdmin ? (
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <Button
                          onClick={() => onEdit(w)}
                          size="small"
                          sx={{ textTransform: 'none' }}
                          disabled={disableActions}
                        >
                          Edit
                        </Button>
                        <Divider orientation="vertical" flexItem />
                        <Button
                          onClick={() => onDelete(w)}
                          size="small"
                          color="error"
                          sx={{ textTransform: 'none' }}
                          disabled={disableActions}
                        >
                          Delete
                        </Button>
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        —
                      </Typography>
                    )}
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
