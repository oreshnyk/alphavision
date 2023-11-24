import React, { lazy, Suspense, useMemo } from "react";
import { Card, Col, Row } from "antd";
import dayjs from "dayjs";
import { AreaConfig } from "@ant-design/plots";
import { Text } from "@/components";
import predictionData from "../../../../prediction.json";
import predictionData2 from "../../../../prediction2.json";

const Area = lazy(() => import("@ant-design/plots/es/components/area"));

export const DashboardDealsChart: React.FC = () => {
    const dealDataPreviousWeek = useMemo(() => {
        const lastWeekData = predictionData.data.slice(-7); // Extract the last 7 elements (last 7 days)
        
        return lastWeekData.map((item) => {
            const date = dayjs(item[0]);
            const dayOfMonth = date.date(); // Get the day of the month

            return [
                {
                    timeUnix: date.unix(),
                    timeText: `Day ${dayOfMonth}`, // Display as Day X
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

    const dealDataNextWeek = useMemo(() => {
        const nextWeekData = predictionData2.data.slice(0, 7); // Extract the first 7 elements (next 7 days)
        
        return nextWeekData.map((item) => {
            const date = dayjs(item[0]);
            const dayOfMonth = date.date(); // Get the day of the month

            return [
                {
                    timeUnix: date.unix(),
                    timeText: `Day ${dayOfMonth}`, // Display as Day X
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
        data: dealDataPreviousWeek,
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
        data: dealDataNextWeek,
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
            <Card>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Text size="sm" style={{ marginLeft: ".5rem" }}>
                            Previous week
                        </Text>
                        <Suspense>
                            <Area {...configPreviousWeek} height={325} />
                        </Suspense>
                    </Col>
                    <Col span={12}>
                        <Text size="sm" style={{ marginLeft: ".5rem" }}>
                            Next week
                        </Text>
                        <Suspense>
                            <Area {...configNextWeek} height={325} />
                        </Suspense>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};
