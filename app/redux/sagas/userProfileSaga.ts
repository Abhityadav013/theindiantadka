import { call, put, takeLatest } from "redux-saga/effects";
import { base_url } from "../../utils/api_url";
import api from "@/app/utils/axiosInstance";

import { fetchOTPStart, fetchOTPSuccess, openOTPModel } from "../reducers/userProfileReducer";

// Fetch cart items from API
export const fetchProfileOTPApi = async (): Promise<number> => {
  const response = await api.post(`${base_url}/send-verify-otp`, {
    withCredentials: true,
  });

  return response.data.data.otpExpiresAt || [];
};

// Worker Saga: Fetch Cart
function* fetchProfileOTPSaga() {
  try {

    yield put(fetchOTPStart());
    const profileOTP: number = yield call(fetchProfileOTPApi);

    yield put(fetchOTPSuccess(profileOTP));
    yield put(openOTPModel())
  } catch (err) {
    console.log("err>>>>", err);
  }
}

// // // Worker Saga: Update Cart
// function* updateUserAddressSaga() {
//   try {
//     yield put(updateUserAddressStart()); // Start loading

//     const newAddress: UserAddress = yield select(
//       (state: RootState) => state.address.newAddress
//     );

//     // Add the new address to the current list
//     const response: UserAddress[] = yield call(
//       updateUserAddressApi,
//       newAddress
//     );

//     // Dispatch the updated list of addresses after adding the new one
//     yield put(updateUserAddressSuccess(response)); // Dispatch success action
//   } catch (error: unknown) {
//     let errorMessage = "An unknown error occurred";
//     if (error && (error as ErrorType).message) {
//       errorMessage = (error as ErrorType).message; // Extract message from the error
//     }
//     yield put(updateuserAddressFailure(errorMessage)); // Handle failure
//   }
// }

// Watcher Saga
export function* watchUserProfileActions() {
  yield takeLatest("user/fetchProfileOTPSaga", fetchProfileOTPSaga);
  //   yield takeLatest("address/updateUserAddress", updateUserAddressSaga);
}
