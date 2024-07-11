import { combineReducers } from "redux";
import weatherReducer from "./WeatherModules";

const rootReducer = combineReducers({
    weatherReducer
})

export default rootReducer;