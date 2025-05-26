package com.se1020.backend.util.dsa;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.se1020.backend.model.Vendor;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

// Linked list implementation for managing vendors.

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

    // New method to convert to JSON string
    public String toJson() throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        List<Vendor> vendorList = new ArrayList<>();
        VendorNode current = head;
        while (current != null) {
            vendorList.add(current.getVendor());
            current = current.getNext();
        }
        return mapper.writeValueAsString(vendorList);
    }

    // New method to create from JSON string
    public static VendorLinkedList fromJson(String json) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        List<Vendor> vendorList = mapper.readValue(json, new TypeReference<List<Vendor>>() {});
        VendorLinkedList list = new VendorLinkedList();
        for (Vendor vendor : vendorList) {
            list.addVendor(vendor);
        }
        return list;
    }

    // New method to get all vendors as array
    public Vendor[] toArray() {
        Vendor[] vendors = new Vendor[size];
        VendorNode current = head;
        int index = 0;
        while (current != null) {
            vendors[index++] = current.getVendor();
            current = current.getNext();
        }
        return vendors;
    }
}
