package com.se1020.backend.model;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.function.Predicate;
import java.util.stream.Collectors;

/**
 * Consolidated class that replaces VendorLinkedList, VendorNode, and VendorSorter
 * to simplify the vendor collection management using Java's built-in collections.
 */
public class VendorCollection {
    private List<Vendor> vendors;
    
    public VendorCollection() {
        this.vendors = new ArrayList<>();
    }
    
    /**
     * Add a vendor to the collection
     */
    public void addVendor(Vendor vendor) {
        this.vendors.add(vendor);
    }
    
    /**
     * Remove a vendor from the collection by ID
     */
    public void removeVendor(String vendorId) {
        this.vendors.removeIf(vendor -> vendor.getId().equals(vendorId));
    }
    
    /**
     * Get vendor by ID
     */
    public Vendor findVendorById(String vendorId) {
        return this.vendors.stream()
                .filter(vendor -> vendor.getId().equals(vendorId))
                .findFirst()
                .orElse(null);
    }
    
    /**
     * Filter vendors by a predicate
     */
    public List<Vendor> filterVendors(Predicate<Vendor> predicate) {
        return this.vendors.stream()
                .filter(predicate)
                .collect(Collectors.toList());
    }
    
    /**
     * Sort vendors by rating in descending order
     */
    public List<Vendor> sortByRatingDescending() {
        return this.vendors.stream()
                .sorted(Comparator.comparing(Vendor::getRating).reversed())
                .collect(Collectors.toList());
    }
    
    /**
     * Sort vendors by a custom comparator
     */
    public List<Vendor> sortVendors(Comparator<Vendor> comparator) {
        return this.vendors.stream()
                .sorted(comparator)
                .collect(Collectors.toList());
    }
    
    /**
     * Get all vendors in the collection
     */
    public List<Vendor> getAllVendors() {
        return new ArrayList<>(this.vendors);
    }
    
    /**
     * Get the size of the collection
     */
    public int getSize() {
        return this.vendors.size();
    }
    
    /**
     * Clear the collection
     */
    public void clear() {
        this.vendors.clear();
    }
}
