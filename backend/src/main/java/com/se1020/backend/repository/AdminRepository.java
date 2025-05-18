package com.se1020.backend.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.se1020.backend.model.User;
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

    public List<User> findAll() throws IOException {
        if (!file.exists()) {
            file.getParentFile().mkdirs();
            file.createNewFile();
            objectMapper.writeValue(file, new ArrayList<User>());
            return new ArrayList<>();
        }
        
        if (file.length() == 0) {
            objectMapper.writeValue(file, new ArrayList<User>());
            return new ArrayList<>();
        }
        
        return objectMapper.readValue(file, new TypeReference<List<User>>() {});
    }

    public User findById(String id) throws IOException {
        List<User> admins = findAll();
        return admins.stream()
                .filter(admin -> admin.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    public User findByEmail(String email) throws IOException {
        List<User> admins = findAll();
        return admins.stream()
                .filter(admin -> admin.getEmail().equals(email))
                .findFirst()
                .orElse(null);
    }

    public void save(User admin) throws IOException {
        List<User> admins = findAll();
        admins.add(admin);
        objectMapper.writeValue(file, admins);
    }

    public void update(User admin) throws IOException {
        List<User> admins = findAll();
        admins.removeIf(a -> a.getId().equals(admin.getId()));
        admins.add(admin);
        objectMapper.writeValue(file, admins);
    }

    public void delete(String adminId) throws IOException {
        List<User> admins = findAll();
        admins.removeIf(a -> a.getId().equals(adminId));
        objectMapper.writeValue(file, admins);
    }
} 