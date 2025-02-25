import AccountCheckout from "./AccountCheckout";
import AddressCheckOut from "./AddressCheckOut";
import PaymentsCheckout from "./PaymentsCheckout";


const CheckoutSteps = () => {
//    const userProfile:UserProfile  = useSelector((state: RootState) => state.user.profile);
    return (
        <div className="max-w-3xl mx-auto p-4">
            {/* Account Section */}
            <AccountCheckout />
            {/* Delivery Address Section */}

            <AddressCheckOut />
            {/* Payment Section */}
            <PaymentsCheckout />
        </div>
    );
};

export default CheckoutSteps;
