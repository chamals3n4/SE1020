package com.se1020.backend.controller;

import com.se1020.backend.model.Vendor;
import com.se1020.backend.service.VendorListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/vendor-list")
public class VendorListController {

    @Autowired
    private VendorListService vendorListService;

    @GetMapping
    public List<Vendor> getAllVendors() throws IOException {
        return vendorListService.getAllVendorsFromList();
    }
    
    @GetMapping("/sorted")
    public List<Vendor> getSortedVendors() throws IOException {
        return vendorListService.getSortedVendors();
    }
}
