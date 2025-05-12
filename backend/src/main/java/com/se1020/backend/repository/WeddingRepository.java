package com.se1020.backend.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.se1020.backend.model.Wedding;
import org.springframework.stereotype.Repository;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class WeddingRepository {
    private static final String FILE_PATH = "src/main/resources/data/weddings.json";
    private final ObjectMapper objectMapper = new ObjectMapper()
        .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    private final File file = new File(FILE_PATH);

    public List<Wedding> findAll() throws IOException {
        if (!file.exists()) {
            file.getParentFile().mkdirs();
            file.createNewFile();
            objectMapper.writeValue(file, new ArrayList<Wedding>());
            return new ArrayList<>();
        }
        
        if (file.length() == 0) {
            objectMapper.writeValue(file, new ArrayList<Wedding>());
            return new ArrayList<>();
        }
        
        return objectMapper.readValue(file, new TypeReference<List<Wedding>>() {});
    }

    public Wedding findById(String id) throws IOException {
        List<Wedding> weddings = findAll();
        return weddings.stream()
                .filter(wedding -> wedding.getWeddingId().equals(id))
                .findFirst()
                .orElse(null);
    }

    public void save(Wedding wedding) throws IOException {
        List<Wedding> weddings = findAll();
        // Check if wedding already exists
        boolean exists = weddings.stream()
                .anyMatch(w -> w.getWeddingId().equals(wedding.getWeddingId()));
        
        if (!exists) {
            weddings.add(wedding);
            objectMapper.writeValue(file, weddings);
        }
    }

    public void update(Wedding wedding) throws IOException {
        List<Wedding> weddings = findAll();
        weddings.removeIf(w -> w.getWeddingId().equals(wedding.getWeddingId()));
        weddings.add(wedding);
        objectMapper.writeValue(file, weddings);
    }

    public void delete(String weddingId) throws IOException {
        List<Wedding> weddings = findAll();
        weddings.removeIf(w -> w.getWeddingId().equals(weddingId));
        objectMapper.writeValue(file, weddings);
    }
}
