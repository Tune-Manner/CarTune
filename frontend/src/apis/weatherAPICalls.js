import { request } from "./api";
import { getWeatherResult } from "../modules/WeatherModules";

export const callWeatherPredictAPI = (file) => {
    return async (dispatch, getState) => {
        const formData = new FormData();
        formData.append('file', file);

        // API 호출
        const result = await request('POST', '/weather-predict/', formData);
        if (result && result.status === 200) {
            dispatch(getWeatherResult(result.data));
        } else {
            console.error('Unexpected response:', result);
        }
    };
};