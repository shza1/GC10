import { api } from './api';

/**
 * Orders API Service
 * Handles all order-related API calls to the backend.
 *
 * Order shape after aligning with the SQL schema:
 * {
 *   id: number,
 *   userId: number,
 *   discountId?: number,
 *   subtotalCents: number,
 *   discountCents: number,
 *   taxRateBasis: number,
 *   taxCents: number,
 *   totalCents: number,
 *   status: 'placed' | 'fulfilled' | 'cancelled',
 *   placedAt: string,
 *   createdAt: string,
 *   updatedAt: string
 * }
 */
export const ordersApi = {
    /**
     * GET /api/orders - Fetch all orders
     * @returns {Promise<Array>} Array of orders
     */
    getOrders: async () => {
        return await api.get('/orders');
    },

    /**
     * GET /api/orders/:id - Fetch a single order by ID
     * @param {number} id - Order ID
     * @returns {Promise<Object>} Order object
     */
    getOrderById: async (id) => {
        return await api.get(`/orders/${id}`);
    },

    /**
     * GET /api/orders/user/:userId - Fetch orders for a specific user
     * @param {number} userId - User ID
     * @returns {Promise<Array>} Array of user's orders
     */
    getOrdersByUserId: async (userId) => {
        return await api.get(`/orders/user/${userId}`);
    },

    /**
     * POST /api/orders - Create a new order.
     * NOTE: in the new schema orders are usually created by checkout logic on the backend.
     * Only use this if your backend exposes POST /api/orders with manual payloads.
     * @param {Object} orderData - { userId, discountId?, subtotalCents, discountCents, taxRateBasis, taxCents, totalCents, status? }
     * @returns {Promise<Object>} Created order
     */
    createOrder: async (orderData) => {
        return await api.post('/orders', orderData);
    },

    /**
     * PATCH /api/orders/:id/status - Update order status
     * @param {number} id - Order ID
     * @param {string} status - New status ('placed' | 'fulfilled' | 'cancelled')
     * @returns {Promise<Object>} Updated order
     */
    updateOrderStatus: async (id, status) => {
        return await api.patch(
            `/orders/${id}/status?status=${encodeURIComponent(status)}`
        );
    },

    /**
     * DELETE /api/orders/:id - Delete an order
     * @param {number} id - Order ID
     * @returns {Promise<null>}
     */
    deleteOrder: async (id) => {
        return await api.delete(`/orders/${id}`);
    },
};
