export const getDeleteApiResponse = <T extends Function>(
  entity: T,
  id: number,
) => {
  return { message: `${entity.name} [${id}] successfully removed` };
};
