package com.se1020.backend.service;

import com.se1020.backend.model.Vendor;
import com.se1020.backend.repository.VendorRepository;
import com.se1020.backend.util.dsa.VendorBubbleSorter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VendorService {

    @Autowired
    private VendorRepository vendorRepository;

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

    public void deleteVendor(String id) throws IOException {
        vendorRepository.delete(id);
    }

    public List<Vendor> getVendorsSortedByRating() throws IOException {
        List<Vendor> vendors = vendorRepository.findAll();
        return vendors.stream()
                .sorted(Comparator.comparing(Vendor::getRating).reversed())
                .collect(Collectors.toList());
    }

    public List<Vendor> getVendorsByPriceRange(Double minPrice, Double maxPrice) throws IOException {
        List<Vendor> vendors = vendorRepository.findAll();
        return vendors.stream()
                .filter(vendor -> {
                    if (minPrice != null && vendor.getBasePrice() < minPrice) {
                        return false;
                    }
                    if (maxPrice != null && vendor.getBasePrice() > maxPrice) {
                        return false;
                    }
                    return true;
                })
                .collect(Collectors.toList());
    }

    public List<Vendor> getVendorsSortedByPrice(boolean ascending) throws IOException {
        List<Vendor> vendors = vendorRepository.findAll();
        return VendorBubbleSorter.sortByPrice(vendors, ascending);
    }
}
