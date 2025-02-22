import { all } from "redux-saga/effects";
import { watchFetchMenu } from "./menuSaga";
import { watchCartActions } from "./cartSaga";
import { watchUserLocation } from "./userLocationSaga";

// Root saga
export default function* rootSaga() {
  yield all([watchFetchMenu(),watchCartActions(),watchUserLocation()]);
}
