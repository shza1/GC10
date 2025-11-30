package com.inkhouse.ecommercebackend.sevice;

import com.inkhouse.ecommercebackend.model.Order;

import java.util.List;
import java.util.Optional;

public interface OrderService {
    List<Order> getAllOrders();
    Optional<Order> getOrderById(Integer id);
    List<Order> getOrdersByUserId(Integer userId);
    Order createOrder(Order order);
    Order updateOrderStatus(Integer id, String status);
    void deleteOrder(Integer id);
}
