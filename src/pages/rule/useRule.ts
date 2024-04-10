/*
 * @Author: Semmy Wong
 * @Date: 2023-07-14 19:48:59
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2024-04-10 21:38:47
 * @Description: 描述
 */
import { create } from '@/common/services';
import { useCRUDService } from '@/hooks';

export const useRule = <T extends RuleType>(options: Partial<CRUDActionType<T>> = {}) => {
  const { currentRecord } = options;
  const { postListHandler, detailHandler, createHandler, postRemoveHandler, searchHandler, postUpdateHandler } =
    useCRUDService<T>(options);

  return {
    async listHandler(params: PageParamsType & unknown) {
      return await postListHandler(`/rule/getRules`, { params: params });
    },
    async detailHandler() {
      if (!currentRecord?.id) {
        return {} as T;
      }
      const { id } = currentRecord;
      return await create<T>(`/`, { data: { id } });
    },
    async createHandler(entity: T) {
      return await createHandler(`/behavior/addBehavior`, { entity });
    },
    async removeHandler(entity: T | undefined) {
      if (!entity?.id) {
        return;
      }
      return await postRemoveHandler(`/rule/deleteRule`, { data: { id: entity.id } });
    },
    async updateHandler(entity: T) {
      return await postUpdateHandler(`/rule/updateRule`, {
        data: { ...entity, id: currentRecord?.id },
      });
    },
    async changeRentHandler(id: string, status: boolean) {
      return await create(`/`, { data: { id, isRent: status } });
    },
    async searchStoreHandler({ keyWords }: { keyWords: string }) {
      return await searchHandler(`/v1/`, {
        keyWords,
        label: 'name',
        value: 'id',
      });
    },
  };
};
