/*
 * @Author: Semmy Wong
 * @Date: 2024-03-21 21:15:20
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2024-04-10 09:05:12
 * @Description: Description
 */
import { DEFAULT_PAGE_SIZE } from '@/common/constants';
import { PageContextProvider } from '@/context';
import { useReduce } from '@/hooks';
import { useColumns } from '@/hooks/useColumns';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useModel, useParams } from '@umijs/max';
import { useRef } from 'react';
import { CreateUpdateForm } from './components/CreateUpdateForm';
import { useUser } from './useUser';

export const User = <T extends UserType>(): React.ReactNode => {
  const { initialState } = useModel('@@initialState');
  const { loginUser } = initialState || {};
  const { patientIdentity = loginUser?.identity } = useParams() ?? {};

  const tableActionRef = useRef<ActionType>();
  const { state, dispatch } = useReduce<T, AppUsageRecordReduceStateType<T>, AppUsageRecordReduceActionType<T>>();

  const { createdTimeColumn } = useColumns<T>();
  const { listHandler, removeHandler, changeRentHandler } = useUser<T>({
    tableActionRef,
  });

  const columns: ProColumns<T>[] = [
    {
      title: '用户名',
      search: false,
      dataIndex: 'username',
    },
    {
      title: '用户ID',
      search: false,
      dataIndex: 'identity',
    },
    {
      title: '用户类型',
      search: false,
      dataIndex: 'role',
      renderText: (_, record) => (record.role === 0 ? '管理员' : '普通用户'),
    },
  ];

  return (
    <PageContextProvider value={{ tableActionRef, state, dispatch }}>
      <PageContainer header={{ title: null }}>
        <ProTable<T, PageParamsType>
          headerTitle={'用户列表'}
          actionRef={tableActionRef}
          rowKey="id"
          search={false}
          pagination={{
            defaultPageSize: DEFAULT_PAGE_SIZE,
            showSizeChanger: true,
          }}
          options={{ density: false, fullScreen: false, reload: true, setting: false }}
          toolBarRender={() => []}
          request={listHandler}
          columns={columns}
        />
      </PageContainer>
      <CreateUpdateForm />
    </PageContextProvider>
  );
};
