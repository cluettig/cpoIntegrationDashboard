import React from "react";
import { Button, Col, Progress, Row, Spin, notification } from "antd";
import { WarningOutlined } from '@ant-design/icons';
import axios from "../utils/Api";
import { stationStatusLoadingType, stationStatusResponseType, statusColPropsType } from "../utils/Types";


const statusColProps: statusColPropsType[] = [
    {statusType: "free", status: "success", numberOfStations: 0, percent: 50, statusText: "Free" },
    {statusType: "busy", status: "normal", numberOfStations: 0, percent: 50, statusText: "Busy" },
    {statusType: "outoforder", status: "exception", numberOfStations: 0, percent: 50, statusText: "Out of order" },
]

const ChargePointStatus: React.FC = () => {
    const [stationStatus, setStationStatus] = React.useState<statusColPropsType[]>(statusColProps);
    const [totalNumberOfStations, setTotalNumberOfStations] = React.useState<number>(0);
    const [loadingStatus, setLoadingStatus] = React.useState<stationStatusLoadingType>(stationStatusLoadingType.Initial);
    const [api, contextHolder] = notification.useNotification();

    /** Handler for Fetch Data */
    const fetchDataClickHandler = async (e: any) => {
        setLoadingStatus(stationStatusLoadingType.Loading);
        try {
            const { data } = await axios.get("/stationstatus/stationlist");
            const stationStatusResponse: stationStatusResponseType[] = data;
            const newStatus = [...statusColProps];
            
            const foundTotalNumber = stationStatusResponse.find(obj => obj.statusType === "total");
            stationStatusResponse.forEach((stationStatus) => {
                const foundStatusCol = newStatus.find(obj => obj.statusType === stationStatus.statusType);
                if (foundStatusCol) {
                    foundStatusCol.numberOfStations = stationStatus.numberOfStations;
                    foundStatusCol.percent = 100 / foundTotalNumber?.numberOfStations! * stationStatus.numberOfStations;
                }
            });
            setTotalNumberOfStations(foundTotalNumber?.numberOfStations!);
            setStationStatus(newStatus);
            setLoadingStatus(stationStatusLoadingType.Finished);
        }
        catch (e: any) {
            api.error({
                message: `Error`,
                description: `Message: ${e.message}`,
                placement: "topRight",
            });
            setLoadingStatus(stationStatusLoadingType.Initial);
        }
    }

    /** Design Definitions */
    const progressColSpan = {
        span: 8, 
        style: {display: 'flex', flexDirection: 'column' as 'column', justifyContent: 'center', alignItems: 'center',},
    };
    const textSpanProps = {style: {fontSize: '22px'}};
    return (
        <div>
            {contextHolder}
            <Spin 
                indicator={loadingStatus === stationStatusLoadingType.Initial ? <WarningOutlined style={{ fontSize: 60, marginTop: -60, }} /> : undefined}
                spinning={loadingStatus === stationStatusLoadingType.Initial || loadingStatus === stationStatusLoadingType.Loading}
                size="large"
                tip={
                    <b>
                        {   loadingStatus === stationStatusLoadingType.Initial 
                            ? "Hit the button to fetch your station data."
                            : ( loadingStatus === stationStatusLoadingType.Loading
                                ? "Fetching your station data..."
                                : ""
                            )
                        }
                    </b>
                }
            >
                <Row>
                    { stationStatus.map((statusCol, index) => (
                        <Col key={`col-${index}`} {...progressColSpan} className="station-status-col">
                            <Progress 
                                type="dashboard"
                                status={statusCol.status}
                                showInfo={true}
                                format={() => statusCol.numberOfStations + " / " + totalNumberOfStations}
                                percent={statusCol.percent}
                                strokeWidth={10}
                                size={200}
                            />
                            <span {...textSpanProps}>{statusCol.statusText}</span>
                        </Col>
                    )
                    )}
                </Row>
            </Spin>
            <div id="plotcontainer"></div>
            <Row>
                <Col span={24}><Button onClick={fetchDataClickHandler} type='primary'>Fetch Data</Button></Col>
            </Row>
        </div>
    );
}

export default ChargePointStatus;