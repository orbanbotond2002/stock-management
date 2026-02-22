import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Controller, type UseFormReturn } from 'react-hook-form'
import type { Product, Warehouse } from '../../types'
import type { CreateStockMovementFormValues } from './createStockMovementSchema'

type Props = {
  form: UseFormReturn<CreateStockMovementFormValues>
  products: Product[]
  warehouses: Warehouse[]
  canCreate: boolean
  onSubmit: () => void
  disableSubmit: boolean
}

export function StockMovementCreateCard({
  form,
  products,
  warehouses,
  canCreate,
  onSubmit,
  disableSubmit,
}: Props) {
  const { control, register, watch, formState } = form
  const type = watch('type')

  if (!canCreate) return null

  return (
    <Card variant="outlined" sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
          Create movement
        </Typography>

        <Box component="form" onSubmit={onSubmit}>
          <Stack spacing={1.5}>
            {/* Row 1: type / product / quantity */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Controller
                name="type"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Type"
                    size="small"
                    fullWidth
                    select
                    slotProps={{ inputLabel: { shrink: true } }}
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  >
                    <MenuItem value="IN">IN</MenuItem>
                    <MenuItem value="OUT">OUT</MenuItem>
                    <MenuItem value="TRANSFER">TRANSFER</MenuItem>
                  </TextField>
                )}
              />

              <Controller
                name="productId"
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Product"
                    size="small"
                    fullWidth
                    select
                    slotProps={{ inputLabel: { shrink: true } }}
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  >
                    {products.length === 0 ? (
                      <MenuItem value="" disabled>
                        No products
                      </MenuItem>
                    ) : (
                      products.map((p) => (
                        <MenuItem key={p.id} value={p.id}>
                          {p.sku} · {p.name}
                        </MenuItem>
                      ))
                    )}
                  </TextField>
                )}
              />

              <TextField
                label="Quantity"
                size="small"
                fullWidth
                type="number"
                inputProps={{ min: 1, step: 1 }}
                slotProps={{ inputLabel: { shrink: true } }}
                {...register('quantity')}
                error={Boolean(formState.errors.quantity)}
                helperText={formState.errors.quantity?.message}
              />
            </Stack>

            {/* Row 2: warehouse selects (shown only when relevant) */}
            {(type === 'OUT' || type === 'TRANSFER' || type === 'IN') && (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                {(type === 'OUT' || type === 'TRANSFER') && (
                  <Controller
                    name="sourceWarehouseId"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        value={field.value ?? ''}
                        label="Source warehouse"
                        size="small"
                        fullWidth
                        select
                        slotProps={{ inputLabel: { shrink: true } }}
                        error={Boolean(fieldState.error)}
                        helperText={fieldState.error?.message}
                      >
                        {warehouses.length === 0 ? (
                          <MenuItem value="" disabled>
                            No warehouses
                          </MenuItem>
                        ) : (
                          warehouses.map((w) => (
                            <MenuItem key={w.id} value={w.id}>
                              {w.name}
                            </MenuItem>
                          ))
                        )}
                      </TextField>
                    )}
                  />
                )}

                {(type === 'IN' || type === 'TRANSFER') && (
                  <Controller
                    name="targetWarehouseId"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        value={field.value ?? ''}
                        label="Target warehouse"
                        size="small"
                        fullWidth
                        select
                        slotProps={{ inputLabel: { shrink: true } }}
                        error={Boolean(fieldState.error)}
                        helperText={fieldState.error?.message}
                      >
                        {warehouses.length === 0 ? (
                          <MenuItem value="" disabled>
                            No warehouses
                          </MenuItem>
                        ) : (
                          warehouses.map((w) => (
                            <MenuItem key={w.id} value={w.id}>
                              {w.name}
                            </MenuItem>
                          ))
                        )}
                      </TextField>
                    )}
                  />
                )}
              </Stack>
            )}

            <Stack direction="row">
              <Button
                type="submit"
                variant="contained"
                sx={{ textTransform: 'none' }}
                disabled={disableSubmit}
              >
                Create
              </Button>
            </Stack>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  )
}
