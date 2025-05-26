package com.se1020.backend.util.dsa;

import com.se1020.backend.model.Vendor;

// Implementation of Bubble Sort algorithm for sorting vendors by price.
public class VendorBubbleSorter {

    public static VendorLinkedList sortByPrice(VendorLinkedList vendors, boolean ascending) {
        if (vendors == null || vendors.getSize() == 0) {
            return vendors;
        }

        VendorNode current = vendors.getHead();
        while (current != null) {
            VendorNode next = current.getNext();
            while (next != null) {
                boolean shouldSwap = ascending ? current.getVendor().getBasePrice() > next.getVendor().getBasePrice()
                        : current.getVendor().getBasePrice() < next.getVendor().getBasePrice();

                if (shouldSwap) {
                    // Swap vendors
                    Vendor temp = current.getVendor();
                    current.setVendor(next.getVendor());
                    next.setVendor(temp);
                }
                next = next.getNext();
            }
            current = current.getNext();
        }

        return vendors;
    }
}