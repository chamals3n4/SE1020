package com.se1020.backend.service;

import com.se1020.backend.model.Service;
import com.se1020.backend.model.Vendor;
import com.se1020.backend.model.VendorSearchCriteria;
import com.se1020.backend.repository.ServiceRepository;
import com.se1020.backend.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
public class VendorService {

    @Autowired
    private VendorRepository vendorRepository;
    
    @Autowired
    private ServiceRepository serviceRepository;

    public List<Vendor> getAllVendors() throws IOException {
        return vendorRepository.findAll();
    }

    public Vendor getVendorById(String id) throws IOException {
        return vendorRepository.findById(id);
    }

    public void createVendor(Vendor vendor) throws IOException {
        vendorRepository.save(vendor);
    }

    public void updateVendor(Vendor vendor) throws IOException {
        vendorRepository.update(vendor);
    }

    public void deleteVendor(String vendorId) throws IOException {
        vendorRepository.delete(vendorId);
    }
    
    /**
     * Advanced search for vendors with various filtering criteria
     */
    public List<Vendor> searchVendors(VendorSearchCriteria criteria) throws IOException {
        List<Vendor> allVendors = vendorRepository.findAll();
        List<Vendor> filteredVendors = new ArrayList<>(allVendors);
        
        // Filter by vendor type
        if (criteria.getVendorType() != null) {
            filteredVendors = filteredVendors.stream()
                .filter(v -> v.getVendorType() == criteria.getVendorType())
                .collect(Collectors.toList());
        }
        
        // Filter by rating range
        if (criteria.getMinRating() != null) {
            filteredVendors = filteredVendors.stream()
                .filter(v -> v.getRating() >= criteria.getMinRating())
                .collect(Collectors.toList());
        }
        
        if (criteria.getMaxRating() != null) {
            filteredVendors = filteredVendors.stream()
                .filter(v -> v.getRating() <= criteria.getMaxRating())
                .collect(Collectors.toList());
        }
        
        // Filter by availability date
        if (criteria.getAvailabilityDate() != null) {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            String searchDate = dateFormat.format(criteria.getAvailabilityDate());
            
            filteredVendors = filteredVendors.stream()
                .filter(v -> v.getAvailability() != null && v.getAvailability().contains(searchDate))
                .collect(Collectors.toList());
        }
        
        // Filter by keywords in name or business name
        if (criteria.getKeywords() != null && !criteria.getKeywords().isEmpty()) {
            List<Vendor> keywordFilteredVendors = new ArrayList<>();
            
            for (Vendor vendor : filteredVendors) {
                boolean matchesKeyword = false;
                
                for (String keyword : criteria.getKeywords()) {
                    keyword = keyword.toLowerCase();
                    if ((vendor.getName() != null && vendor.getName().toLowerCase().contains(keyword)) ||
                        (vendor.getBusinessName() != null && vendor.getBusinessName().toLowerCase().contains(keyword))) {
                        matchesKeyword = true;
                        break;
                    }
                }
                
                if (matchesKeyword) {
                    keywordFilteredVendors.add(vendor);
                }
            }
            
            filteredVendors = keywordFilteredVendors;
        }
        
        return filteredVendors;
    }
    
    /**
     * Get vendors sorted by rating (highest first)
     */
    public List<Vendor> getVendorsSortedByRating() throws IOException {
        List<Vendor> vendors = vendorRepository.findAll();
        return vendors.stream()
            .sorted(Comparator.comparing(Vendor::getRating).reversed())
            .collect(Collectors.toList());
    }
    
    /**
     * Get vendors by service price range
     */
    public List<Vendor> getVendorsByPriceRange(Double minPrice, Double maxPrice) throws IOException {
        List<Service> services = serviceRepository.findAll();
        List<String> vendorIds = new ArrayList<>();
        
        // Find services within price range
        for (Service service : services) {
            double price = service.getBasePrice();
            
            if ((minPrice == null || price >= minPrice) && 
                (maxPrice == null || price <= maxPrice)) {
                // In a real app, you'd have a proper relationship between Service and Vendor
                // This is just a placeholder for demonstration purposes
                // vendorIds.add(service.getVendorId());
            }
        }
        
        // Get the vendors with matching IDs
        List<Vendor> vendors = vendorRepository.findAll();
        return vendors.stream()
            .filter(v -> vendorIds.contains(v.getId()))
            .collect(Collectors.toList());
    }
}
