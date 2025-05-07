package com.se1020.backend.util;

public class VendorSorter {
    
    public VendorNode mergeSort(VendorNode head) {
        if (head == null || head.getNext() == null) {
            return head;
        }
        
        VendorNode middle = getMiddle(head);
        VendorNode nextOfMiddle = middle.getNext();
        middle.setNext(null);
        
        VendorNode left = mergeSort(head);
        VendorNode right = mergeSort(nextOfMiddle);
        
        return merge(left, right);
    }
    
    private VendorNode merge(VendorNode a, VendorNode b) {
        if (a == null) return b;
        if (b == null) return a;
        
        VendorNode result;
        
        // Sort by rating in descending order
        if (a.getVendor().getRating() >= b.getVendor().getRating()) {
            result = a;
            result.setNext(merge(a.getNext(), b));
        } else {
            result = b;
            result.setNext(merge(a, b.getNext()));
        }
        
        return result;
    }
    
    private VendorNode getMiddle(VendorNode head) {
        if (head == null) return head;
        
        VendorNode slow = head;
        VendorNode fast = head;
        
        while (fast.getNext() != null && fast.getNext().getNext() != null) {
            slow = slow.getNext();
            fast = fast.getNext().getNext();
        }
        
        return slow;
    }
}
