package com.inkhouse.ecommercebackend.sevice;

import com.inkhouse.ecommercebackend.model.Product;

import java.util.List;
import java.util.Optional;

public interface ProductService {
    List<Product> getAllProducts();
    Optional<Product> getProductById(Integer id);
    Product createProduct(Product product);
    Product updateProduct(Integer id, Product product);
    void deleteProduct(Integer id);
    List<Product> searchProductsByTitle(String title);
}