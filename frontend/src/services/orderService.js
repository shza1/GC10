// Mock order service - replace with actual API calls
const mockOrders = [
  {
    id: '1001',
    date: '2025-01-05',
    status: 'Delivered',
    total: 259.97,
    items: [
      { id: '1', name: 'Wireless Headphones', quantity: 2, price: 79.99 },
      { id: '2', name: 'Smart Watch', quantity: 1, price: 99.99 },
    ],
  },
  {
    id: '1002',
    date: '2025-01-08',
    status: 'In Transit',
    total: 89.99,
    items: [
      { id: '3', name: 'Running Shoes', quantity: 1, price: 89.99 },
    ],
  },
];

export const orderService = {
  async getOrders(userId) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockOrders;
  },

  async getOrderById(orderId) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockOrders.find((o) => o.id === orderId) || null;
  },

  async createOrder(orderData) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newOrder = {
      id: (1000 + mockOrders.length + 1).toString(),
      date: new Date().toISOString().split('T')[0],
      status: 'Processing',
      ...orderData,
    };
    mockOrders.push(newOrder);
    return newOrder;
  },
};
