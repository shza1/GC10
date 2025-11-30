import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  InputBase,
  Menu,
  MenuItem,
  Button,
  useTheme,
  alpha,
} from '@mui/material';
import {
  ShoppingCart,
  Search as SearchIcon,
  AccountCircle,
  Brightness4,
  Brightness7,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useUserStore } from '../store/userStore';

export default function Header({ onThemeToggle, mode }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const { items } = useCartStore();
  const { user, signOut } = useUserStore();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleSignOut = () => {
    signOut();
    handleMenuClose();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchValue)}`);
    }
  };

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ cursor: 'pointer', fontWeight: 700 }}
          onClick={() => navigate('/')}
        >
          Inkhouse
        </Typography>

        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            position: 'relative',
            borderRadius: 1,
            backgroundColor: alpha(theme.palette.common.white, 0.15),
            '&:hover': {
              backgroundColor: alpha(theme.palette.common.white, 0.25),
            },
            marginLeft: 0,
            width: '100%',
            maxWidth: 600,
            display: { xs: 'none', sm: 'flex' },
          }}
        >
          <Box sx={{ padding: '0 16px', height: '100%', display: 'flex', alignItems: 'center' }}>
            <SearchIcon />
          </Box>
          <InputBase
            placeholder="Search products…"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{ color: 'inherit', width: '100%', '& input': { padding: '8px 8px 8px 0' } }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton color="inherit" onClick={onThemeToggle}>
          {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>

        <IconButton color="inherit" onClick={() => navigate('/cart')}>
          <Badge badgeContent={cartItemCount} color="secondary">
            <ShoppingCart />
          </Badge>
        </IconButton>

        {user ? (
          <>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={() => { navigate('/account'); handleMenuClose(); }}>
                My Account
              </MenuItem>
              <MenuItem onClick={() => { navigate('/orders'); handleMenuClose(); }}>
                Orders
              </MenuItem>
              <MenuItem onClick={() => { navigate('/admin/users'); handleMenuClose(); }}>
                Admin: Users
              </MenuItem>
              <MenuItem onClick={() => { navigate('/admin/products'); handleMenuClose(); }}>
                Admin: Products
              </MenuItem>
              <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
            </Menu>
          </>
        ) : (
          <Button color="inherit" onClick={() => navigate('/signin')}>
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
