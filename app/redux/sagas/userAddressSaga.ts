import { call, put, select, takeLatest } from 'redux-saga/effects';
import { base_url } from '../../utils/api_url';
import { RootState } from '../reducers';
import { ErrorType } from '@/app/utils/types/error_type';
import api from '@/app/utils/axiosInstance';
import {
  fetchUserAddressFailure,
  fetchUserAddressStart,
  fetchUserAddressSuccess,
  updateuserAddressFailure,
  updateUserAddressStart,
  updateUserAddressSuccess,
} from '../reducers/addressReducer';
import { UserAddress } from '@/app/utils/types/address_type';
import { CustomerDetails } from '@/app/utils/types/customer_details_type';
import { fetchCustomerDetailsApi } from './commonAPIs';

// Fetch cart items from API
export const fetchUserAddressApi = async (): Promise<UserAddress[]> => {
  const response = await api.get(`${base_url}/address`, {
    withCredentials: true,
  });
  return response.data.data.addresses || [];
};

// Update cart items in API
export const updateUserAddressApi = async (
  newAddress: UserAddress,
): Promise<UserAddress[]> => {
  // Fetch current user addresses from the API
  const currentAddresses: UserAddress[] = await fetchUserAddressApi();

  // Add the new address to the current addresses
  const updatedAddresses = [...currentAddresses, newAddress];

  // Send the updated address list to the API
  await api.post(
    `${base_url}/address`,
    { address: newAddress },
    { withCredentials: true },
  );

  return updatedAddresses;
};
// Worker Saga: Fetch Cart
function* fetchUserAddressSaga() {
  try {
    yield put(fetchUserAddressStart());
    const customerDetails: CustomerDetails = yield call(
      fetchCustomerDetailsApi,
    );
    yield put(
      fetchUserAddressSuccess(customerDetails.address || ({} as UserAddress)),
    ); // Dispatch success action
  } catch (err) {
    console.log('err>>>>', err);
    yield put(fetchUserAddressFailure('failed'));
  }
}

// // Worker Saga: Update Cart
function* updateUserAddressSaga() {
  try {
    yield put(updateUserAddressStart()); // Start loading

    const newAddress: UserAddress = yield select(
      (state: RootState) => state.address.newAddress,
    );

    // Add the new address to the current list
    const response: UserAddress = yield call(
      updateUserAddressApi,
      newAddress,
    );

    // Dispatch the updated list of addresses after adding the new one
    yield put(updateUserAddressSuccess(response)); // Dispatch success action
  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred';
    if (error && (error as ErrorType).message) {
      errorMessage = (error as ErrorType).message; // Extract message from the error
    }
    yield put(updateuserAddressFailure(errorMessage)); // Handle failure
  }
}

// Watcher Saga
export function* watchUserAddressActions() {
  yield takeLatest('address/fetchUserAddressSaga', fetchUserAddressSaga);
  yield takeLatest('address/updateUserAddress', updateUserAddressSaga);
}
