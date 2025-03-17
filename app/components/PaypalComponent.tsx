'use client'

import React, { useEffect, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { Order } from '../utils/types/order_type';

interface PaypalComponentProps {
    order: Order[];
    amount:number
  }

const PaypalComponent:React.FC<PaypalComponentProps> = ({amount,order}) => {
    const [orderId, setOrderId] = useState<string | null>(null);


    useEffect(() => {
        // Create order on the server when the component mounts
        const createOrder = async () => {
            try {
               
                const response = await fetch('/api/create-order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount,order }),
                });
                const data = await response.json();
               
                setOrderId(data.id);
            } catch (error) {
                console.error('Error creating PayPal order:', error);
            }
        };

        createOrder();
    }, [amount,order]);

    if (!orderId) {
        return (
            <div className="flex items-center justify-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white">
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Loading...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <PayPalScriptProvider options={{clientId : process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ''}}>
            <div className="paypal-button-container">
                <PayPalButtons
                    createOrder={(data, actions) => {
                        return actions.order.create({
                            intent: 'CAPTURE', // Specify intent here
                            purchase_units: [
                                {
                                    amount: {
                                        value: (amount / 100).toFixed(2), // Convert amount from cents to dollars
                                        currency_code: 'USD',
                                    },
                                },
                            ],
                        });
                    }}
                    onApprove={async (data, actions) => {
                        if (actions.order) {
                            const order = await actions.order.capture();
                            console.log('Payment Successful!', order);
                            window.location.href = '/payment-success';
                        } else {
                            console.error('PayPal actions.order is undefined');
                        }
                        console.log('Payment Successful!', actions.order);
                        window.location.href = '/payment-success';
                    }}
                    onError={(err) => {
                        console.error('PayPal error:', err);
                        window.location.href = '/payment-cancel';
                    }}
                    
                />

            </div>
        </PayPalScriptProvider>
    );
};

export default PaypalComponent;