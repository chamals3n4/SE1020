package com.se1020.backend.model;

import java.util.List;

public class CateringService extends Service {
    private int numberOfGuests;
    private boolean includesBeverages;
    private boolean includesDessert;
    private List<String> menuOptions;
    private boolean providesStaff;
    private boolean providesRentals;

    public int getNumberOfGuests() {
        return numberOfGuests;
    }

    public void setNumberOfGuests(int numberOfGuests) {
        this.numberOfGuests = numberOfGuests;
    }

    public boolean isIncludesBeverages() {
        return includesBeverages;
    }

    public void setIncludesBeverages(boolean includesBeverages) {
        this.includesBeverages = includesBeverages;
    }

    public boolean isIncludesDessert() {
        return includesDessert;
    }

    public void setIncludesDessert(boolean includesDessert) {
        this.includesDessert = includesDessert;
    }

    public List<String> getMenuOptions() {
        return menuOptions;
    }

    public void setMenuOptions(List<String> menuOptions) {
        this.menuOptions = menuOptions;
    }

    public boolean isProvidesStaff() {
        return providesStaff;
    }

    public void setProvidesStaff(boolean providesStaff) {
        this.providesStaff = providesStaff;
    }

    public boolean isProvidesRentals() {
        return providesRentals;
    }

    public void setProvidesRentals(boolean providesRentals) {
        this.providesRentals = providesRentals;
    }
} 