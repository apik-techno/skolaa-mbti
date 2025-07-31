// ** MUI Imports
import { Button, ButtonProps, FormHelperText, styled, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import React from 'react'
type ImageInputProps = {
  onChange: (file?: File | null) => void
  disabled?: boolean
  label?: string
  src?: string
  error?: string
}
const ImageInput = ({ onChange, error, src, disabled, label }: ImageInputProps) => {
  const [imgSrc, setImgSrc] = React.useState<string>('')
  const [inputValue, setInputValue] = React.useState<string>('')

  const onImageChange = (file: React.ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement
    const fileData = files?.[0]
    if (files && files.length !== 0 && fileData) {
      onChange(fileData)
      reader.onload = () => {}
      reader.readAsDataURL(fileData)
      if (reader.result !== null) {
        setInputValue(reader.result as string)
      }
    }
  }
  const onImageReset = () => {
    setInputValue('')
    onChange(undefined)
  }
  React.useEffect(() => {
    setImgSrc(src || '/images/misc/no-image.jpg')
    if (!src) setInputValue('')
  }, [src])
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: '1.25rem' }}>
      <ImgStyled src={imgSrc.trim() === '' ? '/images/misc/no-image.jpg' : imgSrc} alt="Profile Pic" />
      <div>
        {label && (
          <Typography fontSize="1rem" fontWeight={600} className="mb-2">
            {label}
          </Typography>
        )}
        <ButtonStyled disabled={disabled} type="button" size="small" component="label" variant="contained">
          Upload Photo
          <input
            hidden
            type="file"
            value={inputValue}
            accept="image/png, image/jpeg, image/webp, image/avif"
            onChange={onImageChange}
            id="account-settings-upload-image"
          />
        </ButtonStyled>
        {imgSrc && (
          <ResetButtonStyled
            size="small"
            disabled={disabled}
            type="button"
            color="primary"
            variant="outlined"
            onClick={onImageReset}
          >
            Reset
          </ResetButtonStyled>
        )}
        <Typography sx={{ mt: 1, color: 'text.secondary' }}>
          Allowed upload format is PNG, WEBP, AVIF or JPEG.
        </Typography>
        {error && <FormHelperText sx={{ color: 'error.main' }}>{error?.toString()}</FormHelperText>}
      </div>
    </Box>
  )
}

export default ImageInput

const ImgStyled = styled('img')(({ theme }) => ({
  width: 100,
  height: 100,
  marginRight: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  objectFit: 'cover',
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: React.ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center',
  },
}))

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
  marginLeft: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4),
  },
}))
