import { Button, Card, CardContent, Stack, TextField } from '@mui/material'

type Props = {
  search: string
  onSearchChange: (value: string) => void
  onClear: () => void
}

export function ProductSearchCard({ search, onSearchChange, onClear }: Props) {
  return (
    <Card variant="outlined" sx={{ mt: 3 }}>
      <CardContent>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <TextField
            label="Search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            size="small"
            fullWidth
            placeholder="e.g. SKU-001 or Laptop"
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <Button
            variant="outlined"
            onClick={onClear}
            disabled={!search.trim()}
            sx={{ textTransform: 'none' }}
          >
            Clear
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}
