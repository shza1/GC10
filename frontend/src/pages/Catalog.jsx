import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Slider,
  FormControlLabel,
  Checkbox,
  Button,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FilterList } from '@mui/icons-material';
import ProductGrid from '../components/ProductGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { productService } from '../services/productService';

export default function Catalog() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: 0,
    maxPrice: 500,
    minRating: 0,
    inStock: false,
    sortBy: 'featured',
    search: searchParams.get('search') || '',
  });

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getAll(filters);
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handlePriceChange = (event, newValue) => {
    setFilters((prev) => ({ ...prev, minPrice: newValue[0], maxPrice: newValue[1] }));
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      minPrice: 0,
      maxPrice: 500,
      minRating: 0,
      inStock: false,
      sortBy: 'featured',
      search: '',
    });
    setSearchParams({});
  };

  const categories = productService.getCategories();

  const FilterPanel = () => (
    <Box sx={{ p: 2, minWidth: { md: 250 } }}>
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          label="Category"
        >
          <MenuItem value="">All</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Typography gutterBottom>Price Range</Typography>
      <Slider
        value={[filters.minPrice, filters.maxPrice]}
        onChange={handlePriceChange}
        valueLabelDisplay="auto"
        min={0}
        max={500}
        sx={{ mb: 2 }}
      />
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        ${filters.minPrice} - ${filters.maxPrice}
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Min Rating</InputLabel>
        <Select
          value={filters.minRating}
          onChange={(e) => handleFilterChange('minRating', e.target.value)}
          label="Min Rating"
        >
          <MenuItem value={0}>All</MenuItem>
          <MenuItem value={3}>3+ Stars</MenuItem>
          <MenuItem value={4}>4+ Stars</MenuItem>
          <MenuItem value={4.5}>4.5+ Stars</MenuItem>
        </Select>
      </FormControl>

      <FormControlLabel
        control={
          <Checkbox
            checked={filters.inStock}
            onChange={(e) => handleFilterChange('inStock', e.target.checked)}
          />
        }
        label="In Stock Only"
        sx={{ mb: 2 }}
      />

      <Button fullWidth variant="outlined" onClick={resetFilters}>
        Reset Filters
      </Button>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Products</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              label="Sort By"
            >
              <MenuItem value="featured">Featured</MenuItem>
              <MenuItem value="price-asc">Price: Low to High</MenuItem>
              <MenuItem value="price-desc">Price: High to Low</MenuItem>
              <MenuItem value="rating">Highest Rated</MenuItem>
            </Select>
          </FormControl>
          {isMobile && (
            <IconButton onClick={() => setDrawerOpen(true)}>
              <FilterList />
            </IconButton>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {!isMobile && (
          <Grid item md={3}>
            <FilterPanel />
          </Grid>
        )}
        <Grid item xs={12} md={9}>
          {loading ? (
            <LoadingSpinner />
          ) : products.length === 0 ? (
            <EmptyState
              message="No products found"
              actionText="Reset Filters"
              actionPath="/catalog"
            />
          ) : (
            <ProductGrid products={products} />
          )}
        </Grid>
      </Grid>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <FilterPanel />
      </Drawer>
    </Container>
  );
}
