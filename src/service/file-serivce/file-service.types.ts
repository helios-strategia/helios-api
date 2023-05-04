import { MemoryStoredFile } from 'nestjs-form-data';

export enum FileStorageProvider {
  MINIO = 'MINIO',
}

export interface FileService {
  upload: (file: MemoryStoredFile, bucketName?: string) => Promise<string>;
  delete: (fileName: string) => Promise<void>;
}
