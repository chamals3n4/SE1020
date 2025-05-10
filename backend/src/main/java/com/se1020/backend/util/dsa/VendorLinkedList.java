package com.se1020.backend.util.dsa;

import com.se1020.backend.model.Vendor;

/**
 * Linked list implementation for managing vendors.
 * This class implements a basic linked list data structure for the OOP course.
 */
public class VendorLinkedList {
    private VendorNode head;
    private int size;

    public VendorLinkedList() {
        this.head = null;
        this.size = 0;
    }

    public VendorNode getHead() {
        return head;
    }

    public int getSize() {
        return size;
    }

    public void addVendor(Vendor vendor) {
        VendorNode newNode = new VendorNode(vendor);
        if (head == null) {
            head = newNode;
        } else {
            VendorNode current = head;
            while (current.getNext() != null) {
                current = current.getNext();
            }
            current.setNext(newNode);
        }
        size++;
    }

    public void removeVendor(String vendorId) {
        if (head == null) {
            return;
        }

        if (head.getVendor().getId().equals(vendorId)) {
            head = head.getNext();
            size--;
            return;
        }

        VendorNode current = head;
        while (current.getNext() != null && !current.getNext().getVendor().getId().equals(vendorId)) {
            current = current.getNext();
        }

        if (current.getNext() != null) {
            current.setNext(current.getNext().getNext());
            size--;
        }
    }

    public Vendor getVendorById(String vendorId) {
        VendorNode current = head;
        while (current != null) {
            if (current.getVendor().getId().equals(vendorId)) {
                return current.getVendor();
            }
            current = current.getNext();
        }
        return null;
    }
}
