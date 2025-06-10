import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { ClothingItem, Category, Tag } from '../types';

// Local storage fallback for web
const localStorage: Record<string, string> = {};

// Helper for cross-platform storage
export const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage[key] || null;
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },
  
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage[key] = value;
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      delete localStorage[key];
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }
};

// Storage keys
const STORAGE_KEYS = {
  CLOTHING_ITEMS: 'clothing_items',
  CATEGORIES: 'categories',
  TAGS: 'tags',
};

// Default categories
const defaultCategories: Category[] = [
  { id: '1', name: 'Tops', icon: 'shirt', color: '#FF6B6B', count: 0 },
  { id: '2', name: 'Bottoms', icon: 'pants', color: '#4ECDC4', count: 0 },
  { id: '3', name: 'Outerwear', icon: 'jacket', color: '#1A535C', count: 0 },
  { id: '4', name: 'Shoes', icon: 'footprints', color: '#FF9F1C', count: 0 },
  { id: '5', name: 'Accessories', icon: 'watch', color: '#E76F51', count: 0 },
];

// Clothing items storage
export const clothingStorage = {
  async getItems(): Promise<ClothingItem[]> {
    const data = await storage.getItem(STORAGE_KEYS.CLOTHING_ITEMS);
    if (!data) return [];
    return JSON.parse(data);
  },
  
  async saveItems(items: ClothingItem[]): Promise<void> {
    await storage.setItem(STORAGE_KEYS.CLOTHING_ITEMS, JSON.stringify(items));
  },
  
  async addItem(item: ClothingItem): Promise<void> {
    const items = await this.getItems();
    items.push(item);
    await this.saveItems(items);
    
    // Update category count
    const categories = await categoryStorage.getCategories();
    const categoryIndex = categories.findIndex(c => c.name === item.category);
    if (categoryIndex >= 0) {
      categories[categoryIndex].count += 1;
      await categoryStorage.saveCategories(categories);
    }
  },
  
  async updateItem(updatedItem: ClothingItem): Promise<void> {
    const items = await this.getItems();
    const index = items.findIndex(item => item.id === updatedItem.id);
    
    if (index >= 0) {
      const oldCategory = items[index].category;
      items[index] = updatedItem;
      await this.saveItems(items);
      
      // Update category counts if category changed
      if (oldCategory !== updatedItem.category) {
        const categories = await categoryStorage.getCategories();
        
        const oldCategoryIndex = categories.findIndex(c => c.name === oldCategory);
        if (oldCategoryIndex >= 0 && categories[oldCategoryIndex].count > 0) {
          categories[oldCategoryIndex].count -= 1;
        }
        
        const newCategoryIndex = categories.findIndex(c => c.name === updatedItem.category);
        if (newCategoryIndex >= 0) {
          categories[newCategoryIndex].count += 1;
        }
        
        await categoryStorage.saveCategories(categories);
      }
    }
  },
  
  async removeItem(id: string): Promise<void> {
    const items = await this.getItems();
    const itemToRemove = items.find(item => item.id === id);
    
    if (itemToRemove) {
      const newItems = items.filter(item => item.id !== id);
      await this.saveItems(newItems);
      
      // Update category count
      const categories = await categoryStorage.getCategories();
      const categoryIndex = categories.findIndex(c => c.name === itemToRemove.category);
      if (categoryIndex >= 0 && categories[categoryIndex].count > 0) {
        categories[categoryIndex].count -= 1;
        await categoryStorage.saveCategories(categories);
      }
    }
  }
};

// Categories storage
export const categoryStorage = {
  async getCategories(): Promise<Category[]> {
    const data = await storage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!data) return defaultCategories;
    return JSON.parse(data);
  },
  
  async saveCategories(categories: Category[]): Promise<void> {
    await storage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },
  
  async addCategory(category: Category): Promise<void> {
    const categories = await this.getCategories();
    categories.push(category);
    await this.saveCategories(categories);
  },
  
  async updateCategory(updatedCategory: Category): Promise<void> {
    const categories = await this.getCategories();
    const index = categories.findIndex(category => category.id === updatedCategory.id);
    
    if (index >= 0) {
      categories[index] = updatedCategory;
      await this.saveCategories(categories);
    }
  },
  
  async removeCategory(id: string): Promise<void> {
    const categories = await this.getCategories();
    const newCategories = categories.filter(category => category.id !== id);
    await this.saveCategories(newCategories);
  },

  async initializeDefaultCategories(): Promise<void> {
    const existingCategories = await this.getCategories();
    if (existingCategories.length === 0) {
      await this.saveCategories(defaultCategories);
    }
  }
};

// Tags storage
export const tagStorage = {
  async getTags(): Promise<Tag[]> {
    const data = await storage.getItem(STORAGE_KEYS.TAGS);
    if (!data) return [];
    return JSON.parse(data);
  },
  
  async saveTags(tags: Tag[]): Promise<void> {
    await storage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
  },
  
  async addTag(tag: Tag): Promise<void> {
    const tags = await this.getTags();
    // Check if tag already exists
    if (!tags.some(t => t.name.toLowerCase() === tag.name.toLowerCase())) {
      tags.push(tag);
      await this.saveTags(tags);
    }
  }
};