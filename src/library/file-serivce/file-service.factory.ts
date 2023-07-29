import { Injectable } from '@nestjs/common';
import {
  FileService,
  FileStorageProvider,
} from '@/library/file-serivce/file-service.types';

@Injectable()
export class FileServiceFactory {
  public get(provider: FileStorageProvider): FileService {
    switch (provider) {
      case FileStorageProvider.MINIO:
        return null;
      default:
        throw new Error(`File storage provider ${provider} doesnt' exists`);
    }
  }
}
