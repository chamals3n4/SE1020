package com.se1020.backend.service;

import com.se1020.backend.model.Admin;
import com.se1020.backend.model.User;
import com.se1020.backend.model.Vendor;
import com.se1020.backend.model.Couple;
import com.se1020.backend.repository.AdminRepository;
import com.se1020.backend.repository.UserRepository;
import com.se1020.backend.repository.VendorRepository;
import com.se1020.backend.repository.CoupleRepository;
import com.se1020.backend.enums.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private CoupleRepository coupleRepository;

    public Admin login(String email, String password) throws IOException {
        Admin admin = adminRepository.findByEmail(email);
        if (admin != null && admin.getPassword().equals(password)) {
            return admin;
        }
        return null;
    }

    public List<Admin> getAllAdmins() throws IOException {
        return adminRepository.findAll();
    }

    public Admin getAdminById(String adminId) throws IOException {
        return adminRepository.findById(adminId);
    }

    public void createAdmin(Admin admin) throws IOException {
        admin.setRole(UserRole.ADMIN);
        adminRepository.save(admin);
    }

    public void updateAdmin(Admin admin) throws IOException {
        adminRepository.update(admin);
    }

    public void deleteAdmin(String adminId) throws IOException {
        adminRepository.delete(adminId);
    }

    // User management methods
    public List<User> getAllUsers() throws IOException {
        return userRepository.findAll();
    }

    public void deleteUser(String userId) throws IOException {
        userRepository.delete(userId);
    }

    // Vendor management methods
    public List<Vendor> getAllVendors() throws IOException {
        return vendorRepository.findAll();
    }

    public Vendor getVendorById(String vendorId) throws IOException {
        return vendorRepository.findById(vendorId);
    }

    public void approveVendor(String vendorId) throws IOException {
        Vendor vendor = vendorRepository.findById(vendorId);
        if (vendor != null) {
            vendor.setStatus("APPROVED");
            vendorRepository.update(vendor);
        }
    }

    public void rejectVendor(String vendorId) throws IOException {
        Vendor vendor = vendorRepository.findById(vendorId);
        if (vendor != null) {
            vendor.setStatus("REJECTED");
            vendorRepository.update(vendor);
        }
    }

    public void deleteVendor(String vendorId) throws IOException {
        vendorRepository.delete(vendorId);
    }

    // Couple management methods
    public List<Couple> getAllCouples() throws IOException {
        return coupleRepository.findAll();
    }

    public Couple getCoupleById(String coupleId) throws IOException {
        return coupleRepository.findById(coupleId);
    }

    public void deleteCouple(String coupleId) throws IOException {
        coupleRepository.delete(coupleId);
    }

    // Statistics
    public Map<String, Object> getStats() throws IOException {
        Map<String, Object> stats = new HashMap<>();

        List<User> allUsers = userRepository.findAll();
        List<Vendor> allVendors = vendorRepository.findAll();
        List<Admin> allAdmins = adminRepository.findAll();

        stats.put("totalUsers", allUsers.size());
        stats.put("totalVendors", allVendors.size());
        stats.put("totalAdmins", allAdmins.size());
        stats.put("totalCouples", allUsers.stream()
                .filter(user -> user.getRole() == UserRole.COUPLE)
                .count());
        stats.put("pendingApprovals", allVendors.stream()
                .filter(vendor -> !vendor.isApproved())
                .count());

        return stats;
    }
}