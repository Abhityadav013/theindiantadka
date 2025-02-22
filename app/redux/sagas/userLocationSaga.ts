import { call, put, takeLatest } from "redux-saga/effects";
import Cookies from "js-cookie";
import { UserLocation } from "@/app/utils/types/user_location_type";
import { setLoading, setUserLocation } from "../reducers/userLocationReducer";
import { base_url } from "@/app/utils/api_url";
import { DeviceInfo } from "@/app/utils/types/device_info_type";
import api from "@/app/utils/axiosInstance";

// Function to get user location
const getUserLocation = (): Promise<UserLocation> =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => reject(error)
    );
  });

// API call for session registration
const registerSessionAPI = async (
  lat?: number,
  lng?: number
): Promise<DeviceInfo> => {
  const params = lat && lng ? { lat, lng } : {};
  const response = await api.get(base_url || "https://authenticate-demo.vercel.app/api/v1", {
    params,
    withCredentials: true,
  });

  console.log("API Response:", response.data); // Debugging

  return response.data.data; // ✅ Return only data, not the entire response object
};

// ✅ FIX: Properly typing the generator function

function* fetchUserLocationSaga(): Generator<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  void,
  UserLocation & DeviceInfo
> {
  yield put(setLoading(true));

  try {
    const location = Cookies.get("userLocation");

    if (!location) {
      const userLocation: UserLocation = (yield call(
        getUserLocation
      )) as UserLocation;
      Cookies.set("userLocation", JSON.stringify(userLocation), { expires: 7 });

      yield put(setUserLocation(userLocation));

      if (!sessionStorage.getItem("tid")) {
        const response: DeviceInfo = (yield call(
          registerSessionAPI,
          userLocation.lat,
          userLocation.lng
        )) as DeviceInfo;

        sessionStorage.setItem("tid", response.tid);
        localStorage.setItem(
          "indian_tadka_userLocation",
          JSON.stringify(userLocation)
        );
      }
    } else {
      yield put(setUserLocation(JSON.parse(location)));
    }
  } catch (error) {
    console.error("Failed to fetch user location:", error);
  } finally {
    yield put(setLoading(false));
  }
}

// Watcher Saga
export function* watchUserLocation(): Generator {
  yield takeLatest("user/fetchUserLocation", fetchUserLocationSaga);
}
