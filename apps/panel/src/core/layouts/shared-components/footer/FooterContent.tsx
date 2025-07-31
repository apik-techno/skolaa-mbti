// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const FooterContent = () => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant="caption" sx={{ mr: 2 }}>
        Copyright {`© ${new Date().getFullYear()}  `}
      </Typography>
    </Box>
  )
}

export default FooterContent
