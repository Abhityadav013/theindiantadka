"use client"
import { Checkbox, Typography } from '@mui/material'
import React, { useState } from 'react'

const NoContactDelivery = () => {
    const [noContactDelivery, setNoContactDelivery] = useState(false); // Managing checkbox state
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNoContactDelivery(event.target.checked);
    };

    return (
        <div className="flex items-start gap-2 p-5">
            <Checkbox checked={noContactDelivery} onChange={handleCheckboxChange} />
            <Typography variant="body2" fontSize={14} className="text-tomato">
                <strong>Opt in for No-contact Delivery</strong>
                <br />Unwell, or avoiding contact? Please select no-contact delivery.
            </Typography>
        </div>
    )
}

export default NoContactDelivery
