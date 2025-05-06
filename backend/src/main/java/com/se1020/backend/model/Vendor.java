package com.se1020.backend.model;

import java.util.Date;
import java.util.List;

public class Vendor extends User {
    private VendorType vendorType;
    private String businessName;
    private double rating;
    private List<Date> availability;

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

    public List<Date> getAvailability() {
        return availability;
    }

    public void setAvailability(List<Date> availability) {
        this.availability = availability;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }
}
