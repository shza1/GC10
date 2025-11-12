import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  IconButton,
  Button,
  Divider,
  TextField,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useCartStore } from '../store/cartStore';
import Price from '../components/Price';
import QuantitySelector from '../components/QuantitySelector';
import EmptyState from '../components/EmptyState';

export default function Cart() {
  const navigate = useNavigate();
  const { items, remove, updateQty, getTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <EmptyState
          message="Your cart is empty"
          actionText="Continue Shopping"
          actionPath="/catalog"
        />
      </Container>
    );
  }

  const subtotal = getTotal();
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {items.map((item) => (
            <Paper key={item.id} sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.name}
                    sx={{ width: '100%', borderRadius: 1 }}
                  />
                </Grid>
                <Grid item xs={9}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6">{item.name}</Typography>
                    <IconButton onClick={() => remove(item.id)} color="error">
                      <Delete />
                    </IconButton>
                  </Box>
                  <Price value={item.price} />
                  <Box sx={{ mt: 2 }}>
                    <QuantitySelector
                      value={item.quantity}
                      onChange={(qty) => updateQty(item.id, qty)}
                    />
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Subtotal: <Price value={item.price * item.quantity} variant="body2" />
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 80 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Subtotal:</Typography>
              <Price value={subtotal} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Shipping:</Typography>
              <Price value={shipping} />
            </Box>
            {subtotal > 100 && (
              <Typography variant="caption" color="success.main" sx={{ mb: 2, display: 'block' }}>
                Free shipping on orders over $100!
              </Typography>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Total:</Typography>
              <Price value={total} variant="h6" />
            </Box>

            <TextField
              fullWidth
              size="small"
              placeholder="Promo code"
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </Button>
            
            <Button
              variant="text"
              fullWidth
              onClick={() => navigate('/catalog')}
              sx={{ mt: 1 }}
            >
              Continue Shopping
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
