import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import { ShoppingCart, ArrowBack } from '@mui/icons-material';
import Price from '../components/Price';
import Rating from '../components/Rating';
import QuantitySelector from '../components/QuantitySelector';
import ProductGrid from '../components/ProductGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import { productService } from '../services/productService';
import { useCartStore } from '../store/cartStore';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { add } = useCartStore();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await productService.getById(id);
      setProduct(data);
      if (data) {
        const related = await productService.getRelated(id);
        setRelatedProducts(related);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      add(product, quantity);
      setSnackbar({ open: true, message: 'Added to cart!' });
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!product) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5">Product not found</Typography>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/catalog')} sx={{ mt: 2 }}>
          Back to Catalog
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={product.image}
            alt={product.name}
            sx={{
              width: '100%',
              height: 'auto',
              borderRadius: 2,
              objectFit: 'cover',
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Rating value={product.rating} count={product.reviewCount} />
          </Box>

          <Price value={product.price} variant="h4" sx={{ mb: 2 }} />

          <Typography variant="body1" color="text.secondary" paragraph>
            {product.description}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Specifications
            </Typography>
            {Object.entries(product.specs || {}).map(([key, value]) => (
              <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {key}:
                </Typography>
                <Typography variant="body2">{value}</Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />

          {product.inStock ? (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <QuantitySelector value={quantity} onChange={setQuantity} />
              <Button
                variant="contained"
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                fullWidth
                size="large"
              >
                Add to Cart
              </Button>
            </Box>
          ) : (
            <Button variant="outlined" disabled fullWidth size="large">
              Out of Stock
            </Button>
          )}
        </Grid>
      </Grid>

      {relatedProducts.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom>
            Related Products
          </Typography>
          <ProductGrid products={relatedProducts} />
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity="success">{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
}
