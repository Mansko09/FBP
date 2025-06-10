import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store';
import Screen from '@/components/Screen';
import Header from '@/components/Header';
import ClothingItem from '@/components/ClothingItem';
import SearchBar from '@/components/SearchBar';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { categories, items } = useAppStore(state => ({
    categories: state.categories,
    items: state.items,
  }));
  
  const [category, setCategory] = useState(categories.find(c => c.id === id) || null);
  
  // Update category when store changes
  useEffect(() => {
    const foundCategory = categories.find(c => c.id === id);
    if (foundCategory) {
      setCategory(foundCategory);
    }
  }, [id, categories]);
  
  if (!category) {
    return (
      <Screen>
        <Header title="Category" showBackButton />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Category not found</Text>
        </View>
      </Screen>
    );
  }
  
  // Filter items by category and search query
  const filteredItems = items.filter(item => {
    const matchesCategory = item.category === category.name;
    
    if (!searchQuery) return matchesCategory;
    
    const query = searchQuery.toLowerCase();
    const matchesName = item.name.toLowerCase().includes(query);
    const matchesTags = item.tags?.some(tag => tag.toLowerCase().includes(query));
    
    return matchesCategory && (matchesName || matchesTags);
  });
  
  return (
    <Screen scrollable={false} padding={false}>
      <Header 
        title={category.name} 
        showBackButton 
        backgroundColor={category.color}
        textColor={COLORS.white}
      />
      
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={`Search in ${category.name}...`}
        />
      </View>
      
      {filteredItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No items found</Text>
          <Text style={styles.emptyText}>
            {searchQuery 
              ? `Try a different search term or add items to the "${category.name}" category.`
              : `You don't have any items in the "${category.name}" category yet.`
            }
          </Text>
        </View>
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
    </Screen>
  );
}

const styles = StyleSheet.create({
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
  },
});