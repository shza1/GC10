import { api } from './api';

/**
 * Orders API Service
 * Handles all order-related API calls to the backend.
 *
 * Backend Order JSON shape (based on schema):
 * {
 *   id: number,
 *   userId: number,
 *   discountId?: number | null,
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
    getOrders: async () => api.get('/orders'),

    getOrderById: async (id) => api.get(`/orders/${id}`),

    getOrdersByUserId: async (userId) => api.get(`/orders/user/${userId}`),

    createOrder: async (order) => api.post('/orders', order),

    // PATCH /api/orders/:id/status?status=fulfilled
    updateOrderStatus: async (id, status) =>
        api.patch(`/orders/${id}/status?status=${encodeURIComponent(status)}`),

    deleteOrder: async (id) => api.delete(`/orders/${id}`),
};
