/*
 * @Author: Semmy Wong
 * @Date: 2024-03-21 21:15:20
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2024-04-10 21:16:19
 * @Description: Description
 */
interface RuleType extends Record<string, unknown> {
  id: string;
  name: string;
  sellerId: string;
  createdTime: number;
  usable: boolean;
}

interface RuleReduceStateType<T> extends ReduceStateType<T> {}
type RuleReduceActionType<T> = ReduceActionType<T, RuleReduceStateType<T>>;
