import IconifyIcon from '@/core/components/icon'
import { downloadURI } from '@/utils/downloader'
import { Button, Modal } from '@mui/material'
import { useState } from 'react'

type ModalProps = {
  image?: string
  open?: boolean
  onClose?: () => void
}

export function ModalMedia({ open, onClose, image }: ModalProps) {
  const [loading, setLoading] = useState(true)
  const handleClose = async () => {
    if (onClose) onClose()
    setLoading(true)
  }
  return (
    <Modal
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': {
          backgroundcolor: 'red',
        },
      }}
      open={Boolean(open)}
      onClose={handleClose}
      closeAfterTransition
    >
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image || ''}
          alt="asd"
          loading="eager"
          style={{ maxHeight: '80vh', maxWidth: '80vw', height: '100%' }}
        />
        <div className="absolute right-1 left-1 bottom-1 z-1">
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              const rand = crypto.randomUUID()
              if (image) downloadURI(image, rand)
            }}
            startIcon={<IconifyIcon icon="ph:download" />}
          >
            Download
          </Button>
        </div>
      </div>
    </Modal>
  )
}
