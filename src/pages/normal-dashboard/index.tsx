import { GridContent } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { useAsyncEffect } from 'ahooks';
import { Col, DatePicker, Row } from 'antd';
import type { RadioChangeEvent } from 'antd/es/radio';
import type dayjs from 'dayjs';
import numeral from 'numeral';
import type { FC } from 'react';
import { Suspense, useState } from 'react';
import IntroduceRow from './components/IntroduceRow';
import ProportionSales from './components/ProportionSales';
import type { TimeType } from './components/SalesCard';
import TopSearch from './components/TopSearch';
import type { AnalysisData } from './data.d';
import useStyles from './style.style';
import { useNormalDashboard } from './useNormalDashboard';
import { getTimeDistance } from './utils/utils';

const { RangePicker } = DatePicker;
type RangePickerValue = any;
type AnalysisProps = {
  dashboardAndanalysis: AnalysisData;
  loading: boolean;
};
type SalesType = 'all' | 'online' | 'stores';
const Analysis: FC<AnalysisProps> = () => {
  const { initialState } = useModel('@@initialState');
  const { loginUser } = initialState || {};

  const { styles } = useStyles();
  const [salesType, setSalesType] = useState<SalesType>('all');
  const [currentTabKey, setCurrentTabKey] = useState<string>('');
  const [rangePickerValue, setRangePickerValue] = useState<RangePickerValue>();
  const [browserPieData, setBrowserPieData] = useState<any>([]);
  const [behaviorPieData, setBehaviorPieData] = useState<any>([]);
  const { loading, data } = {};

  const [identity, setIdentity] = useState<string>(loginUser?.identity);
  const [personalData, setPersonalData] = useState<any>({});

  const selectDate = (type: TimeType) => {
    setRangePickerValue(getTimeDistance(type));
  };
  const handleRangePickerChange = (value: RangePickerValue) => {
    setRangePickerValue(value);
  };
  const isActive = (type: TimeType) => {
    if (!rangePickerValue) {
      return '';
    }
    const value = getTimeDistance(type);
    if (!value) {
      return '';
    }
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0] as dayjs.Dayjs, 'day') &&
      rangePickerValue[1].isSame(value[1] as dayjs.Dayjs, 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  };

  let salesPieData;

  if (salesType === 'all') {
    salesPieData = data?.salesTypeData;
  } else {
    salesPieData = salesType === 'online' ? data?.salesTypeDataOnline : data?.salesTypeDataOffline;
  }

  const handleChangeSalesType = (e: RadioChangeEvent) => {
    setSalesType(e.target.value);
  };
  const { personWorkEfficiencyDetailHandler, analyzePersonalAppUsageHandler, analyzePersonalBrowserUsageHandler } =
    useNormalDashboard();

  const onIdentityChange = (value: any) => {
    setIdentity(value);
  };
  useAsyncEffect(async () => {
    const { data: personalData } = await personWorkEfficiencyDetailHandler({ identity });
    const { data: browserData } = await analyzePersonalAppUsageHandler({
      identity,
      startTime: rangePickerValue?.[0]?.valueOf(),
      endTime: rangePickerValue?.[1]?.valueOf(),
    });
    const { data: behaviorData } = await analyzePersonalBrowserUsageHandler({
      identity,
      startTime: rangePickerValue?.[0]?.valueOf(),
      endTime: rangePickerValue?.[1]?.valueOf(),
    });
    const browserResult = browserData?.map((d: any) => {
      return {
        x: d.columnName,
        y: +numeral(d.duration / 1000 / 60 / 60).format('0'),
      };
    });
    const behaviorResult = behaviorData?.map((d: any) => {
      return {
        x: d.columnName,
        y: +(d.duration / 1000 / 60 / 60).toFixed(0),
      };
    });
    setPersonalData(personalData);
    setBrowserPieData(browserResult);
    setBehaviorPieData(behaviorResult);
  }, [identity, rangePickerValue]);

  return (
    <GridContent>
      <>
        <div className={styles.salesExtraWrap}>
          <RangePicker
            value={rangePickerValue}
            onChange={handleRangePickerChange}
            style={{
              width: 256,
            }}
          />
        </div>
        <Suspense fallback={null}>
          <IntroduceRow loading={loading} visitData={personalData || []} />
        </Suspense>

        <Row
          gutter={24}
          style={{
            marginTop: 24,
          }}
        >
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <TopSearch loading={loading} browserPieData={browserPieData || []} />
            </Suspense>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Suspense fallback={null}>
              <ProportionSales
                salesType={salesType}
                loading={loading}
                salesPieData={behaviorPieData || []}
                handleChangeSalesType={handleChangeSalesType}
              />
            </Suspense>
          </Col>
        </Row>
      </>
    </GridContent>
  );
};
export default Analysis;
