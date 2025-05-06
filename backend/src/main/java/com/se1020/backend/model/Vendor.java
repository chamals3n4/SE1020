package com.se1020.backend.model;

import java.util.List;

public class Vendor extends User {
    private VendorType vendorType;
    private String businessName;
    private double rating;
    private List<String> availability; // For simplicity, use List<String> for dates

    public VendorType getVendorType() {
        return vendorType;
    }

    public void setVendorType(VendorType vendorType) {
        this.vendorType = vendorType;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public List<String> getAvailability() {
        return availability;
    }

    public void setAvailability(List<String> availability) {
        this.availability = availability;
    }

    public void updateAvailability() {}
    public void respondToBooking() {}
    public void submitPortfolio() {}
}
