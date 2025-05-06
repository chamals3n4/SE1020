package com.se1020.backend.model;

public class Admin extends User {
    private String accessLevel;

    public String getAccessLevel() {
        return accessLevel;
    }

    public void setAccessLevel(String accessLevel) {
        this.accessLevel = accessLevel;
    }
}
