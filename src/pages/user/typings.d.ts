/*
 * @Author: Semmy Wong
 * @Date: 2024-03-21 21:15:20
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2024-04-10 08:58:45
 * @Description: Description
 */
interface UserType extends Record<string, unknown> {
  id: string;
  name: string;
  sellerId: string;
  createdTime: number;
  usable: boolean;
}

interface UserReduceStateType<T> extends ReduceStateType<T> {}
type UserReduceActionType<T> = ReduceActionType<T, UserReduceStateType<T>>;
