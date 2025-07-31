// ** MUI Imports
import { InputAdornment } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

// ** Icon Imports
import Icon from '@/core/icon'

interface TableHeaderProps {
  value?: string
  title?: string
  toggle?: () => void
  handleFilter?: (val: string) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, toggle, value, title } = props

  return (
    <Box
      sx={{ py: 4, px: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
        {/* <Button sx={{ mb: 2 }} variant="outlined" startIcon={<Icon icon="mdi:filter" fontSize={20} />}>
          Filter
        </Button> */}
        {handleFilter && (
          <TextField
            size="small"
            value={value}
            placeholder={title || 'Cari'}
            InputProps={{
              startAdornment: (
                <InputAdornment component="div" position="start">
                  <Icon icon="material-symbols:search-rounded" fontSize={20} />
                </InputAdornment>
              ),
            }}
            onChange={(e) => handleFilter(e.target.value)}
          />
        )}
      </Box>
      {toggle && (
        <Button onClick={toggle} variant="contained">
          BUAT
        </Button>
      )}
    </Box>
  )
}

export default TableHeader
