import { Card, CardContent, Typography } from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";

const PaymentsCheckout = () => {
  return (
    <Card className="w-full shadow-md border border-gray-200 rounded-lg mt-4">
    <CardContent className="p-4 flex items-center gap-4">
      <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-md">
        <CreditCardIcon className="text-gray-600" />
      </div>
      <Typography variant="h6" className="font-semibold text-gray-600">
        Payment
      </Typography>
    </CardContent>
  </Card>
  )
}

export default PaymentsCheckout
