import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Alert,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Stack,
    Switch,
    FormControlLabel,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { productsApi } from '../services/productsApi';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: '',
        priceDollars: '',
        qtyAvailable: '',
        isActive: true,
    });
    const [submitting, setSubmitting] = useState(false);

    // Load products on mount
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await productsApi.getProducts();
            setProducts(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error('Error fetching products:', e);
            setError(e.message || 'Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEditingProduct(null);
        setFormData({
            title: '',
            description: '',
            imageUrl: '',
            priceDollars: '',
            qtyAvailable: '',
            isActive: true,
        });
    };

    // Open dialog to create a new product
    const handleCreate = () => {
        resetForm();
        setOpenDialog(true);
    };

    // Open dialog to edit an existing product
    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            title: product.title ?? '',
            description: product.description ?? '',
            imageUrl: product.imageUrl ?? '',
            priceDollars:
                product.basePriceCents != null
                    ? (product.basePriceCents / 100).toFixed(2)
                    : '',
            qtyAvailable:
                product.qtyAvailable != null ? String(product.qtyAvailable) : '',
            isActive: product.isActive ?? true,
        });
        setOpenDialog(true);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            return 'Title is required';
        }
        if (!formData.priceDollars || isNaN(Number(formData.priceDollars))) {
            return 'Valid price is required';
        }
        if (!formData.qtyAvailable || isNaN(Number(formData.qtyAvailable))) {
            return 'Valid quantity is required';
        }
        return null;
    };

    // Create / update product
    const handleSubmit = async () => {
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const payload = {
                // field names here should match your updated Product entity
                title: formData.title.trim(),
                description: formData.description.trim(),
                imageUrl: formData.imageUrl.trim() || null,
                basePriceCents: Math.round(parseFloat(formData.priceDollars) * 100),
                qtyAvailable: parseInt(formData.qtyAvailable, 10),
                isActive: !!formData.isActive,
            };

            if (editingProduct?.id != null) {
                await productsApi.updateProduct(editingProduct.id, payload);
            } else {
                await productsApi.createProduct(payload);
            }

            setOpenDialog(false);
            resetForm();
            await fetchProducts();
        } catch (e) {
            console.error('Error saving product:', e);
            setError(e.message || 'Failed to save product');
        } finally {
            setSubmitting(false);
        }
    };

    // Delete product
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }
        setError(null);
        try {
            await productsApi.deleteProduct(id);
            await fetchProducts();
        } catch (e) {
            console.error('Error deleting product:', e);
            setError(e.message || 'Failed to delete product');
        }
    };

    return (
        <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1400, mx: 'auto' }}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 3 }}
            >
                <Typography variant="h4" component="h1">
                    Admin – Products
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleCreate}
                >
                    Add Product
                </Button>
            </Stack>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Paper elevation={1}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Image URL</TableCell>
                                    <TableCell align="right">Price</TableCell>
                                    <TableCell align="right">Qty Available</TableCell>
                                    <TableCell>Active</TableCell>
                                    <TableCell>Created</TableCell>
                                    <TableCell>Updated</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product.id} hover>
                                        <TableCell>{product.id}</TableCell>
                                        <TableCell>{product.title}</TableCell>
                                        <TableCell
                                            sx={{
                                                maxWidth: 260,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {product.description}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                maxWidth: 200,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {product.imageUrl}
                                        </TableCell>
                                        <TableCell align="right">
                                            {product.basePriceCents != null
                                                ? `$${(product.basePriceCents / 100).toFixed(2)}`
                                                : '—'}
                                        </TableCell>
                                        <TableCell align="right">
                                            {product.qtyAvailable}
                                        </TableCell>
                                        <TableCell>{product.isActive ? 'Yes' : 'No'}</TableCell>
                                        <TableCell>
                                            {product.createdAt
                                                ? new Date(product.createdAt).toLocaleString()
                                                : '—'}
                                        </TableCell>
                                        <TableCell>
                                            {product.updatedAt
                                                ? new Date(product.updatedAt).toLocaleString()
                                                : '—'}
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => handleEdit(product)}
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDelete(product.id)}
                                            >
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {products.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                                            No products found. Click "Add Product" to create one.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            {/* Create/Edit Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {editingProduct ? 'Edit Product' : 'Add Product'}
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                            fullWidth
                        />
                        <TextField
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            multiline
                            minRows={3}
                            fullWidth
                        />
                        <TextField
                            label="Image URL"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleInputChange}
                            fullWidth
                        />
                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="Price (USD)"
                                name="priceDollars"
                                value={formData.priceDollars}
                                onChange={handleInputChange}
                                required
                                fullWidth
                            />
                            <TextField
                                label="Quantity Available"
                                name="qtyAvailable"
                                value={formData.qtyAvailable}
                                onChange={handleInputChange}
                                required
                                fullWidth
                            />
                        </Stack>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.isActive}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            isActive: e.target.checked,
                                        }))
                                    }
                                />
                            }
                            label="Active"
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={submitting}
                    >
                        {submitting
                            ? 'Saving...'
                            : editingProduct
                                ? 'Update'
                                : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
