// src/services/productService.js
// Bridges between the backend Product schema and the UI components
import { productsApi } from './productsApi';

// Maps backend Product → shape used by ProductCard / ProductDetail / cart
function mapProduct(p) {
    if (!p) return null;

    // Backend fields: id, title, description, imageUrl, basePriceCents, qtyAvailable, isActive, createdAt, updatedAt
    const price =
        typeof p.basePriceCents === 'number'
            ? p.basePriceCents / 100
            : Number(p.basePriceCents || 0) / 100;

    const stockQty =
        typeof p.qtyAvailable === 'number'
            ? p.qtyAvailable
            : Number(p.qtyAvailable || 0);

    return {
        // Core identity
        id: p.id,
        name: p.title,
        description: p.description,
        image: p.imageUrl,

        // Price in dollars for UI
        price,
        basePriceCents: p.basePriceCents,

        // Inventory / status
        stockQuantity: stockQty,
        inStock: stockQty > 0 && p.isActive !== false,
        isActive: p.isActive !== false,

        // Extra stuff used by UI (safe defaults for now)
        rating: p.rating ?? 0,
        reviewCount: p.reviewCount ?? 0,
        category: p.category || 'Posters',
        specs: p.specs || {},

        // Timestamps
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
    };
}

// This list backs Catalog filter dropdown
const CATEGORY_LIST = ['Posters', 'Photography', 'Abstract', 'Typography'];

function applyFilters(items, filters = {}) {
    let result = [...items];

    const {
        category,
        minPrice,
        maxPrice,
        minRating,
        inStock,
        sortBy,
        search,
    } = filters || {};

    if (search) {
        const term = search.toLowerCase();
        result = result.filter((p) => p.name.toLowerCase().includes(term));
    }

    if (category) {
        result = result.filter((p) => p.category === category);
    }

    if (typeof minPrice === 'number') {
        result = result.filter((p) => p.price >= minPrice);
    }

    if (typeof maxPrice === 'number') {
        result = result.filter((p) => p.price <= maxPrice);
    }

    if (minRating) {
        result = result.filter((p) => (p.rating ?? 0) >= minRating);
    }

    if (inStock) {
        result = result.filter((p) => p.inStock);
    }

    switch (sortBy) {
        case 'price-asc':
            result.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            result.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
            break;
        // 'featured' → leave as-is
    }

    return result;
}

export const productService = {
    // Used on Home.jsx
    async getFeatured(limit = 6) {
        const raw = await productsApi.getProducts();
        const mapped = raw.map(mapProduct).filter(Boolean);
        // Simple "featured": newest first based on createdAt
        const sorted = [...mapped].sort((a, b) => {
            const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return db - da;
        });
        return sorted.slice(0, limit);
    },

    // Used on Catalog.jsx
    async getAll(filters) {
        const raw = await productsApi.getProducts();
        const mapped = raw.map(mapProduct).filter(Boolean);
        return applyFilters(mapped, filters);
    },

    // Used on ProductDetail.jsx
    async getById(id) {
        const raw = await productsApi.getProductById(id);
        return mapProduct(raw);
    },

    // Used on ProductDetail.jsx for the "You might also like" section
    async getRelated(currentId, limit = 4) {
        const raw = await productsApi.getProducts();
        const mapped = raw.map(mapProduct).filter(Boolean);
        return mapped
            .filter((p) => String(p.id) !== String(currentId))
            .slice(0, limit);
    },

    // Used on Catalog.jsx for category dropdown
    getCategories() {
        return CATEGORY_LIST;
    },
};
