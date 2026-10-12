import type { IFileStorage } from './IFileStorage'
import { Buffer } from 'node:buffer'
import { randomUUID } from 'node:crypto'
import * as fs from 'node:fs/promises'
import path from 'node:path'

export class LocalFileStorage implements IFileStorage {
  private baseDir: string

  constructor (baseDir: string) {
    this.baseDir = baseDir
  }

  async save (fileName: string, content: Buffer): Promise<string> {
    await fs.mkdir(this.baseDir, { recursive: true })

    const storedName = randomUUID() + '-' + path.basename(fileName)
    const fullPath = path.join(this.baseDir, storedName)

    await fs.writeFile(fullPath, content)
    return fullPath
  }

  async read (fileUrl: string): Promise<Buffer> {
    return fs.readFile(fileUrl)
  }
}
