import React from "react";

import { Col, Row } from "antd";



import {
    CompaniesMap,
    DashboardPredictChart,
    DashboardTasksChart,
    DashboardTotalCountCard,
} from "./components";

export const DashboardPage: React.FC = () => {
    return (
        <div className="page-container">
            <Row gutter={[32, 32]}>
                <Col xs={24} sm={24} xl={12}>
                    <DashboardTotalCountCard resource="companies" />
                </Col>
                <Col xs={24} sm={24} xl={12}>
                    <DashboardTotalCountCard resource="contacts" />
                </Col>
            </Row>

            <Row
                gutter={[32, 32]}
                style={{
                    marginTop: "32px",
                }}
            >
                <Col
                    xs={24}
                    sm={24}
                    xl={24}
                    style={{
                        height: "432px",
                    }}
                >
                    <DashboardPredictChart />
                </Col>
            </Row>

            <Row
                gutter={[32, 32]}
                style={{
                    marginTop: "32px",
                }}
            >
                <Col xs={24} sm={24} xl={14} xxl={16}>
                </Col>
                <Col xs={24} sm={24} xl={10} xxl={8}>
                </Col>
            </Row>

            <Row
                gutter={[32, 32]}
                style={{
                    marginTop: "32px",
                }}
            >
                <Col
                    xs={24}
                    sm={24}
                    xl={8}
                    style={{
                        height: "448px",
                    }}
                >
                    <DashboardTasksChart />
                </Col>
                <Col
                    xs={24}
                    sm={24}
                    xl={16}
                    style={{
                        height: "448px",
                    }}
                >
                    <CompaniesMap />
                </Col>
            </Row>
        </div>
    );
};
