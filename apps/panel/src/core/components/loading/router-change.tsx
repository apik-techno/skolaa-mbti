import { Backdrop, CircularProgress } from '@mui/material'

export default function RouterLoading({ open = true }: { open?: boolean }) {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <Backdrop
      sx={{ color: ({ palette }) => palette.text.primary, zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  )
}
