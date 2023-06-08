export const getDeleteApiResponse = <T extends Object>(
  entity: T,
  id: number,
) => {
  return { message: `${entity.constructor.name} [${id}] successfully removed` };
};
