'use client'

import React, { useEffect, useRef, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { OrderItem } from '../utils/types/order_type';

interface PaypalComponentProps {
    order: OrderItem[];
    amount: number
}

const PaypalComponent: React.FC<PaypalComponentProps> = ({ amount, order }) => {
    const [orderId, setOrderId] = useState<string | null>(null);
    const isOrderCreatedRef = useRef(false);
    const amountRef = useRef(amount);
    const orderRef = useRef(order);

    useEffect(() => {
        // Track the latest values of amount and order
        amountRef.current = amount;
        orderRef.current = order;
    }, [amount, order]); // Ensure that refs are updated with latest values
    useEffect(() => {
        // Create order on the server when the component mounts and when amount/order change
        const createOrder = async () => {
            try {
                const response = await fetch('/api/create-order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: amountRef.current, order: orderRef.current }),
                });
                const data = await response.json();

                if (response.ok) {
                    setOrderId(data.id);
                    isOrderCreatedRef.current = true; // Only set order created flag after successful response
                } else {
                    throw new Error(data.message || 'Failed to create order');
                }
            } catch (error) {
                console.error('Error creating PayPal order:', error);
            }
        };

        if (!isOrderCreatedRef.current) {
            createOrder();
        }
    }, []); // Empty dependency array ensures it runs once on mount

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
        <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '' }}>
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