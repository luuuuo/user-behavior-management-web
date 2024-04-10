/*
 * @Author: Semmy Wong
 * @Date: 2024-03-21 21:15:20
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2024-04-09 21:37:05
 * @Description: Description
 */
import { CommonReducerAction, DEFAULT_PAGE_SIZE } from '@/common/constants';
import { PageContextProvider } from '@/context';
import { useReduce } from '@/hooks';
import { useColumns } from '@/hooks/useColumns';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { useModel, useParams } from '@umijs/max';
import { Button } from 'antd';
import { useRef } from 'react';
import { useBrowserUsageRecord } from './useBrowserUsageRecord';

export const BrowserUsageRecord = <T extends BrowserUsageRecordType>(): React.ReactNode => {
  const { initialState } = useModel('@@initialState');
  const { loginUser } = initialState || {};
  const { patientIdentity = loginUser?.identity } = useParams() ?? {};

  const tableActionRef = useRef<ActionType>();
  const { state, dispatch } = useReduce<
    T,
    BrowserUsageRecordReduceStateType<T>,
    BrowserUsageRecordReduceActionType<T>
  >();

  const { createdTimeColumn } = useColumns<T>();
  const { listHandler, removeHandler, changeRentHandler } = useBrowserUsageRecord<T>({
    tableActionRef,
  });

  const columns: ProColumns<T>[] = [
    {
      title: '用户ID',
      search: false,
      dataIndex: 'identity',
    },
    {
      title: '浏览器',
      search: false,
      dataIndex: 'browserName',
    },
    {
      title: '版本',
      search: false,
      dataIndex: 'version',
    },
    {
      title: '源IP',
      search: false,
      dataIndex: 'sourceIp',
    },
    {
      title: '目标IP',
      search: false,
      dataIndex: 'targetIp',
    },
    {
      title: '站点标题',
      search: false,
      dataIndex: 'webTitle',
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
  ];

  return (
    <PageContextProvider value={{ tableActionRef, state, dispatch }}>
      <PageContainer header={{ title: null }}>
        <ProTable<T, PageParamsType>
          headerTitle={'浏览器记录'}
          actionRef={tableActionRef}
          rowKey="id"
          search={false}
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
    </PageContextProvider>
  );
};
