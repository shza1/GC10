import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Order Confirmed!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Thank you for your purchase. Your order has been successfully placed.
        </Typography>
        {orderId && (
          <Typography variant="body2" color="text.secondary" paragraph>
            Order ID: <strong>{orderId}</strong>
          </Typography>
        )}
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="contained" onClick={() => navigate('/orders')}>
            View Orders
          </Button>
          <Button variant="outlined" onClick={() => navigate('/')}>
            Continue Shopping
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
