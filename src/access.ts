/*
 * @Author: Semmy Wong
 * @Date: 2023-04-03 20:52:52
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2024-04-08 15:06:38
 * @Description: 描述
 */
/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */

export default function access(initialState: { accesses?: Record<string, boolean> } | undefined) {
  const { accesses } = initialState ?? {};
  return {
    ...accesses,
  };
}
