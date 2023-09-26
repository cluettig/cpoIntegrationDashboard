import React from "react";
import { Button, Col, DatePicker, Form, Row, Space, Table, notification } from "antd";
import { DownloadOutlined } from '@ant-design/icons';
import CsvDownloadButton from 'react-json-to-csv'
import axios from "../utils/Api";
import { sessionDataResponseType, sessionPerEmaidRequestType } from "../utils/Types";
import dayjs from 'dayjs';
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)

const SessionData: React.FC = () => {
    const [loadingStatus, setLoadingStatus] = React.useState<boolean>(false);
    const [sessionData, setSessionData] = React.useState<sessionDataResponseType[]>([]);
    const [api, contextHolder] = notification.useNotification();

    /** Handler for Fetch Data */
    const fetchSessionData = async (values: any) => {
        setLoadingStatus(true);
        try {
            const startDate = dayjs();
            const stopDate = dayjs(values.range?.[1]?.add(values.range?.[1]?.utcOffset(),'minute').toISOString()) ;//.endOf('day').toISOString();
            console.log(startDate, ' - ', stopDate);
            
            const lastUpdateFrom = values.range?.[0]?.toISOString();
            const lastUpdateTo = values.range?.[1]?.toISOString();
            const params: sessionPerEmaidRequestType = {
                lastUpdateFrom: lastUpdateFrom,
                lastUpdateTo: lastUpdateTo,
            } 
            const { data } = await axios.get(
                "/sessions/sumperemaid",
                {params: params},
            );
            const sessionDataResponse: sessionDataResponseType[] = [
                {emaid: "DE-ISE-C1JLIIUHZ-6", month: new Date("2023-08-01T16:30:00.000Z"), kwh: 1205.45, timeSeconds: 4420, costs: 0.000510321, },
                {emaid: "DE-ISE-C1JLIIUHZ-7", month: new Date("2023-08-01T16:30:00.000Z"), kwh: 1105.45, timeSeconds: 4380, costs: 0.000490321, },
                {emaid: "DE-ISE-C1JLIIUHZ-8", month: new Date("2023-08-01T16:30:00.000Z"), kwh: 1305.45, timeSeconds: 4580, costs: 0.000540321, },
                {emaid: "DE-ISE-C1JLIIUHZ-6", month: new Date("2023-09-01T16:30:00.000Z"), kwh: 605.45, timeSeconds: 3800, costs: 0.000340321, },
                {emaid: "DE-ISE-C1JLIIUHZ-7", month: new Date("2023-09-01T16:30:00.000Z"), kwh: 505.45, timeSeconds: 3700, costs: 0.000320321, },
                {emaid: "DE-ISE-C1JLIIUHZ-8", month: new Date("2023-09-01T16:30:00.000Z"), kwh: 545.45, timeSeconds: 3750, costs: 0.000330321, },
            ];
            setSessionData(data);
        }
        catch (e: any) {
            api.error({
                message: `Error`,
                description: `Message: ${e.message}`,
                placement: "topRight",
            });
        }
        finally {
            setLoadingStatus(false);
        }
    }

    return (
        <div>
            {contextHolder}
            <Form
                name="basic"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                onFinish={fetchSessionData}
            >
                <Row gutter={[16,16]}>
                    <Col span={12}>
                        <Form.Item label="Timerange for data (max 6 months in past)" name="range" rules={[{ required: true, }]}>
                            <DatePicker.RangePicker />
                        </Form.Item>
                    </Col>
                    <Col span={12} style={{textAlign: "right", marginTop: "auto",}}>
                        <Form.Item >
                            <Space>
                                <Button type="primary" htmlType="submit" loading={loadingStatus}>Fetch data</Button>
                                {sessionData.length > 0 ? (
                                    <CsvDownloadButton className="ant-btn css-dev-only-do-not-override-2ygyml ant-btn-primary" data={sessionData}>
                                        <span className="ant-btn-icon"><DownloadOutlined /></span>
                                        <span>CSV</span>
                                    </CsvDownloadButton>
                                ) : (
                                    <Button type="primary" icon={<DownloadOutlined />} disabled={true}>CSV</Button>
                                )}
                            </Space>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <Row>
                <Col span={24}>
                    <Table
                        loading={loadingStatus}
                        dataSource={sessionData}
                        columns={[
                            {
                                title: "Emaid",
                                key: "emaid",
                                dataIndex: "emaid",
                            },
                            {
                                title: "Month",
                                key: "month",
                                dataIndex: "month",
                                render: (value) => {
                                    const month = new Date(value);
                                     return `${month.getMonth()+1}-${month.getFullYear()}`
                                },
                            },
                            {
                                title: "Energy (kWh)",
                                key: "kwh",
                                dataIndex: "kwh",
                            },
                            {
                                title: "Charging time (s)",
                                key: "timeSeconds",
                                dataIndex: "timeSeconds",
                            },
                            {
                                title: "Total costs (€)",
                                key: "costs",
                                dataIndex: "costs",
                                render: (value) => (value * 10000).toFixed(4),
                            },
                        ]}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default SessionData;