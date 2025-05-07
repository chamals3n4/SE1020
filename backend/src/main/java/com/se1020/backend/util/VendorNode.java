package com.se1020.backend.util;

import com.se1020.backend.model.Vendor;

public class VendorNode {
    private Vendor vendor;
    private VendorNode next;
    
    public VendorNode(Vendor vendor) {
        this.vendor = vendor;
        this.next = null;
    }
    
    public Vendor getVendor() {
        return vendor;
    }
    
    public void setVendor(Vendor vendor) {
        this.vendor = vendor;
    }
    
    public VendorNode getNext() {
        return next;
    }
    
    public void setNext(VendorNode next) {
        this.next = next;
    }
}
