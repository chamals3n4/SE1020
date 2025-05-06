package com.se1020.backend.service;

import com.se1020.backend.model.Admin;
import com.se1020.backend.model.User;
import com.se1020.backend.model.Vendor;
import com.se1020.backend.repository.UserRepository;
import com.se1020.backend.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private VendorRepository vendorRepository;

    public List<User> getAllUsers() throws IOException {
        return userRepository.findAll();
    }
    
    public void approveVendor(String vendorId) throws IOException {
        Vendor vendor = vendorRepository.findById(vendorId);
        if (vendor != null) {
            // Mark vendor as approved in a real application
            // For this demo, we're just updating the vendor
            vendor.setRating(5.0); // Default high rating for newly approved vendors
            vendorRepository.update(vendor);
        }
    }
    
    public void resolveDispute(String userId, String resolution) throws IOException {
        // Implementation for dispute resolution would go here
        // This is a placeholder method
    }
}
