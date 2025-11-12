package com.inkhouse.ecommercebackend.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.util.Date;

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String email;
    private String name;
    private String password;
    private Date created_at;
    private Date updated_at;

    public User(){
    }

    public int getId(){
        return id;
    }

    public String getEmail(){
        return email;
    }
    public String getName(){
        return name;
    }
    public String getPassword(){
        return password;
    }
    public Date getCreated_at(){
        return created_at;
    }
    public Date getUpdated_at(){
        return updated_at;
    }
    public void setId(int id){
        this.id = id;
    }
    public void setEmail(String email){
        this.email = email;
    }
    public void setName(String name){
        this.name = name;
    }
    public void setPassword(String password){
        this.password = password;
    }
    public void setCreated_at(Date created_at){
        this.created_at = created_at;
    }
    public void setUpdated_at(Date updated_at){
        this.updated_at = updated_at;
    }
}