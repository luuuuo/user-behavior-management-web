import { GridContent } from '@ant-design/pro-components';
import { useAsyncEffect } from 'ahooks';
import { Col, Row } from 'antd';
import type { RadioChangeEvent } from 'antd/es/radio';
import numeral from 'numeral';
import type { FC } from 'react';
import { Suspense, useState } from 'react';
import ProportionSales from './components/ProportionSales';
import type { TimeType } from './components/SalesCard';
import SalesCard from './components/SalesCard';
import TopSearch from './components/TopSearch';
import type { AnalysisData } from './data.d';
import { useAdminDashboard } from './useAdminDashboard';
import { getTimeDistance } from './utils/utils';

type RangePickerValue = any;
type AnalysisProps = {
  dashboardAndanalysis: AnalysisData;
  loading: boolean;
};
type SalesType = 'all' | 'online' | 'stores';
const Analysis: FC<AnalysisProps> = () => {
  const [salesType, setSalesType] = useState<SalesType>('all');
  const [rangePickerValue, setRangePickerValue] = useState<RangePickerValue>();
  const [salesData, setSalesData] = useState<any>([]);
  const [browserPieData, setBrowserPieData] = useState<any>([]);
  const [behaviorPieData, setBehaviorPieData] = useState<any>([]);
  const { loading } = {};

  const [identity, setIdentity] = useState<string>('');
  const [personalData, setPersonalData] = useState<any>({});

  const {
    analyzeOfficeAppHandler,
    personWorkEfficiencyDetailHandler,
    browserAnalyzeAllAppUsageHandler,
    behaviorAnalyzeAllAppUsageHandler,
  } = useAdminDashboard();
  const onIdentityChange = (value: any) => {
    setIdentity(value);
  };
  useAsyncEffect(async () => {
    const { data: officeData } = await analyzeOfficeAppHandler({
      identity,
      startTime: rangePickerValue?.[0]?.valueOf(),
      endTime: rangePickerValue?.[1]?.valueOf(),
    });
    const { data: personalData } = await personWorkEfficiencyDetailHandler({ identity });
    const { data: browserData } = await browserAnalyzeAllAppUsageHandler({
      identity,
      startTime: rangePickerValue?.[0]?.valueOf(),
      endTime: rangePickerValue?.[1]?.valueOf(),
    });
    const { data: behaviorData } = await behaviorAnalyzeAllAppUsageHandler({
      identity,
      startTime: rangePickerValue?.[0]?.valueOf(),
      endTime: rangePickerValue?.[1]?.valueOf(),
    });
    const officeResult = officeData?.map((d: any) => {
      return {
        x: d.columnName,
        y: +numeral(d.duration / 1000 / 60 / 60).format('0'),
      };
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
        y: +numeral(d.duration / 1000 / 60 / 60).format('0'),
      };
    });
    setPersonalData(personalData);
    setSalesData(officeResult);
    setBrowserPieData(browserResult);
    setBehaviorPieData(behaviorResult);
  }, [identity, rangePickerValue]);

  const selectDate = (type: TimeType) => {
    setRangePickerValue(getTimeDistance(type));
  };
  const handleRangePickerChange = (value: RangePickerValue) => {
    setRangePickerValue(value);
  };
  const handleChangeSalesType = (e: RadioChangeEvent) => {
    setSalesType(e.target.value);
  };

  return (
    <GridContent>
      <>
        {/* <Suspense fallback={<PageLoading />}>
          <IntroduceRow loading={loading} visitData={data?.visitData || []} />
        </Suspense> */}

        <SalesCard
          salesData={salesData}
          personalData={personalData}
          rangePickerValue={rangePickerValue}
          onIdentityChange={onIdentityChange}
          onRangePickerChange={handleRangePickerChange}
          loading={loading}
          selectDate={selectDate}
        />

        <Row
          gutter={24}
          style={{
            marginTop: 24,
          }}
        >
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <TopSearch loading={loading} browserPieData={browserPieData || []} />
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
