import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Plus, Search } from 'lucide-react-native';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store';
import Screen from '@/components/Screen';
import Header from '@/components/Header';
import ClothingItem from '@/components/ClothingItem';
import SearchBar from '@/components/SearchBar';
import Button from '@/components/Button';

export default function WardrobeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  const { items, categories, isLoading, fetchItems, fetchCategories } = useAppStore(state => ({
    items: state.items,
    categories: state.categories,
    isLoading: state.isLoading,
    fetchItems: state.fetchItems,
    fetchCategories: state.fetchCategories,
  }));
  
  // Refresh data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchItems();
      fetchCategories();
    }, [])
  );
  
  const filteredItems = items.filter(item => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const matchesName = item.name.toLowerCase().includes(query);
    const matchesCategory = item.category.toLowerCase().includes(query);
    const matchesTags = item.tags?.some(tag => tag.toLowerCase().includes(query));
    
    return matchesName || matchesCategory || matchesTags;
  });
  
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
    }
  };
  
  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      );
    }
    
    // Empty state with search results
    if (searchQuery && filteredItems.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No items found</Text>
          <Text style={styles.emptyText}>
            Try a different search term or add new items to your wardrobe.
          </Text>
        </View>
      );
    }
    
    // Empty state for wardrobe
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Your wardrobe is empty</Text>
        <Text style={styles.emptyText}>
          Start adding your clothing items to organize your wardrobe.
        </Text>
        <Button
          title="Add First Item"
          onPress={() => router.push('/add')}
          icon={<Plus size={20} color={COLORS.white} />}
          style={styles.addButton}
        />
      </View>
    );
  };
  
  return (
    <Screen scrollable={false} padding={false}>
      <Header 
        title="My Wardrobe" 
        showSearchButton={true}
        onSearchPress={toggleSearch}
      />
      
      <View style={styles.container}>
        {showSearch && (
          <View style={styles.searchContainer}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search clothes..."
              autoFocus
            />
          </View>
        )}
        
        {items.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {filteredItems.length === 0 ? (
              renderEmptyState()
            ) : (
              <FlatList
                data={filteredItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                  <ClothingItem item={item} index={index} />
                )}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              />
            )}
          </>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: SPACING.m,
    paddingTop: SPACING.s,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.s,
  },
  listContent: {
    paddingVertical: SPACING.s,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.l,
  },
  emptyTitle: {
    ...FONTS.h3,
    color: COLORS.gray8,
    marginBottom: SPACING.s,
  },
  emptyText: {
    ...FONTS.body2,
    color: COLORS.gray6,
    textAlign: 'center',
    marginBottom: SPACING.m,
  },
  addButton: {
    marginTop: SPACING.m,
  },
});