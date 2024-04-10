import { IS_DEV, LOGIN_PATH } from '@/common/constants';
import { AvatarDropdown, AvatarName, Footer, Question } from '@/components';
import { LinkOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { Link, history } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';

interface InitialStateType {
  settings?: Partial<LayoutSettings>;
  loginUser?: API.LoginUserType;
  loading?: boolean;
  token?: string | null;
  accesses?: Record<string, boolean>;
  collapsed?: boolean;
}
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<InitialStateType> {
  // 如果不是登录页面，执行
  if (window.location.pathname !== LOGIN_PATH) {
    const loginUser = JSON.parse(localStorage.getItem('loginUser') || '{}');
    const accesses = JSON.parse(localStorage.getItem('accesses') || '{}');
    const token = localStorage.getItem('token');
    return {
      token,
      loginUser,
      accesses,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }
  return {
    collapsed: false,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    // actionsRender: () => [<Question key="doc" />, <SelectLang key="SelectLang" />],
    actionsRender: () => [<Question key="doc" />],
    avatarProps: {
      src: initialState?.loginUser?.avatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content: '用户行为系统',
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.loginUser && location.pathname !== LOGIN_PATH) {
        history.push(LOGIN_PATH);
      }
    },
    layoutBgImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: IS_DEV
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {IS_DEV && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

interface OriginalResponseType<T> {
  data: AppResponseType<T>;
  config: { responseType: string } & unknown;
  headers: unknown;
  status: number;
  statusText: string;
}
/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request: any = {
  ...errorConfig,
  baseURL: '/api',
  requestInterceptors: [
    // 直接写一个 function，作为拦截器
    (url: string, options: any) => {
      // do something
      localStorage.getItem('token') && (options.headers.Authorization = `Bearer ${localStorage.getItem('token')}`);
      return { url, options };
    },
  ],
  responseInterceptors: [
    (response: unknown) => {
      // 拦截响应数据，进行个性化处理
      const { config, status, data } = response as OriginalResponseType<any>;
      if (status === 200) {
        if (config.responseType === 'blob') {
          return response;
        } else if (data.code !== 0) {
          //token过期，跳转登录页面
          if (data.code === 401) {
            localStorage.clear();
            history.replace({
              pathname: LOGIN_PATH,
            });
            return response;
          }
          throw new Error(data.message);
        }
      } else if (status === 401) {
        localStorage.clear();
        history.replace({
          pathname: LOGIN_PATH,
        });
      }
      return response;
    },
  ],
};
