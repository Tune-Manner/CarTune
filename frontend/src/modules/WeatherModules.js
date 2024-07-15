import { createActions, handleActions} from "redux-actions";

// 초기 값
const initialState = {};

// 액션
const SUCCESS = 'weather/SUCCESS';
const GET_WEATHER_RESULT = 'weather/GET_WEATHER_RESULT';

export const { weather : { success, getWeatherResult } } = createActions({
    [SUCCESS] : () => ({ success : true }),
    [GET_WEATHER_RESULT] : result => ({ weather : result })
});

// 리듀서 함수
const weatherReducer = handleActions({
    [SUCCESS] : (state, {payload}) => payload,
    [GET_WEATHER_RESULT] : (state, { payload }) => payload
}, initialState);

export default weatherReducer;