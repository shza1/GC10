import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActionArea,
  Box,
  Chip,
} from '@mui/material';
import { Star } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Price from './Price';

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea onClick={() => navigate(`/product/${product.id}`)}>
        <CardMedia
          component="img"
          height="200"
          image={product.image || 'https://via.placeholder.com/300x200?text=Product'}
          alt={product.name}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {product.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Star sx={{ color: 'warning.main', fontSize: 18, mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              {product.rating?.toFixed(1) || '0.0'} ({product.reviewCount || 0})
            </Typography>
          </Box>
          <Price value={product.price} variant="h6" />
          {!product.inStock && (
            <Chip label="Out of Stock" size="small" color="error" sx={{ mt: 1 }} />
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
