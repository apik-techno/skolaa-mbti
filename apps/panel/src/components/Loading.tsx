// ** MUI Imports
import { CircularProgress, Typography } from '@mui/material'
import Box from '@mui/material/Box'

const Loading: React.FC<{ open?: boolean }> = ({ open = true }) => {
  // ** Props
  if (!open) return null
  return (
    <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <CircularProgress sx={{ mb: 4 }} />
      <Typography>Loading...</Typography>
    </Box>
  )
}

export default Loading
