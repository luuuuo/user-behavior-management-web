/*
 * @Author: Semmy Wong
 * @Date: 2024-04-09 23:44:08
 * @LastEditors: Semmy Wong
 * @LastEditTime: 2024-04-10 23:42:59
 * @Description: Description
 */
import { Pie } from '@ant-design/plots';
import { Card, Typography } from 'antd';
import type { RadioChangeEvent } from 'antd/es/radio';
import React from 'react';
import type { DataItem } from '../data.d';
import useStyles from '../style.style';
const { Text } = Typography;
const ProportionSales = ({
  dropdownGroup,
  salesType,
  loading,
  salesPieData,
  handleChangeSalesType,
}: {
  loading: boolean;
  dropdownGroup: React.ReactNode;
  salesType: 'all' | 'online' | 'stores';
  salesPieData: DataItem[];
  handleChangeSalesType?: (e: RadioChangeEvent) => void;
}) => {
  const { styles } = useStyles();
  return (
    <Card
      loading={loading}
      className={styles.salesCard}
      bordered={false}
      title="应用统计分析"
      style={{
        height: '100%',
      }}
    >
      <div>
        <Pie
          height={340}
          radius={0.8}
          innerRadius={0.5}
          angleField="y"
          colorField="x"
          data={salesPieData as any}
          legend={false}
          tooltip={(
            d, // 每一个数据项
            index, // 索引
            data, // 完整数据
            column, // 通道
          ) => ({
            value: `${d.x} - ${d.y}`,
          })}
          label={{
            position: 'spider',
            text: (item: { x: number; y: number }) => {
              return `${item.x}: ${item.y}`;
            },
          }}
        />
      </div>
    </Card>
  );
};
export default ProportionSales;
