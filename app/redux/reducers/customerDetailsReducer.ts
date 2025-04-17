import {
  CustomerDetails,
  CustomerOrder,
} from '@/app/utils/types/customer_details_type';
import { UserLocation } from '@/app/utils/types/user_location_type';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ValidationError = {
  key: string;
  message: string;
};

export type ValidationErrors = ValidationError[];

interface CustomerDetailsState {
  customerDetailsModel: boolean;
  customerDetails: CustomerDetails | null;
  customerOrder: CustomerOrder | null;
  customerDetailsFormError: ValidationErrors;
  isCustomerDetailsPresent: boolean;
  isCustomerInformationSaved: boolean;
  userLocation: UserLocation | null;
  isUserLocationPresent: boolean;
  isOrderDeliverableAddress: boolean;
  loading: boolean;
  error: string | null;
}
const initialState: CustomerDetailsState = {
  customerDetailsModel: false,
  customerDetails: null,
  customerOrder: null,
  customerDetailsFormError: [],
  isCustomerDetailsPresent: false,
  isCustomerInformationSaved: false,
  isUserLocationPresent: false,
  userLocation: null,
  isOrderDeliverableAddress: true,
  loading: false,
  error: null,
};

const customerDetailsSlice = createSlice({
  name: 'customerDetails',
  initialState,
  reducers: {
    fetchCustomerDetailsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCustomerDetailsSuccess: (
      state,
      action: PayloadAction<CustomerDetails>,
    ) => {
      state.customerDetails = action.payload;
      state.isCustomerDetailsPresent =
        action.payload && Object.keys(action.payload).length > 0;
      state.loading = false;
    },
    fetchCustomerOrderSuccess: (
      state,
      action: PayloadAction<CustomerOrder>,
    ) => {
      state.customerDetails = action.payload.customerDetails ?? {};
      state.customerOrder = action.payload ?? {};
      state.loading = false;
    },
    fetchCustomerDetailsFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    fetchCustomerLocationStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCustomerLocationSuccess: (
      state,
      action: PayloadAction<UserLocation>,
    ) => {
      state.userLocation = action.payload ?? null;
      state.isUserLocationPresent =
        state.userLocation && Object.keys(state.userLocation).length > 0;
      state.loading = false;
    },
    fetchIsOrderDeliverableAddress: (state, action: PayloadAction<boolean>) => {
      state.isOrderDeliverableAddress = action.payload;
    },
    updateCustomerDetailsStart: (state) => {
      state.loading = true;
    },
    updateCustomerDetailsSuccess: (
      state,
      action: PayloadAction<CustomerOrder>,
    ) => {
      state.customerDetails = action.payload.customerDetails;
      state.customerOrder = action.payload;
      state.isCustomerInformationSaved = true;
      state.isCustomerDetailsPresent =
        action.payload && Object.keys(action.payload).length > 0;
      state.loading = false;
    },
    updateCustomerDetailsFailure: (
      state,
      action: PayloadAction<ValidationErrors | string>,
    ) => {
      if (typeof action.payload === 'string') {
        state.error = action.payload;
      } else {
        state.customerDetailsFormError = Array.isArray(action.payload)
          ? action.payload
          : [];
      }
      state.loading = false;
    },
    openCustomerDetailsModel: (state) => {
      state.loading = true;
      state.customerDetailsModel = true;
    },
    closeCustomerDetailsModel: (state) => {
      state.loading = true;
      state.customerDetailsModel = false;
    },
  },
});

export const {
  fetchCustomerDetailsStart,
  fetchCustomerDetailsSuccess,
  fetchCustomerOrderSuccess,
  fetchCustomerDetailsFailure,
  fetchCustomerLocationSuccess,
  fetchCustomerLocationStart,
  fetchIsOrderDeliverableAddress,
  updateCustomerDetailsStart,
  updateCustomerDetailsSuccess,
  updateCustomerDetailsFailure,
  openCustomerDetailsModel,
  closeCustomerDetailsModel,
} = customerDetailsSlice.actions;
export default customerDetailsSlice.reducer;
