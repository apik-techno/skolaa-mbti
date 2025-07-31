declare module '@mui/material/styles' {
  interface Palette {
    customColors: {
      dark: string
      main: string
      light: string
      bodyBg: string
      darkBg: string
      lightBg: string
      logo: string
      base: string
      trackBg: string
      avatarBg: string
      tooltipBg: string
      tableHeaderBg: string
      paperLight: string
    }
  }
  interface PaletteOptions {
    customColors?: {
      dark?: string
      main?: string
      light?: string
      bodyBg?: string
      darkBg?: string
      lightBg?: string
      trackBg?: string
      avatarBg?: string
      tooltipBg?: string
      tableHeaderBg?: string
      paperLight: string
    }
  }
}

export {}
