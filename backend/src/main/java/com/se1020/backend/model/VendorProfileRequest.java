package com.se1020.backend.model;

import com.se1020.backend.enums.SocialMediaPlatform;
import java.util.List;
import java.util.Map;

/**
 * Request class for creating or updating a vendor with all profile details in a single request.
 * Contains basic vendor information, location, social media links, and service packages.
 */
public class VendorProfileRequest {
    
    private Vendor vendor;
    private LocationInfo location;
    private Map<SocialMediaPlatform, String> socialMediaLinks;
    private List<ServicePackage> servicePackages;
    
    public VendorProfileRequest() {
    }
    
    public Vendor getVendor() {
        return vendor;
    }
    
    public void setVendor(Vendor vendor) {
        this.vendor = vendor;
    }
    
    public LocationInfo getLocation() {
        return location;
    }
    
    public void setLocation(LocationInfo location) {
        this.location = location;
    }
    
    public Map<SocialMediaPlatform, String> getSocialMediaLinks() {
        return socialMediaLinks;
    }
    
    public void setSocialMediaLinks(Map<SocialMediaPlatform, String> socialMediaLinks) {
        this.socialMediaLinks = socialMediaLinks;
    }
    
    public List<ServicePackage> getServicePackages() {
        return servicePackages;
    }
    
    public void setServicePackages(List<ServicePackage> servicePackages) {
        this.servicePackages = servicePackages;
    }
    
    /**
     * Inner class to represent the vendor's location information
     */
    public static class LocationInfo {
        private String address;
        private String city;
        private String state;
        private String zipCode;
        private double serviceRadius;
        
        public LocationInfo() {
        }
        
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
    }
}
