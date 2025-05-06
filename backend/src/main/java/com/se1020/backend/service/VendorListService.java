package com.se1020.backend.service;

import com.se1020.backend.model.Vendor;
import com.se1020.backend.model.VendorLinkedList;
import com.se1020.backend.model.VendorNode;
import com.se1020.backend.model.VendorSorter;
import com.se1020.backend.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class VendorListService {

    @Autowired
    private VendorRepository vendorRepository;
    
    private VendorLinkedList vendorList = new VendorLinkedList();
    private VendorSorter vendorSorter = new VendorSorter();
    
    public void initializeVendorList() throws IOException {
        List<Vendor> vendors = vendorRepository.findAll();
        vendorList = new VendorLinkedList();
        for (Vendor vendor : vendors) {
            vendorList.addVendor(vendor);
        }
    }
    
    public List<Vendor> getAllVendorsFromList() throws IOException {
        if (vendorList.getSize() == 0) {
            initializeVendorList();
        }
        
        List<Vendor> result = new ArrayList<>();
        VendorNode current = vendorList.getHead();
        while (current != null) {
            result.add(current.getVendor());
            current = current.getNext();
        }
        return result;
    }
    
    public List<Vendor> getSortedVendors() throws IOException {
        if (vendorList.getSize() == 0) {
            initializeVendorList();
        }
        
        // Sort vendors by rating using merge sort
        VendorNode sortedHead = vendorSorter.mergeSort(vendorList.getHead());
        
        // Convert the sorted linked list to a regular list
        List<Vendor> result = new ArrayList<>();
        VendorNode current = sortedHead;
        while (current != null) {
            result.add(current.getVendor());
            current = current.getNext();
        }
        return result;
    }
    
    public void addVendor(Vendor vendor) throws IOException {
        // Save to repository first
        vendorRepository.save(vendor);
        
        // Then add to our linked list
        vendorList.addVendor(vendor);
    }
    
    public void removeVendor(String vendorId) throws IOException {
        // Remove from repository first
        vendorRepository.delete(vendorId);
        
        // Then remove from our linked list
        vendorList.removeVendor(vendorId);
    }
}
