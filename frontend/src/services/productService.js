// Mock product data - replace with actual API calls
const mockProducts = [
  {
    id: '1',
    name: 'Skiing on the Slopes',
    price: 29.99,
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    image: '/src/assets/skiing-sm.jpg',
    description: 'Woman skiing poster.',
    category: 'Posters',
    specs: {
        'Thickness': '6mm',
        'Material': 'Lamented Wood',
        'Size': '3ft x 1ft',
    },
  },
  {
    id: '2',
    name: 'Clean your Teeth',
    price: 29.99,
    rating: 4.7,
    reviewCount: 256,
    inStock: true,
    image: '/src/assets/clean-teeth-sm.jpg',
    description: 'Teeth cleaning poster.',
    category: 'Electronics',
    specs: {
        'Thickness': '6mm',
        'Material': 'Lamented Wood',
        'Size': '3ft x 1ft',
    },
  },
  {
    id: '3',
    name: 'Poster Collage',
    price: 29.99,
    rating: 4.3,
    reviewCount: 94,
    inStock: true,
    image: '/src/assets/collage-sm.jpg',
    description: 'Poster collage.',
    category: 'Posters',
    specs: {
        'Thickness': '6mm',
        'Material': 'Lamented Wood',
        'Size': '3ft x 1ft',
    },
  },
  {
    id: '4',
    name: 'Missing Person',
    price: 29.99,
    rating: 4.6,
    reviewCount: 187,
    inStock: false,
    image: '/src/assets/missing-sm.jpg',
    description: 'Missing person poster.',
    category: 'Posters',
    specs: {
        'Thickness': '6mm',
        'Material': 'Lamented Wood',
        'Size': '3ft x 1ft',
    },
  },
  {
    id: '5',
    name: 'Uncle Sam',
    price: 29.99,
    rating: 4.4,
    reviewCount: 76,
    inStock: true,
    image: '/src/assets/uncle-sam-sm.jpg',
    description: 'Uncle Sam Poster.',
    category: 'Posters',
    specs: {
      'Thickness': '6mm',
      'Material': 'Lamented Wood',
      'Size': '3ft x 1ft',
    },
  },
  {
    id: '6',
    name: 'Camera Head',
    price: 29.99,
    rating: 4.5,
    reviewCount: 100,
    inStock: true,
    image: '/src/assets/camera-head-sm.jpg',
    description: 'Camera Head Guy Poster.',
    category: 'Posters',
    specs: {
        'Thickness': '6mm',
        'Material': 'Lamented Wood',
        'Size': '3ft x 1ft',
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
