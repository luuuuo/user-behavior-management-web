import { useUser } from '@/pages/user/useUser';
import { Column } from '@ant-design/plots';
import { ProFormSelect } from '@ant-design/pro-components';
import { Card, Col, DatePicker, Row, Tabs } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker/generatePicker';
import type dayjs from 'dayjs';
import numeral from 'numeral';
import antdStyle from '../style.style';

export type TimeType = 'today' | 'week' | 'month' | 'year';
const { RangePicker } = DatePicker;

const rankingListData: {
  title: string;
  total: number;
}[] = [];

for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: `工专路 ${i} 号店`,
    total: 323234,
  });
}

const SalesCard = ({
  salesData,
  personalData,
  rangePickerValue,
  isActive,
  loading,
  onRangePickerChange,
  onIdentityChange,
  selectDate,
}: {
  personalData: any;
  rangePickerValue: RangePickerProps<dayjs.Dayjs>['value'];
  isActive: (key: TimeType) => string;
  salesData: any;
  loading: boolean;
  onRangePickerChange: any;
  onIdentityChange: any;
  selectDate: (key: TimeType) => void;
}) => {
  const { styles } = antdStyle();

  const handleRangePickerChange = (value: any) => {
    onRangePickerChange(value);
  };
  const { searchUserHandler } = useUser();
  return (
    <Card
      loading={loading}
      bordered={false}
      bodyStyle={{
        padding: 0,
      }}
    >
      <div className={styles.salesCard}>
        <Tabs
          tabBarExtraContent={
            <div className={styles.salesExtraWrap}>
              <div className={styles.salesExtra}>
                <ProFormSelect
                  name="identity"
                  label="用户ID"
                  request={searchUserHandler}
                  allowClear
                  showSearch
                  onChange={(v) => {
                    onIdentityChange(v);
                  }}
                />
              </div>
              <RangePicker
                value={rangePickerValue}
                showTime={true}
                onChange={handleRangePickerChange}
                style={{
                  width: 350,
                }}
              />
            </div>
          }
          size="large"
          tabBarStyle={{
            marginBottom: 24,
          }}
          items={[
            {
              key: 'sales',
              label: '办公类',
              children: (
                <Row>
                  <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Column
                        height={300}
                        data={salesData}
                        xField="x"
                        yField="y"
                        paddingBottom={12}
                        axis={{
                          x: {
                            title: false,
                          },
                          y: {
                            title: false,
                            gridLineDash: null,
                            gridStroke: '#ccc',
                          },
                        }}
                        scale={{
                          x: { paddingInner: 0.4 },
                        }}
                        tooltip={{
                          name: '时长（小时）',
                          channel: 'y',
                        }}
                      />
                    </div>
                  </Col>
                  <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesRank}>
                      <h4 className={styles.rankingTitle}>用户行为</h4>
                      <ul className={styles.rankingList}>
                        <li>
                          <span className={`${styles.rankingItemNumber}`}>1</span>
                          <span className={styles.rankingItemTitle} title={'效率'}>
                            效率
                          </span>
                          <span>{numeral(personalData.efficiency).format('0.00')}</span>
                        </li>
                        <li>
                          <span className={`${styles.rankingItemNumber}`}>2</span>
                          <span className={styles.rankingItemTitle} title={'娱乐时长'}>
                            娱乐时长
                          </span>
                          <span>{numeral(personalData.entertainmentDuration).format('0,0')}</span>
                        </li>
                        <li>
                          <span className={`${styles.rankingItemNumber}`}>3</span>
                          <span className={styles.rankingItemTitle} title={'总时长'}>
                            总时长
                          </span>
                          <span>{numeral(personalData.totalDuration).format('0,0')}</span>
                        </li>
                        <li>
                          <span className={`${styles.rankingItemNumber}`}>4</span>
                          <span className={styles.rankingItemTitle} title={'结果'}>
                            结果
                          </span>
                          <span>{personalData.result}</span>
                        </li>
                      </ul>
                    </div>
                  </Col>
                </Row>
              ),
            },
          ]}
        />
      </div>
    </Card>
  );
};
export default SalesCard;
