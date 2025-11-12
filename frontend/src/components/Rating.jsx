import { Box, Typography } from '@mui/material';
import { Star, StarHalf, StarBorder } from '@mui/icons-material';

export default function Rating({ value = 0, count, size = 'medium' }) {
  const stars = [];
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={`full-${i}`} sx={{ color: 'warning.main' }} fontSize={size} />);
  }

  if (hasHalfStar) {
    stars.push(<StarHalf key="half" sx={{ color: 'warning.main' }} fontSize={size} />);
  }

  const remainingStars = 5 - stars.length;
  for (let i = 0; i < remainingStars; i++) {
    stars.push(<StarBorder key={`empty-${i}`} sx={{ color: 'warning.main' }} fontSize={size} />);
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {stars}
      {count !== undefined && (
        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
          ({count})
        </Typography>
      )}
    </Box>
  );
}
