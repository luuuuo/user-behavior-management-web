/*
 * @Author: Semmy Wong
 * @Date: 2023-04-20 12:01:22
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2024-04-10 23:45:07
 * @Description: 描述
 */
import { CommonReducerAction } from '@/common/constants';
import { usePageContext } from '@/context';
import { ModalForm, ProFormSwitch, ProFormText } from '@ant-design/pro-components';
import { useRule } from '../useRule';

export const CreateUpdateForm = <T extends RuleType>(): JSX.Element => {
  const { tableActionRef, state, dispatch } = usePageContext<T, RuleReduceStateType<T>, RuleReduceActionType<T>>();

  const { createHandler, updateHandler } = useRule<T>({
    tableActionRef,
    currentRecord: state?.currentRecord,
  });

  return (
    <ModalForm
      title={state?.currentRecord?.id ? '编辑规则' : '新增规则'}
      open={state?.createUpdateModalVisible}
      onOpenChange={(visible) =>
        dispatch?.({
          type: CommonReducerAction.SetState,
          payload: { createUpdateModalVisible: visible },
        })
      }
      initialValues={state?.currentRecord}
      onFinish={state?.currentRecord?.id ? updateHandler : createHandler}
      modalProps={{
        destroyOnClose: true,
        maskClosable: false,
        closable: true,
      }}
    >
      <ProFormText label="应用类型" name="processType" />
      <ProFormText label="应用名称" name="processName" />
      <ProFormText label="公司名称" name="companyName" />
      <ProFormText label="程序特征" name="programFeature" />
      <ProFormSwitch label="是否白名单" name="isWhitelist" initialValue={false} />
      <ProFormSwitch label="是否黑名单" name="isBlacklist" initialValue={false} />
    </ModalForm>
  );
};
