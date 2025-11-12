// Mock product data - replace with actual API calls
const mockProducts = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 79.99,
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    image: 'https://via.placeholder.com/400x300?text=Wireless+Headphones',
    description: 'Premium wireless headphones with active noise cancellation and superior sound quality.',
    category: 'Electronics',
    specs: {
      'Battery Life': '30 hours',
      'Connectivity': 'Bluetooth 5.0',
      'Weight': '250g',
    },
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 199.99,
    rating: 4.7,
    reviewCount: 256,
    inStock: true,
    image: 'https://via.placeholder.com/400x300?text=Smart+Watch',
    description: 'Track your fitness and stay connected with this advanced smart watch.',
    category: 'Electronics',
    specs: {
      'Display': '1.4" AMOLED',
      'Battery': '7 days',
      'Water Resistance': '5ATM',
    },
  },
  {
    id: '3',
    name: 'Running Shoes',
    price: 89.99,
    rating: 4.3,
    reviewCount: 94,
    inStock: true,
    image: 'https://via.placeholder.com/400x300?text=Running+Shoes',
    description: 'Lightweight and comfortable running shoes for your daily workout.',
    category: 'Sports',
    specs: {
      'Weight': '200g per shoe',
      'Drop': '8mm',
      'Material': 'Mesh upper',
    },
  },
  {
    id: '4',
    name: 'Coffee Maker',
    price: 129.99,
    rating: 4.6,
    reviewCount: 187,
    inStock: false,
    image: 'https://via.placeholder.com/400x300?text=Coffee+Maker',
    description: 'Programmable coffee maker with thermal carafe for perfect coffee every time.',
    category: 'Home',
    specs: {
      'Capacity': '12 cups',
      'Features': 'Programmable, Auto-off',
      'Material': 'Stainless steel',
    },
  },
  {
    id: '5',
    name: 'Yoga Mat',
    price: 29.99,
    rating: 4.4,
    reviewCount: 76,
    inStock: true,
    image: 'https://via.placeholder.com/400x300?text=Yoga+Mat',
    description: 'Non-slip yoga mat with extra cushioning for comfortable practice.',
    category: 'Sports',
    specs: {
      'Thickness': '6mm',
      'Material': 'TPE',
      'Size': '183cm x 61cm',
    },
  },
  {
    id: '6',
    name: 'Laptop Backpack',
    price: 49.99,
    rating: 4.2,
    reviewCount: 103,
    inStock: true,
    image: 'https://via.placeholder.com/400x300?text=Laptop+Backpack',
    description: 'Durable laptop backpack with multiple compartments and USB charging port.',
    category: 'Accessories',
    specs: {
      'Laptop Size': 'Up to 17"',
      'Capacity': '30L',
      'Material': 'Water-resistant nylon',
    },
  },
];

export const productService = {
  async getAll(filters = {}) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    let filtered = [...mockProducts];

    // Apply filters
    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }
    if (filters.minPrice) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice);
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice);
    }
    if (filters.minRating) {
      filtered = filtered.filter((p) => p.rating >= filters.minRating);
    }
    if (filters.inStock) {
      filtered = filtered.filter((p) => p.inStock);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    if (filters.sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    return filtered;
  },

  async getById(id) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockProducts.find((p) => p.id === id) || null;
  },

  async getRelated(productId, limit = 4) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const product = mockProducts.find((p) => p.id === productId);
    if (!product) return [];

    return mockProducts
      .filter((p) => p.id !== productId && p.category === product.category)
      .slice(0, limit);
  },

  async getFeatured(limit = 6) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockProducts
      .filter((p) => p.inStock)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  },

  getCategories() {
    return [...new Set(mockProducts.map((p) => p.category))];
  },
};
