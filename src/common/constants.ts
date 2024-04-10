/*
 * @Author: Semmy Wong
 * @Date: 2023-04-21 21:44:34
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2024-03-31 10:36:56
 * @Description: 描述
 */
export const LOGIN_PATH = '/login';

export const IS_DEV = process.env.NODE_ENV === 'development';
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_BIG_PAGE_SIZE = 1000;
export const IMAGE_ERROR_PATH = '/images/img_error.png';

/**
 * 常用的一些Reducer Action名称
 */
export const enum CommonReducerAction {
  SetCurrentRecord = 'SET_CURRENT_RECORD',
  ToggleUpdateModalVisible = 'TOGGLE_UPDATE_MODAL_VISIBLE',
  ToggleCreateModalVisible = 'TOGGLE_CREATE_MODAL_VISIBLE',
  ToggleDetailModalVisible = 'TOGGLE_DETAIL_MODAL_VISIBLE',
  ToggleCreateUpdateModalVisible = 'TOGGLE_CREATE_UPDATE_MODAL_VISIBLE',
  ToggleModalVisible = 'TOGGLE_MODAL_VISIBLE',
  SetKeyword = 'SET_KEYWORD',
  SetState = 'SET_STATE',
  ResetState = 'RESET_STATE',
}

export const FilterCondition = {
  IS_NULL: 'IS_NULL',
  IS_NOT_NULL: 'IS_NOT_NULL',
  EQ: 'EQ',
  NEQ: 'NEQ',
  IN: 'IN',
  NIN: 'NIN',
  GT: 'GT',
  GE: 'GE',
  LT: 'LT',
  LE: 'LE',
  BETWEEN: 'BETWEEN',
  LIKE: 'LIKE',
  LIKE_LEFT: 'LIKE_LEFT',
  LIKE_RIGHT: 'LIKE_RIGHT',
  AND: 'AND',
  OR: 'OR',
};

/** 表格里单元格图片的大小 */
export const TableImageSize = {
  width: 112,
  height: 100,
};
