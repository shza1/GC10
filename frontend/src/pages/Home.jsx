import { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import { productService } from '../services/productService';

export default function Home() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const products = await productService.getFeatured(6);
      setFeaturedProducts(products);
    } finally {
      setLoading(false);
    }
  };

  const categories = productService.getCategories();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box
        sx={{
          py: 8,
          px: 4,
          mb: 6,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" gutterBottom>
          Welcome to Inkhouse
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Discover amazing products at great prices
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            bgcolor: 'white',
            color: 'primary.main',
            '&:hover': { bgcolor: 'grey.100' },
          }}
          onClick={() => navigate('/catalog')}
        >
          Shop Now
        </Button>
      </Box>

      {/* Categories Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Shop by Category
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {categories.map((category) => (
            <Grid item xs={6} sm={4} md={3} key={category}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => navigate(`/catalog?category=${category}`)}
                sx={{ py: 2 }}
              >
                {category}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Featured Products */}
      <Box>
        <Typography variant="h4" gutterBottom>
          Featured Products
        </Typography>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <Box sx={{ mt: 3 }}>
            <ProductGrid products={featuredProducts} />
          </Box>
        )}
      </Box>
    </Container>
  );
}
