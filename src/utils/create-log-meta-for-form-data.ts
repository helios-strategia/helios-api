import { MemoryStoredFile } from 'nestjs-form-data';

type DtoFormData = {
  [key: string]: any | MemoryStoredFile | MemoryStoredFile[];
};
export const createLogMetaForFormData = (
  dtoObject: DtoFormData,
  fileKeys: keyof DtoFormData,
) => {};
