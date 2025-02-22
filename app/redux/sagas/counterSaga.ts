import { takeEvery, put, delay } from "redux-saga/effects";
import { incrementAsyncSuccess } from "../reducers/counterReducer";

// Worker Saga: Runs when the 'INCREMENT_ASYNC' action is dispatched
function* incrementAsync() {
  yield delay(1000); // Simulate async call
  yield put(incrementAsyncSuccess(5)); // Increment by 5 after delay
}

// Watcher Saga: Watches for 'INCREMENT_ASYNC' action and runs worker saga
export function* watchIncrementAsync() {
  yield takeEvery("counter/incrementAsync", incrementAsync);
}
