package com.inkhouse.ecommercebackend.model;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "users")
@JsonPropertyOrder({"user_id", "email", "full_name", "created_at", "updated_at"})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int user_id;
    private String email;
    private String full_name;
    private Date created_at;
    private Date updated_at;

    public User(){}
}