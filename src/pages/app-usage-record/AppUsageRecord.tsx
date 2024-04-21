/*
 * @Author: Semmy Wong
 * @Date: 2024-03-21 21:15:20
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2024-04-21 16:59:46
 * @Description: Description
 */
import { CommonReducerAction, DEFAULT_PAGE_SIZE } from '@/common/constants';
import { convertSecondsToDHMS } from '@/common/utils';
import { PageContextProvider } from '@/context';
import { useReduce } from '@/hooks';
import { useColumns } from '@/hooks/useColumns';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useModel, useParams } from '@umijs/max';
import { Button } from 'antd';
import { useRef } from 'react';
import { CreateUpdateForm } from './components/CreateUpdateForm';
import { useAppUsageRecord } from './useAppUsageRecord';

export const AppUsageRecord = <T extends AppUsageRecordType>(): React.ReactNode => {
  const { initialState } = useModel('@@initialState');
  const { loginUser } = initialState || {};
  const { patientIdentity = loginUser?.identity } = useParams() ?? {};

  const tableActionRef = useRef<ActionType>();
  const { state, dispatch } = useReduce<T, AppUsageRecordReduceStateType<T>, AppUsageRecordReduceActionType<T>>();

  const { createdTimeColumn } = useColumns<T>();
  const { listHandler, removeHandler, changeRentHandler } = useAppUsageRecord<T>({
    tableActionRef,
  });

  const columns: ProColumns<T>[] = [
    {
      title: '应用类型',
      search: false,
      dataIndex: 'processType',
    },
    {
      title: '应用名称',
      dataIndex: 'processName',
    },
    {
      title: '用户ID',
      search: false,
      dataIndex: 'identity',
    },
    {
      title: '开始时间',
      search: false,
      valueType: 'dateTime',
      dataIndex: 'startTime',
    },
    {
      title: '结束时间',
      search: false,
      valueType: 'dateTime',
      dataIndex: 'endTime',
    },
    {
      title: '时长',
      search: false,
      dataIndex: 'duration',
      renderText: (text, record: any) => convertSecondsToDHMS(record.duration / 1000),
    },
  ];

  return (
    <PageContextProvider value={{ tableActionRef, state, dispatch }}>
      <PageContainer header={{ title: null }}>
        <ProTable<T, PageParamsType>
          headerTitle={'用户行为列表'}
          actionRef={tableActionRef}
          rowKey="id"
          pagination={{
            defaultPageSize: DEFAULT_PAGE_SIZE,
            showSizeChanger: true,
          }}
          options={{ density: false, fullScreen: false, reload: true, setting: false }}
          toolBarRender={() => [
            <Button
              key="buttonStoreManageCreate"
              type="primary"
              onClick={() =>
                dispatch({
                  type: CommonReducerAction.SetState,
                  payload: { createUpdateModalVisible: true, currentRecord: undefined },
                })
              }
            >
              <PlusOutlined /> 新增
            </Button>,
          ]}
          request={listHandler}
          columns={columns}
        />
      </PageContainer>
      <CreateUpdateForm />
    </PageContextProvider>
  );
};
