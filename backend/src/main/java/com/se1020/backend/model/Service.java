package com.se1020.backend.model;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.se1020.backend.enums.VendorType;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Service {
    private String serviceId;
    private String name;
    private String description;
    private double basePrice;
    private VendorType serviceType;
    
    // Catering service properties
    private Integer numberOfGuests;
    private Boolean includesBeverages;
    private Boolean includesDessert;
    private List<String> menuOptions;
    private Boolean providesStaff;
    private Boolean providesRentals;
    
    // Photography service properties
    private Integer hoursOfCoverage;
    private Integer numberOfPhotos;
    private Boolean includesEngagementShoot;
    private Boolean includesWeddingAlbum;
    
    // Decoration service properties
    private String themeStyle;
    private Boolean includesFlowers;
    private Boolean includesLighting;
    
    // Venue service properties
    private Integer maxCapacity;
    private Boolean indoorSpace;
    private Boolean outdoorSpace;
    private Boolean providesAccommodation;
    
    // Music service properties
    private Integer numberOfPerformers;
    private Boolean providesEquipment;
    private List<String> repertoireOptions;
    
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

    // Getters and setters for catering service properties
    public Integer getNumberOfGuests() {
        return numberOfGuests;
    }

    public void setNumberOfGuests(Integer numberOfGuests) {
        this.numberOfGuests = numberOfGuests;
    }

    public Boolean isIncludesBeverages() {
        return includesBeverages;
    }

    public void setIncludesBeverages(Boolean includesBeverages) {
        this.includesBeverages = includesBeverages;
    }

    public Boolean isIncludesDessert() {
        return includesDessert;
    }

    public void setIncludesDessert(Boolean includesDessert) {
        this.includesDessert = includesDessert;
    }

    public List<String> getMenuOptions() {
        return menuOptions;
    }

    public void setMenuOptions(List<String> menuOptions) {
        this.menuOptions = menuOptions;
    }

    public Boolean isProvidesStaff() {
        return providesStaff;
    }

    public void setProvidesStaff(Boolean providesStaff) {
        this.providesStaff = providesStaff;
    }

    public Boolean isProvidesRentals() {
        return providesRentals;
    }

    public void setProvidesRentals(Boolean providesRentals) {
        this.providesRentals = providesRentals;
    }
    
    // Getters and setters for photography service properties
    public Integer getHoursOfCoverage() {
        return hoursOfCoverage;
    }

    public void setHoursOfCoverage(Integer hoursOfCoverage) {
        this.hoursOfCoverage = hoursOfCoverage;
    }

    public Integer getNumberOfPhotos() {
        return numberOfPhotos;
    }

    public void setNumberOfPhotos(Integer numberOfPhotos) {
        this.numberOfPhotos = numberOfPhotos;
    }

    public Boolean isIncludesEngagementShoot() {
        return includesEngagementShoot;
    }

    public void setIncludesEngagementShoot(Boolean includesEngagementShoot) {
        this.includesEngagementShoot = includesEngagementShoot;
    }

    public Boolean isIncludesWeddingAlbum() {
        return includesWeddingAlbum;
    }

    public void setIncludesWeddingAlbum(Boolean includesWeddingAlbum) {
        this.includesWeddingAlbum = includesWeddingAlbum;
    }
    
    // Getters and setters for decoration service properties
    public String getThemeStyle() {
        return themeStyle;
    }

    public void setThemeStyle(String themeStyle) {
        this.themeStyle = themeStyle;
    }

    public Boolean isIncludesFlowers() {
        return includesFlowers;
    }

    public void setIncludesFlowers(Boolean includesFlowers) {
        this.includesFlowers = includesFlowers;
    }

    public Boolean isIncludesLighting() {
        return includesLighting;
    }

    public void setIncludesLighting(Boolean includesLighting) {
        this.includesLighting = includesLighting;
    }
    
    // Getters and setters for venue service properties
    public Integer getMaxCapacity() {
        return maxCapacity;
    }

    public void setMaxCapacity(Integer maxCapacity) {
        this.maxCapacity = maxCapacity;
    }

    public Boolean isIndoorSpace() {
        return indoorSpace;
    }

    public void setIndoorSpace(Boolean indoorSpace) {
        this.indoorSpace = indoorSpace;
    }

    public Boolean isOutdoorSpace() {
        return outdoorSpace;
    }

    public void setOutdoorSpace(Boolean outdoorSpace) {
        this.outdoorSpace = outdoorSpace;
    }

    public Boolean isProvidesAccommodation() {
        return providesAccommodation;
    }

    public void setProvidesAccommodation(Boolean providesAccommodation) {
        this.providesAccommodation = providesAccommodation;
    }
    
    // Getters and setters for music service properties
    public Integer getNumberOfPerformers() {
        return numberOfPerformers;
    }

    public void setNumberOfPerformers(Integer numberOfPerformers) {
        this.numberOfPerformers = numberOfPerformers;
    }

    public Boolean isProvidesEquipment() {
        return providesEquipment;
    }

    public void setProvidesEquipment(Boolean providesEquipment) {
        this.providesEquipment = providesEquipment;
    }

    public List<String> getRepertoireOptions() {
        return repertoireOptions;
    }

    public void setRepertoireOptions(List<String> repertoireOptions) {
        this.repertoireOptions = repertoireOptions;
    }

    // Methods from UML
    public double calculateCost() {
        double cost = basePrice;
        
        // Dynamic cost calculation based on service type
        if (serviceType == VendorType.PHOTOGRAPHY) {
            // For photography, add cost based on hours
            if (hoursOfCoverage != null) {
                cost += (hoursOfCoverage * 50); // $50 per hour extra
            }
            // Add cost for wedding album if included
            if (Boolean.TRUE.equals(includesWeddingAlbum)) {
                cost += 200; // $200 extra for wedding album
            }
            // Add cost for engagement shoot if included
            if (Boolean.TRUE.equals(includesEngagementShoot)) {
                cost += 300; // $300 extra for engagement shoot
            }
        } else if (serviceType == VendorType.CATERING) {
            // For catering, add cost based on guest count
            if (numberOfGuests != null) {
                cost += (numberOfGuests * 25); // $25 per guest
            }
            // Add cost for beverages if included
            if (Boolean.TRUE.equals(includesBeverages)) {
                cost += (numberOfGuests != null ? numberOfGuests * 10 : 0); // $10 per guest for beverages
            }
            // Add cost for dessert if included
            if (Boolean.TRUE.equals(includesDessert)) {
                cost += (numberOfGuests != null ? numberOfGuests * 8 : 0); // $8 per guest for dessert
            }
        } else if (serviceType == VendorType.VENUE) {
            // For venue, add cost based on capacity
            if (maxCapacity != null) {
                cost += (maxCapacity * 15); // $15 per guest capacity
            }
            // Add cost for accommodation if provided
            if (Boolean.TRUE.equals(providesAccommodation)) {
                cost += 1000; // $1000 extra for accommodation
            }
        } else if (serviceType == VendorType.MUSIC) {
            // For music, add cost based on number of performers
            if (numberOfPerformers != null) {
                cost += (numberOfPerformers * 200); // $200 per performer
            }
            // Add cost for equipment if provided
            if (Boolean.TRUE.equals(providesEquipment)) {
                cost += 500; // $500 extra for equipment
            }
        } else if (serviceType == VendorType.DECORATION) {
            // For decoration, add cost for flowers if included
            if (Boolean.TRUE.equals(includesFlowers)) {
                cost += 700; // $700 extra for flowers
            }
            // Add cost for lighting if included
            if (Boolean.TRUE.equals(includesLighting)) {
                cost += 500; // $500 extra for lighting
            }
        }
        
        // Fall back to using additionalProperties if the typed fields are not set
        if (additionalProperties.containsKey("hours") && (serviceType == VendorType.PHOTOGRAPHY && hoursOfCoverage == null)) {
            int hours = Integer.parseInt(additionalProperties.get("hours").toString());
            cost += (hours * 50); // $50 per hour extra
        }
        if (additionalProperties.containsKey("guestCount") && (serviceType == VendorType.CATERING && numberOfGuests == null)) {
            int guestCount = Integer.parseInt(additionalProperties.get("guestCount").toString());
            cost += (guestCount * 25); // $25 per guest
        }
        
        return cost;
    }

    public void updateDetails() {
        // Implementation for updating service details
    }
}
