package com.inkhouse.ecommercebackend.controller;

import com.inkhouse.ecommercebackend.model.Product;
import com.inkhouse.ecommercebackend.sevice.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173") // Vite default port
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * GET /api/products - Get all products
     */
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    /**
     * GET /api/products/{id} - Get product by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Integer id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/products - Create a new product
     *
     * Expected JSON (aligned with products schema):
     * {
     *   "title": "Premade UTSA Skyline",
     *   "description": "Popular premade poster",
     *   "imageUrl": "https://example.com/img.jpg",
     *   "basePriceCents": 1999,
     *   "qtyAvailable": 50,
     *   "isActive": true
     * }
     */
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product createdProduct = productService.createProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }

    /**
     * PUT /api/products/{id} - Update an existing product
     */
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Integer id, @RequestBody Product product) {
        try {
            Product updatedProduct = productService.updateProduct(id, product);
            return ResponseEntity.ok(updatedProduct);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * DELETE /api/products/{id} - Delete a product
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/products/search?name={query} - Search products by title
     *
     * Kept the query parameter name "name" so your frontend
     * doesn’t need to change, even though it searches on title.
     */
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam(name = "name") String query) {
        List<Product> products = productService.searchProductsByTitle(query);
        return ResponseEntity.ok(products);
    }
}
