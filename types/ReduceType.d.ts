/*
 * @Author: Semmy Wong
 * @Date: 2023-09-06 21:44:55
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2024-04-08 17:30:40
 * @Description: 描述
 */
import type { Reducer, ReducerState } from 'react';

declare global {
  interface ReduceStateType<T> {
    currentRecord?: T;
    createModalVisible?: boolean;
    updateModalVisible?: boolean;
    detailModalVisible?: boolean;
    createUpdateModalVisible?: boolean;
    modalVisible?: boolean;
    keyword?: string;
    selectedRows?: T[];
    expandedRowKeys?: React.Key[];
  }
  interface ReduceActionType<T, P extends ReduceStateType<T> = ReduceStateType<T>> {
    type: string;
    payload?: Partial<P>;
  }

  type CommonReducerOptionType<S, A> = {
    reducer?: Reducer<S, A>;
    states?: ReducerState<Reducer<S, A>>;
  };
  type ReducerType<T, S, A> = (
    prevState: ReduceStateType<T> & S,
    action: ReduceActionType<T> | A,
  ) => ReduceStateType<T> & S;
}
