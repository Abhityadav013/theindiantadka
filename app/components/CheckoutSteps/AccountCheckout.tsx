import React from 'react'
import { Card, CardContent, Typography, Button } from "@mui/material";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonIcon from '@mui/icons-material/Person';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/redux/store';
import { setLoginModal } from '@/app/redux/reducers/userProfileReducer';

const AccountCheckout = () => {
    const dispatch = useDispatch<AppDispatch>();

    const handleProfileModal = () =>{
     dispatch(setLoginModal(true))
    }
  return (
    <Card className="w-full shadow-md border border-gray-200 rounded-lg">
        <CardContent className="p-6 flex flex-col space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-10 h-10 bg-black">
              <PersonIcon className="text-white" />
            </div>
            <div className="flex-1">
              <Typography variant="h6" className="font-semibold">
                Account
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                To place your order now, log in to your existing account or sign up.
              </Typography>
              <div className="mt-4 flex gap-4">
                <Button variant="outlined" className="border-green-600 text-green-600"
                onClick={handleProfileModal}>
                  Have an account? LOG IN
                </Button>
                <Button variant="contained" className="bg-green-600 text-white">
                  New to Indian Tadka? SIGN UP
                </Button>
              </div>
            </div>
            {/* <img
              src="/food-image.png"
              alt="Food"
              className="w-16 h-16 object-cover"
            /> */}
          </div>
        </CardContent>
      </Card>
  )
}

export default AccountCheckout
