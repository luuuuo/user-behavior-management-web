/*
 * @Author: Semmy Wong
 * @Date: 2023-04-18 22:03:26
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2024-04-10 21:43:08
 * @Description: 描述
 */
import { useIntl } from '@umijs/max';
import { App } from 'antd';
import { saveAs } from 'file-saver';
import get from 'lodash/get';
import { DEFAULT_PAGE_SIZE } from '../common/constants';
import {
  create,
  detail,
  downloadFile,
  exportFile,
  getList,
  importExportFile,
  importFile,
  list,
  postList,
  postRemove,
  postUpdate,
  remove,
  update,
} from '../common/services';
import { usePage } from './usePage';

interface SearchProps {
  keyWords?: string;
  label: string;
  value: string;
  params?: Record<string, unknown>;
  method?: 'GET' | 'POST';
  specialParams?: Record<string, { rule: string; values: unknown }>;
}
export const useCRUDService = <T extends Record<string, unknown>>({
  tableActionRef,
  createFormRef,
  setCreateModalVisible,
  updateFormRef,
  setUpdateModalVisible,
}: Partial<CRUDActionType<T>> = {}) => {
  const { getQueryListParams } = usePage();
  const { message } = App.useApp();
  const intl = useIntl();

  const getFilterData = ({ params, specialParams }: ListHandlerOptionType) => {
    const { current = 1, keyword, pageSize = DEFAULT_PAGE_SIZE, ...restParams } = params;
    const queryListParams = {
      current,
      pageSize,
      keyword,
      params: restParams,
      specialParams,
    };
    const data = getQueryListParams(queryListParams);
    return data;
  };

  return {
    async searchHandler<U = T>(
      url: string,
      { keyWords, label = 'label', value = 'id', params, method = 'GET' }: SearchProps,
    ): Promise<{ value: string; label: string }[]> {
      const {
        data: { records: resultData },
      } =
        method === 'GET'
          ? await getList<U>(url, {
              params,
            })
          : await postList<U>(url, {
              data: params,
            });
      return resultData?.map((item) => {
        return {
          value: get(item, value),
          label: get(item, label),
        };
      });
    },
    async loadHandler<U = T>(
      url: string,
      { label = 'label', value = 'id' }: { label: string; value: string },
    ): Promise<{ value: string; label: string }[]> {
      const data = await detail<U>(url);
      return (data as U[])?.map((item) => {
        return {
          value: get(item, value),
          label: get(item, label),
        };
      });
    },
    async importHandler(url: string, options: unknown & { file: Blob | File; reload?: () => void }) {
      const { file, reload } = options;
      const hide = message.loading(intl.formatMessage({ id: 'common-common.importing' }));
      try {
        await importFile(url, file);
        hide();
        reload ? reload() : tableActionRef?.current?.reload();
        message.success(intl.formatMessage({ id: 'common-common.import-success' }));
        return true;
      } catch {
        hide();
        return false;
      }
    },
    async importExportHandler(
      url: string,
      {
        params = {},
        specialParams,
        file,
        reload,
      }: { file: Blob | File; reload?: () => void } & Partial<ListHandlerOptionType>,
    ) {
      const hide = message.loading(intl.formatMessage({ id: 'common-common.exporting' }));
      try {
        const data = getFilterData({ params, specialParams });
        const { data: fileData, headers } = await importExportFile(url, { file, data });
        let fileName = 'file.xls';
        try {
          fileName = headers['content-disposition'].split(';')[1].split('filename=')[1];
          fileName = decodeURIComponent(fileName);
        } catch (error) {}
        await saveAs(fileData as Blob, fileName);
        hide();
        reload ? reload() : tableActionRef?.current?.reload();
        message.success(intl.formatMessage({ id: 'common-common.export-success' }));
        return true;
      } catch {
        hide();
        return false;
      }
    },
    async exportHandler(url: string, { params, specialParams }: ListHandlerOptionType) {
      const hide = message.loading(intl.formatMessage({ id: 'common-common.exporting' }));
      try {
        const data = getFilterData({ params, specialParams });
        const { data: fileData, headers } = await exportFile(url, { data });
        let fileName = 'file.xls';
        try {
          fileName = headers['content-disposition'].split(';')[1].split('filename=')[1];
          fileName = decodeURIComponent(fileName);
        } catch (error) {}
        await saveAs(fileData, fileName);
        hide();
        message.success(intl.formatMessage({ id: 'common-common.export-success' }));
        return true;
      } catch {
        hide();
        return false;
      }
    },
    async downloadHandler(url: string) {
      const hide = message.loading(intl.formatMessage({ id: 'common-common.downloading' }));
      try {
        const { data: fileData, headers } = await downloadFile(url);
        let fileName = 'file';
        try {
          fileName = headers['content-disposition'].split(';')[1].split('filename=')[1];
          fileName = decodeURIComponent(fileName);
        } catch (error) {}
        await saveAs(fileData, fileName);
        hide();
        message.success(intl.formatMessage({ id: 'common-common.download-success' }));
        return true;
      } catch {
        hide();
        return false;
      }
    },
    async detailHandler<U = T>(url: string) {
      return await detail<U>(url);
    },
    async listHandler<U = T>(url: string, { params, specialParams }: ListHandlerOptionType) {
      const data = getFilterData({ params, specialParams });
      const { data: resultData, total } = await list<U>(url, {
        data,
      });
      return { data: resultData, success: true, total: Number(total) };
    },
    async getListHandler<U = T>(url: string, { params, specialParams }: ListHandlerOptionType) {
      // const data = getFilterData({ params, specialParams });
      const { current = 1, pageSize = DEFAULT_PAGE_SIZE, ...restParams } = params ?? {};
      const {
        data: { records: resultData, total },
      } = await getList<U>(url, {
        params: { ...restParams, page: current - 1, size: pageSize },
      });
      return { data: resultData, success: true, total: Number(total) };
    },
    async postListHandler<U = T>(url: string, { params, specialParams }: ListHandlerOptionType) {
      // const data = getFilterData({ params, specialParams });
      const { current = 1, pageSize = DEFAULT_PAGE_SIZE, ...restParams } = params ?? {};
      const {
        data: { records: resultData, total },
      } = await postList<U>(url, {
        data: { ...restParams, page: current - 1, size: pageSize },
      });
      return { data: resultData, success: true, total: Number(total) };
    },
    async createHandler<U = T>(
      url: string,
      { entity, reload, successTip = intl.formatMessage({ id: '添加成功' }) }: CRUDActionOptionType<U> = {},
    ) {
      const hide = message.loading(intl.formatMessage({ id: '正在添加中' }));
      try {
        await create<T>(url, {
          data: { ...entity },
        });
        setCreateModalVisible?.(false);
        createFormRef?.current?.resetFields();
        reload ? reload() : tableActionRef?.current?.reload();
        message.success(successTip);
        return true;
      } catch (error) {
        return false;
      } finally {
        hide();
      }
    },
    async postRemoveHandler<U = T>(url: string, options?: { tableReload?: boolean; data?: any }) {
      const { tableReload = true, data } = options ?? {};
      const hide = message.loading(intl.formatMessage({ id: '正在删除中' }));
      try {
        await postRemove<U>(url, { data });
        tableReload && tableActionRef?.current?.reload();
        message.success(intl.formatMessage({ id: '删除成功' }));
        return true;
      } catch (error) {
        return false;
      } finally {
        hide();
      }
    },
    async removeHandler<U = T>(url: string, options?: { tableReload: boolean }) {
      const { tableReload = true } = options ?? {};
      const hide = message.loading(intl.formatMessage({ id: '正在删除中' }));
      try {
        await remove<U>(url);
        tableReload && tableActionRef?.current?.reload();
        message.success(intl.formatMessage({ id: '删除成功' }));
        return true;
      } catch (error) {
        return false;
      } finally {
        hide();
      }
    },
    async updateHandler<U = T>(url: string, { entity, reload, ...rest }: CRUDActionOptionType<U> = {}) {
      const hide = message.loading(intl.formatMessage({ id: '正在更新' }));
      try {
        await update<T>(url, { data: { ...entity, ...rest } });
        setUpdateModalVisible?.(false);
        updateFormRef?.current?.resetFields();
        reload ? reload() : tableActionRef?.current?.reload();
        message.success(intl.formatMessage({ id: '更新成功' }));
        return true;
      } catch (error) {
        console.error(error);
        return false;
      } finally {
        hide();
      }
    },
    async postUpdateHandler<U = T>(url: string, { data, reload, ...rest }: CRUDActionOptionType<U> = {}) {
      const hide = message.loading(intl.formatMessage({ id: '正在更新' }));
      try {
        await postUpdate<T>(url, { data });
        setUpdateModalVisible?.(false);
        updateFormRef?.current?.resetFields();
        reload ? reload() : tableActionRef?.current?.reload();
        message.success(intl.formatMessage({ id: '更新成功' }));
        return true;
      } catch (error) {
        console.error(error);
        return false;
      } finally {
        hide();
      }
    },
  };
};
