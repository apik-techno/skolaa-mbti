import { Link as MuiLink, LinkProps as MuiLinkProps } from '@mui/material'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import { forwardRef } from 'react'

type CustomLinkProps = NextLinkProps & Omit<MuiLinkProps, 'href'>

const CustomLink = forwardRef<HTMLAnchorElement, CustomLinkProps>(function CustomLink({ ...muiProps }, ref) {
  return <MuiLink component={NextLink} {...muiProps} ref={ref} prefetch passHref />
})

export default CustomLink
