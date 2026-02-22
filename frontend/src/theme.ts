import { createTheme } from '@mui/material/styles'

export const appTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0b0f17',
      paper: 'rgba(255, 255, 255, 0.04)',
    },
  },
  components: {
    MuiPopover: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: theme.palette.background.default,
          backgroundImage: 'none',
          opacity: 1,
          border: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: theme.palette.background.default,
          backgroundImage: 'none',
          opacity: 1,
          border: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: theme.palette.background.default,
          backgroundImage: 'none',
          opacity: 1,
          border: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily:
      'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  },
})
