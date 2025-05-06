package com.se1020.backend.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.se1020.backend.model.Vendor;
import org.springframework.stereotype.Repository;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class VendorRepository {
    private static final String FILE_PATH = "src/main/resources/data/vendors.json";
    private final ObjectMapper objectMapper = new ObjectMapper();
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
        vendors.removeIf(v -> v.getId().equals(vendor.getId()));
        vendors.add(vendor);
        objectMapper.writeValue(file, vendors);
    }

    public void delete(String vendorId) throws IOException {
        List<Vendor> vendors = findAll();
        vendors.removeIf(v -> v.getId().equals(vendorId));
        objectMapper.writeValue(file, vendors);
    }
}
