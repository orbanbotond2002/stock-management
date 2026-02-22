import { AppBar, Box, Button, Container, Toolbar } from '@mui/material'
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

type NavItem = {
  label: string
  to: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Warehouses', to: '/warehouses' },
  { label: 'Stock Movements', to: '/stock-movements' },
]

export function AppLayout() {
  const { logout } = useAuth()
  const location = useLocation()

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          bgcolor: 'background.default',
          backgroundImage: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar disableGutters>
          <Container
            maxWidth="lg"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 1,
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.to
                return (
                  <Button
                    key={item.to}
                    component={RouterLink}
                    to={item.to}
                    color={isActive ? 'primary' : 'inherit'}
                    size="small"
                    sx={{ textTransform: 'none' }}
                  >
                    {item.label}
                  </Button>
                )
              })}
            </Box>

            <Button
              onClick={logout}
              size="small"
              variant="outlined"
              sx={{ textTransform: 'none' }}
            >
              Logout
            </Button>
          </Container>
        </Toolbar>
      </AppBar>

      <Outlet />
    </Box>
  )
}
