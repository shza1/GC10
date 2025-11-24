package com.inkhouse.ecommercebackend.controller;

import com.inkhouse.ecommercebackend.model.User;
import com.inkhouse.ecommercebackend.sevice.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/addUser")
    public String addUser(@RequestBody User user){
        user = userService.saveUser(user);
        return "User has been added";
    }

    @RequestMapping("/getUsers")
    public Iterable<User> getAllUsers(){
        return userService.getAllUsers();
    }
}
