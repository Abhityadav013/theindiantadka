import React, { useCallback } from 'react'
import AddNewAddress, { AddressInput } from '../AddNewAddress'
import { UserAddress } from '@/app/utils/types/address_type';
import { AppDispatch } from '@/app/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/redux/reducers';

const AddressForm = () => {
    const { addressModel: isAddressModelOpen, address ,userAddress} = useSelector((state: RootState) => state.address);
    console.log('userAddress>>>>>',userAddress)
    const isMobile = useSelector((state: RootState) => state.mobile.isMobile);
    const dispatch = useDispatch<AppDispatch>();
    const onSubmit = (values: AddressInput) => {
        const userAddress: UserAddress = {
            ...values,
            displayAddress: `${values.street} ${values.buildingNumber}, ${values.pincode} ${address?.village ?? ''} ${address?.town ?? ''},${address.country}`,
        }
        dispatch({ type: 'address/updateUserAddress', payload: userAddress })
        dispatch({ type: "address/closeAddressModel" });
    };

    const closeAddressDrawer = useCallback(() => {
        dispatch({ type: "address/closeAddressModel" });
    }, [dispatch])

    return (
        <div>
            <AddNewAddress onSubmit={onSubmit} isOpen={isAddressModelOpen} onClose={closeAddressDrawer} address={address} isMobile={isMobile}/>
        </div>
    )
}

export default AddressForm
