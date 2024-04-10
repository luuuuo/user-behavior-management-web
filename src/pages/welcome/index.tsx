/*
 * @Author: Semmy Wong
 * @Date: 2024-03-29 19:49:39
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2024-04-08 10:10:03
 * @Description: Description
 */
import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import React, { useLayoutEffect } from 'react';

const Welcome: React.FC = () => {
  useLayoutEffect(() => {
    // history.push('/house');
  }, []);
  return (
    <PageContainer>
      <div>hello</div>
    </PageContainer>
  );
};

export default Welcome;
