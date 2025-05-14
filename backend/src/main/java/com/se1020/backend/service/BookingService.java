package com.se1020.backend.service;

import com.se1020.backend.model.Booking;
import com.se1020.backend.repository.BookingRepository;
import com.se1020.backend.repository.WeddingRepository;
import com.se1020.backend.repository.VendorRepository;
import com.se1020.backend.model.Wedding;
import com.se1020.backend.model.Vendor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private WeddingRepository weddingRepository;
    @Autowired
    private VendorRepository vendorRepository;

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

            // If this is a venue booking and confirmed, update the wedding location
            if ("CONFIRMED".equals(booking.getStatus().name())) {
                // Fetch the wedding
                Wedding wedding = weddingRepository.findById(booking.getWeddingId());
                if (wedding != null) {
                    // Fetch the vendor (venue)
                    Vendor vendor = vendorRepository.findById(booking.getVendorId());
                    if (vendor != null) {
                        wedding.setLocation(vendor.getName());
                        wedding.setAddress(vendor.getAddress());
                        weddingRepository.update(wedding);
                    }
                }
            }
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
