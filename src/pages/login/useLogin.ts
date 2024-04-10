/*
 * @Author: Semmy Wong
 * @Date: 2023-04-21 22:05:35
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2024-04-08 08:57:14
 * @Description: 描述
 */
// @ts-ignore
/* eslint-disable */
import { LOGIN_PATH } from '@/common/constants';
import { history, request } from '@umijs/max';

export const useLogin = () => {
  return {
    async getLoginUser(options?: { [key: string]: any }) {
      try {
        const data = request<AppResponseType<API.LoginUserType>>('/user/info', {
          method: 'POST',
          ...(options || {}),
        });
        return data;
      } catch (error) {
        history.push(LOGIN_PATH);
      }
    },
    async login(body: API.LoginParamsType, options?: { [key: string]: any }) {
      const response = await request<AppResponseType<API.LoginResult>>('/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
      });
      return response;
    },
    async register(body: API.LoginParamsType, options?: { [key: string]: any }) {
      const response = await request<API.LoginResult>('/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
      });
      return response;
    },
    async logout(options?: { [key: string]: any }) {
      return request<Record<string, any>>('/user/logout', {
        method: 'POST',
        ...(options || {}),
      });
    },
  };
};
