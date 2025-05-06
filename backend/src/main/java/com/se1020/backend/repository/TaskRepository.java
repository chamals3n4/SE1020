package com.se1020.backend.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.se1020.backend.model.Task;
import org.springframework.stereotype.Repository;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class TaskRepository {
    private static final String FILE_PATH = "src/main/resources/data/tasks.json";
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final File file = new File(FILE_PATH);

    public List<Task> findAll() throws IOException {
        if (!file.exists()) {
            file.getParentFile().mkdirs();
            file.createNewFile();
            objectMapper.writeValue(file, new ArrayList<Task>());
            return new ArrayList<>();
        }
        
        if (file.length() == 0) {
            objectMapper.writeValue(file, new ArrayList<Task>());
            return new ArrayList<>();
        }
        
        return objectMapper.readValue(file, new TypeReference<List<Task>>() {});
    }

    public Task findById(String id) throws IOException {
        List<Task> tasks = findAll();
        return tasks.stream()
                .filter(task -> task.getTaskId().equals(id))
                .findFirst()
                .orElse(null);
    }

    public void save(Task task) throws IOException {
        List<Task> tasks = findAll();
        tasks.add(task);
        objectMapper.writeValue(file, tasks);
    }

    public void update(Task task) throws IOException {
        List<Task> tasks = findAll();
        tasks.removeIf(t -> t.getTaskId().equals(task.getTaskId()));
        tasks.add(task);
        objectMapper.writeValue(file, tasks);
    }

    public void delete(String taskId) throws IOException {
        List<Task> tasks = findAll();
        tasks.removeIf(t -> t.getTaskId().equals(taskId));
        objectMapper.writeValue(file, tasks);
    }
}
