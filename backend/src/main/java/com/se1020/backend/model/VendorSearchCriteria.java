package com.se1020.backend.model;

import java.util.Date;
import java.util.List;

public class VendorSearchCriteria {
    private VendorType vendorType;
    private String location;
    private Double minRating;
    private Double maxRating;
    private Double minPrice;
    private Double maxPrice;
    private Date availabilityDate;
    private List<String> keywords;
    
    public VendorSearchCriteria() {
    }
    
    public VendorType getVendorType() {
        return vendorType;
    }
    
    public void setVendorType(VendorType vendorType) {
        this.vendorType = vendorType;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public Double getMinRating() {
        return minRating;
    }
    
    public void setMinRating(Double minRating) {
        this.minRating = minRating;
    }
    
    public Double getMaxRating() {
        return maxRating;
    }
    
    public void setMaxRating(Double maxRating) {
        this.maxRating = maxRating;
    }
    
    public Double getMinPrice() {
        return minPrice;
    }
    
    public void setMinPrice(Double minPrice) {
        this.minPrice = minPrice;
    }
    
    public Double getMaxPrice() {
        return maxPrice;
    }
    
    public void setMaxPrice(Double maxPrice) {
        this.maxPrice = maxPrice;
    }
    
    public Date getAvailabilityDate() {
        return availabilityDate;
    }
    
    public void setAvailabilityDate(Date availabilityDate) {
        this.availabilityDate = availabilityDate;
    }
    
    public List<String> getKeywords() {
        return keywords;
    }
    
    public void setKeywords(List<String> keywords) {
        this.keywords = keywords;
    }
}
