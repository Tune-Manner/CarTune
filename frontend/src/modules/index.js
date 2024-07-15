import { combineReducers } from "redux";
import weatherReducer from "./WeatherModules";
import emailReducer from "./EmailModules";

const rootReducer = combineReducers({
    weatherReducer, emailReducer
})

export default rootReducer;