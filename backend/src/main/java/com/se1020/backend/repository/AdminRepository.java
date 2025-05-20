package com.se1020.backend.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.se1020.backend.model.Admin;
import org.springframework.stereotype.Repository;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class AdminRepository {
    private static final String FILE_PATH = "src/main/resources/data/admin.json";
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final File file = new File(FILE_PATH);

    public List<Admin> findAll() throws IOException {
        if (!file.exists()) {
            file.getParentFile().mkdirs();
            file.createNewFile();
            objectMapper.writeValue(file, new ArrayList<Admin>());
            return new ArrayList<>();
        }
        
        if (file.length() == 0) {
            objectMapper.writeValue(file, new ArrayList<Admin>());
            return new ArrayList<>();
        }
        
        return objectMapper.readValue(file, new TypeReference<List<Admin>>() {});
    }

    public Admin findById(String id) throws IOException {
        List<Admin> admins = findAll();
        return admins.stream()
                .filter(admin -> admin.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    public Admin findByEmail(String email) throws IOException {
        List<Admin> admins = findAll();
        return admins.stream()
                .filter(admin -> admin.getEmail().equals(email))
                .findFirst()
                .orElse(null);
    }

    public void save(Admin admin) throws IOException {
        List<Admin> admins = findAll();
        admins.add(admin);
        objectMapper.writeValue(file, admins);
    }

    public void update(Admin admin) throws IOException {
        List<Admin> admins = findAll();
        admins.removeIf(a -> a.getId().equals(admin.getId()));
        admins.add(admin);
        objectMapper.writeValue(file, admins);
    }

    public void delete(String adminId) throws IOException {
        List<Admin> admins = findAll();
        admins.removeIf(a -> a.getId().equals(adminId));
        objectMapper.writeValue(file, admins);
    }
} 