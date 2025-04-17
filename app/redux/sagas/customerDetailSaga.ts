import { call, put, select, takeLatest } from 'redux-saga/effects';
import { RootState } from '../reducers';
import { ErrorType } from '@/app/utils/types/error_type';
import {
  CustomerDetails,
  CustomerOrder,
} from '@/app/utils/types/customer_details_type';
import { OrderType } from '@/app/models/Order';
import {
  fetchCustomerDetailsStart,
  fetchCustomerDetailsSuccess,
  fetchCustomerOrderSuccess,
  updateCustomerDetailsFailure,
  updateCustomerDetailsStart,
  ValidationErrors,
} from '../reducers/customerDetailsReducer';
import {
  ApiResponse,
  ValidationErrorResponse,
} from '@/app/utils/types/api_response_type';
import { isValidationErrorResponse } from '@/app/libs/common/ApiResponse';
import {
  fetchUserAddressFailure,
  fetchUserAddressSuccess,
} from '../reducers/addressReducer';
import { UserAddress } from '@/app/utils/types/address_type';
import { fetchCustomerDetailsApi } from './commonAPIs';

// Fetch cart items from API

// Update cart items in API
export const updateCustomerDetails = async (customerOrder: CustomerOrder) => {
  try {
    // Send the updated address list to the API
    const payload = {
      userInfo: {
        name: customerOrder.customerDetails.name,
        phoneNumber: customerOrder.customerDetails.phoneNumber,
        ...(customerOrder.orderType === OrderType.DELIVERY && {
          address: customerOrder.customerDetails.address,
        }),
      },
      orderType: customerOrder.orderType,
    };
    const tid = localStorage.getItem('tid'); // Retrieve tid from session storage
    const ssid = localStorage.getItem('ssid');
    const response = await fetch('api/user-details', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Session-Id': ssid || '', // Add session ID to request headers
        Tid: tid || '', // Add tid to request headers
      },
      body: JSON.stringify({ ...payload }),
    });
    const data = await response.json();

    // Check if request was successful before parsing JSON
    if (!response.ok) {
      return data;
    }
    return data;
  } catch (error) {
    console.error('Fetch Error:', error);
    return null;
  }
};
// Worker Saga: Fetch Cart
function* fetchCustomerDetailsSaga() {
  try {
    yield put(fetchCustomerDetailsStart());
    const customerOrder: CustomerOrder = yield call(fetchCustomerDetailsApi);

    yield put(
      fetchCustomerDetailsSuccess(
        (customerOrder?.customerDetails ?? {}) as CustomerDetails,
      ),
    );
    yield put(
      fetchCustomerOrderSuccess((customerOrder ?? {}) as CustomerOrder),
    );
    yield put(
      fetchUserAddressSuccess(
        customerOrder.customerDetails.address || ({} as UserAddress),
      ),
    ); // Assuming address is an array of UserAddress
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    yield put(fetchUserAddressFailure('failed'));
  }
}

// // Worker Saga: Update Cart
function* updateCustomerDetailsSaga() {
  try {
    yield put(updateCustomerDetailsStart()); // Start loading

    const { customerOrder } = yield select(
      (state: RootState) => state.customerDetails,
    );

    // Add the new address to the current list
    const response: ValidationErrorResponse | ApiResponse<CustomerDetails> =
      yield call(updateCustomerDetails, customerOrder);

    if (isValidationErrorResponse(response)) {
      const error: ValidationErrors = response.data; // Extract validation errors
      yield put(updateCustomerDetailsFailure(error)); // Handle validation errors
    } else {
      yield put(
        fetchUserAddressSuccess(response.data.address || ({} as UserAddress)),
      );
      yield put(
        fetchCustomerDetailsSuccess((response.data ?? {}) as CustomerDetails),
      );
    }
  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred';
    if (error && (error as ErrorType).message) {
      errorMessage = (error as ErrorType).message; // Extract message from the error
    }
    yield put(updateCustomerDetailsFailure(errorMessage)); // Handle failure
  }
}

// Watcher Saga
export function* watchCustomerDetailsActions() {
  yield takeLatest(
    'customerDetails/fetchCustomerDetailsSaga',
    fetchCustomerDetailsSaga,
  );
  yield takeLatest(
    'customerDetails/updateCustomerDetailsSuccess',
    updateCustomerDetailsSaga,
  );
}
