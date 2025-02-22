import { combineReducers } from "redux";
import menuReducer from "./menuReducer";
import categoryReducer from "./categoryReducer";
import cartReducer from "./cartReducer";
import userLocationReducer from './userLocationReducer';
import addressReducer from './addressReducer'

const rootReducer = combineReducers({
  menu: menuReducer,
  category: categoryReducer,
  cart: cartReducer,
  userLocation:userLocationReducer,
  address:addressReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>; // TypeScript helper for Redux state
