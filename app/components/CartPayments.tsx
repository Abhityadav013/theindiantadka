import { Button, CardContent, Typography } from '@mui/material'
import React from 'react'

const CartPayments = () => {
    return (
        <div className="p-6 bg-white">
            <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
            </div>
        </div>
    )
}

export default CartPayments
