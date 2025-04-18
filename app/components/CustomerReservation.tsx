'use client'
import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormHelperText, IconButton, TextField, Typography, useMediaQuery } from '@mui/material';
import PhoneInput from 'react-phone-input-2';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { addMonths } from 'date-fns';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';;
import { deleteReservation } from '../redux/sagas/commonAPIs';
import { useRouter } from 'next/navigation';
import { ErrorResponse } from '../components/Navbar';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import { useTheme } from "@mui/material/styles";


export default function Reservation() {
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

    const [loadingTableData, setLoadingTableData] = useState(true);
    const [reservationName, setName] = useState<string>("");
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [numberOfPeople, setNumberOfPeople] = useState<string>("");
    const [reservationDateTime, setReservationDateTime] = useState<Date | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [reservations, setReservations] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [selectedReservationId, setSelectedReservationId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formError, setFormError] = React.useState<ErrorResponse>([]);
    const isMobile = useSelector((state: RootState) => state.mobile.isMobile);
    const router = useRouter();

    const onBack = () => {
        router.back();
    };
    useEffect(() => {
        document.body.style.visibility = 'visible'; // Ensures body is visible once styles are loaded
    }, []);

    useEffect(() =>{
        if(openConfirmDialog){
            setTimeout(() => {
                // Simulating fetched data
             
            }, 1000); // Simulate a delay of 3 seconds
            setLoadingTableData(true); // Stop loading after data is set
        }
      
    },[openConfirmDialog])

    useEffect(() => {
        const fetchReservation = async () => {
            const ssid = localStorage.getItem('ssid');

            try {
                const response = await fetch('/api/reservation', {
                    method: 'GET',
                    headers: {
                        'ssid': ssid || '',
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setReservations(data.data);
                } else {
                    console.error('Failed to fetch reservation:', data);
                }
            } catch (error) {
                console.error('Error fetching reservation:', error);
            }
        };


        setTimeout(() => {
            // Simulating fetched data
            fetchReservation();
            setLoadingTableData(false); // Stop loading after data is set
        }, 1000); // Simulate a delay of 3 seconds
    }, []);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = {
            reservationName,
            reservationDateTime,
            numberOfPeople,
            phoneNumber,
        };

        try {
            const tid = localStorage.getItem('tid'); // Retrieve tid from session storage
            const ssid = localStorage.getItem('ssid');
            const response = await fetch('/api/reservation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Session-Id': ssid || '', // Add session ID to request headers
                    Tid: tid || '', // Add tid to request headers
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setReservations((prev) => [
                    ...prev,
                    {
                        displayId: data.reservation.displayId,
                        reservationName: reservationName,
                        phoneNumber,
                        numberOfPeople,
                        reservationDateTime: reservationDateTime?.toString(), // for display
                    },
                ]);

                // Optionally reset form:
                setName("");
                setPhoneNumber("49");
                setNumberOfPeople("");
                setReservationDateTime(null);
            } else {
                if (data.statusCode === 400 && data.message == 'Validation failed.') {
                    setFormError(data.data)
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while submitting the reservation');
        }
    };

    const handleEdit = (reservationId: string) => {
        // Handle the edit action, open a modal or navigate to the edit page, etc.
        // Call the PUT API to update the reservation later
        if (reservations && reservations.length > 0) {
            const updateReservation = reservations.find((reserv) => reserv.id === reservationId);
            setName(updateReservation.reservationName);
            setPhoneNumber(updateReservation.phoneNumber);
            setNumberOfPeople(updateReservation.numberOfPeople);
            setReservationDateTime(new Date(updateReservation.reservationDateTime));
            setIsEditing(true);
            setEditingId(reservationId);

        }
    };

    const handleCancelEdit = () => {
        resetForm();
    };

    const resetForm = () => {
        setName("");
        setPhoneNumber("49");
        setNumberOfPeople("");
        setReservationDateTime(null);
        setIsEditing(false);
        setEditingId(null);
    };

    const handleUpdate = async () => {
        if (!editingId) return;
        try {

            const response = await fetch(`/api/reservation/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'reservation-id': editingId,
                },
                body: JSON.stringify({
                    reservationName,
                    phoneNumber,
                    numberOfPeople,
                    reservationDateTime,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                const updatedReservations = reservations.map((r) =>
                    r.id === editingId ? { ...r, reservationName, phoneNumber, numberOfPeople, reservationDateTime } : r
                );
                setReservations(updatedReservations);
                resetForm();
            } else {
                if (data.statusCode === 400 && data.message == 'Validation failed.') {
                    setFormError(data.data)
                }
            }
        } catch (error) {
            console.error('Error updating reservation:', error);
        }
    };


    const handleOpenConfirmDialog = (reservationId: string) => {
      
        setSelectedReservationId(reservationId);
        setOpenConfirmDialog(true);
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
        setSelectedReservationId(null);
    }

    const confirmDelete = async () => {
        if (!selectedReservationId) return;

        try {
            await deleteReservation(selectedReservationId);
            
            setReservations((prev) =>
                prev.filter((reservation) => reservation.id !== selectedReservationId)
            );
            handleCloseConfirmDialog();

            setTimeout(() => {
                // Simulating fetched data
                setLoadingTableData(false); // Stop loading after data is set
            }, 1000); // Simulate a delay of 3 seconds
        } catch (error) {
            console.error('Failed to delete reservation:', error);
        }
    };


    const getErrorMessage = (key: string) => {
        return formError?.find((err) => err.key === key)?.message || null;

    };

    const currentDate = new Date();
    const maxDate = addMonths(currentDate, 2); // Adding 2 months to current date
    return (
        <div className="h-[100vh] flex flex-col overflow-hidden mb-4">
            <div className="flex items-center justify-between mb-4">
                {/* Back Icon on the left */}
                <IconButton onClick={onBack} aria-label="back">
                    <ArrowBackIcon />
                </IconButton>

                {/* Centered Title */}
                <Typography
                    className="font-semibold flex-1 text-center"
                    sx={isSmall ? { fontSize: '1.2rem' } : { fontSize: '1.5rem' }}
                >
                    Reservation Detail
                </Typography>

                {/* Placeholder to keep spacing balanced */}
                <div className="w-10" /> {/* Same width as IconButton to balance layout */}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className='pl-4 pr-4'>
                    <TextField
                        label="Name"
                        variant="outlined"
                        fullWidth
                        value={reservationName}
                        onChange={(e) => setName(e.target.value)}
                        className="mb-4"
                        required
                        error={!!getErrorMessage('reservationName')}
                        helperText={getErrorMessage('reservationName')}
                    />

                    <div className="mb-4">
                        <PhoneInput
                            country={"de"} // Default country set to Germany
                            value={phoneNumber}
                            onChange={setPhoneNumber}
                            preferredCountries={["de"]} // Always show Germany at the top
                            enableSearch={true} // Allow searching for country codes
                            disableSearchIcon={false} // Show a search icon
                            autoFormat={true} // Auto-format the input for better UX
                            priority={{ de: 1 }} // Ensures 'DE' stays at the top of the list when opening
                            inputStyle={{
                                width: "100%",
                                height: "56px",
                                fontSize: "16px",
                                paddingLeft: "50px", // Adjust space for flag & country code
                            }}
                            containerStyle={{
                                width: "100%",
                            }}
                            buttonStyle={{
                                background: "transparent",
                            }}
                            dropdownStyle={{
                                maxHeight: "250px", // Limit height to prevent excessive scrolling
                                overflowY: "auto", // Enable scrolling
                                zIndex: 1000, // Ensure it's above other elements
                            }}
                            searchStyle={{
                                width: "90%",
                                margin: "10px auto",
                                padding: "8px",
                                fontSize: "14px",
                                borderRadius: "6px",
                            }}

                        />
                        {getErrorMessage('phoneNumber') && (
                            <FormHelperText error>
                                {getErrorMessage("phoneNumber")}
                            </FormHelperText>
                        )}
                    </div>

                    <TextField
                        label="Number of People"
                        type="number"
                        fullWidth
                        value={numberOfPeople}
                        onChange={(e) => setNumberOfPeople(e.target.value)}
                        error={!!getErrorMessage('numberOfPeople')}
                        helperText={getErrorMessage('numberOfPeople')}
                        inputProps={{ min: 1 }}
                    />

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            className='mt-2'
                            label="Reservation Date & Time"
                            value={reservationDateTime}
                            onChange={(newDate) => setReservationDateTime(newDate)}
                            minDate={currentDate}
                            maxDate={maxDate}
                            // slots={{ textField: TextField }}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    error: !!getErrorMessage('reservationDateTime'),
                                    helperText: getErrorMessage('reservationDateTime'),
                                },
                            }}
                        />
                    </LocalizationProvider>

                    {/* Submit Button */}
                    {!isEditing ? (
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ height: '46px', marginTop: '10px' }}
                        >
                            BOOK TABLE
                        </Button>
                    ) : (
                        <div className="flex gap-2 mt-3">
                            <Button
                                variant="contained"
                                color="success"
                                fullWidth
                                onClick={handleUpdate}
                            >
                                Update
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                fullWidth
                                onClick={handleCancelEdit}
                            >
                                Clear
                            </Button>
                        </div>
                    )}

                </div>
            </form>
            <Typography variant="h6" className="mt-6 mb-2 px-4">
                Your Reservation
            </Typography>


            <div className='mb-10 px-4'>
                {loadingTableData && (
                    <div className="flex items-center justify-center h-20 space-x-2 mb-4">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                    </div>
                )}
                {
                    !loadingTableData && reservations.length > 0 && (
                        isMobile ? (
                            <div className="space-y-4 max-h-[400px] overflow-auto scrollbar-hide ">
                                {reservations.map((res) => (
                                    <Paper
                                        key={res.id}
                                        className="p-4 rounded-xl shadow-md bg-gradient-to-br from-purple-600 via-pink-500 to-red-400 text-white transition-transform hover:scale-105 duration-300"
                                    >
                                        <Typography sx={{ fontSize: '1.2rem' }}><strong>DisplayId:</strong> {res.displayId}</Typography>
                                        <Typography sx={{ fontSize: '0.7rem' }}><strong>Name:</strong> {res.reservationName}</Typography>
                                        <Typography sx={{ fontSize: '0.7rem' }}><strong>Phone Number:</strong><strong>   +49 - {res.phoneNumber.slice(2)} </strong> </Typography>
                                        <Typography sx={{ fontSize: '0.7rem' }}><strong>Number of people:</strong> {res.numberOfPeople}</Typography>
                                        <Typography sx={{ fontSize: '0.7rem' }}>
                                            <strong>Date:</strong>{" "}
                                            {new Date(res.reservationDateTime).toLocaleString("en-US", {
                                                month: "short",
                                                day: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                            })}
                                        </Typography>
                                        <div className="flex justify-end gap-2 mt-3">
                                            <Button
                                                variant="contained"
                                                size="small"
                                                sx={{
                                                    backgroundColor: '#ffffff',
                                                    color: '#4a148c',
                                                    fontSize: '0.6rem',
                                                    padding: '2px 6px',
                                                    minWidth: 'auto',
                                                    '&:hover': { backgroundColor: '#f3e5f5' }
                                                }}
                                                onClick={() => handleEdit(res.id)}
                                            >
                                                Update
                                            </Button>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                sx={{
                                                    backgroundColor: '#f44336',
                                                    color: '#fff',
                                                    fontSize: '0.6rem',
                                                    padding: '2px 6px',
                                                    minWidth: 'auto',
                                                    '&:hover': { backgroundColor: '#e53935' }
                                                }}
                                                onClick={() => handleOpenConfirmDialog(res.id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </Paper>
                                ))}
                            </div>
                        ) : (
                            <div className="px-4 border-red-400">
                                <TableContainer
                                    component={Paper}
                                    className='scrollbar-hide'
                                    sx={{
                                        maxHeight: '400px',
                                        overflow: 'auto',
                                        boxShadow: 3,
                                        border: '1px solid #ddd', // Add border around the table container
                                        borderRadius: '8px', // Optional: rounded corners for table container
                                    }}
                                >
                                    <Table stickyHeader size="medium">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell><strong>Id</strong></TableCell>
                                                <TableCell><strong>Name</strong></TableCell>
                                                <TableCell><strong>Phone</strong></TableCell>
                                                <TableCell><strong>People</strong></TableCell>
                                                <TableCell><strong>Date & Time</strong></TableCell>
                                                <TableCell><strong>Actions</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {reservations.map((res, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{res.displayId}</TableCell>
                                                    <TableCell>{res.reservationName}</TableCell>
                                                    <TableCell>
                                                        {(() => {
                                                            const full = res.phoneNumber;
                                                            const code = '49';
                                                            const numberOnly = full?.startsWith(code) ? full.slice(code.length) : full;
                                                            return `+${code} - ${numberOnly}`;
                                                        })()}
                                                    </TableCell>
                                                    <TableCell>{res.numberOfPeople}</TableCell>
                                                    <TableCell>
                                                        {new Date(res.reservationDateTime).toLocaleString('en-US', {
                                                            month: 'short',
                                                            day: '2-digit',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: true,
                                                        })}
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton onClick={() => handleEdit(res.id)} color="primary">
                                                            <EditIcon />
                                                        </IconButton>
                                                        |
                                                        <IconButton onClick={() => handleOpenConfirmDialog(res.id)} color="error">
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>

                        )
                    )
                }
            </div>

            <Dialog
                open={openConfirmDialog}
                onClose={handleCloseConfirmDialog}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <DialogTitle id="confirm-dialog-title">Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                        Are you sure you want to delete this reservation?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmDelete} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
