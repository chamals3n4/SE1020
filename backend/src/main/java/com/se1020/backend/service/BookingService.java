package com.se1020.backend.service;

import com.se1020.backend.model.Booking;
import com.se1020.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    public List<Booking> getAllBookings() throws IOException {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(String id) throws IOException {
        return bookingRepository.findById(id);
    }

    public void createBooking(Booking booking) throws IOException {
        bookingRepository.save(booking);
    }

    public void updateBooking(Booking booking) throws IOException {
        bookingRepository.update(booking);
    }

    public void deleteBooking(String bookingId) throws IOException {
        bookingRepository.delete(bookingId);
    }
    
    public void confirmBooking(String bookingId) throws IOException {
        Booking booking = getBookingById(bookingId);
        if (booking != null) {
            booking.confirmBooking();
            updateBooking(booking);
        }
    }
    
    public void cancelBooking(String bookingId) throws IOException {
        Booking booking = getBookingById(bookingId);
        if (booking != null) {
            booking.cancelBooking();
            updateBooking(booking);
        }
    }
}
