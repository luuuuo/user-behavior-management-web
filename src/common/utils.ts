/*
 * @Author: Semmy Wong
 * @Date: 2022-09-20 23:30:15
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2024-04-10 22:28:50
 * @Description: 描述
 */
import type { GetProp, UploadProps } from 'antd';
import isNil from 'lodash/isNil';

const isType =
  <T>(type: string) =>
  (obj: unknown): obj is T =>
    toString.call(obj) === `[object ${type}]`;
export const isFn = isType<(...args: unknown[]) => unknown>('Function');
export const isArr = Array.isArray || isType<unknown[]>('Array');
export const isPlainObj = isType<object>('Object');
export const isStr = isType<string>('String');
export const isBool = isType<boolean>('Boolean');
export const isNum = isType<number>('Number');
export const isObj = (val: unknown): val is object => typeof val === 'object';
export const isRegExp = isType<RegExp>('RegExp');
export const isNumberLike = (t: string) => {
  return isNum(t) || /^(\d+)(\.\d+)?$/.test(t);
};
export function isEmptyObject(obj: Record<string, unknown> | string | number | undefined | null | unknown) {
  if (isNil(obj) || ((isPlainObj(obj) || isArr(obj) || isStr(obj)) && Object.keys(obj).length === 0)) {
    return true;
  }
  return false;
}

export function isValidObject(obj: Record<string, unknown> | string | number | undefined | null | unknown) {
  return !isEmptyObject(obj);
}

export function blobToString(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsText(blob);
  });
}

export type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const getBase64Image = (img: string): string => {
  return img?.startsWith('data:image') ? img : `data:image/png;base64,${img}`;
};

export function convertSecondsToDHMS(seconds: number): string {
  const days = Math.floor(seconds / (24 * 3600));
  seconds %= 24 * 3600;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds %= 60;

  return `${days} 天 ${hours} 小时 ${minutes} 分钟 ${seconds.toFixed(0)} 秒`;
}
