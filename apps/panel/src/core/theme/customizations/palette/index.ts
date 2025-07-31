// ** Type Imports
import { Palette } from '@mui/material'

const DefaultPalette = (mode: Palette['mode']): Partial<Palette> => {
  // ** Vars
  const whiteColor = '#ffffff'
  const lightColor = '76, 78, 100'
  const darkColor = '234, 234, 234'
  const mainColor = mode === 'light' ? lightColor : darkColor

  const defaultBgColor = () => {
    if (mode === 'light') return '#FFFFFF'
    else return '#212121'
  }
  // @ts-ignore
  return {
    customColors: {
      dark: `rgb(${darkColor})`,
      main: `rgb(${mainColor})`,
      light: `rgb(${lightColor})`,
      darkBg: '#212121',
      lightBg: '#F7F7F7',
      paperLight: mode === 'light' ? whiteColor : '#424242',
      logo: mode === 'light' ? '#3C496B' : '#FFFFFF',
      base: '#F9D949',
      bodyBg: mode === 'light' ? '#F7F7F7' : '#212121',
      trackBg: mode === 'light' ? '#F2F2F2' : '#41435C',
      avatarBg: mode === 'light' ? '#F1F1F3' : '#3F425C',
      tooltipBg: mode === 'light' ? '#262732' : '#464A65',
      tableHeaderBg: mode === 'light' ? '#F5F5F7' : '#353535',
    },
    mode: mode,
    common: {
      black: '#000',
      white: whiteColor,
    },
    primary: {
      main: mode === 'light' ? '#f7ce00' : '#e9570c',
      contrastText: whiteColor,
    },
    secondary: {
      main: mode === 'light' ? '#fefefe' : '#424242',
      contrastText: whiteColor,
    },
    error: {
      light: '#FF625F',
      main: '#FF4D49',
      dark: '#E04440',
      contrastText: whiteColor,
    },
    warning: {
      light: '#FDBE42',
      main: '#FDB528',
      dark: '#DF9F23',
      contrastText: whiteColor,
    },
    info: {
      light: '#40CDFA',
      main: '#26C6F9',
      dark: '#21AEDB',
      contrastText: whiteColor,
    },
    success: {
      light: '#83E542',
      main: '#72E128',
      dark: '#64C623',
      contrastText: whiteColor,
    },
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      A100: '#F5F5F5',
      A200: '#EEEEEE',
      A400: '#BDBDBD',
      A700: '#616161',
    },
    text: {
      primary: `rgba(${mainColor}, 0.9)`,
      secondary: `rgba(${mainColor}, 0.75)`,
      disabled: `rgba(${mainColor}, 0.48)`,
    },
    divider: `rgba(${mainColor}, 0.3)`,
    background: {
      paper: mode === 'light' ? whiteColor : '#424242',
      default: defaultBgColor(),
    },
    action: {
      active: `rgba(${mainColor}, 0.54)`,
      hover: `rgba(${mainColor}, 0.05)`,
      hoverOpacity: 0.05,
      selected: `rgba(${mainColor}, 0.08)`,
      disabled: `rgba(${mainColor}, 0.26)`,
      disabledBackground: `rgba(${mainColor}, 0.12)`,
      focus: `rgba(${mainColor}, 0.12)`,
    },
  } as Partial<Palette>
}

export default DefaultPalette
