import { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Heart } from 'lucide-react-native';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store';
import Screen from '@/components/Screen';
import Header from '@/components/Header';
import ClothingItem from '@/components/ClothingItem';

export default function FavoritesScreen() {
  const { items, fetchItems } = useAppStore(state => ({
    items: state.items.filter(item => item.isFavorite),
    fetchItems: state.fetchItems,
  }));
  
  // Refresh data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchItems();
    }, [])
  );
  
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Heart size={56} color={COLORS.gray4} />
      <Text style={styles.emptyTitle}>No favorites yet</Text>
      <Text style={styles.emptyText}>
        Mark items as favorites to find them quickly here.
      </Text>
    </View>
  );
  
  return (
    <Screen scrollable={false} padding={false}>
      <Header title="Favorites" />
      
      <View style={styles.container}>
        {items.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={items}
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
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginTop: SPACING.m,
    marginBottom: SPACING.s,
  },
  emptyText: {
    ...FONTS.body2,
    color: COLORS.gray6,
    textAlign: 'center',
  },
});