/*
 * @Author: Semmy Wong
 * @Date: 2023-04-20 12:01:22
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2024-04-10 09:00:19
 * @Description: 描述
 */
import { CommonReducerAction } from '@/common/constants';
import { usePageContext } from '@/context';
import { ModalForm, ProFormDateTimePicker, ProFormText } from '@ant-design/pro-components';
import dayjs from 'dayjs';
import { useUser } from '../useUser';

export const CreateUpdateForm = <T extends UserType>(): JSX.Element => {
  const { tableActionRef, state, dispatch } = usePageContext<
    T,
    AppUsageRecordReduceStateType<T>,
    AppUsageRecordReduceActionType<T>
  >();

  const { createHandler, updateHandler } = useUser<T>({
    tableActionRef,
    currentRecord: state?.currentRecord,
  });

  return (
    <ModalForm
      title={state?.currentRecord?.id ? '编辑用户行为' : '新增用户行为'}
      open={state?.createUpdateModalVisible}
      onOpenChange={(visible) =>
        dispatch?.({
          type: CommonReducerAction.SetState,
          payload: { createUpdateModalVisible: visible },
        })
      }
      onFinish={state?.currentRecord?.id ? updateHandler : createHandler}
      modalProps={{
        destroyOnClose: true,
        maskClosable: false,
        closable: true,
      }}
    >
      <ProFormText label="应用名称" name="processName" />
      <ProFormText label="版本" name="version" />
      <ProFormText label="用户ID" name="identity" />
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
