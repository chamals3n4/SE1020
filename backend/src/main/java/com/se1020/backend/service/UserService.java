package com.se1020.backend.service;

import com.se1020.backend.model.User;
import com.se1020.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository usersRepository;

    public List<User> getAllUsers() throws IOException {
        return usersRepository.findAll();
    }

    public void createUser(User user) throws IOException {
        usersRepository.save(user);
    }

    public void updateUser(User user) throws IOException {
        usersRepository.update(user);
    }

    public void deleteUser(String userId) throws IOException {
        usersRepository.delete(userId);
    }
}
