// ** React Imports
import React, { Fragment, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Icon Imports
import Icon from '@/core/components/icon'

// ** Third Party Imports
import { removeExtension } from '@/utils/format'
import { Grid, LinearProgress } from '@mui/material'
import _ from 'lodash'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'

// Styled component for the upload image inside the dropzone area
const Img = styled('img')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    marginRight: theme.spacing(10),
  },
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4),
  },
  [theme.breakpoints.down('sm')]: {
    width: 250,
  },
}))

// Styled component for the heading inside the dropzone area
const HeadingTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
  marginBottom: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(4),
  },
}))

type UploaderProps = {
  onComplete: () => void
  uploadFile: (file: File) => Promise<any>
  isUploading: (load: boolean) => void
  active: boolean
}

type UploadProps = {
  index: number
  type: string
  playType: number
  file: File
}
const maxSize = 5 * 1024 * 1024

const ImageUploader = ({ onComplete, isUploading, uploadFile, active }: UploaderProps) => {
  // ** State
  const [successIndex, setSuccessIndex] = useState<{ id: number; status: boolean }[]>([])
  const [progress, setProgress] = useState<number>()
  const [uploadFiles, setUploadFiles] = useState<UploadProps[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDisable, setIsDisable] = useState(true)

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles: File[]) => {
      setIsLoading(true)
      if (isLoading) {
        toast.success(`Upload in progress`)
      } else {
        const newFiles: UploadProps[] = _.clone(uploadFiles)
        for (const acceptedFile of acceptedFiles) {
          if (acceptedFile.type.includes('image')) {
            newFiles.push({ index: Math.random(), type: 'image', file: acceptedFile, playType: 0 })
          }
        }
        setUploadFiles(newFiles)
      }
      setIsLoading(false)
    },
    maxSize: maxSize,
    accept: {
      'image/*': ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    },
  })

  const renderFilePreview = ({ file }: UploadProps) => {
    if (file.type.startsWith('image')) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img alt={file.name} src={URL.createObjectURL(file as any)} />
    } else {
      return <Icon icon="mdi:file-document-outline" />
    }
  }

  const handleRemoveFile = ({ file }: UploadProps) => {
    const filtered = uploadFiles.filter((i: UploadProps) => i.file.name !== file.name)
    setUploadFiles([...filtered])
  }

  const fileList = uploadFiles.map((props: UploadProps) => {
    let status = null
    if (progress === props.index) {
      status = <LinearProgress variant="indeterminate" color="info" />
    } else {
      const find = successIndex.find((f) => f.id === props.index)
      if (find) {
        if (find.status) status = <LinearProgress variant="determinate" value={100} color="success" />
        else status = <LinearProgress variant="determinate" value={100} color="error" />
      }
    }
    return (
      <Grid item xs={12} sm={6} lg={4} xl={3} key={props.file.name + props.index}>
        <Box className="file-item">
          <Box className="file-details" sx={{ flex: 1 }}>
            <div className="file-preview">{renderFilePreview(props)}</div>
            <Box sx={{ flex: 1 }}>
              <Typography className="file-name line-clamp-1">{removeExtension(props.file.name)}</Typography>
              <Box display="flex" gap="1rem">
                <Typography className="file-size" variant="body2">
                  {props.file.type}
                </Typography>
                <Typography className="file-size" variant="body2">
                  {Math.round(props.file.size / 100) / 10 > 1000
                    ? `${(Math.round(props.file.size / 100) / 10000).toFixed(1)} mb`
                    : `${(Math.round(props.file.size / 100) / 10).toFixed(1)} kb`}
                </Typography>
              </Box>

              {status}
            </Box>
          </Box>
          {!status && (
            <IconButton
              sx={{ width: '3rem', height: '3rem' }}
              disabled={isLoading}
              onClick={() => handleRemoveFile(props)}
            >
              <Icon icon="mdi:trash" fontSize={20} />
            </IconButton>
          )}
        </Box>
      </Grid>
    )
  })

  const handleRemoveAllFiles = () => {
    setUploadFiles([])
    setSuccessIndex([])
    setIsLoading(false)
  }
  const handleSubmitFiles = async () => {
    setIsLoading(true)
    const successFiles = _.clone(successIndex)
    for (let i = 0; i < uploadFiles.length; i++) {
      const item = uploadFiles[i]
      if (!item) continue
      const find = successFiles.find((v) => v.id === item.index)
      if (!find && item.file) {
        setProgress(item.index)
        const res = await uploadFile(item.file).catch(() => false)
        if (res) {
          setSuccessIndex((s) => {
            const indexes = _.clone(s)
            indexes.push({ id: item.index, status: true })
            return indexes
          })
        } else {
          setSuccessIndex((s) => {
            const indexes = _.clone(s)
            indexes.push({ id: item.index, status: false })
            return indexes
          })
        }
        setProgress(undefined)
      }
    }
    setIsLoading(false)
    onComplete()
  }
  React.useEffect(() => {
    isUploading(isLoading)
  }, [isLoading, isUploading])

  React.useEffect(() => {
    if (!active) handleRemoveAllFiles()
  }, [active])

  React.useEffect(() => {
    if (uploadFiles.length !== successIndex.length) setIsDisable(false)
    else setIsDisable(true)
  }, [uploadFiles, successIndex])

  return (
    <div className="mt-2">
      <div
        {...getRootProps({
          className:
            'dropzone bg-primary/20 border border-dashed border-[2px] border-primary rounded-xl hover:bg-primary/40 transition-colors duration-200 ease-in-out cursor-pointer',
        })}
      >
        <input {...getInputProps()} disabled={isLoading || isDisable} accept="image" />
        <Box sx={{ display: 'flex', flexDirection: ['column', 'column', 'row'], alignItems: 'center' }}>
          <Img width={300} alt="Upload img" src="/images/misc/upload.png" />
          <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: ['center', 'center', 'inherit'] }}>
            <HeadingTypography variant="h5">Drop files here or click to upload.</HeadingTypography>
            <Typography color="textSecondary" sx={{ '& a': { color: 'primary.main', textDecoration: 'none' } }}>
              Drop files here or click{' '}
              <Link href="#" onClick={(e) => e.preventDefault()}>
                browse
              </Link>{' '}
              to upload images (Only JPG, JPEG, PNG & ZIP)
            </Typography>
          </Box>
        </Box>
      </div>
      {uploadFiles.length ? (
        <Fragment>
          <Grid container spacing={2}>
            {fileList}
          </Grid>
          <div className="buttons">
            <Button color="error" disabled={isLoading} variant="outlined" onClick={handleRemoveAllFiles}>
              Remove All
            </Button>
            <Button variant="contained" disabled={isLoading || isDisable} onClick={handleSubmitFiles}>
              Upload Files
            </Button>
          </div>
        </Fragment>
      ) : null}
    </div>
  )
}

export default ImageUploader
