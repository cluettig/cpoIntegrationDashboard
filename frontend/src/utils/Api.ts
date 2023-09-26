import axios from 'axios';

const backendBaseUrl = "http://localhost:9999/"

const axiosObj = axios.create({
    baseURL: backendBaseUrl,
    headers: {
        "content-type": "application/json",
        "accept": "application/json",
    },
});

export default axiosObj;
