/*
 * @Author: Semmy Wong
 * @Date: 2023-04-20 12:01:22
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2024-04-09 21:29:38
 * @Description: 描述
 */
import { CommonReducerAction } from '@/common/constants';
import { usePageContext } from '@/context';
import { ModalForm, ProFormDateTimePicker, ProFormText } from '@ant-design/pro-components';
import dayjs from 'dayjs';
import { useBrowserUsageRecord } from '../useBrowserUsageRecord';

export const CreateUpdateForm = <T extends BrowserUsageRecordType>(): JSX.Element => {
  const { tableActionRef, state, dispatch } = usePageContext<
    T,
    BrowserUsageRecordReduceStateType<T>,
    BrowserUsageRecordReduceActionType<T>
  >();

  const { detailHandler, createHandler, updateHandler } = useBrowserUsageRecord<T>({
    tableActionRef,
    currentRecord: state?.currentRecord,
  });

  return (
    <ModalForm
      title={state?.currentRecord?.id ? '编辑浏览器记录' : '新增浏览器记录'}
      open={state?.createUpdateModalVisible}
      onOpenChange={(visible) =>
        dispatch?.({
          type: CommonReducerAction.SetState,
          payload: { createUpdateModalVisible: visible },
        })
      }
      onFinish={state?.currentRecord?.id ? updateHandler : createHandler}
      request={detailHandler}
      modalProps={{
        destroyOnClose: true,
        maskClosable: false,
        closable: true,
      }}
    >
      <ProFormText label="浏览器" name="browserName" />
      <ProFormText label="版本" name="version" />
      <ProFormText label="用户ID" name="identity" />
      <ProFormText label="源IP" name="sourceIp" />
      <ProFormText label="目标IP" name="targetIp" />
      <ProFormText label="站点标题" name="webTitle" />
      <ProFormDateTimePicker
        name="startTime"
        label="开始时间"
        transform={(value) => {
          return dayjs(value).valueOf();
        }}
      />
      <ProFormDateTimePicker
        name="endTime"
        label="结束时间"
        transform={(value) => {
          return dayjs(value).valueOf();
        }}
      />
    </ModalForm>
  );
};
