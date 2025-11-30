import { api } from './api';

/**
 * Products API Service
 * Handles all product-related API calls to the backend.
 *
 * Product shape after aligning with the SQL schema:
 * {
 *   id: number,
 *   title: string,
 *   description?: string,
 *   imageUrl?: string,
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
     * @returns {Promise<Array>} Array of products
     */
    getProducts: async () => {
        return await api.get('/products');
    },

    /**
     * GET /api/products/:id - Fetch a single product by ID
     * @param {number} id - Product ID
     * @returns {Promise<Object>} Product object
     */
    getProductById: async (id) => {
        return await api.get(`/products/${id}`);
    },

    /**
     * POST /api/products - Create a new product
     * @param {Object} productData - { title, description?, imageUrl?, basePriceCents, qtyAvailable, isActive? }
     * @returns {Promise<Object>} Created product
     */
    createProduct: async (productData) => {
        return await api.post('/products', productData);
    },

    /**
     * PUT /api/products/:id - Update an existing product
     * @param {number} id - Product ID
     * @param {Object} productData - Updated product data
     * @returns {Promise<Object>} Updated product
     */
    updateProduct: async (id, productData) => {
        return await api.put(`/products/${id}`, productData);
    },

    /**
     * DELETE /api/products/:id - Delete a product
     * @param {number} id - Product ID
     * @returns {Promise<null>}
     */
    deleteProduct: async (id) => {
        return await api.delete(`/products/${id}`);
    },

    /**
     * GET /api/products/search?name=... - Search products by title/name
     * @param {string} name - Search query
     * @returns {Promise<Array>} Array of matching products
     */
    searchProducts: async (name) => {
        return await api.get(`/products/search?name=${encodeURIComponent(name)}`);
    },
};
