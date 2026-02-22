import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Container } from '@mui/material'
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  type Product,
  updateProduct,
  type UpsertProductInput,
} from '../api/products'
import { useAuth } from '../auth/useAuth'
import { ErrorAlert } from '../components/ErrorAlert'
import { PageHeader } from '../components/PageHeader'
import { ProductSearchCard } from '../components/products/ProductSearchCard'
import { ProductUpsertCard } from '../components/products/ProductUpsertCard'
import { ProductsTableCard } from '../components/products/ProductsTableCard'
import {
  upsertProductSchema,
  type UpsertProductFormValues,
} from '../components/products/upsertProductSchema'

export function ProductsPage() {
  const { token, hasRole } = useAuth()
  const isAdmin = hasRole('admin')
  const queryClient = useQueryClient()

  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Product | null>(null)

  const normalizedSearch = useMemo(() => {
    const trimmed = search.trim()
    return trimmed.length > 0 ? trimmed : undefined
  }, [search])

  const productsQuery = useQuery({
    queryKey: ['products', token, normalizedSearch],
    queryFn: () => fetchProducts(token as string, normalizedSearch),
    enabled: Boolean(token),
  })

  const createMutation = useMutation({
    mutationFn: (input: UpsertProductInput) =>
      createProduct(token as string, input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: (vars: { id: string; input: UpsertProductInput }) =>
      updateProduct(token as string, vars.id, vars.input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(token as string, id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const form = useForm<UpsertProductFormValues>({
    resolver: zodResolver(upsertProductSchema),
    defaultValues: { sku: '', name: '', description: '' },
    mode: 'onChange',
  })

  const onSubmit = form.handleSubmit(async (values) => {
    if (!isAdmin) return

    const input: UpsertProductInput = values

    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, input })
      setEditing(null)
    } else {
      await createMutation.mutateAsync(input)
    }

    form.reset({ sku: '', name: '', description: '' })
  })

  const startEdit = (product: Product) => {
    if (!isAdmin) return
    setEditing(product)
    form.reset({
      sku: product.sku,
      name: product.name,
      description: product.description ?? '',
    })
  }

  const cancelEdit = () => {
    setEditing(null)
    form.reset({ sku: '', name: '', description: '' })
  }

  const onDelete = async (product: Product) => {
    if (!isAdmin) return
    await deleteMutation.mutateAsync(product.id)
    if (editing?.id === product.id) cancelEdit()
  }

  const firstError =
    productsQuery.error ??
    createMutation.error ??
    updateMutation.error ??
    deleteMutation.error

  return (
    <Container maxWidth="lg" sx={{ py: 3, textAlign: 'left' }}>
      <ErrorAlert error={firstError} />
      <PageHeader title="Products" subtitle="Search by SKU or name" />

      <ProductSearchCard
        search={search}
        onSearchChange={setSearch}
        onClear={() => setSearch('')}
      />

      {isAdmin && (
        <ProductUpsertCard
          form={form}
          editingTitle={editing ? 'Edit product' : 'Create product'}
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

      <ProductsTableCard
        products={productsQuery.data ?? []}
        isLoading={productsQuery.isLoading}
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
