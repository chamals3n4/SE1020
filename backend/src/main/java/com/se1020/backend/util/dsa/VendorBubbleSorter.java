package com.se1020.backend.util.dsa;

import com.se1020.backend.model.Vendor;
import java.util.List;

/**
 * Implementation of Bubble Sort algorithm specifically for sorting vendors by price.
 * This class demonstrates the bubble sort algorithm in the context of vendor management.
 */
public class VendorBubbleSorter {
    
    /**
     * Sorts a list of vendors by their base price using bubble sort algorithm.
     *
     * @param vendors List of vendors to be sorted
     * @param ascending true for ascending order (lowest price first), false for descending order
     * @return Sorted list of vendors by base price
     */
    public static List<Vendor> sortByPrice(List<Vendor> vendors, boolean ascending) {
        if (vendors == null || vendors.isEmpty()) {
            return vendors;
        }

        int n = vendors.size();
        
        // Bubble sort implementation
        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;
            
            for (int j = 0; j < n - i - 1; j++) {
                // Compare adjacent vendors by their base price
                boolean shouldSwap = ascending ? 
                    vendors.get(j).getBasePrice() > vendors.get(j + 1).getBasePrice() :
                    vendors.get(j).getBasePrice() < vendors.get(j + 1).getBasePrice();
                
                if (shouldSwap) {
                    // Swap vendors
                    Vendor temp = vendors.get(j);
                    vendors.set(j, vendors.get(j + 1));
                    vendors.set(j + 1, temp);
                    swapped = true;
                }
            }
            
            // If no swapping occurred in this pass, array is already sorted
            if (!swapped) {
                break;
            }
        }
        
        return vendors;
    }
} 