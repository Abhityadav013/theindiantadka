import { OrderType } from '@/app/models/Order';
import { UserAddress } from './address_type';


export interface CustomerDetails {
  name: string;
  phoneNumber: string;
  address?: UserAddress;
  isFreeDelivery?:boolean;
  deliveryFee?:string,
  notDeliverable?: boolean
}

export interface CustomerOrder{
  customerDetails: CustomerDetails;
  orderType: OrderType;
}
