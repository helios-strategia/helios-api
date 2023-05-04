import { Inject, Injectable, Logger } from '@nestjs/common';
import { PlantDocumentRepository } from '@/api/plant-document/plant-document.repository';
import { MemoryStoredFile } from 'nestjs-form-data';
import { PlantDocument } from '@/api/plant-document/plant-document.entity';
import { PlantDocumentType } from '@/api/plant-document/plant-document-type.enum';
import { FileService } from '@/service/file-serivce/file-service';
import { MinioFileService } from '@/service/file-serivce/minio-file-service';

@Injectable()
export class PlantDocumentService {
  @Inject(PlantDocumentRepository)
  private readonly documentRepository: PlantDocumentRepository;
  @Inject(MinioFileService)
  private readonly fileService: MinioFileService;

  public async create({
    documentType,
    file,
    plantId,
  }: {
    readonly documentType: string;
    readonly file: MemoryStoredFile;
    readonly plantId?: number;
  }): Promise<PlantDocument> {
    return this.documentRepository.save({
      url: await this.fileService.upload(file),
      documentType: PlantDocumentType[documentType] ?? PlantDocumentType.OTHER,
      name: file.originalName,
    });
  }

  public async createMany(
    documentsToCreate: {
      readonly documentType: string;
      readonly file: MemoryStoredFile;
      readonly plantId?: number;
    }[],
  ) {
    return Promise.all(documentsToCreate.map((doc) => this.create(doc)));
  }

  public async getAll() {
    return this.documentRepository.find({
      relations: {
        plant: true,
      },
    });
  }

  public async deleteById(id: number, token: string) {
    try {
      const document = await this.documentRepository.findOne({ where: { id } });

      if (
        await this.documentRepository
          .count({ where: { name: document.name } })
          .then((count) => count === 1)
      ) {
        const resFileServer = await this.fileService.delete(
          document.name,
          token,
        );

        Logger.log('PlantDocumentService#deleteById FileService#delete', {
          deleteFileName: resFileServer,
        });
      }

      return this.documentRepository.delete(id);
    } catch (e) {
      Logger.error('Error in PlantDocumentService#deleteById', { ...e });

      throw e;
    }
  }

  public async isPresent(id: number): Promise<boolean> {
    return this.documentRepository
      .count({ where: { id } })
      .then((count) => count === 1);
  }
}
