import { Button, Card, CardContent, Typography } from '@mui/material'
import React from 'react'

const CartPayments = () => {
    return (
        <Card className="shadow-md rounded-lg p-4">
            <CardContent>
                <Typography variant="h6" className="font-semibold mb-4">
                    Choose payment method
                </Typography>
                <Button
                    variant="contained"
                    className="bg-green-600 w-full py-2 text-white"
                >
                    PROCEED TO PAY
                </Button>
            </CardContent>
        </Card>
    )
}

export default CartPayments
