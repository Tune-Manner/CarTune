import { handleActions,createActions } from "redux-actions";

// 초기 값
const initialState = {};

// 액션

// 리듀서 함수
const weatherReducer = handleActions({}, initialState);

export default weatherReducer;