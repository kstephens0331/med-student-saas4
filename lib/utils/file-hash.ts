import crypto from 'crypto'

export async function calculateSHA256(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const hash = crypto.createHash('sha256')
  hash.update(buffer)
  return hash.digest('hex')
}

export async function calculateSHA256FromBuffer(buffer: Buffer): Promise<string> {
  const hash = crypto.createHash('sha256')
  hash.update(buffer)
  return hash.digest('hex')
}

export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase()
}

export function getFileType(filename: string): string {
  const ext = getFileExtension(filename)

  const typeMap: Record<string, string> = {
    pdf: 'pdf',
    mp3: 'mp3',
    mp4: 'mp4',
    m4a: 'mp3',
    wav: 'mp3',
    jpg: 'image',
    jpeg: 'image',
    png: 'image',
    gif: 'image',
    ppt: 'ppt',
    pptx: 'ppt',
    txt: 'note',
    md: 'note',
    doc: 'note',
    docx: 'note',
  }

  return typeMap[ext] || 'note'
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}
