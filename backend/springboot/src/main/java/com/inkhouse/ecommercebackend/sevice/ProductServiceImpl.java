package com.inkhouse.ecommercebackend.sevice;

import com.inkhouse.ecommercebackend.model.Product;
import com.inkhouse.ecommercebackend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Optional<Product> getProductById(Integer id) {
        return productRepository.findById(id);
    }

    @Override
    public Product createProduct(Product product) {
        // @PrePersist in Product will handle createdAt/updatedAt/default flags
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Integer id, Product productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        product.setTitle(productDetails.getTitle());
        product.setDescription(productDetails.getDescription());
        product.setImageUrl(productDetails.getImageUrl());
        product.setBasePriceCents(productDetails.getBasePriceCents());
        product.setQtyAvailable(productDetails.getQtyAvailable());
        product.setIsActive(productDetails.getIsActive());

        return productRepository.save(product);
    }

    @Override
    public void deleteProduct(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        productRepository.delete(product);
    }

    @Override
    public List<Product> searchProductsByTitle(String title) {
        return productRepository.findByTitleContainingIgnoreCase(title);
    }
}
