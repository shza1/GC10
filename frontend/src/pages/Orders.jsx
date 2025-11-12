import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Chip,
  Divider,
} from '@mui/material';
import { useUserStore } from '../store/userStore';
import { orderService } from '../services/orderService';
import Price from '../components/Price';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

export default function Orders() {
  const { user } = useUserStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await orderService.getOrders(user?.id);
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'success';
      case 'In Transit':
        return 'info';
      case 'Processing':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) return <LoadingSpinner />;

  if (orders.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Orders
        </Typography>
        <EmptyState
          message="No orders yet"
          actionText="Start Shopping"
          actionPath="/catalog"
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>

      {orders.map((order) => (
        <Paper key={order.id} sx={{ p: 3, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="h6">Order #{order.id}</Typography>
              <Typography variant="body2" color="text.secondary">
                Placed on {order.date}
              </Typography>
            </Box>
            <Chip label={order.status} color={getStatusColor(order.status)} />
          </Box>

          <Divider sx={{ my: 2 }} />

          {order.items.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>
                {item.name} x {item.quantity}
              </Typography>
              <Price value={item.price * item.quantity} />
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Total:</Typography>
            <Price value={order.total} variant="h6" />
          </Box>
        </Paper>
      ))}
    </Container>
  );
}
