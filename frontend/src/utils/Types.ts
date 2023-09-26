
/** Station Status Types */
export type statusColPropsType = {
    statusType: "total" | "free" | "busy" | "outoforder", 
    status: ["normal", "exception", "active", "success"][number], //as "success", 
    numberOfStations: number, 
    percent: number, 
    statusText: string,
}

export type stationStatusResponseType = {
    statusType: "total" | "free" | "busy" | "outoforder", 
    numberOfStations: number,
}

export enum stationStatusLoadingType {
    Initial = "init",
    Loading = "loading",
    Finished = "finished",
}

/** Session Data Types */
export type sessionPerEmaidRequestType = {
    lastUpdateFrom: string, 
    lastUpdateTo: string,
}


export type sessionDataResponseType = {
    emaid: string, 
    month: Date,
    kwh: number,
    timeSeconds: number,
    costs: number,
}
