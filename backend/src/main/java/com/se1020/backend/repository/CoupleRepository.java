package com.se1020.backend.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.se1020.backend.model.Couple;
import org.springframework.stereotype.Repository;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class CoupleRepository {
    private static final String FILE_PATH = "src/main/resources/data/couples.json";
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final File file = new File(FILE_PATH);

    public List<Couple> findAll() throws IOException {
        if (!file.exists()) {
            file.getParentFile().mkdirs();
            file.createNewFile();
            objectMapper.writeValue(file, new ArrayList<Couple>());
            return new ArrayList<>();
        }
        
        if (file.length() == 0) {
            objectMapper.writeValue(file, new ArrayList<Couple>());
            return new ArrayList<>();
        }
        
        return objectMapper.readValue(file, new TypeReference<List<Couple>>() {});
    }

    public Couple findById(String id) throws IOException {
        List<Couple> couples = findAll();
        return couples.stream()
                .filter(couple -> couple.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    public void save(Couple couple) throws IOException {
        List<Couple> couples = findAll();
        couples.add(couple);
        objectMapper.writeValue(file, couples);
    }

    public void update(Couple couple) throws IOException {
        List<Couple> couples = findAll();
        couples.removeIf(c -> c.getId().equals(couple.getId()));
        couples.add(couple);
        objectMapper.writeValue(file, couples);
    }

    public void delete(String coupleId) throws IOException {
        List<Couple> couples = findAll();
        couples.removeIf(c -> c.getId().equals(coupleId));
        objectMapper.writeValue(file, couples);
    }
}
