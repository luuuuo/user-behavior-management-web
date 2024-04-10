/*
 * @Author: Semmy Wong
 * @Date: 2023-04-03 23:15:29
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2024-04-10 23:16:13
 * @Description: 描述
 */
import Footer from '@/components/footer';
import type { InitialStateType } from '@@/plugin-initialState/@@initialState';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-components';
import { FormattedMessage, history, useIntl, useModel } from '@umijs/max';
import { message } from 'antd';
import omit from 'lodash/omit';
import React, { useState } from 'react';
import { Register } from './Register';
import { useLogin } from './useLogin';

const Login: React.FC = () => {
  const [type, setType] = useState<string>('login');
  const { setInitialState } = useModel('@@initialState');
  const { login, getLoginUser } = useLogin();
  const intl = useIntl();
  const [openRegister, setOpenRegister] = useState(false);

  const initAppConfig = async () => {
    const token = localStorage.getItem('token');
    const { data: loginUser } = (await getLoginUser()) ?? {};
    localStorage.setItem('loginUser', JSON.stringify(loginUser));
    let accesses = {};
    // 0: 管理员 1: 普通用户
    if (loginUser?.role === 0) {
      accesses = {
        Admin: true,
        RuleOperateColumn: true,
        AddRule: true,
        RemoveRule: true,
        UpdateRule: true,
      };
    } else if (loginUser?.role === 1) {
      accesses = {
        Normal: true,
      };
    }
    localStorage.setItem('accesses', JSON.stringify(accesses));
    await setInitialState((s: InitialStateType) => ({
      ...s,
      token,
      loginUser,
      accesses,
    }));
  };

  const submitHandler = async (values: API.LoginParamsType) => {
    try {
      // 登录
      const { code, data, message: msg } = await login({ ...omit(values, ['autoLogin']) });
      if (code !== 0 && !data) {
        message.error(msg);
        return;
      }
      // setUserLoginState(data);
      localStorage.setItem('token', data as string);
      const defaultLoginSuccessMessage = intl.formatMessage({
        id: 'pages.login.success',
        defaultMessage: '登录成功！',
      });
      const hide = message.success(defaultLoginSuccessMessage);
      await initAppConfig();
      setTimeout(() => {
        hide();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
      }, 0);
    } catch (error) {}
  };

  return (
    <div>
      <div>
        <LoginForm
          logo={<img alt="logo" src={LOGO} />}
          title={TITLE}
          subTitle={LOGIN_SUBTITLE}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={submitHandler}
        >
          <>
            <ProFormText
              name="identity"
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
          </>

          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
            </ProFormCheckbox>
            <a
              onClick={() => setOpenRegister(true)}
              style={{
                float: 'right',
              }}
            >
              <FormattedMessage id="pages.login.forgotPassword" defaultMessage="注册" />
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
      {openRegister && <Register open={openRegister} onOpenChange={setOpenRegister} />}
    </div>
  );
};

export default Login;
