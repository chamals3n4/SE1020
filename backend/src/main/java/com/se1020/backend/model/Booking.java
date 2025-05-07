package com.se1020.backend.model;

import com.se1020.backend.enums.BookingStatus;
import java.util.Date;

public class Booking {
    private String bookingId;
    private String coupleId;      // Link to the couple who made this booking
    private String vendorId;      // Link to the vendor providing the service
    private String serviceId;     // Link to the specific service being booked
    private Date date;
    private BookingStatus status;
    private double totalCost;
    
    public Booking() {
    }
    
    public Booking(String bookingId, String coupleId, String vendorId, String serviceId, Date date, BookingStatus status, double totalCost) {
        this.bookingId = bookingId;
        this.coupleId = coupleId;
        this.vendorId = vendorId;
        this.serviceId = serviceId;
        this.date = date;
        this.status = status;
        this.totalCost = totalCost;
    }
    
    public String getBookingId() {
        return bookingId;
    }
    
    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }
    
    public Date getDate() {
        return date;
    }
    
    public void setDate(Date date) {
        this.date = date;
    }
    
    public BookingStatus getStatus() {
        return status;
    }
    
    public void setStatus(BookingStatus status) {
        this.status = status;
    }
    
    public double getTotalCost() {
        return totalCost;
    }
    
    public void setTotalCost(double totalCost) {
        this.totalCost = totalCost;
    }
    
    public String getCoupleId() {
        return coupleId;
    }
    
    public void setCoupleId(String coupleId) {
        this.coupleId = coupleId;
    }
    
    public String getVendorId() {
        return vendorId;
    }
    
    public void setVendorId(String vendorId) {
        this.vendorId = vendorId;
    }
    
    public String getServiceId() {
        return serviceId;
    }
    
    public void setServiceId(String serviceId) {
        this.serviceId = serviceId;
    }
    
    // Methods from UML
    public void confirmBooking() {
        this.status = BookingStatus.CONFIRMED;
    }
    
    public void cancelBooking() {
        this.status = BookingStatus.CANCELLED;
    }
    
    public void generateInvoice() {
        // Implementation to generate an invoice for the booking
    }
    
    public void processPayment() {
        // Implementation for payment processing
    }
}
