import { Box, Container, Typography, Link, Grid } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[900],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              ShopHub
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your one-stop shop for everything you need.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Link href="/catalog" display="block" color="text.secondary" sx={{ mb: 1 }}>
              Shop
            </Link>
            <Link href="/about" display="block" color="text.secondary" sx={{ mb: 1 }}>
              About Us
            </Link>
            <Link href="/contact" display="block" color="text.secondary">
              Contact
            </Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Support
            </Typography>
            <Link href="/faq" display="block" color="text.secondary" sx={{ mb: 1 }}>
              FAQ
            </Link>
            <Link href="/shipping" display="block" color="text.secondary" sx={{ mb: 1 }}>
              Shipping Info
            </Link>
            <Link href="/returns" display="block" color="text.secondary">
              Returns
            </Link>
          </Grid>
        </Grid>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
          © {new Date().getFullYear()} Inkhouse. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
