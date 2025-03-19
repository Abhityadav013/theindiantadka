import { call, put, select, takeLatest } from "redux-saga/effects";
import { base_url } from "../../utils/api_url";
import { Cart, CartDescription } from "@/app/utils/types/cart_type";
import {
  fetchCartDescriptionFailure,
  fetchCartDescriptionStart,
  fetchCartDescriptionSuccess,
  fetchCartFailure,
  fetchCartStart,
  fetchCartSuccess,
  updateCartDescriptionSuccess,
  updateCartFailure,
  updateCartStart,
  updateCartSuccess,
} from "../reducers/cartReducer";
import { RootState } from "../reducers";
import { ErrorType } from "@/app/utils/types/error_type";
import api from "@/app/utils/axiosInstance";

// Fetch cart items from API
export const fetchCartItemsApi = async (): Promise<Cart[]> => {
  const response = await api.post(
    `${base_url}/cart`,
    {},
    { withCredentials: true }
  );
  return response.data.data?.cart?.cartItems || [];
};


export const fetchCartItemsAddonsApi = async (): Promise<CartDescription[]> => {
  const response = await api.get(`${base_url}/cart-description`, {
    withCredentials: true,
  });
  return response.data.data?.cartDescription || [];
};

// Update cart items in API
export const updateCartItemsApi = async (cart: Cart[],isCartEmpty?:boolean): Promise<Cart[]> => {
  const response = await api.post(
    `${base_url}/cart`,
    { cart ,isCartEmpty},
    { withCredentials: true }
  );
  return response.data.data.cart.cartItems || [];
};

export const updateCartDescriptionApi = async (
  cartDescription: CartDescription
): Promise<CartDescription[]> => {
  // Fetch current user addresses from the API
  const existingDescription: CartDescription[] =
    await fetchCartItemsAddonsApi();

  // Add the new address to the current addresses
  const updateCartDescription = [...existingDescription, cartDescription];

  await api.put(
    `${base_url}/cart`,
    { cartDescription },
    { withCredentials: true }
  );

  return updateCartDescription;
};

// Worker Saga: Fetch Cart
function* fetchCartSaga() {
  try {
    yield put(fetchCartStart());
    const cartData: Cart[] = yield call(fetchCartItemsApi);
    yield put(fetchCartSuccess(cartData));
  } catch (err) {
    console.log("err>>>>", err);
    yield put(fetchCartFailure("failed"));
  }
}

function* fetchCartDescriptionSaga() {
  try {
    yield put(fetchCartDescriptionStart());
    const cartData: CartDescription[] = yield call(fetchCartItemsAddonsApi);
    yield put(fetchCartDescriptionSuccess(cartData));
  } catch (err) {
    console.log("err>>>>", err);
    yield put(fetchCartDescriptionFailure("failed"));
  }
}

// // Worker Saga: Update Cart
function* updateCartSaga() {
  try {
    yield put(updateCartStart()); // Start loading
    const cart: Cart[] = yield select((state: RootState) => state.cart.cart);
    // Call API to update car
    const response: Cart[] = yield call(updateCartItemsApi, cart,false);
    yield put(updateCartSuccess(response)); // Dispatch success action
  } catch (error: unknown) {
    let errorMessage = "An unknown error occurred";
    if (error && (error as ErrorType).message) {
      errorMessage = (error as ErrorType).message; // Extract message from the error
    }
    yield put(updateCartFailure(errorMessage)); // Handle failure
  }
}
function* updateCartOrderCreatedSaga() {
  try {
    yield put(updateCartStart()); // Start loading
    const cart: Cart[] = yield select((state: RootState) => state.cart.cart);
    // Call API to update car
    const response: Cart[] = yield call(updateCartItemsApi, cart,true);
    yield put(updateCartSuccess(response)); // Dispatch success action
  } catch (error: unknown) {
    let errorMessage = "An unknown error occurred";
    if (error && (error as ErrorType).message) {
      errorMessage = (error as ErrorType).message; // Extract message from the error
    }
    yield put(updateCartFailure(errorMessage)); // Handle failure
  }
}

function* updateCartDescriptionSaga() {
  try {
    yield put(updateCartStart()); // Start loading
    const cartDescription: CartDescription = yield select(
      (state: RootState) => state.cart.cartDescription
    );
    // Call API to update car
    const response: CartDescription[] = yield call(
      updateCartDescriptionApi,
      cartDescription
    );
    yield call(updateCartDescriptionSuccess, response);
    // yield put(updateCartDescriptionSuccess(cartDescription)); // Dispatch success action
  } catch (error: unknown) {
    let errorMessage = "An unknown error occurred";
    if (error && (error as ErrorType).message) {
      errorMessage = (error as ErrorType).message; // Extract message from the error
    }
    yield put(updateCartFailure(errorMessage)); // Handle failure
  }
}

// Watcher Saga
export function* watchCartActions() {
  yield takeLatest("cart/fetchCartSaga", fetchCartSaga);
  yield takeLatest("cart/fetchCartDescriptionSaga", fetchCartDescriptionSaga);
  yield takeLatest("cart/updateCartItem", updateCartSaga);
  yield takeLatest("cart/updateCartDescriptionItem", updateCartDescriptionSaga);
  yield takeLatest("cart/updateCartOrderCreatedSaga",updateCartOrderCreatedSaga)
}
