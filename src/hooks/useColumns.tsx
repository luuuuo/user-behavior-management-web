/*
 * @Author: Semmy Wong
 * @Date: 2023-07-05 22:56:24
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2024-03-21 22:00:24
 * @Description: 描述
 */
import type { ProColumns } from '@ant-design/pro-components';

export const useColumns = <T extends Record<string, unknown>>(): Record<string, ProColumns<T>> => {
  return {
    createdTimeColumn: {
      title: '创建时间',
      valueType: 'dateTime',
      dataIndex: 'createdTime',
      align: 'center',
      hideInSearch: true,
    },
    createdTimeFilterColumn: {
      title: '创建时间',
      dataIndex: 'createdTime',
      align: 'center',
      valueType: 'dateTimeRange',
      render: (_, record: T) => <>{record.createdTime}</>,
    },
    updateTimeColumn: {
      title: '更新时间',
      valueType: 'dateTime',
      dataIndex: 'updateTime',
      align: 'center',
      hideInSearch: true,
    },
  };
};
