import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function MaterialUIPickers({ setSelectedDate, selectedDate }) {
  const handleDateChange = (date) => {
    setSelectedDate(date ? date.toISOString() : null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid
        container
        justifyContent="space-around"
        style={{ width: '97%', paddingLeft: '10px', paddingBottom: '15px', paddingTop: "10px" }}
      >
        <DatePicker
          label="Date Paid"
          value={selectedDate}
          onChange={handleDateChange}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              margin="normal"
              variant="outlined"
              id="date-picker-inline"
            />
          )}
        />
      </Grid>
    </LocalizationProvider>
  );
}
