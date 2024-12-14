/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MuiDialogTitle from '@mui/material/DialogTitle';
import MuiDialogContent from '@mui/material/DialogContent';
import MuiDialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { TextField, Grid } from '@mui/material';
import DatePicker from './DatePicker';
import Autocomplete from '@mui/material/Autocomplete';
import { useNavigate } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { updateInvoice } from '../../actions/invoiceActions';

const Modal = ({ setOpen, open, invoice }) => {
  const dispatch = useDispatch();
  const history = useNavigate();

  // Create a state to add new payment record
  const [payment, setPayment] = useState({
    amountPaid: 0,
    datePaid: new Date(),
    paymentMethod: '',
    note: '',
    paidBy: ''
  });

  // Material UI datepicker
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  // Create a state to handle the payment records
  const [paymentRecords, setPaymentRecords] = useState([]);
  const [method, setMethod] = useState({});
  const [totalAmountReceived, setTotalAmountReceived] = useState(0);
  const [updatedInvoice, setUpdatedInvoice] = useState({});

  useEffect(() => {
    setPayment({ ...payment, paymentMethod: method?.title });
  }, [method]);

  useEffect(() => {
    setPayment({ ...payment, datePaid: selectedDate });
  }, [selectedDate]);

  useEffect(() => {
    if (invoice) {
      setPayment({
        ...payment,
        amountPaid: Number(invoice.total) - Number(invoice.totalAmountReceived),
        paidBy: invoice?.client?.name
      });
    }
  }, [invoice]);

  useEffect(() => {
    if (invoice?.paymentRecords) {
      setPaymentRecords(invoice?.paymentRecords);
    }
  }, [invoice]);

  // Get the total amount paid
  useEffect(() => {
    let totalReceived = 0;
    for (var i = 0; i < invoice?.paymentRecords?.length; i++) {
      totalReceived += Number(invoice?.paymentRecords[i]?.amountPaid);
      setTotalAmountReceived(totalReceived);
    }
  }, [invoice, payment]);

  useEffect(() => {
    setUpdatedInvoice({
      ...invoice,
      status:
        Number(totalAmountReceived) + Number(payment.amountPaid) >= invoice?.total
          ? 'Paid'
          : 'Partial',
      paymentRecords: [...paymentRecords, payment],
      totalAmountReceived: Number(totalAmountReceived) + Number(payment.amountPaid)
    });
  }, [payment, paymentRecords, totalAmountReceived, invoice]);

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    dispatch(updateInvoice(invoice._id, history, updatedInvoice)).then(() => {
      handleClose();
      
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const paymentMethods = [
    { title: 'Bank Transfer' },
    { title: 'Cash' },
    { title: 'Credit Card' },
    { title: 'PayPal' },
    { title: 'Others' }
  ];

  return (
    <div>
      <form>
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} fullWidth>
          <MuiDialogTitle
            sx={{
              paddingLeft: '20px',
              backgroundColor: '#1976D2',
              color: 'white',
              position: 'relative',
              fontWeight: 'bold',
              fontSize: '1.2rem',
            }}
          >
            Record Payment
            <IconButton
              aria-label="close"
              sx={{
                position: 'absolute',
                right: 1,
                top: 1,
                color: 'white',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          </MuiDialogTitle>
          <MuiDialogContent sx={{ padding: '16px 24px' }}>
            <DatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

            <TextField
              type="number"
              name="amountPaid"
              label="Amount Paid"
              fullWidth
              sx={{ marginTop: 5, marginBottom: 2 }}
              variant="outlined"
              onChange={(e) => setPayment({ ...payment, amountPaid: e.target.value })}
              value={payment.amountPaid}
            />

            <Grid item fullWidth>
              <Autocomplete
                id="combo-box-demo"
                options={paymentMethods}
                getOptionLabel={(option) => option.title || ''}
                sx={{ width: '100%', marginBottom: 2 }}
                renderInput={(params) => <TextField {...params} label="Payment Method" variant="outlined" />}
                value={method}
                onChange={(event, value) => setMethod(value)}
              />
            </Grid>

            <TextField
              type="text"
              name="note"
              label="Note"
              fullWidth
              sx={{ marginBottom: 2 }}
              variant="outlined"
              onChange={(e) => setPayment({ ...payment, note: e.target.value })}
              value={payment.note}
            />
          </MuiDialogContent>
          <MuiDialogActions sx={{ padding: '8px 24px', justifyContent: 'flex-end' }}>
            <Button
              autoFocus
              onClick={handleSubmitPayment}
              variant="contained"
              sx={{
                backgroundColor: '#1976D2',
                '&:hover': { backgroundColor: '#1565C0' },
                padding: '6px 20px',
              }}
            >
              Save Record
            </Button>
          </MuiDialogActions>
        </Dialog>
      </form>
    </div>
  );
};

export default Modal;
