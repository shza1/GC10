import { Card, CardContent, Skeleton, Box } from '@mui/material';

export default function ProductCardSkeleton() {
  return (
    <Card sx={{ height: '100%' }}>
      <Skeleton variant="rectangular" height={200} />
      <CardContent>
        <Skeleton variant="text" height={32} width="80%" />
        <Skeleton variant="text" height={24} width="40%" />
        <Box sx={{ mt: 1 }}>
          <Skeleton variant="text" height={28} width="30%" />
        </Box>
      </CardContent>
    </Card>
  );
}
