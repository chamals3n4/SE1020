package com.se1020.backend.model;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.HashMap;
import java.util.Map;

public class Service {
    private String serviceId;
    private String name;
    private String description;
    private double basePrice;
    private VendorType serviceType;
    
    // Additional dynamic properties
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<>();

    public Service() {
    }

    public Service(String serviceId, String name, String description, double basePrice) {
        this.serviceId = serviceId;
        this.name = name;
        this.description = description;
        this.basePrice = basePrice;
    }

    public String getServiceId() {
        return serviceId;
    }

    public void setServiceId(String serviceId) {
        this.serviceId = serviceId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(double basePrice) {
        this.basePrice = basePrice;
    }
    
    public VendorType getServiceType() {
        return serviceType;
    }
    
    public void setServiceType(VendorType serviceType) {
        this.serviceType = serviceType;
    }
    
    // Handle any additional properties dynamically
    @JsonAnyGetter
    public Map<String, Object> getAdditionalProperties() {
        return this.additionalProperties;
    }
    
    @JsonAnySetter
    public void setAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
    }
    
    public Object getAdditionalProperty(String name) {
        return this.additionalProperties.get(name);
    }

    // Methods from UML
    public double calculateCost() {
        double cost = basePrice;
        
        // Dynamic cost calculation based on service type
        if (serviceType == VendorType.PHOTOGRAPHY) {
            // For photography, add cost based on hours if available
            if (additionalProperties.containsKey("hours")) {
                int hours = Integer.parseInt(additionalProperties.get("hours").toString());
                cost += (hours * 50); // $50 per hour extra
            }
        } else if (serviceType == VendorType.CATERING) {
            // For catering, add cost based on guest count if available
            if (additionalProperties.containsKey("guestCount")) {
                int guestCount = Integer.parseInt(additionalProperties.get("guestCount").toString());
                cost += (guestCount * 25); // $25 per guest
            }
        }
        
        return cost;
    }

    public void updateDetails() {
        // Implementation for updating service details
    }
}
