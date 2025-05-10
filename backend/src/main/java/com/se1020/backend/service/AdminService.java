package com.se1020.backend.service;

import com.se1020.backend.model.Admin;
import com.se1020.backend.model.User;
import com.se1020.backend.enums.UserRole;
import com.se1020.backend.model.Vendor;
import com.se1020.backend.repository.UserRepository;
import com.se1020.backend.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VendorRepository vendorRepository;

    // We'll use Spring's resource loading capabilities instead of direct file path
    private static final String ADMIN_DATA_FILE = "data/admin.json";

    public List<User> getAllUsers() throws IOException {
        return userRepository.findAll();
    }

    public List<Vendor> getAllVendors() throws IOException {
        return vendorRepository.findAll();
    }

    public Admin authenticateAdmin(String email, String password) throws IOException {
        // Read admin data from JSON file
        ObjectMapper mapper = new ObjectMapper();
        mapper.findAndRegisterModules(); // Important for date/time handling

        List<Admin> admins = new ArrayList<>();

        try {
            // Use Spring's ClassPathResource to load the file from classpath
            Resource resource = new ClassPathResource(ADMIN_DATA_FILE);
            admins = mapper.readValue(resource.getInputStream(), new TypeReference<List<Admin>>() {
            });

            System.out.println("Loaded " + admins.size() + " admin accounts from file");
            // Print all admin emails for debugging
            admins.forEach(admin -> System.out.println("Admin email: " + admin.getEmail()));
        } catch (Exception e) {
            e.printStackTrace();
            throw new IOException("Error reading admin data: " + e.getMessage());
        }

        // Find admin with matching credentials
        return admins.stream()
                .filter(admin -> admin.getEmail().equals(email) && admin.getPassword().equals(password))
                .findFirst()
                .orElse(null);
    }

    public Map<String, Object> getAdminStats() throws IOException {
        List<User> users = userRepository.findAll();
        List<Vendor> vendors = vendorRepository.findAll();

        // Count users by role
        long totalUsers = users.size();
        long totalVendors = users.stream().filter(u -> u.getRole() == UserRole.VENDOR).count();
        long totalCouples = users.stream().filter(u -> u.getRole() == UserRole.COUPLE).count();

        // Count pending vendor approvals
        long pendingApprovals = vendors.stream().filter(v -> !v.isApproved()).count();

        // Calculate total bookings (mock data for now)
        long totalBookings = 58; // This would come from a BookingRepository in a real app

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalVendors", totalVendors);
        stats.put("totalCouples", totalCouples);
        stats.put("pendingApprovals", pendingApprovals);
        stats.put("totalBookings", totalBookings);

        return stats;
    }

    public void approveVendor(String vendorId) throws IOException {
        Vendor vendor = vendorRepository.findById(vendorId);
        if (vendor != null) {
            vendor.setApproved(true);
            vendor.setApprovalDate(LocalDateTime.now());
            vendor.setRating(0.0); // Initial rating for newly approved vendors
            vendorRepository.update(vendor);
        }
    }

    public void rejectVendor(String vendorId, String reason) throws IOException {
        Vendor vendor = vendorRepository.findById(vendorId);
        if (vendor != null) {
            vendor.setApproved(false);
            vendor.setRejected(true);
            vendor.setRejectionReason(reason);
            vendor.setRejectionDate(LocalDateTime.now());
            vendorRepository.update(vendor);
        }
    }
}
