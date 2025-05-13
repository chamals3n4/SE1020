package com.se1020.backend.dto;

import com.se1020.backend.enums.SocialMediaPlatform;
import com.se1020.backend.model.ServicePackage;
import com.se1020.backend.model.Vendor;

import java.util.List;
import java.util.Map;

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

    public static class LocationInfo {
        private String address;

        public LocationInfo() {
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }
    }
} 