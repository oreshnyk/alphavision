import React, { FC, PropsWithChildren, Suspense } from "react";
import { useList } from "@refinedev/core";
import { AuditOutlined, StepBackwardOutlined, StepForwardOutlined } from "@ant-design/icons";
import { AreaConfig } from "@ant-design/plots";
import { Card, Skeleton } from "antd";
import { Company, Contact, Deal } from "interfaces/graphql";
import { Text } from "@/components";
import styles from "./index.module.css";
import predictionData from "../../../../../prediction.json";
import predictionData2 from "../../../../../prediction2.json";

const Area = React.lazy(() => import("@ant-design/plots/es/components/area"));

type Type = "companies" | "contacts" | "deals";

function calculateAverage(values: number[]): number {
    if (values.length === 0) {
        return 0;
    }
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
}

export const DashboardTotalCountCard: React.FC<{
    resource: Type;
}> = ({ resource }) => {
    const { data, isLoading, isError, error } = useList<
        Company | Contact | Deal
    >({
        resource,
        meta: {
            fields: ["id"],
        },
    });

    if (isError) {
        console.error("Error fetching dashboard data", error);
        return null;
    }

    const prediction = resource === "companies" ? predictionData : predictionData2;

    const lastTwoDaysData = prediction.data.slice(-2).map(item => [
        new Date(item[0]).getTime(),
        parseFloat(item[1] as string),
        parseFloat(item[2] as string),
    ]);
    const averageEnergyProduction = calculateAverage(lastTwoDaysData.map(item => item[1]));

    const nextTwoDaysData = prediction.data.slice(0, 2).map(item => [
        new Date(item[0]).getTime(),
        parseFloat(item[1] as string),
        parseFloat(item[2] as string),
    ]);
    const averageSolar = calculateAverage(nextTwoDaysData.map(item => item[1]));
    const averageWind = calculateAverage(nextTwoDaysData.map(item => item[2]));

    const combinedAverage = (averageSolar + averageWind).toFixed(0) + "GW";

    const { primaryColor, secondaryColor, icon, title } = variants[resource];

    const combinedAverageEnergy = parseFloat((averageSolar + averageWind).toFixed(0));

    let chartData: { index: string; value: number }[] = variants[resource].data; // Default chart data from variants

    if (resource === 'companies') {
        chartData = lastTwoDaysData.map(item => ({ index: item[0].toString(), value: item[1] }));
    }

    const config: AreaConfig & { markLine?: any } = {
        className: styles.area,
        appendPadding: [1, 0, 0, 0],
        padding: 0,
        syncViewPadding: true,
        data: chartData, 
        autoFit: true,
        tooltip: false,
        animation: false,
        xField: "index",
        yField: "value",
        xAxis: false,
        yAxis: {
            tickCount: 12,
            label: {
                style: {
                    fill: "transparent",
                },
            },
            grid: {
                line: {
                    style: {
                        stroke: "transparent",
                    },
                },
            },
        },
        smooth: true,
        areaStyle: () => {
            return {
                fill: `l(270) 0:#fff 0.2:${secondaryColor} 1:${primaryColor}`,
            };
        },
        line: {
            color: primaryColor,
        },
        markLine: {
            type: 'average',
            label: {
                content: 'Combined Average',
                position: 'end',
                style: {
                    textAlign: 'left',
                },
            },
            data: [
                {
                    yAxis: combinedAverageEnergy, 
                    lineStyle: {
                        stroke: 'red',
                        lineDash: [3, 3],
                    },
                },
            ],
        },
    };

    let nextChartData: { index: string; value: number }[] = variants[resource].data; // Default chart data from variants

    if (resource === 'contacts') {
        nextChartData = nextTwoDaysData.map(item => ({ index: item[0].toString(), value: item[1] }));
    }

    const nextConfig: AreaConfig & { markLine?: any } = {
        className: styles.area,
        appendPadding: [1, 0, 0, 0],
        padding: 0,
        syncViewPadding: true,
        data: nextChartData, // Set the nextChartData dynamically based on the resource
        autoFit: true,
        tooltip: false,
        animation: false,
        xField: "index",
        yField: "value",
        xAxis: false,
        yAxis: {
            tickCount: 12,
            label: {
                style: {
                    fill: "transparent",
                },
            },
            grid: {
                line: {
                    style: {
                        stroke: "transparent",
                    },
                },
            },
        },
        smooth: true,
        areaStyle: () => {
            return {
                fill: `l(270) 0:#fff 0.2:${secondaryColor} 1:${primaryColor}`,
            };
        },
        line: {
            color: primaryColor,
        },
        markLine: {
            type: 'average',
            label: {
                content: 'Next Combined Average',
                position: 'end',
                style: {
                    textAlign: 'left',
                },
            },
            data: [
                {
                    yAxis: parseFloat((averageSolar + averageWind).toFixed(0)),
                    lineStyle: {
                        stroke: 'blue',
                        lineDash: [3, 3],
                    },
                },
            ],
        },
    };

    return (
        <Card
            style={{ height: "96px", padding: 0 }}
            bodyStyle={{ padding: "8px 8px 8px 12px" }}
            size="small"
        >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap" }}>
                {icon}
                <Text size="md" className="secondary" style={{ marginLeft: "8px" }}>
                    {title}
                </Text>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text size="xxxl" strong style={{ textAlign: "start", marginLeft: "48px", fontVariantNumeric: "tabular-nums" }}>
                    {isLoading ? (
                        <Skeleton.Button style={{ marginTop: "8px", width: "74px" }} />
                    ) : (
                        combinedAverage
                    )}
                </Text>
                <Suspense fallback={<div>Loading...</div>}>
                    <div>
                        {/* Conditionally render the first chart */}
                        {resource === 'companies' && <div>{chartData && <Area {...config} />}</div>}
                        {/* Conditionally render the second chart */}
                        {resource === 'contacts' && <div>{nextChartData && <Area {...nextConfig} />}</div>}
                    </div>
                </Suspense>
            </div>
        </Card>
    );
};

