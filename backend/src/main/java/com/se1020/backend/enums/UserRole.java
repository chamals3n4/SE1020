package com.se1020.backend.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum UserRole {
    ADMIN,
    COUPLE,
    VENDOR;
    
    @JsonCreator
    public static UserRole fromString(String value) {
        if (value == null) {
            return null;
        }
        
        try {
            return UserRole.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            // Handle case where the string doesn't match any enum value
            System.err.println("Invalid UserRole value: " + value);
            return null;
        }
    }
}
