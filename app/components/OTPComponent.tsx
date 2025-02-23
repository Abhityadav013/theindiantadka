import React, { useEffect, useState } from "react";
import { Button, TextField, Typography, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ProfileOTPProps {
  isOpen: boolean;
  onClose: () => void;
  resendOTP: () => void;
  verifyOTP: (value: string) => void;
  otpExpiresAt: number;
}

const OTPComponent: React.FC<ProfileOTPProps> = ({ isOpen, otpExpiresAt, verifyOTP, resendOTP, onClose }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // Countdown timer
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const timeLeft = otpExpiresAt - Date.now();
      
      if (timeLeft <= 0) {
        setMinutes(0);
        setSeconds(0);
        return;
      }

      const remainingMinutes = Math.floor(timeLeft / 60000);
      const remainingSeconds = Math.floor((timeLeft % 60000) / 1000);

      setMinutes(remainingMinutes);
      setSeconds(remainingSeconds);
    };

    calculateTimeRemaining();

    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval); // Stop when time expires
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [otpExpiresAt, seconds, minutes]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value.slice(0, 1); // Ensure only one character
    setOtp(newOtp);

    if (e.target.value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus(); // Auto-focus the next input
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>, index: number) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus(); // Focus previous input if backspace is pressed
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle className="text-center text-lg font-semibold text-gray-800">
        Verify OTP
      </DialogTitle>
      <IconButton
        edge="end"
        color="inherit"
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 10, // 10px from the top of the container
          right: 20, // 10px from the right of the container
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        {/* OTP Inputs */}
        <div className="grid grid-cols-6 gap-2 mb-6">
          {otp.map((digit, index) => (
            <TextField
              key={index}
              id={`otp-input-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              inputProps={{ maxLength: 1 }}
              variant="outlined"
              size="small"
              className="text-center border-indigo-600 focus:ring-2 focus:ring-indigo-500"
              autoFocus={index === 0}
            />
          ))}
        </div>

        {/* Countdown and Resend OTP */}
        <div className="text-center mb-6">
          <Typography variant="body2" className="text-gray-600">
            Time Remaining:{" "}
            <span className="font-semibold text-indigo-600">
              {minutes < 10 ? `0${minutes}` : minutes}:
              {seconds < 10 ? `0${seconds}` : seconds}
            </span>
          </Typography>
          <Button
            className={`mt-2 ${seconds > 0 || minutes > 0 ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"} text-white py-2 px-4 rounded-md`}
            onClick={resendOTP}
            disabled={seconds > 0 || minutes > 0} // Disable until time is up
          >
            Resend OTP
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => verifyOTP(otp.join(""))}
            className="mt-2 text-white ml-4 py-2 px-4 rounded-md"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OTPComponent;
