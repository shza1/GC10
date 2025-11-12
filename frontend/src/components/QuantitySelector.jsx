import { Box, IconButton, TextField } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

export default function QuantitySelector({ value, onChange, min = 1, max = 99 }) {
  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleChange = (e) => {
    const num = parseInt(e.target.value, 10);
    if (!isNaN(num) && num >= min && num <= max) {
      onChange(num);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <IconButton onClick={handleDecrement} disabled={value <= min} size="small">
        <Remove />
      </IconButton>
      <TextField
        value={value}
        onChange={handleChange}
        size="small"
        inputProps={{
          style: { textAlign: 'center', width: '50px' },
          min,
          max,
        }}
        type="number"
      />
      <IconButton onClick={handleIncrement} disabled={value >= max} size="small">
        <Add />
      </IconButton>
    </Box>
  );
}
