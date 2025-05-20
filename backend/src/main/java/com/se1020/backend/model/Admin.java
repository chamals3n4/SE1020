package com.se1020.backend.model;

public class Admin extends User {
    
    public Admin() {
        super();
    }

    @Override
    public String getUserType() {
        return "ADMIN";
    }
} 