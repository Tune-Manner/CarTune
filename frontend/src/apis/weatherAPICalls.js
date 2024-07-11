import { request } from "./api"


export function callWeatherPredictAPI() {

    return async (dispatch, getState) => {

        // API 호출
        const result = await request('POST', '/weather-predict')

        if(result.status === 200) {
            dispatch(weatherPredict(result));
        }
    }
}

export function callWeatherPredictResultAPI() {

    return async (dispatch, getState) => {

        // API 호출
        const result = await request('GET', '/weather-predict')

        dispatch(weatherPredictResult(result));
    }
}