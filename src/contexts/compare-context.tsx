"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface CompareItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  brand?: string;
}

interface CompareContextType {
  items: CompareItem[];
  addItem: (item: CompareItem) => void;
  removeItem: (id: string) => void;
  clearAll: () => void;
  isInCompare: (id: string) => boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isHydrated: boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const COMPARE_STORAGE_KEY = "coolmart_compare";
const MAX_COMPARE_ITEMS = 3;

export function CompareProvider({ children }: { children: ReactNode }) {
  // Start with empty array to match server render
  const [items, setItems] = useState<CompareItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage after hydration
  useEffect(() => {
    try {
      const stored = localStorage.getItem(COMPARE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed.slice(0, MAX_COMPARE_ITEMS));
        }
      }
    } catch (error) {
      console.error("Error loading compare from localStorage:", error);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage when items change (after hydration)
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error("Error saving compare to localStorage:", error);
      }
    }
  }, [items, isHydrated]);

  const addItem = (newItem: CompareItem) => {
    setItems((prev) => {
      // Check if already in list
      if (prev.some((item) => item.id === newItem.id)) {
        return prev;
      }
      // Check max items
      if (prev.length >= MAX_COMPARE_ITEMS) {
        // Remove first item, add new one
        return [...prev.slice(1), newItem];
      }
      return [...prev, newItem];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    setItems([]);
  };

  const isInCompare = (id: string) => {
    return items.some((item) => item.id === id);
  };

  return (
    <CompareContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearAll,
        isInCompare,
        isOpen,
        setIsOpen,
        isHydrated,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
