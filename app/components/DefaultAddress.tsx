import { Card, CardContent, Typography, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { UserAddress } from "../utils/types/address_type";

interface DeliverAddressProps {
    addressData?: UserAddress;
    onClose: () => void;
}
const DeliveryAddress: React.FC<DeliverAddressProps> = ({ addressData, onClose }) => {

    const handleChangeDeliveryAddress = () => {
        onClose();
    };

    return (
        <Card className="w-[150%] min-w-3xl mx-auto bg-white shadow-2xl border border-gray-200 rounded-lg p-6">
            <CardContent className="p-6 flex flex-col space-y-2 ">
                <div className="flex items-start gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <Typography variant="h6" className="font-semibold">
                                Delivery address
                            </Typography>
                            <CheckCircleIcon className="text-green-500" />
                        </div>

                        <Typography variant="subtitle1" className="font-bold mt-1">
                            {addressData?.addressType === 'home' ? 'Home' : 'Work'}
                        </Typography>
                        <Typography variant="body2" className="text-gray-500">
                            {addressData?.displayAddress}
                        </Typography>

                        <Typography variant="body2" className="font-semibold mt-2">
                            34 MINS
                        </Typography>
                    </div>

                    {/* Change Button */}
                    <Button onClick={handleChangeDeliveryAddress} className="text-orange-500 font-bold" size="small">
                        CHANGE
                    </Button>
                </div>
            </CardContent>
            
        </Card>
    );
};

export default DeliveryAddress;
