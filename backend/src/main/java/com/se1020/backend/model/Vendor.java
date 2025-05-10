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
    private double rating;
    private List<String> availability; // For simplicity, use List<String> for dates
    
    // Admin approval management
    private boolean isApproved = false;
    private boolean isRejected = false;
    private String rejectionReason;
    private LocalDateTime approvalDate;
    private LocalDateTime rejectionDate;
    private String category; // Simple category string for admin dashboard
    
    // Portfolio management
    private List<PortfolioItem> portfolioItems = new ArrayList<>();
    
    // Service packages/pricing tiers
    private List<ServicePackage> servicePackages = new ArrayList<>();
    
    // Geographic location/service area
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private double serviceRadius; // in kilometers
    
    // Social media links
    private Map<SocialMediaPlatform, String> socialMediaLinks = new HashMap<>();

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
    
    public String getRejectionReason() {
        return rejectionReason;
    }
    
    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
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
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    // Portfolio management methods
    public List<PortfolioItem> getPortfolioItems() {
        return portfolioItems;
    }
    
    public void setPortfolioItems(List<PortfolioItem> portfolioItems) {
        this.portfolioItems = portfolioItems;
    }
    
    public void addPortfolioItem(PortfolioItem item) {
        if (this.portfolioItems == null) {
            this.portfolioItems = new ArrayList<>();
        }
        this.portfolioItems.add(item);
    }
    
    public void removePortfolioItem(String itemId) {
        if (this.portfolioItems != null) {
            this.portfolioItems.removeIf(item -> item.getId().equals(itemId));
        }
    }
    
    public void submitPortfolio() {
        // Implementation for submitting the portfolio
        System.out.println("Submitting portfolio for " + businessName);
        // In a real implementation, you might validate and process the portfolio items
        for (PortfolioItem item : portfolioItems) {
            System.out.println("- Processing item: " + item.getTitle());
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
    
    public String getCity() {
        return city;
    }
    
    public void setCity(String city) {
        this.city = city;
    }
    
    public String getState() {
        return state;
    }
    
    public void setState(String state) {
        this.state = state;
    }
    
    public String getZipCode() {
        return zipCode;
    }
    
    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }
    
    public double getServiceRadius() {
        return serviceRadius;
    }
    
    public void setServiceRadius(double serviceRadius) {
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
    
    public String getSocialMediaLink(SocialMediaPlatform platform) {
        return this.socialMediaLinks.get(platform);
    }
    
    public void removeSocialMediaLink(SocialMediaPlatform platform) {
        if (this.socialMediaLinks != null) {
            this.socialMediaLinks.remove(platform);
        }
    }
    
    public void updateAvailability() {
        // Implementation for updating availability
    }
    
    public void respondToBooking() {
        // Implementation for responding to booking
    }
}
