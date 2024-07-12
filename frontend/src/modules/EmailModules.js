import { createActions, handleActions} from "redux-actions";

// 초기 값
const initialState = {};

// 액션
const SEND_PLAYLIST_SUCCESS = 'email/SEND_PLAYLIST_SUCCESS';

export const { email : { sendPlaylistSuccess }} = createActions({
    [SEND_PLAYLIST_SUCCESS] : () => ({ sendPlaylistSuccess : true })
});

// 리듀서 함수
const emailReducer = handleActions({
    [SEND_PLAYLIST_SUCCESS]: (state, {payload}) => ({
        ...state,
        ...payload
    })
}, initialState);

export default emailReducer;