const IconWrapper: FC<PropsWithChildren<{ color: string }>> = ({ color, children }) => {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: color,
            }}
        >
            {children}
        </div>
    );
};

const variants: {
    [key in Type]: {
        primaryColor: string;
        secondaryColor?: string;
        icon: React.ReactNode;
        title: string;
        data: { index: string; value: number }[];
    };
} = {
    companies: {
        primaryColor: "#1677FF",
        secondaryColor: "#BAE0FF",
        icon: (
            <IconWrapper color="#E6F4FF">
                <StepBackwardOutlined className="md" style={{ color: "#1677FF" }} />
            </IconWrapper>
        ),
        title: "Average energy generated for the Past 48 hours",
        data: [
            { index: "1", value: 7000 },
            { index: "2", value: 2750 },
            { index: "3", value: 5000 },
            { index: "4", value: 4250 },
            { index: "5", value: 5000 },
        ],
    },
    contacts: {
        primaryColor: "#52C41A",
        secondaryColor: "#D9F7BE",
        icon: (
            <IconWrapper color="#F6FFED">
                <StepForwardOutlined className="md" style={{ color: "#52C41A" }} />
            </IconWrapper>
        ),
        title: "Average energy generated for the Next 48 hour",
        data: [
            { index: "1", value: 10000 },
            { index: "2", value: 19500 },
            { index: "3", value: 13000 },
            { index: "4", value: 17000 },
            { index: "5", value: 13000 },
            { index: "6", value: 20000 },
        ],
    },
    deals: {
        primaryColor: "#FA541C",
        secondaryColor: "#FFD8BF",
        icon: (
            <IconWrapper color="#FFF2E8">
                <AuditOutlined className="md" style={{ color: "#FA541C" }} />
            </IconWrapper>
        ),
        title: "Total deals in pipeline",
        data: [
            { index: "1", value: 1000 },
            { index: "2", value: 1300 },
            { index: "3", value: 1200 },
            { index: "4", value: 2000 },
            { index: "5", value: 800 },
            { index: "6", value: 1700 },
            { index: "7", value: 1400 },
            { index: "8", value: 1800 },
        ],
    },
};

export default DashboardTotalCountCard;
