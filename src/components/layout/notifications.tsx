import React, { useState } from "react";
import { BellOutlined } from "@ant-design/icons";
import { Badge, Button, Divider, Popover, Space, Spin } from "antd";
import dayjs from "dayjs";
import { CustomAvatar } from "../custom-avatar";
import { Text } from "../text";

interface Notification {
    id: string;
    icon: string;
    text: string;
    time: string;
}

export const Notifications: React.FC = () => {
    const [open, setOpen] = useState(false);

    const hardcodedNotifications: Notification[] = [
        {
            id: "1",
            icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2mdDg-3g4-wOCGuAomV3VGq66wLPd-Rf7CLP4jMg&s",
            text:
                "Alert: Expected energy demand surpasses current production estimates by 15%. Prepare for potential shortfall and consider alternative energy sources.",
            time: "2023-11-20T08:00:00Z",
        },
        {
            id: "2",
            icon: "data:image/png;base64,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",
            text:
                "Notification: Severe weather forecasted in the next 48 hours may impact renewable energy production. Prepare for potential output fluctuations.",
            time: "2023-11-20T09:00:00Z",
        },
        {
            id: "3",
            icon: "data:image/png;base64,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",
            text:
                "Warning: Anticipated peak energy demand in the next 24 hours exceeds normal levels by 20%. Implement demand-side management strategies to balance load.",
            time: "2023-11-20T10:00:00Z",
        },
        {
            id: "4",
            icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr7YQIiIHEYcmt7HJMBb6j_wl-hmIwdm0Pdw&usqp=CAU",
            text:
                "Suggestion: Historical data indicates an upcoming period of high solar/wind energy output. Optimize operations to capitalize on increased renewable energy production.",
            time: "2023-11-20T11:00:00Z",
        },
        {
            id: "5",
            icon: "data:image/png;base64,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",
            text:
                "Recommendation: Recent data shows decreased energy production due to weather conditions. Consider adjusting operations or sourcing alternative energy to meet demand.",
            time: "2023-11-20T12:00:00Z",
        },
    ];

    // Mocked data
    const data = { data: hardcodedNotifications };
    const isLoading = false;

    const content = (
        <Space direction="vertical" split={<Divider style={{ margin: 0 }} />}>
            {data.data.map((notification) => (
                <Space key={notification.id}>
                    <CustomAvatar
                        size={48}
                        shape="square"
                        src={notification.icon}
                    />
                    <Space direction="vertical" size={0}>
                        <Text>{notification.text}</Text>
                        <Text size="xs" type="secondary">
                            {dayjs(notification.time).fromNow()}
                        </Text>
                    </Space>
                </Space>
            ))}
        </Space>
    );

    const loadingContent = (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 20,
            }}
        >
            <Spin />
        </div>
    );

    return (
        <Popover
            placement="bottomRight"
            content={isLoading ? loadingContent : content}
            trigger="click"
            onOpenChange={(newOpen) => setOpen(newOpen)}
            overlayStyle={{ width: 400 }}
        >
            <Badge dot>
                <Button
                    shape="circle"
                    icon={<BellOutlined />}
                    style={{ border: 0 }}
                />
            </Badge>
        </Popover>
    );
};
