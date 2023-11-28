import React, { lazy, Suspense, useMemo } from "react";
import { Card, Col, Row } from "antd";
import dayjs from "dayjs";
import { AreaConfig } from "@ant-design/plots";
import predictionData from "../../../../prediction.json";
import predictionData2 from "../../../../prediction2.json";

const Area = lazy(() => import("@ant-design/plots/es/components/area"));

export const DashboardPredictChart: React.FC = () => {
    const predictDataPreviousWeek = useMemo(() => {
        const lastWeekData = predictionData.data.slice(-7);
        return lastWeekData.map((item) => {
            const date = dayjs(item[0]);
            const dayOfMonth = date.date();

            return [
                {
                    timeUnix: date.unix(),
                    timeText: `Day ${dayOfMonth}`,
                    value: item[1],
                    state: "Solar",
                },
                {
                    timeUnix: date.unix(),
                    timeText: `Day ${dayOfMonth}`,
                    value: item[2],
                    state: "Wind",
                },
            ];
        }).flat();
    }, []);

    const predictionProdNextWeek = useMemo(() => {
        const nextWeekData = predictionData2.data.slice(0, 7);
        return nextWeekData.map((item) => {
            const date = dayjs(item[0]);
            const dayOfMonth = date.date();

            return [
                {
                    timeUnix: date.unix(),
                    timeText: `Day ${dayOfMonth}`,
                    value: item[1],
                    state: "Solar",
                },
                {
                    timeUnix: date.unix(),
                    timeText: `Day ${dayOfMonth}`,
                    value: item[2],
                    state: "Wind",
                },
            ];
        }).flat();
    }, []);

    const configPreviousWeek: AreaConfig = {
        isStack: false,
        data: predictDataPreviousWeek,
        xField: "timeText",
        yField: "value",
        seriesField: "state",
        animation: true,
        startOnZero: false,
        smooth: true,
        legend: {
            offsetY: -6,
        },
        yAxis: {
            tickCount: 4,
            label: {
                formatter: (v) => {
                    return `${parseFloat(v).toFixed(1)}GW`; // Display values as 0.160...GW
                },
            },
        },
        tooltip: {
            formatter: (data) => {
                return {
                    name: data.state,
                    value: `${data.value.toFixed(6)}GW`, // Display tooltip value as 160.764699GW
                };
            },
        },
        areaStyle: (datum) => {
            return { fill: datum.state === "Solar" ? "#52C41A" : "#1890FF" };
        },
        color: (datum) => {
            return datum.state === "Solar" ? "#52C41A" : "#1890FF";
        },
    };

    const configNextWeek: AreaConfig = {
        isStack: false,
        data: predictionProdNextWeek,
        xField: "timeText",
        yField: "value",
        seriesField: "state",
        animation: true,
        startOnZero: false,
        smooth: true,
        legend: {
            offsetY: -6,
        },
        yAxis: {
            tickCount: 4,
            label: {
                formatter: (v) => {
                    return `${parseFloat(v).toFixed(1)}GW`; // Display values as 0.160...GW
                },
            },
        },
        tooltip: {
            formatter: (data) => {
                return {
                    name: data.state,
                    value: `${data.value.toFixed(6)}GW`, // Display tooltip value as 160.764699GW
                };
            },
        },
        areaStyle: (datum) => {
            return { fill: datum.state === "Solar" ? "#52C41A" : "#1890FF" };
        },
        color: (datum) => {
            return datum.state === "Solar" ? "#52C41A" : "#1890FF";
        },
    };

    return (
        <div>
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <Card>
                        <Suspense fallback={<div>Loading...</div>}>
                            <Area {...configPreviousWeek} height={325} />
                        </Suspense>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card>
                        <Suspense fallback={<div>Loading...</div>}>
                            <Area {...configNextWeek} height={325} />
                        </Suspense>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

