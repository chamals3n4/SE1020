package com.se1020.backend.model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Represents a service package offered by a vendor with specific inclusions and pricing
 */
public class ServicePackage {
    private String id;
    private String name;
    private String description;
    private double basePrice;
    private List<String> inclusions;
    private List<String> exclusions;
    private int hoursOfCoverage;
    private boolean isPremium;
    
    public ServicePackage() {
        this.id = UUID.randomUUID().toString();
        this.inclusions = new ArrayList<>();
        this.exclusions = new ArrayList<>();
    }
    
    public ServicePackage(String name, String description, double basePrice) {
        this();
        this.name = name;
        this.description = description;
        this.basePrice = basePrice;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public List<String> getInclusions() {
        return inclusions;
    }

    public void setInclusions(List<String> inclusions) {
        this.inclusions = inclusions;
    }
    
    public void addInclusion(String inclusion) {
        if (this.inclusions == null) {
            this.inclusions = new ArrayList<>();
        }
        this.inclusions.add(inclusion);
    }

    public List<String> getExclusions() {
        return exclusions;
    }

    public void setExclusions(List<String> exclusions) {
        this.exclusions = exclusions;
    }
    
    public void addExclusion(String exclusion) {
        if (this.exclusions == null) {
            this.exclusions = new ArrayList<>();
        }
        this.exclusions.add(exclusion);
    }

    public int getHoursOfCoverage() {
        return hoursOfCoverage;
    }

    public void setHoursOfCoverage(int hoursOfCoverage) {
        this.hoursOfCoverage = hoursOfCoverage;
    }

    public boolean isPremium() {
        return isPremium;
    }

    public void setPremium(boolean premium) {
        isPremium = premium;
    }
}
