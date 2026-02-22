import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Container } from '@mui/material'
import { createStockMovement, fetchStockMovements } from '../api/stockMovements'
import { fetchProducts } from '../api/products'
import { fetchWarehouses } from '../api/warehouses'
import { useAuth } from '../auth/useAuth'
import { ErrorAlert } from '../components/ErrorAlert'
import { PageHeader } from '../components/PageHeader'
import { StockMovementCreateCard } from '../components/stockMovements/StockMovementCreateCard'
import { StockMovementsTableCard } from '../components/stockMovements/StockMovementsTableCard'
import {
  createStockMovementSchema,
  type CreateStockMovementFormValues,
} from '../components/stockMovements/createStockMovementSchema'
import type { CreateStockMovementInput } from '../api/stockMovements'

const DEFAULT_VALUES = {
  type: 'IN' as const,
  productId: '',
  quantity: 1 as number,
}

export function StockMovementsPage() {
  const { token, hasRole } = useAuth()
  const canCreate = hasRole('admin', 'manager')
  const queryClient = useQueryClient()

  const movementsQuery = useQuery({
    queryKey: ['stockMovements', token],
    queryFn: () => fetchStockMovements(token as string),
    enabled: Boolean(token),
  })

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

  const createMutation = useMutation({
    mutationFn: (input: CreateStockMovementInput) =>
      createStockMovement(token as string, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['stockMovements'] })
      await queryClient.invalidateQueries({ queryKey: ['reports'] })
      await queryClient.invalidateQueries({ queryKey: ['products', 'detail'] })
    },
  })

  const form = useForm<CreateStockMovementFormValues>({
    resolver: zodResolver(createStockMovementSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onChange',
    shouldUnregister: true,
  })

  const onSubmit = form.handleSubmit(async (values) => {
    if (!canCreate) return

    let input: CreateStockMovementInput

    if (values.type === 'IN') {
      input = {
        type: 'IN',
        productId: values.productId,
        quantity: values.quantity,
        targetWarehouseId: values.targetWarehouseId,
      }
    } else if (values.type === 'OUT') {
      input = {
        type: 'OUT',
        productId: values.productId,
        quantity: values.quantity,
        sourceWarehouseId: values.sourceWarehouseId,
      }
    } else {
      input = {
        type: 'TRANSFER',
        productId: values.productId,
        quantity: values.quantity,
        sourceWarehouseId: values.sourceWarehouseId,
        targetWarehouseId: values.targetWarehouseId,
      }
    }

    await createMutation.mutateAsync(input)
    form.reset(DEFAULT_VALUES)
  })

  const firstError =
    movementsQuery.error ??
    productsQuery.error ??
    warehousesQuery.error ??
    createMutation.error

  return (
    <Container maxWidth="lg" sx={{ py: 3, textAlign: 'left' }}>
      <ErrorAlert error={firstError} />
      <PageHeader title="Stock Movements" subtitle="Record IN/OUT/TRANSFER" />

      <StockMovementCreateCard
        form={form}
        products={productsQuery.data ?? []}
        warehouses={warehousesQuery.data ?? []}
        canCreate={canCreate}
        onSubmit={onSubmit}
        disableSubmit={
          form.formState.isSubmitting ||
          createMutation.isPending ||
          productsQuery.isLoading ||
          warehousesQuery.isLoading
        }
      />

      <StockMovementsTableCard
        movements={movementsQuery.data ?? []}
        isLoading={movementsQuery.isLoading}
      />
    </Container>
  )
}
