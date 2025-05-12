package com.se1020.backend.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.se1020.backend.model.Vendor;
import org.springframework.stereotype.Repository;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class VendorRepository {
    private static final String FILE_PATH = "src/main/resources/data/vendors.json";
    private final ObjectMapper objectMapper = new ObjectMapper()
        .setDefaultPropertyInclusion(JsonInclude.Include.NON_NULL)
        .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    private final File file = new File(FILE_PATH);

    public List<Vendor> findAll() throws IOException {
        if (!file.exists()) {
            file.getParentFile().mkdirs();
            file.createNewFile();
            objectMapper.writeValue(file, new ArrayList<Vendor>());
            return new ArrayList<>();
        }
        
        if (file.length() == 0) {
            objectMapper.writeValue(file, new ArrayList<Vendor>());
            return new ArrayList<>();
        }
        
        return objectMapper.readValue(file, new TypeReference<List<Vendor>>() {});
    }

    public Vendor findById(String id) throws IOException {
        List<Vendor> vendors = findAll();
        return vendors.stream()
                .filter(vendor -> vendor.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    public void save(Vendor vendor) throws IOException {
        List<Vendor> vendors = findAll();
        vendors.add(vendor);
        objectMapper.writeValue(file, vendors);
    }

    public void update(Vendor vendor) throws IOException {
        List<Vendor> vendors = findAll();
        // Find existing vendor
        Vendor existingVendor = vendors.stream()
                .filter(v -> v.getId().equals(vendor.getId()))
                .findFirst()
                .orElse(null);

        if (existingVendor != null) {
            // Remove old vendor
            vendors.removeIf(v -> v.getId().equals(vendor.getId()));
            
            // Merge new data with existing data
            // Only update non-null fields from the new vendor object
            if (vendor.getEmail() != null) existingVendor.setEmail(vendor.getEmail());
            if (vendor.getName() != null) existingVendor.setName(vendor.getName());
            if (vendor.getPhone() != null) existingVendor.setPhone(vendor.getPhone());
            if (vendor.getRole() != null) existingVendor.setRole(vendor.getRole());
            if (vendor.getVendorType() != null) existingVendor.setVendorType(vendor.getVendorType());
            if (vendor.getBusinessName() != null) existingVendor.setBusinessName(vendor.getBusinessName());
            if (vendor.getRating() != 0.0) existingVendor.setRating(vendor.getRating());
            if (vendor.getAvailability() != null) existingVendor.setAvailability(vendor.getAvailability());
            if (vendor.getAddress() != null) existingVendor.setAddress(vendor.getAddress());
            if (vendor.getCity() != null) existingVendor.setCity(vendor.getCity());
            if (vendor.getState() != null) existingVendor.setState(vendor.getState());
            if (vendor.getZipCode() != null) existingVendor.setZipCode(vendor.getZipCode());
            if (vendor.getServiceRadius() != 0.0) existingVendor.setServiceRadius(vendor.getServiceRadius());
            if (vendor.getServicePackages() != null) existingVendor.setServicePackages(vendor.getServicePackages());
            if (vendor.getPortfolioItems() != null) existingVendor.setPortfolioItems(vendor.getPortfolioItems());
            if (vendor.getSocialMediaLinks() != null) existingVendor.setSocialMediaLinks(vendor.getSocialMediaLinks());
            
            // Add updated vendor back to list
            vendors.add(existingVendor);
        } else {
            // If vendor doesn't exist, add as new
            vendors.add(vendor);
        }
        
        objectMapper.writeValue(file, vendors);
    }

    public void delete(String vendorId) throws IOException {
        List<Vendor> vendors = findAll();
        vendors.removeIf(v -> v.getId().equals(vendorId));
        objectMapper.writeValue(file, vendors);
    }
}
