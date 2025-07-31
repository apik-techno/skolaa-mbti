import crypto from 'crypto'
import SparkMD5 from 'spark-md5'

export const resizeImage = ({ file, maxWidth, maxHeight }: { file: File; maxWidth: number; maxHeight: number }) => {
  return new Promise<File>((resolve, reject) => {
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = function () {
      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height
          height = maxHeight
        }
      }
      width *= 1.5
      height *= 1.5
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(img, 0, 0, width, height)
      canvas.toBlob((blob) => {
        if (blob) {
          const resizedFile = new File([blob], `${file.name.split('.')[0]}.webp`, {
            type: 'image/webp',
            lastModified: Date.now(),
          })
          resolve(resizedFile)
        } else {
          reject(new Error('Failed to create file.'))
        }
      }, 'image/webp')
    }

    img.onerror = reject
  })
}

export const md5File = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function (event) {
      const data = event.target?.result as ArrayBuffer
      const hash = crypto.createHash('md5').update(new Uint8Array(data)).digest('hex')
      resolve(hash)
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

export const calculateMD5Hash = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()

    fileReader.onload = function (e: ProgressEvent<FileReader>) {
      if (e.target?.result) {
        const spark = new SparkMD5.ArrayBuffer()
        spark.append(e.target.result as ArrayBuffer) // Append array buffer
        resolve(spark.end()) // Compute hash
      } else {
        reject(new Error('File read error.'))
      }
    }

    fileReader.onerror = function () {
      reject(new Error('File reading failed.'))
    }

    fileReader.readAsArrayBuffer(file)
  })
}
