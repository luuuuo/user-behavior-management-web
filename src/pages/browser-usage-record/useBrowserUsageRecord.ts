/*
 * @Author: Semmy Wong
 * @Date: 2023-07-14 19:48:59
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2024-04-09 21:25:06
 * @Description: 描述
 */
import { create } from '@/common/services';
import { useCRUDService } from '@/hooks';

export const useBrowserUsageRecord = <T extends BrowserUsageRecordType>(options: Partial<CRUDActionType<T>> = {}) => {
  const { currentRecord } = options;
  const { postListHandler, detailHandler, createHandler, removeHandler, searchHandler, updateHandler } =
    useCRUDService<T>(options);

  return {
    async listHandler(params: PageParamsType & unknown) {
      return await postListHandler(`/browser/listAllBrowserRecord`, { params: params });
    },
    async detailHandler() {
      if (!currentRecord?.id) {
        return {} as T;
      }
      const { id } = currentRecord;
      return await create<T>(`/`, { data: { id } });
    },
    async createHandler(entity: T) {
      return await createHandler(`/browser/addBehavior`, { entity });
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
    async searchStoreHandler({ keyWords }: { keyWords: string }) {
      return await searchHandler(`/v1/`, {
        keyWords,
        label: 'name',
        value: 'id',
      });
    },
  };
};
