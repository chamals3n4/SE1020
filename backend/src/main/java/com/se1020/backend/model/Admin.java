package com.se1020.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Admin extends User {
    
    public Admin() {
        super();
    }

    @Override
    public String getUserType() {
        return "ADMIN";
    }
}