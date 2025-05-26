package com.se1020.backend.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.se1020.backend.model.Vendor;
import com.se1020.backend.util.dsa.VendorLinkedList;
import com.se1020.backend.util.dsa.VendorNode;
import org.springframework.stereotype.Repository;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Repository
public class VendorRepository {
    private static final String FILE_PATH = "src/main/resources/data/vendors.json";
    private final ObjectMapper objectMapper = new ObjectMapper()
        .setDefaultPropertyInclusion(JsonInclude.Include.NON_NULL)
        .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    private final File file = new File(FILE_PATH);

    public VendorLinkedList findAll() throws IOException {
        if (!file.exists()) {
            file.getParentFile().mkdirs();
            file.createNewFile();
            VendorLinkedList emptyList = new VendorLinkedList();
            Files.write(Paths.get(FILE_PATH), emptyList.toJson().getBytes());
            return emptyList;
        }
        
        if (file.length() == 0) {
            VendorLinkedList emptyList = new VendorLinkedList();
            Files.write(Paths.get(FILE_PATH), emptyList.toJson().getBytes());
            return emptyList;
        }
        
        String json = new String(Files.readAllBytes(Paths.get(FILE_PATH)));
        return VendorLinkedList.fromJson(json);
    }

    public Vendor findById(String id) throws IOException {
        return findAll().getVendorById(id);
    }

    public void save(Vendor vendor) throws IOException {
        VendorLinkedList vendors = findAll();
        vendors.addVendor(vendor);
        saveAll(vendors);
    }

    public void update(Vendor vendor) throws IOException {
        VendorLinkedList vendors = findAll();
        vendors.removeVendor(vendor.getId());
        vendors.addVendor(vendor);
        saveAll(vendors);
    }

    public void delete(String vendorId) throws IOException {
        VendorLinkedList vendors = findAll();
        vendors.removeVendor(vendorId);
        saveAll(vendors);
    }

    private void saveAll(VendorLinkedList vendors) throws IOException {
        Files.write(Paths.get(FILE_PATH), vendors.toJson().getBytes());
    }
}
