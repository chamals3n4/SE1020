package com.se1020.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.se1020.backend.enums.SocialMediaPlatform;
import com.se1020.backend.enums.VendorType;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@JsonIgnoreProperties(ignoreUnknown = true)
@JsonTypeInfo(
  use = JsonTypeInfo.Id.NAME,
  include = JsonTypeInfo.As.PROPERTY,
  property = "role",
  defaultImpl = Vendor.class
)
public class Vendor extends User {
    private VendorType vendorType;
    private String businessName;
    private double rating = 0.0;
    private List<String> availability = new ArrayList<>();
    
    // Simplified status management
    private String status = "PENDING"; // PENDING, APPROVED, REJECTED
    
    // Portfolio management
    private List<String> imageUrls = new ArrayList<>();
    
    // Basic pricing
    private double basePrice = 0.0;
    
    // Simplified location
    private String address = "";
    private Double serviceRadius;
    
    // Social media links
    private Map<SocialMediaPlatform, String> socialMediaLinks = new HashMap<>();
    
    // Constructor
    public Vendor() {
        super();
        this.availability = new ArrayList<>();
        this.imageUrls = new ArrayList<>();
        this.socialMediaLinks = new HashMap<>();
    }

    @Override
    public String getUserType() {
        return "VENDOR";
    }

    // Basic getters and setters
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
    
    // Simplified status methods
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    // Approval status methods
    public boolean isApproved() {
        return "APPROVED".equals(status);
    }
    
    public void setApproved(boolean approved) {
        if (approved) {
            this.status = "APPROVED";
        } else if ("APPROVED".equals(status)) {
            this.status = "PENDING";
        }
    }
    
    public boolean isRejected() {
        return "REJECTED".equals(status);
    }
    
    public void setRejected(boolean rejected) {
        if (rejected) {
            this.status = "REJECTED";
        } else if ("REJECTED".equals(status)) {
            this.status = "PENDING";
        }
    }
    
    // Image management methods
    public List<String> getImageUrls() {
        return imageUrls;
    }
    
    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }
    
    public void addImageUrl(String url) {
        if (this.imageUrls == null) {
            this.imageUrls = new ArrayList<>();
        }
        this.imageUrls.add(url);
    }
    
    public void removeImageUrl(String url) {
        if (this.imageUrls != null) {
            this.imageUrls.remove(url);
        }
    }
    
    // Price methods
    public double getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(double basePrice) {
        this.basePrice = basePrice;
    }
    
    // Location methods
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public Double getServiceRadius() {
        return serviceRadius;
    }
    
    public void setServiceRadius(Double serviceRadius) {
        this.serviceRadius = serviceRadius;
    }
    
    // Social media methods
    public Map<SocialMediaPlatform, String> getSocialMediaLinks() {
        return socialMediaLinks;
    }
    
    public void setSocialMediaLinks(Map<SocialMediaPlatform, String> socialMediaLinks) {
        this.socialMediaLinks = socialMediaLinks;
    }
    
    public void addSocialMediaLink(SocialMediaPlatform platform, String link) {
        if (this.socialMediaLinks == null) {
            this.socialMediaLinks = new HashMap<>();
        }
        this.socialMediaLinks.put(platform, link);
    }
    
    public void removeSocialMediaLink(SocialMediaPlatform platform) {
        if (this.socialMediaLinks != null) {
            this.socialMediaLinks.remove(platform);
        }
    }
}
