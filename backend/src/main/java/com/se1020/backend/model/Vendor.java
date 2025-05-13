package com.se1020.backend.model;

import com.se1020.backend.enums.SocialMediaPlatform;
import com.se1020.backend.enums.VendorType;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Vendor extends User {
    private VendorType vendorType;
    private String businessName;
    private double rating = 0.0;
    private List<String> availability = new ArrayList<>(); // For simplicity, use List<String> for dates
    
    // Admin approval management
    private boolean isApproved = false;
    private boolean isRejected = false;
    private LocalDateTime approvalDate;
    private LocalDateTime rejectionDate;
    
    // Portfolio management
    private List<String> imageUrls = new ArrayList<>(); // For storing Supabase image URLs
    
    // Service packages/pricing tiers
    private List<ServicePackage> servicePackages = new ArrayList<>();
    
    // Geographic location/service area
    private String address = "";
    
    // Social media links
    private Map<SocialMediaPlatform, String> socialMediaLinks = new HashMap<>();
    
    // Constructor to ensure all collections are initialized
    public Vendor() {
        super();
        this.servicePackages = new ArrayList<>();
        this.availability = new ArrayList<>();
        this.imageUrls = new ArrayList<>();
        this.socialMediaLinks = new HashMap<>();
    }

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
    
    // Admin approval methods
    public boolean isApproved() {
        return isApproved;
    }
    
    public void setApproved(boolean approved) {
        isApproved = approved;
    }
    
    public boolean isRejected() {
        return isRejected;
    }
    
    public void setRejected(boolean rejected) {
        isRejected = rejected;
    }
    
    public LocalDateTime getApprovalDate() {
        return approvalDate;
    }
    
    public void setApprovalDate(LocalDateTime approvalDate) {
        this.approvalDate = approvalDate;
    }
    
    public LocalDateTime getRejectionDate() {
        return rejectionDate;
    }
    
    public void setRejectionDate(LocalDateTime rejectionDate) {
        this.rejectionDate = rejectionDate;
    }
    
    // Portfolio management methods
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
    
    // Service packages methods
    public List<ServicePackage> getServicePackages() {
        return servicePackages;
    }
    
    public void setServicePackages(List<ServicePackage> servicePackages) {
        this.servicePackages = servicePackages;
    }
    
    public void addServicePackage(ServicePackage servicePackage) {
        if (this.servicePackages == null) {
            this.servicePackages = new ArrayList<>();
        }
        this.servicePackages.add(servicePackage);
    }
    
    public void removeServicePackage(String packageId) {
        if (this.servicePackages != null) {
            this.servicePackages.removeIf(pkg -> pkg.getId().equals(packageId));
        }
    }
    
    // Location methods
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    // Social media methods
    public Map<SocialMediaPlatform, String> getSocialMediaLinks() {
        return socialMediaLinks;
    }
    
    public void setSocialMediaLinks(Map<SocialMediaPlatform, String> socialMediaLinks) {
        this.socialMediaLinks = socialMediaLinks;
    }
}
