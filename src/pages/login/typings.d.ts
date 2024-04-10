/*
 * @Author: Semmy Wong
 * @Date: 2023-04-03 23:24:00
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2024-04-08 14:24:37
 * @Description: 描述
 */
declare namespace API {
  interface LoginParamsType {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  }

  interface LoginUserType {
    role?: number;
    identity?: string;
    name?: string;
    nickname?: string;
    avatar?: string;
    email?: string;
    signature?: string;
    title?: string;
    group?: string;
    tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    country?: string;
    access?: string;
    geographic?: {
      province?: { label?: string; key?: string };
      city?: { label?: string; key?: string };
    };
    address?: string;
    phone?: string;
    token?: string | null;
  }

  type LoginResult = {
    token?: {
      value?: string;
    };
    user?: {
      id?: string;
      nickname?: string;
      username?: string;
    };
  };
}
