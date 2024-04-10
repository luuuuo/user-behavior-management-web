/*
 * @Author: Semmy Wong
 * @Date: 2024-03-21 21:15:20
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2024-04-10 23:16:38
 * @Description: Description
 */
import { CommonReducerAction, DEFAULT_PAGE_SIZE } from '@/common/constants';
import { PageContextProvider } from '@/context';
import { useReduce } from '@/hooks';
import { useColumns } from '@/hooks/useColumns';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Access, useAccess, useModel, useParams } from '@umijs/max';
import { Button, Popconfirm } from 'antd';
import { useRef } from 'react';
import { CreateUpdateForm } from './components/CreateUpdateForm';
import { useRule } from './useRule';

export const Rule = <T extends RuleType>(): React.ReactNode => {
  const { initialState } = useModel('@@initialState');
  const { loginUser } = initialState || {};
  const { patientIdentity = loginUser?.identity } = useParams() ?? {};
  const accesses = useAccess();

  const tableActionRef = useRef<ActionType>();
  const { state, dispatch } = useReduce<T, RuleReduceStateType<T>, RuleReduceActionType<T>>();

  const { createdTimeColumn } = useColumns<T>();
  const { listHandler, removeHandler, changeRentHandler } = useRule<T>({
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
      search: false,
      dataIndex: 'processName',
    },
    {
      title: '公司名称',
      search: false,
      dataIndex: 'companyName',
    },
    {
      title: '程序特征',
      search: false,
      dataIndex: 'programFeature',
    },
    {
      title: '是否白名单',
      dataIndex: 'isWhitelist',
      valueEnum: {
        true: {
          text: '是',
          color: '#52c41a',
        },
        false: {
          text: '否',
          color: '#f5222d',
        },
      },
    },
    {
      title: '是否黑名单',
      dataIndex: 'isBlacklist',
      valueEnum: {
        true: {
          text: '是',
          color: '#52c41a',
        },
        false: {
          text: '否',
          color: '#f5222d',
        },
      },
    },
    !!accesses.RuleOperateColumn
      ? {
          title: '操作',
          dataIndex: 'option',
          valueType: 'option',
          width: 200,
          render: (_, record) => [
            <Access key="update" accessible={!!accesses.UpdateRule}>
              <a
                onClick={async () =>
                  dispatch({
                    type: CommonReducerAction.SetState,
                    payload: { createUpdateModalVisible: true, currentRecord: record },
                  })
                }
              >
                编辑
              </a>
            </Access>,
            <Access key="remove" accessible={!!accesses.RemoveRule}>
              <Popconfirm title="确定要删除吗" icon={<DeleteOutlined />} onConfirm={removeHandler.bind(null, record)}>
                <a>删除</a>
              </Popconfirm>
            </Access>,
          ],
        }
      : null,
  ].filter((col) => !!col);

  return (
    <PageContextProvider value={{ tableActionRef, state, dispatch }}>
      <PageContainer header={{ title: null }}>
        <ProTable<T, PageParamsType>
          headerTitle={'用户行为列表'}
          actionRef={tableActionRef}
          rowKey="id"
          search={false}
          pagination={{
            defaultPageSize: DEFAULT_PAGE_SIZE,
            showSizeChanger: true,
          }}
          options={{ density: false, fullScreen: false, reload: true, setting: false }}
          toolBarRender={() => [
            <Access key="AddRule" accessible={!!accesses.AddRule}>
              <Button
                key="AddRule"
                type="primary"
                onClick={() =>
                  dispatch({
                    type: CommonReducerAction.SetState,
                    payload: { createUpdateModalVisible: true, currentRecord: undefined },
                  })
                }
              >
                <PlusOutlined /> 新增
              </Button>
            </Access>,
          ]}
          request={listHandler}
          columns={columns}
        />
      </PageContainer>
      <CreateUpdateForm />
    </PageContextProvider>
  );
};
