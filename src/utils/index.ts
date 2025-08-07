// src/utils/index.ts
import pick from 'lodash/pick';

interface GetInfoParams {
  fields?: string[];
  object?: Record<string, any>;
}

export const getInfoData = ({ fields = [], object = {} }: GetInfoParams) => {
  return pick(object, fields);
};
