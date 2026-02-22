import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Container } from '@mui/material'
import {
  createWarehouse,
  deleteWarehouse,
  fetchWarehouses,
  updateWarehouse,
  type UpsertWarehouseInput,
} from '../api/warehouses'
import type { Warehouse } from '../types'
import { useAuth } from '../auth/useAuth'
import { ErrorAlert } from '../components/ErrorAlert'
import { PageHeader } from '../components/PageHeader'
import { WarehousesTableCard } from '../components/warehouses/WarehousesTableCard'
import { WarehouseUpsertCard } from '../components/warehouses/WarehouseUpsertCard'
import {
  upsertWarehouseSchema,
  type UpsertWarehouseFormValues,
} from '../components/warehouses/upsertWarehouseSchema'

export function WarehousesPage() {
  const { token, hasRole } = useAuth()
  const isAdmin = hasRole('admin')
  const queryClient = useQueryClient()

  const [editing, setEditing] = useState<Warehouse | null>(null)

  const warehousesQuery = useQuery({
    queryKey: ['warehouses', token],
    queryFn: () => fetchWarehouses(token as string),
    enabled: Boolean(token),
  })

  const createMutation = useMutation({
    mutationFn: (input: UpsertWarehouseInput) =>
      createWarehouse(token as string, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['warehouses'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: (vars: { id: string; input: UpsertWarehouseInput }) =>
      updateWarehouse(token as string, vars.id, vars.input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['warehouses'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteWarehouse(token as string, id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['warehouses'] })
    },
  })

  const form = useForm<UpsertWarehouseFormValues>({
    resolver: zodResolver(upsertWarehouseSchema),
    defaultValues: { name: '', location: '' },
    mode: 'onChange',
  })

  const onSubmit = form.handleSubmit(async (values) => {
    if (!isAdmin) return

    const input: UpsertWarehouseInput = values

    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, input })
      setEditing(null)
    } else {
      await createMutation.mutateAsync(input)
    }

    form.reset({ name: '', location: '' })
  })

  const startEdit = (warehouse: Warehouse) => {
    if (!isAdmin) return
    setEditing(warehouse)
    form.reset({
      name: warehouse.name,
      location: warehouse.location ?? '',
    })
  }

  const cancelEdit = () => {
    setEditing(null)
    form.reset({ name: '', location: '' })
  }

  const onDelete = async (warehouse: Warehouse) => {
    if (!isAdmin) return
    await deleteMutation.mutateAsync(warehouse.id)
    if (editing?.id === warehouse.id) cancelEdit()
  }

  const firstError =
    warehousesQuery.error ??
    createMutation.error ??
    updateMutation.error ??
    deleteMutation.error

  return (
    <Container maxWidth="lg" sx={{ py: 3, textAlign: 'left' }}>
      <ErrorAlert error={firstError} />
      <PageHeader title="Warehouses" subtitle="Manage warehouse locations" />

      {isAdmin && (
        <WarehouseUpsertCard
          form={form}
          title={editing ? 'Edit warehouse' : 'Create warehouse'}
          submitLabel={editing ? 'Save' : 'Create'}
          onSubmit={onSubmit}
          onCancel={editing ? cancelEdit : undefined}
          disableSubmit={
            form.formState.isSubmitting ||
            createMutation.isPending ||
            updateMutation.isPending
          }
          disableCancel={
            form.formState.isSubmitting ||
            createMutation.isPending ||
            updateMutation.isPending
          }
        />
      )}

      <WarehousesTableCard
        warehouses={warehousesQuery.data ?? []}
        isLoading={warehousesQuery.isLoading}
        isAdmin={isAdmin}
        disableActions={
          deleteMutation.isPending ||
          createMutation.isPending ||
          updateMutation.isPending
        }
        onEdit={startEdit}
        onDelete={onDelete}
      />
    </Container>
  )
}
