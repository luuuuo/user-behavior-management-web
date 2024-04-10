/*
 * @Author: Semmy Wong
 * @Date: 2023-04-20 12:01:22
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2024-04-08 16:46:36
 * @Description: 描述
 */
import { CommonReducerAction } from '@/common/constants';
import { usePageContext } from '@/context';
import { ModalForm, ProDescriptions } from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { FormattedMessage } from '@umijs/max';
import { useAsyncEffect } from 'ahooks';
import { Button } from 'antd';
import { useState } from 'react';
import { useMedicalRecord } from '../useUser';

export const DetailForm = <T extends MedicalRecordType>(): JSX.Element => {
  const className = useEmotionCss(({ token }) => {
    return {
      [`& .ant-descriptions-title`]: {
        fontWeight: 'unset',
      },
      [`& .qrcode-image-column`]: {
        ['& .ant-image-img']: { width: 150 },
        ['& .ant-image-mask']: {
          textAlign: 'center',
          width: 150,
        },
      },
      [`& .amount-column`]: {
        [`& .ant-descriptions-item-content`]: {
          marginTop: -6,
          color: token.colorError,
          fontSize: token.fontSizeHeading4,
        },
      },
    };
  });
  const { tableActionRef, state, dispatch } = usePageContext<
    T,
    MedicalRecordReduceStateType<T>,
    MedicalRecordReduceActionType<T>
  >();
  const [dataSource, setDataSource] = useState<T>();
  const { detailHandler } = useMedicalRecord<T>({ tableActionRef, currentRecord: state.currentRecord });

  useAsyncEffect(async () => {
    if (!state.currentRecord?.id || !state.detailModalVisible) {
      return;
    }
    const { data } = await detailHandler();
    setDataSource(data as any);
  }, [state.currentRecord?.id]);

  return (
    <ModalForm
      title={<FormattedMessage id="遍历详情" />}
      open={state.detailModalVisible}
      onOpenChange={(visible) =>
        dispatch?.({
          type: CommonReducerAction.SetState,
          payload: { detailModalVisible: visible },
        })
      }
      submitter={{
        render: () => {
          return [
            <Button
              key="cancel"
              onClick={() =>
                dispatch?.({
                  type: CommonReducerAction.SetState,
                  payload: { detailModalVisible: false },
                })
              }
            >
              <FormattedMessage id="page.common.close" />
            </Button>,
          ];
        },
      }}
      modalProps={{
        destroyOnClose: true,
        maskClosable: false,
        closable: true,
      }}
      className={className}
    >
      <ProDescriptions
        column={{ xs: 1, sm: 2, md: 2 }}
        style={{ marginBottom: 32 }}
        dataSource={dataSource}
        columns={[
          {
            title: '病人身份证',
            dataIndex: 'patientIdentity',
          },
          {
            title: '医院名称',
            dataIndex: 'hospitalName',
          },
          {
            title: '医生名称',
            dataIndex: 'doctorName',
          },
          {
            title: '诊断结果',
            dataIndex: 'diagnosis',
          },
        ]}
      />
    </ModalForm>
  );
};
