import { create } from 'zustand';
import { ClothingItem, Category, Tag } from '../types';
import { clothingStorage, categoryStorage, tagStorage } from '../utils/storage';

interface AppState {
  items: ClothingItem[];
  categories: Category[];
  tags: Tag[];
  isLoading: boolean;
  
  // Items actions
  fetchItems: () => Promise<void>;
  addItem: (item: ClothingItem) => Promise<void>;
  updateItem: (item: ClothingItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  
  // Categories actions
  fetchCategories: () => Promise<void>;
  addCategory: (category: Category) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
  
  // Tags actions
  fetchTags: () => Promise<void>;
  addTag: (tag: Tag) => Promise<void>;
  
  // Loading
  setLoading: (isLoading: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  items: [],
  categories: [],
  tags: [],
  isLoading: false,
  
  // Item actions
  fetchItems: async () => {
    set({ isLoading: true });
    try {
      const items = await clothingStorage.getItems();
      set({ items });
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  addItem: async (item: ClothingItem) => {
    set({ isLoading: true });
    try {
      await clothingStorage.addItem(item);
      set(state => ({ 
        items: [...state.items, item] 
      }));
      await get().fetchCategories(); // Refresh categories to update counts
    } catch (error) {
      console.error('Failed to add item:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateItem: async (item: ClothingItem) => {
    set({ isLoading: true });
    try {
      await clothingStorage.updateItem(item);
      set(state => ({
        items: state.items.map(i => i.id === item.id ? item : i)
      }));
      await get().fetchCategories(); // Refresh categories to update counts
    } catch (error) {
      console.error('Failed to update item:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  removeItem: async (id: string) => {
    set({ isLoading: true });
    try {
      await clothingStorage.removeItem(id);
      set(state => ({
        items: state.items.filter(item => item.id !== id)
      }));
      await get().fetchCategories(); // Refresh categories to update counts
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  toggleFavorite: async (id: string) => {
    const { items } = get();
    const item = items.find(item => item.id === id);
    if (item) {
      const updatedItem = { ...item, isFavorite: !item.isFavorite };
      await get().updateItem(updatedItem);
    }
  },
  
  // Category actions
  fetchCategories: async () => {
    try {
      const categories = await categoryStorage.getCategories();
      set({ categories });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  },
  
  addCategory: async (category: Category) => {
    set({ isLoading: true });
    try {
      await categoryStorage.addCategory(category);
      set(state => ({ 
        categories: [...state.categories, category] 
      }));
    } catch (error) {
      console.error('Failed to add category:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateCategory: async (category: Category) => {
    set({ isLoading: true });
    try {
      await categoryStorage.updateCategory(category);
      set(state => ({
        categories: state.categories.map(c => c.id === category.id ? category : c)
      }));
    } catch (error) {
      console.error('Failed to update category:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  removeCategory: async (id: string) => {
    set({ isLoading: true });
    try {
      await categoryStorage.removeCategory(id);
      set(state => ({
        categories: state.categories.filter(category => category.id !== id)
      }));
    } catch (error) {
      console.error('Failed to remove category:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  // Tag actions
  fetchTags: async () => {
    try {
      const tags = await tagStorage.getTags();
      set({ tags });
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  },
  
  addTag: async (tag: Tag) => {
    try {
      await tagStorage.addTag(tag);
      set(state => {
        // Only add if it doesn't already exist
        if (!state.tags.some(t => t.name.toLowerCase() === tag.name.toLowerCase())) {
          return { tags: [...state.tags, tag] };
        }
        return { tags: state.tags };
      });
    } catch (error) {
      console.error('Failed to add tag:', error);
    }
  },
  
  // Loading state
  setLoading: (isLoading: boolean) => set({ isLoading })
}));