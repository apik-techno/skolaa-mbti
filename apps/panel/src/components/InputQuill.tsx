import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import ReactQuill, { Quill } from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
// @ts-ignore
import ImageResize from 'quill-image-resize-module-react'
// @ts-ignore
import ImageCompress from 'quill-image-compress'

// Register the modules
Quill.register('modules/imageResize', ImageResize)
Quill.register('modules/imageCompress', ImageCompress)

interface InputQuillProps {
  value: string
  onChange: (content: string) => void
  [key: string]: any
}

const StyledQuill = styled(Box)(({ theme }) => ({
  '& .quill': {
    borderRadius: '0.5rem',
    border: `1px solid ${theme.palette.divider}`,
  },
  '& .ql-picker-options': {
    backgroundColor: `${theme.palette.background.paper} !important`,
  },
  '& .ql-toolbar': {
    backgroundColor: theme.palette.background.paper,
    borderColor: theme.palette.divider,
    border: `1px solid rgba(255, 255, 255, 0.23) !important`,
    borderRadius: '0.5rem 0.5rem 0 0', // Rounded corners for the top of the toolbar
    '& .ql-stroke': { fill: 'none', stroke: theme.palette.text.primary },
    '& .ql-fill': { fill: theme.palette.text.primary, stroke: 'none' },
    '& .ql-picker': { color: theme.palette.text.primary },
    '& button:hover .ql-stroke, & .ql-picker-label:hover .ql-stroke': {
      fill: 'none',
      stroke: `${theme.palette.primary.main} !important`,
    },
    '& button:hover .ql-fill, & .ql-picker-label:hover .ql-fill': {
      fill: `${theme.palette.primary.main} !important`,
      stroke: 'none',
    },
    '& .ql-active .ql-stroke': {
      fill: 'none',
      stroke: `${theme.palette.primary.main} !important`,
    },
    '& .ql-active .ql-fill': {
      fill: `${theme.palette.primary.main} !important`,
      stroke: 'none',
    },
    '& .ql-picker-label:hover': {
      color: `${theme.palette.primary.main} !important`,
    },
    '& .ql-active': {
      color: `${theme.palette.primary.main} !important`,
    },
  },
  '& .ql-container': {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    borderColor: theme.palette.divider,
    border: `1px solid rgba(255, 255, 255, 0.23) !important`,
    borderRadius: '0 0 0.5rem 0.5rem', // Rounded corners for the bottom of the editor
    '& .ql-editor': {
      minHeight: '200px',
    },
    '& .ql-editor.ql-blank::before': {
      // Styled placeholder
      color: theme.palette.text.secondary,
    },
  },
}))

const InputQuill: React.FC<InputQuillProps> = ({ ...rest }) => {
  return (
    <StyledQuill>
      <ReactQuill
        {...rest}
        theme="snow"
        modules={{
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            ['link', 'image', 'formula'],
            ['code-block'],
            [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
            [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
            [{ direction: 'rtl' }], // text direction

            [{ header: [1, 2, 3, 4, 5, 6, false] }],

            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            [{ font: [] }],
            [{ align: [] }],
          ],
          imageResize: {
            modules: ['Resize', 'DisplaySize', 'Toolbar'],
          },
          imageCompress: {
            quality: 0.7, // default
            maxWidth: 720, // default
            maxHeight: 720, // default
            imageType: 'image/webp', // default
            debug: true, // default
          },
        }}
      />
    </StyledQuill>
  )
}

export default InputQuill
