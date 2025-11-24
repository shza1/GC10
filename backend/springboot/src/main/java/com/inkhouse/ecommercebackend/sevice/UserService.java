package com.inkhouse.ecommercebackend.sevice;

import com.inkhouse.ecommercebackend.model.User;

import java.util.List;

public interface UserService {
    public User saveUser(User user);
    public User getUserByEmail(String email);
    public User getUserById(int id);
    public User updateUser(User user);
    public void deleteUser(int id);
    public Iterable<User> getAllUsers();
}
