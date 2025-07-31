// ** MUI imports
import Box, { BoxProps } from '@mui/material/Box'
import { styled } from '@mui/material/styles'

const DropzoneWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  '&.dropzone, & .dropzone': {
    minHeight: 200,
    display: 'flex',
    flexWrap: 'wrap',
    cursor: 'pointer',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius,
    border: `2px dashed ${theme.palette.mode === 'light' ? 'rgba(93, 89, 98, 0.22)' : 'rgba(247, 244, 254, 0.14)'}`,
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center',
    },
    '&:focus': {
      outline: 'none',
    },
    '& + .MuiList-root': {
      padding: 0,
      marginTop: theme.spacing(6.25),
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      '& .MuiListItem-root': {
        flex: '1 0 15rem',
        display: 'flex',
        justifyContent: 'space-between',
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(2.5, 2.4, 2.5, 2.5),
        border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(93, 89, 98, 0.14)' : 'rgba(247, 244, 254, 0.14)'}`,
        '& .file-details': {
          display: 'flex',
          alignItems: 'center',
        },
        '& .file-preview': {
          display: 'flex',
          marginRight: theme.spacing(3.75),
          '& svg': {
            fontSize: '2rem',
          },
        },
        '& img': {
          width: 48,
          height: 48,
          backgroundSize: 'cover',
          padding: theme.spacing(0.75),
          borderRadius: theme.shape.borderRadius,
          border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(93, 89, 98, 0.14)' : 'rgba(247, 244, 254, 0.14)'}`,
        },
        '& .file-name': {
          fontWeight: 600,
        },
      },
      '& + .buttons': {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: theme.spacing(6.25),
        '& > :first-of-type': {
          marginRight: theme.spacing(3.5),
        },
      },
    },
    '& + .MuiGrid-container': {
      padding: 0,
      marginTop: theme.spacing(6.25),
      '& .MuiGrid-item': {
        '& .file-item': {
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          borderRadius: theme.shape.borderRadius,
          padding: theme.spacing(2.5, 2.4, 2.5, 2.5),
          border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(93, 89, 98, 0.14)' : 'rgba(247, 244, 254, 0.14)'}`,
          '& .file-details': {
            display: 'flex',
            alignItems: 'center',
          },
          '& .file-preview': {
            display: 'flex',
            marginRight: theme.spacing(3.75),
            '& svg': {
              fontSize: '2rem',
            },
          },
          '& img': {
            width: 48,
            height: 48,
            backgroundSize: 'cover',
            padding: theme.spacing(0.75),
            borderRadius: theme.shape.borderRadius,
            border: `1px solid ${theme.palette.mode === 'light' ? 'rgba(93, 89, 98, 0.14)' : 'rgba(247, 244, 254, 0.14)'}`,
          },
          '& .file-name': {
            fontWeight: 600,
          },
        },
      },
      '& + .buttons': {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: theme.spacing(6.25),
        '& > :first-of-type': {
          marginRight: theme.spacing(3.5),
        },
      },
    },
    '& img.single-file-image': {
      objectFit: 'cover',
      position: 'absolute',
      width: 'calc(100% - 1rem)',
      height: 'calc(100% - 1rem)',
      borderRadius: theme.shape.borderRadius,
    },
  },
}))

export default DropzoneWrapper
