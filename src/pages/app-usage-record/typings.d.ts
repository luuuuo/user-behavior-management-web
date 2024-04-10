/*
 * @Author: Semmy Wong
 * @Date: 2024-03-21 21:15:20
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2024-04-09 20:16:45
 * @Description: Description
 */
interface AppUsageRecordType extends Record<string, unknown> {
  id: string;
  name: string;
  sellerId: string;
  createdTime: number;
  usable: boolean;
}

interface AppUsageRecordReduceStateType<T> extends ReduceStateType<T> {}
type AppUsageRecordReduceActionType<T> = ReduceActionType<T, AppUsageRecordReduceStateType<T>>;
