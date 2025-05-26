package com.se1020.backend.service;

import com.se1020.backend.model.Vendor;
import com.se1020.backend.repository.VendorRepository;
import com.se1020.backend.util.dsa.VendorLinkedList;
import com.se1020.backend.util.dsa.VendorBubbleSorter;
import com.se1020.backend.util.dsa.VendorNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

@Service
public class VendorService {

    @Autowired
    private VendorRepository vendorRepository;

    public List<Vendor> getAllVendors() throws IOException {
        VendorLinkedList vendors = vendorRepository.findAll();
        List<Vendor> vendorList = new ArrayList<>();
        VendorNode current = vendors.getHead();
        while (current != null) {
            vendorList.add(current.getVendor());
            current = current.getNext();
        }
        return vendorList;
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
        VendorLinkedList vendors = vendorRepository.findAll();
        Vendor[] vendorArray = vendors.toArray();
        Arrays.sort(vendorArray, Comparator.comparing(Vendor::getRating).reversed());
        return Arrays.asList(vendorArray);
    }

    public List<Vendor> getVendorsByPriceRange(Double minPrice, Double maxPrice) throws IOException {
        VendorLinkedList vendors = vendorRepository.findAll();
        List<Vendor> filteredVendors = new ArrayList<>();
        VendorNode current = vendors.getHead();
        while (current != null) {
            Vendor vendor = current.getVendor();
            if (vendor.getBasePrice() >= minPrice && vendor.getBasePrice() <= maxPrice) {
                filteredVendors.add(vendor);
            }
            current = current.getNext();
        }
        return filteredVendors;
    }

    public List<Vendor> getVendorsSortedByPrice(boolean ascending) throws IOException {
        VendorLinkedList vendors = vendorRepository.findAll();
        VendorLinkedList sortedVendors = VendorBubbleSorter.sortByPrice(vendors, ascending);
        List<Vendor> result = new ArrayList<>();
        VendorNode current = sortedVendors.getHead();
        while (current != null) {
            result.add(current.getVendor());
            current = current.getNext();
        }
        return result;
    }
}
