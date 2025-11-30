package com.inkhouse.ecommercebackend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Integer id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "discount_id")
    private Integer discountId;

    @Column(name = "subtotal_cents", nullable = false)
    private Integer subtotalCents;

    @Column(name = "discount_cents", nullable = false)
    private Integer discountCents = 0;

    @Column(name = "tax_rate_basis", nullable = false)
    private Integer taxRateBasis = 825; // 8.25% = 825 basis points

    @Column(name = "tax_cents", nullable = false)
    private Integer taxCents;

    @Column(name = "total_cents", nullable = false)
    private Integer totalCents;

    // ENUM('placed','fulfilled','cancelled') in the DB
    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "placed_at", nullable = false)
    private LocalDateTime placedAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();

        if (placedAt == null) {
            placedAt = now;
        }
        if (createdAt == null) {
            createdAt = now;
        }
        updatedAt = now;

        if (status == null) {
            status = "placed";
        }
        if (taxRateBasis == null) {
            taxRateBasis = 825;
        }
        if (discountCents == null) {
            discountCents = 0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Order() {
    }
}