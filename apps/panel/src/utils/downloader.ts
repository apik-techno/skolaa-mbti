export function downloadURI(uri: string, name?: string) {
  const random = crypto.randomUUID()
  const fileName = name || random
  const link = document.createElement('a')
  link.download = fileName
  link.target = '_blank'
  link.href = uri
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
