import { api } from './api';

/**
 * Products API Service
 * Handles all product-related API calls to the backend.
 *
 * Backend Product JSON shape (based on schema/entity):
 * {
 *   id: number,
 *   title: string,
 *   description: string | null,
 *   imageUrl: string | null,
 *   basePriceCents: number,
 *   qtyAvailable: number,
 *   isActive: boolean,
 *   createdAt: string,
 *   updatedAt: string
 * }
 */
export const productsApi = {
    /**
     * GET /api/products - Fetch all products
     * @returns {Promise<Array>}
     */
    getProducts: async () => {
        return await api.get('/products');
    },

    /**
     * GET /api/products/:id - Fetch a single product
     */
    getProductById: async (id) => {
        return await api.get(`/products/${id}`);
    },

    /**
     * POST /api/products - Create a new product
     */
    createProduct: async (product) => {
        return await api.post('/products', product);
    },

    /**
     * PUT /api/products/:id - Update an existing product
     */
    updateProduct: async (id, product) => {
        return await api.put(`/products/${id}`, product);
    },

    /**
     * DELETE /api/products/:id - Delete a product
     */
    deleteProduct: async (id) => {
        return await api.delete(`/products/${id}`);
    },

    /**
     * GET /api/products/search?name=... - Search products by name/title
     */
    searchProducts: async (name) => {
        return await api.get(`/products/search?name=${encodeURIComponent(name)}`);
    },
};

