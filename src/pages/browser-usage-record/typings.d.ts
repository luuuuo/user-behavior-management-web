/*
 * @Author: Semmy Wong
 * @Date: 2024-03-21 21:15:20
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2024-04-07 20:06:12
 * @Description: Description
 */
interface BrowserUsageRecordType extends Record<string, unknown> {
  id: string;
  name: string;
  sellerId: string;
  createdTime: number;
  usable: boolean;
}

interface BrowserUsageRecordReduceStateType<T> extends ReduceStateType<T> {}
type BrowserUsageRecordReduceActionType<T> = ReduceActionType<T, BrowserUsageRecordReduceStateType<T>>;
