import { Inject, Injectable } from '@nestjs/common';
import { MinioFileService } from '@/library/file-serivce/minio-file-service';
import { PlantDocumentService } from '@/api/plant-document/plant-document.service';
import { PlantDocumentType } from '@/types/plant-document';
import { MemoryStoredFile } from 'nestjs-form-data';
import { PlantDocument } from '@/api/plant-document/plant-document.entity';
import { PlantImagesService } from '@/api/plant-images/plant-images.service';
import { PlantImage } from '@/api/plant-images/plant-images.entity';

export enum PlantFileTypes {
  Documents,
  Images,
  TaxStatement,
  MainPlan,
}

export type FileTypesMap = {
  [PlantFileTypes.Documents]: {
    readonly documentType: PlantDocumentType;
    readonly file: MemoryStoredFile;
  }[];
  [PlantFileTypes.Images]: MemoryStoredFile[];
  [PlantFileTypes.TaxStatement]: MemoryStoredFile;
  [PlantFileTypes.MainPlan]: MemoryStoredFile;
};

@Injectable()
export class PlantFilesService {
  @Inject(MinioFileService)
  private readonly fileService: MinioFileService;
  @Inject(PlantDocumentService)
  private readonly documentService: PlantDocumentService;
  @Inject(PlantImagesService)
  private readonly plantImagesService: PlantImagesService;

  public async upload(
    fileByTypesMap: FileTypesMap,
  ): Promise<[PlantDocument[], PlantImage[], string | null, string | null]> {
    return Promise.all([
      this.documentService.createMany(
        fileByTypesMap[PlantFileTypes.Documents] || [],
        false,
      ),
      this.plantImagesService.bulkCreate(
        ...(fileByTypesMap[PlantFileTypes.Images] || []),
      ),
      fileByTypesMap[PlantFileTypes.TaxStatement]
        ? this.fileService.upload(fileByTypesMap[PlantFileTypes.TaxStatement])
        : null,
      fileByTypesMap[PlantFileTypes.MainPlan]
        ? this.fileService.upload(fileByTypesMap[PlantFileTypes.MainPlan])
        : null,
    ]);
  }
}
