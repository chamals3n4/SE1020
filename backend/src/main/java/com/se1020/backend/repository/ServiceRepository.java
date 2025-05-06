package com.se1020.backend.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.se1020.backend.model.Service;
import org.springframework.stereotype.Repository;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class ServiceRepository {
    private static final String FILE_PATH = "src/main/resources/data/services.json";
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final File file = new File(FILE_PATH);

    public List<Service> findAll() throws IOException {
        if (!file.exists()) {
            file.getParentFile().mkdirs();
            file.createNewFile();
            objectMapper.writeValue(file, new ArrayList<Service>());
            return new ArrayList<>();
        }
        
        if (file.length() == 0) {
            objectMapper.writeValue(file, new ArrayList<Service>());
            return new ArrayList<>();
        }
        
        return objectMapper.readValue(file, new TypeReference<List<Service>>() {});
    }

    public Service findById(String id) throws IOException {
        List<Service> services = findAll();
        return services.stream()
                .filter(service -> service.getServiceId().equals(id))
                .findFirst()
                .orElse(null);
    }

    public void save(Service service) throws IOException {
        List<Service> services = findAll();
        services.add(service);
        objectMapper.writeValue(file, services);
    }

    public void update(Service service) throws IOException {
        List<Service> services = findAll();
        services.removeIf(s -> s.getServiceId().equals(service.getServiceId()));
        services.add(service);
        objectMapper.writeValue(file, services);
    }

    public void delete(String serviceId) throws IOException {
        List<Service> services = findAll();
        services.removeIf(s -> s.getServiceId().equals(serviceId));
        objectMapper.writeValue(file, services);
    }
}
