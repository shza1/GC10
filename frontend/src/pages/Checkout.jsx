import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Grid,
  Paper,
} from '@mui/material';
import { useCartStore } from '../store/cartStore';
import { useUserStore } from '../store/userStore';
import { orderService } from '../services/orderService';
import Price from '../components/Price';

const steps = ['Shipping', 'Payment', 'Review'];

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotal, clear } = useCartStore();
  const { user } = useUserStore();
  const [activeStep, setActiveStep] = useState(0);
  const [orderData, setOrderData] = useState({
    shipping: {
      fullName: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      country: 'USA',
    },
    payment: {
      cardNumber: '',
      cardName: '',
      expiry: '',
      cvv: '',
    },
  });

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmitOrder = async () => {
    try {
      const order = await orderService.createOrder({
        items,
        total: getTotal() + 9.99,
        ...orderData,
      });
      clear();
      navigate('/order-confirmation', { state: { orderId: order.id } });
    } catch (error) {
      console.error('Order failed:', error);
    }
  };

  const updateShipping = (field, value) => {
    setOrderData((prev) => ({
      ...prev,
      shipping: { ...prev.shipping, [field]: value },
    }));
  };

  const updatePayment = (field, value) => {
    setOrderData((prev) => ({
      ...prev,
      payment: { ...prev.payment, [field]: value },
    }));
  };

  const ShippingStep = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Full Name"
          value={orderData.shipping.fullName}
          onChange={(e) => updateShipping('fullName', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Address"
          value={orderData.shipping.address}
          onChange={(e) => updateShipping('address', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="City"
          value={orderData.shipping.city}
          onChange={(e) => updateShipping('city', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="State"
          value={orderData.shipping.state}
          onChange={(e) => updateShipping('state', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12} sm={3}>
        <TextField
          fullWidth
          label="ZIP Code"
          value={orderData.shipping.zip}
          onChange={(e) => updateShipping('zip', e.target.value)}
          required
        />
      </Grid>
    </Grid>
  );

  const PaymentStep = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Card Number"
          value={orderData.payment.cardNumber}
          onChange={(e) => updatePayment('cardNumber', e.target.value)}
          placeholder="1234 5678 9012 3456"
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Cardholder Name"
          value={orderData.payment.cardName}
          onChange={(e) => updatePayment('cardName', e.target.value)}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Expiry Date"
          value={orderData.payment.expiry}
          onChange={(e) => updatePayment('expiry', e.target.value)}
          placeholder="MM/YY"
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="CVV"
          value={orderData.payment.cvv}
          onChange={(e) => updatePayment('cvv', e.target.value)}
          placeholder="123"
          required
        />
      </Grid>
    </Grid>
  );

  const ReviewStep = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Shipping Address
      </Typography>
      <Typography>{orderData.shipping.fullName}</Typography>
      <Typography>{orderData.shipping.address}</Typography>
      <Typography>
        {orderData.shipping.city}, {orderData.shipping.state} {orderData.shipping.zip}
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Payment Method
      </Typography>
      <Typography>Card ending in {orderData.payment.cardNumber.slice(-4)}</Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Order Items
      </Typography>
      {items.map((item) => (
        <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>
            {item.name} x {item.quantity}
          </Typography>
          <Price value={item.price * item.quantity} />
        </Box>
      ))}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, fontWeight: 'bold' }}>
        <Typography variant="h6">Total:</Typography>
        <Price value={getTotal() + 9.99} variant="h6" />
      </Box>
    </Box>
  );

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Please sign in to continue
        </Typography>
        <Button variant="contained" onClick={() => navigate('/signin')}>
          Sign In
        </Button>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Button variant="contained" onClick={() => navigate('/catalog')}>
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ my: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ p: 3, mb: 3 }}>
        {activeStep === 0 && <ShippingStep />}
        {activeStep === 1 && <PaymentStep />}
        {activeStep === 2 && <ReviewStep />}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button variant="contained" onClick={handleSubmitOrder}>
            Place Order
          </Button>
        ) : (
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        )}
      </Box>
    </Container>
  );
}
