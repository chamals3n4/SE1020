package com.se1020.backend.dto;

import com.se1020.backend.enums.SocialMediaPlatform;
import com.se1020.backend.model.ServicePackage;
import com.se1020.backend.model.Vendor;

import java.util.List;
import java.util.Map;

public class VendorProfileRequest {
    private Vendor vendor;
    private Location location;
    private Map<SocialMediaPlatform, String> socialMediaLinks;
    private List<ServicePackage> servicePackages;

    public Vendor getVendor() {
        return vendor;
    }

    public void setVendor(Vendor vendor) {
        this.vendor = vendor;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
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

    public static class Location {
        private String address;
        private String city;
        private String state;
        private String zipCode;
        private Double serviceRadius;

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

        public Double getServiceRadius() {
            return serviceRadius;
        }

        public void setServiceRadius(Double serviceRadius) {
            this.serviceRadius = serviceRadius;
        }
    }
} 