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
import type { UpsertWarehouseFormValues } from './upsertWarehouseSchema'

type Props = {
  form: UseFormReturn<UpsertWarehouseFormValues>
  title: string
  submitLabel: string
  onSubmit: () => void
  onCancel?: () => void
  disableSubmit: boolean
  disableCancel: boolean
}

export function WarehouseUpsertCard({
  form,
  title,
  submitLabel,
  onSubmit,
  onCancel,
  disableSubmit,
  disableCancel,
}: Props) {
  return (
    <Card variant="outlined" sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
          {title}
        </Typography>

        <Box component="form" onSubmit={onSubmit}>
          <Stack spacing={1.5}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <TextField
                label="Name"
                size="small"
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
                {...form.register('name')}
                error={Boolean(form.formState.errors.name)}
                helperText={form.formState.errors.name?.message}
              />
              <TextField
                label="Location"
                size="small"
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
                {...form.register('location')}
                error={Boolean(form.formState.errors.location)}
                helperText={form.formState.errors.location?.message}
              />
            </Stack>

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
