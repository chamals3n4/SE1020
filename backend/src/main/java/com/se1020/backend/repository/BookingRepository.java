package com.se1020.backend.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.se1020.backend.model.Booking;
import org.springframework.stereotype.Repository;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class BookingRepository {
    private static final String FILE_PATH = "src/main/resources/data/bookings.json";
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final File file = new File(FILE_PATH);

    public List<Booking> findAll() throws IOException {
        if (!file.exists()) {
            file.getParentFile().mkdirs();
            file.createNewFile();
            objectMapper.writeValue(file, new ArrayList<Booking>());
            return new ArrayList<>();
        }
        
        if (file.length() == 0) {
            objectMapper.writeValue(file, new ArrayList<Booking>());
            return new ArrayList<>();
        }
        
        return objectMapper.readValue(file, new TypeReference<List<Booking>>() {});
    }

    public Booking findById(String id) throws IOException {
        List<Booking> bookings = findAll();
        return bookings.stream()
                .filter(booking -> booking.getBookingId().equals(id))
                .findFirst()
                .orElse(null);
    }

    public void save(Booking booking) throws IOException {
        List<Booking> bookings = findAll();
        bookings.add(booking);
        objectMapper.writeValue(file, bookings);
    }

    public void update(Booking booking) throws IOException {
        List<Booking> bookings = findAll();
        bookings.removeIf(b -> b.getBookingId().equals(booking.getBookingId()));
        bookings.add(booking);
        objectMapper.writeValue(file, bookings);
    }

    public void delete(String bookingId) throws IOException {
        List<Booking> bookings = findAll();
        bookings.removeIf(b -> b.getBookingId().equals(bookingId));
        objectMapper.writeValue(file, bookings);
    }
}
