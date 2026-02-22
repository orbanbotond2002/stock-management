import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import type { UseFormReturn } from 'react-hook-form'
import type { UpsertProductFormValues } from './upsertProductSchema'

type Props = {
  form: UseFormReturn<UpsertProductFormValues>
  editingTitle: string
  submitLabel: string
  onSubmit: () => void
  onCancel?: () => void
  disableSubmit: boolean
  disableCancel: boolean
}

export function ProductUpsertCard({
  form,
  editingTitle,
  submitLabel,
  onSubmit,
  onCancel,
  disableSubmit,
  disableCancel,
}: Props) {
  return (
    <Card variant="outlined" sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
          {editingTitle}
        </Typography>

        <Box component="form" onSubmit={onSubmit}>
          <Stack spacing={1.5}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <TextField
                label="SKU"
                size="small"
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
                {...form.register('sku')}
                error={Boolean(form.formState.errors.sku)}
                helperText={form.formState.errors.sku?.message}
              />
              <TextField
                label="Name"
                size="small"
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
                {...form.register('name')}
                error={Boolean(form.formState.errors.name)}
                helperText={form.formState.errors.name?.message}
              />
            </Stack>

            <TextField
              label="Description"
              size="small"
              fullWidth
              multiline
              minRows={2}
              slotProps={{ inputLabel: { shrink: true } }}
              {...form.register('description')}
            />

            <Stack direction="row" spacing={1}>
              <Button
                type="submit"
                variant="contained"
                sx={{ textTransform: 'none' }}
                disabled={disableSubmit}
              >
                {submitLabel}
              </Button>

              {onCancel && (
                <Button
                  type="button"
                  variant="outlined"
                  sx={{ textTransform: 'none' }}
                  onClick={onCancel}
                  disabled={disableCancel}
                >
                  Cancel
                </Button>
              )}
            </Stack>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  )
}
