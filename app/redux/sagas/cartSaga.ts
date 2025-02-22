import { call, put, select, takeLatest } from "redux-saga/effects";
import axios from "axios";
import { base_url } from "../../utils/api_url";
import { Cart } from "@/app/utils/types/cart_type";
import { 
  fetchCartFailure, fetchCartStart, fetchCartSuccess,
  updateCartFailure,
  updateCartStart,
  updateCartSuccess,
} from "../reducers/cartReducer";
import { RootState } from "../reducers";
import { ErrorType } from "@/app/utils/types/error_type";
import api from "@/app/utils/axiosInstance";

// Fetch cart items from API
export const fetchCartItemsApi = async (): Promise<Cart[]> => {
  const response = await axios.post(`${base_url}/cart`, {}, { withCredentials: true });
  console.log('response.....',response.data.data)
  return response.data.data.cart.cartItems || [];
};

// Update cart items in API
export const updateCartItemsApi = async (cart: Cart[]): Promise<Cart[]> => {
  console.log('base_urlbase_urlbase_urlbase_urlbase_url>>>>>',base_url)
  const response = await api.post(
    `${base_url}/cart`,
    { cart },
    { withCredentials: true }
  );
  return response.data.data.cart.cartItems || [];
};

// Worker Saga: Fetch Cart
function* fetchCartSaga() {
  try {
    yield put(fetchCartStart());
    const cartData: Cart[] = yield call(fetchCartItemsApi);
    console.log('cartData>>>>>',cartData)
    yield put(fetchCartSuccess(cartData));
  } catch(err) {
    console.log('err>>>>',err)
    yield put(fetchCartFailure('failed'));
  }
}

// // Worker Saga: Update Cart
function* updateCartSaga() {
  try {
    yield put(updateCartStart()); // Start loading
    const cart: Cart[] = yield select((state: RootState) => state.cart.cart);
    console.log('Step 1>><<<<',cart)


   
    // Call API to update car
    const response: Cart[] = yield call(updateCartItemsApi, cart);
    console.log('response>>>>',response)
    yield put(updateCartSuccess(response)); // Dispatch success action
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
  yield takeLatest("cart/updateCartItem", updateCartSaga);
}
