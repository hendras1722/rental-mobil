'use client'
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#fa8231',
        },
        secondary: {
          main: '#eb3b5a',
        },
      },
    },
  },
  typography: {
    fontFamily: 'var(--font-roboto)',
    button: {
      textTransform: 'none',
    },
  },
})

export default theme
