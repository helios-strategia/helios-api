export const enumValidationMessage = (key: string, enumObject: object) =>
  `${key} must be one of [${Object.values(enumObject).join(', ')}]`;
