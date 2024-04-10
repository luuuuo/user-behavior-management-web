/*
 * @Author: Semmy Wong
 * @Date: 2023-07-14 19:48:59
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2024-04-10 21:44:23
 * @Description: 描述
 */
import { create } from '@/common/services';
import { useCRUDService } from '@/hooks';

export const useUser = <T extends UserType>(options: Partial<CRUDActionType<T>> = {}) => {
  const { currentRecord } = options;
  const { postListHandler, detailHandler, createHandler, removeHandler, searchHandler, updateHandler } =
    useCRUDService<T>(options);

  return {
    async listHandler(params: PageParamsType & unknown) {
      return await postListHandler(`/user/listAllUser`, { params: params });
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
      return await removeHandler(`/v1//${entity.id}`);
    },
    async updateHandler(entity: T) {
      const record = { ...currentRecord, ...entity };
      return await updateHandler(`/v1//${record.id}`, {
        entity: record,
      });
    },
    async changeRentHandler(id: string, status: boolean) {
      return await create(`/`, { data: { id, isRent: status } });
    },
    async searchUserHandler({ keyWords }: { keyWords: string }) {
      return await searchHandler(`/user/listAllUser`, {
        method: 'POST',
        // params: { role: '0' },
        keyWords,
        label: 'username',
        value: 'identity',
      });
    },
  };
};
