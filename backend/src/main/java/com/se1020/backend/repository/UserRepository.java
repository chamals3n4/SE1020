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
public class UserRepository {
    private static final String FILE_PATH = "src/main/resources/data/users.json";
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

    public void save(User user) throws IOException {
        List<User> users = findAll();
        
        // Check if user already exists
        boolean exists = users.stream()
                .anyMatch(u -> u.getId().equals(user.getId()));
        
        if (!exists) {
            users.add(user);
            objectMapper.writeValue(file, users);
        }
    }

    public void update(User user) throws IOException {
        List<User> users = findAll();
        users.removeIf(u -> u.getId().equals(user.getId()));
        users.add(user);
        objectMapper.writeValue(file, users);
    }

    public void delete(String userId) throws IOException {
        List<User> users = findAll();
        users.removeIf(u -> u.getId().equals(userId));
        objectMapper.writeValue(file, users);
    }
}
