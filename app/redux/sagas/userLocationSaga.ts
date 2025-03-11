import { call, put, takeLatest } from 'redux-saga/effects';
import Cookies from 'js-cookie';
import { UserLocation } from '@/app/utils/types/user_location_type';
import { setLoading, setUserLocation } from '../reducers/userLocationReducer';
import { base_url } from '@/app/utils/api_url';
import { DeviceInfo } from '@/app/utils/types/device_info_type';
import api from '@/app/utils/axiosInstance';

const getUserLocation = (): Promise<UserLocation> =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => reject(error),
    );
  });

// API call for session registration
const registerSessionAPI = async (lat?: number, lng?: number): Promise<DeviceInfo> => {
  const params = lat !== undefined && lng !== undefined ? { lat, lng } : {};
  const response = await api.get(
    base_url || 'https://authenticate-demo.vercel.app/api/v1',
    {
      params,
      withCredentials: true,
    },
  );

  return response.data.data; // ✅ Return only data, not the entire response object
};

// ✅ FIX: Properly typing the generator function
function* fetchUserLocationSaga(): Generator<
  any, // eslint-disable-line @typescript-eslint/no-explicit-any
  void,
  UserLocation & DeviceInfo
> {
  yield put(setLoading(true));

  try {
    const location = Cookies.get('userLocation');
    const locationConsent = localStorage.getItem("locationConsent") === 'true';

    if (!location) {
      let userLocation: UserLocation | null = null;

      // ✅ Only fetch user location if consent is given
      if (locationConsent) {
        userLocation = (yield call(getUserLocation)) as UserLocation;

        Cookies.set('userLocation', JSON.stringify(userLocation), {
          expires: 7,
        });

        yield put(setUserLocation(userLocation));
      }

      // ✅ Only register session if `tid` is not set
      if (!sessionStorage.getItem('tid')) {
        let response: DeviceInfo;

        // ✅ Only send location if consent is given
        if (userLocation) {
          response = (yield call(registerSessionAPI, userLocation.lat, userLocation.lng)) as DeviceInfo;
        } else {
          response = (yield call(registerSessionAPI)) as DeviceInfo;
        }

        sessionStorage.setItem('tid', response.tid);

        // ✅ Store location in localStorage only if consent is given
        if (locationConsent && userLocation) {
          localStorage.setItem('indian_tadka_userLocation', JSON.stringify(userLocation));
        }
      }
    } else {
      yield put(setUserLocation(JSON.parse(location)));
    }
  } catch (error) {
    console.error('Failed to fetch user location:', error);
  } finally {
    yield put(setLoading(false));
  }
}

// Watcher Saga
export function* watchUserLocation(): Generator {
  yield takeLatest('user/fetchUserLocation', fetchUserLocationSaga);
}
