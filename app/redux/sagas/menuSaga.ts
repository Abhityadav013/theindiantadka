import { call, put, select, takeLatest,all } from "redux-saga/effects";
import { fetchMenuStart, fetchMenuSuccess, fetchMenuFailure } from "../reducers/menuReducer";
import { menu_url } from "../../utils/api_url";
import { RootState } from "../reducers";
import { FoodCategory } from "@/app/utils/types/food_category_type";
import { FoodItem } from "@/app/utils/types/menu_type";
import axios from "axios";

// Function to fetch Menu items
export const fetchMenuItemsApi = async (): Promise<FoodItem[]> => {
  const response = await axios.get(`${menu_url}/menu`); // Use full URL
  return response.data;
};

// Function to fetch menu items
export const fetchMenuItemsCategoryApi = async (): Promise<FoodCategory[]> => {
  const response = await axios.get(`${menu_url}/category`); // Use full URL
  return response.data;
};

// Worker Saga: Fetch Menu Data
function* fetchMenuSaga() {
  try {
    // Select current data from Redux store
    const {foodCategoryItems,foodMenuItems } = yield select((state: RootState) => state.menu);

    
    // Avoid API calls if data already exists
    if (foodMenuItems.length > 0 && foodCategoryItems.length > 0) return;

    yield put(fetchMenuStart());

    const [foodMenuData, foodCategoryData]: [FoodItem[], FoodCategory[]] = yield all([
      call(fetchMenuItemsApi),
      call(fetchMenuItemsCategoryApi),
    ]);

    // Process menu data to match expected format
    const filteredMenuCategoryItems = foodCategoryData
      .filter((cat) => cat.isDelivery)
      .map((cat) => ({
        menu_name: cat.categoryName,
        menu_image: cat.imageUrl,
      }));

    // Dispatch success action with fetched data
    yield put(fetchMenuSuccess({ foodMenuItems: foodMenuData, foodCategoryItems: filteredMenuCategoryItems }));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    yield put(fetchMenuFailure(error.message));
  }
}

// Watcher Saga: Listen for the action
export function* watchFetchMenu() {
  yield takeLatest("menu/fetchMenuSaga", fetchMenuSaga);
}
