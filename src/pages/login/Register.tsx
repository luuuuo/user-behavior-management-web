/*
 * @Author: Semmy Wong
 * @Date: 2024-03-29 20:18:45
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2024-04-09 17:22:08
 * @Description: Description
 */
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { ModalForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { FormattedMessage } from '@umijs/max';
import { Button, Tabs, message } from 'antd';
import { useState } from 'react';
import { useLogin } from './useLogin';

export const Register = ({ open, onOpenChange }: any): JSX.Element => {
  const modalClass = useEmotionCss(({ token }) => {
    return {
      [`& .ant-upload-list.ant-upload-list-picture-circle`]: {
        textAlign: 'center',
      },
    };
  });

  const { register } = useLogin();
  const [tabKey, setTabKey] = useState('0');

  const onRegisterHandler = async (values: any) => {
    const response = await register({ ...values, role: tabKey });
    const hide = message.success('注册成功，请登录');
    return true;
  };
  return (
    <ModalForm
      title={'注册'}
      onFinish={onRegisterHandler}
      open={open}
      className={modalClass}
      onOpenChange={onOpenChange}
      width={600}
      submitter={{
        render: ({ submit }) => {
          return [
            <Button key="register" type="primary" onClick={submit}>
              <FormattedMessage id="注册" />
            </Button>,
          ];
        },
      }}
      modalProps={{
        destroyOnClose: true,
        maskClosable: false,
        closable: true,
      }}
    >
      <Tabs
        activeKey={tabKey}
        centered
        destroyInactiveTabPane={true}
        onChange={(key) => setTabKey(key)}
        items={[
          {
            label: '管理员',
            key: '0',
            children: (
              <>
                <ProFormText
                  label={<FormattedMessage id="用户名" />}
                  name="username"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined />,
                  }}
                  placeholder={'请输入用户名'}
                  rules={[
                    {
                      required: true,
                      message: <FormattedMessage id="pages.login.username.required" defaultMessage="请输入用户名!" />,
                    },
                  ]}
                />
                <ProFormText.Password
                  label={<FormattedMessage id="密码" />}
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined />,
                  }}
                  placeholder={'请输入密码'}
                  rules={[
                    {
                      required: true,
                      message: <FormattedMessage id="pages.login.password.required" defaultMessage="请输入密码！" />,
                    },
                  ]}
                />

                <ProFormText
                  label={<FormattedMessage id="身份证" />}
                  name="identity"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined />,
                  }}
                  placeholder={'请输入身份证号'}
                  rules={[
                    {
                      required: true,
                      message: <FormattedMessage id="pages.login.username.required" defaultMessage="请输入身份证号!" />,
                    },
                  ]}
                />
                <ProFormTextArea label={<FormattedMessage id="备注" />} name="doctorDescription" />
              </>
            ),
          },
          {
            label: '普通用户',
            key: '1',
            children: (
              <>
                <ProFormText
                  label={<FormattedMessage id="用户名" />}
                  name="username"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined />,
                  }}
                  placeholder={'请输入用户名'}
                  rules={[
                    {
                      required: true,
                      message: <FormattedMessage id="pages.login.username.required" defaultMessage="请输入用户名!" />,
                    },
                  ]}
                />
                <ProFormText.Password
                  label={<FormattedMessage id="密码" />}
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined />,
                  }}
                  placeholder={'请输入密码'}
                  rules={[
                    {
                      required: true,
                      message: <FormattedMessage id="pages.login.password.required" defaultMessage="请输入密码！" />,
                    },
                  ]}
                />

                <ProFormText
                  label={<FormattedMessage id="身份证" />}
                  name="identity"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined />,
                  }}
                  placeholder={'请输入身份证号'}
                  rules={[
                    {
                      required: true,
                      message: <FormattedMessage id="pages.login.username.required" defaultMessage="请输入身份证号!" />,
                    },
                  ]}
                />
              </>
            ),
          },
        ]}
      />
    </ModalForm>
  );
};
