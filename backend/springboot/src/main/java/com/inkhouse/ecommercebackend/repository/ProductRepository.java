package com.inkhouse.ecommercebackend.repository;

import com.inkhouse.ecommercebackend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    // Search by product title (maps to products.title)
    List<Product> findByTitleContainingIgnoreCase(String title);

    // All active products (is_active = 1)
    List<Product> findByIsActiveTrue();

    // Products with quantity above a threshold (qty_available)
    List<Product> findByQtyAvailableGreaterThan(Integer qty);
}