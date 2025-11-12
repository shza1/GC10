import { Typography } from '@mui/material';

export default function Price({ value, variant = 'body1', color = 'primary', ...props }) {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value || 0);

  return (
    <Typography variant={variant} color={color} fontWeight={600} {...props}>
      {formatted}
    </Typography>
  );
}
