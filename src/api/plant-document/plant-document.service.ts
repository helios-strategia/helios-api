import { Inject, Injectable, Logger } from '@nestjs/common';
import { PlantDocumentRepository } from '@/api/plant-document/plant-document.repository';
import { MemoryStoredFile } from 'nestjs-form-data';
import { PlantDocument } from '@/api/plant-document/plant-document.entity';
import { PlantDocumentType } from '@/api/plant-document/plant-document-type.enum';
import { MinioFileService } from '@/service/file-serivce/minio-file-service';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { PlantDocumentResponseDto } from '@/api/plant-document/plant-document.response.dto';

@Injectable()
export class PlantDocumentService {
  @Inject(PlantDocumentRepository)
  private readonly documentRepository: PlantDocumentRepository;
  @Inject(MinioFileService)
  private readonly fileService: MinioFileService;
  @InjectMapper()
  private readonly classMapper: Mapper;

  public async create(
    {
      documentType,
      file,
    }: {
      readonly documentType: string;
      readonly file: MemoryStoredFile;
      readonly plantId?: number;
    },
    isTrx: boolean,
  ): Promise<PlantDocument> {
    return this.documentRepository.save(
      {
        url: await this.fileService.upload(file),
        documentType:
          PlantDocumentType[documentType] ?? PlantDocumentType.OTHER,
        name: file.originalName,
      },
      { transaction: isTrx },
    );
  }

  public async createMany(
    documentsToCreate: {
      readonly documentType: string;
      readonly file: MemoryStoredFile;
      readonly plantId?: number;
    }[],
    isTrx = true,
  ) {
    return Promise.all(documentsToCreate.map((doc) => this.create(doc, isTrx)));
  }

  public async getAll() {
    return this.classMapper.mapArray(
      await this.documentRepository.find({
        relations: {
          plant: true,
        },
      }),
      PlantDocument,
      PlantDocumentResponseDto,
    );
  }

  public async deleteById(id: number) {
    try {
      const document = await this.documentRepository.findOne({ where: { id } });

      if (
        await this.documentRepository
          .count({ where: { name: document.name } })
          .then((count) => count === 1)
      ) {
        const resFileServer = await this.fileService.delete(document.name);

        Logger.log('PlantDocumentService#deleteById', {
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
