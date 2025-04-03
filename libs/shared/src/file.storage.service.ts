import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class FileStorageService {
  private storagePath = path.join(__dirname, '../../../storage');

  constructor() {
    this.ensureStoragePath();
  }

  private async ensureStoragePath() {
    try {
      await fs.mkdir(this.storagePath, { recursive: true });
    } catch (error) {
      console.error('Error creating storage directory:', error);
    }
  }

  private getFilePath(filename: string): string {
    return path.join(this.storagePath, `${filename}.json`);
  }

  async readData<T>(filename: string): Promise<T | null> {
    const filePath = this.getFilePath(filename);
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data) as T;
    } catch (error) {
      return null; // File might not exist yet
    }
  }

  async writeData<T>(filename: string, data: T): Promise<void> {
    const filePath = this.getFilePath(filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  }
}
