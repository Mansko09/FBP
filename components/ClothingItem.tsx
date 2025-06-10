import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Heart } from 'lucide-react-native';
import { COLORS, FONTS, SIZES, SHADOWS, SPACING } from '@/constants/theme';
import { ClothingItem as ClothingItemType } from '@/types';
import { useAppStore } from '@/store';

interface ClothingItemProps {
  item: ClothingItemType;
  index?: number;
}

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - SPACING.m * 3) / 2;

export default function ClothingItem({ item, index = 0 }: ClothingItemProps) {
  const router = useRouter();
  const toggleFavorite = useAppStore(state => state.toggleFavorite);
  
  const handlePress = () => {
    router.push(`/item/${item.id}`);
  };
  
  const handleFavoritePress = () => {
    toggleFavorite(item.id);
  };
  
  return (
    <Animated.View 
      entering={FadeIn.delay(index * 100).duration(300)}
      style={styles.container}
    >
      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={handlePress}
        style={styles.card}
      >
        <Image 
          source={{ uri: item.imageUri }} 
          style={styles.image}
          resizeMode="cover"
        />
        
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={handleFavoritePress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Heart 
            size={20} 
            color={item.isFavorite ? COLORS.accent : COLORS.gray5}
            fill={item.isFavorite ? COLORS.accent : 'none'}
          />
        </TouchableOpacity>
        
        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          
          <View style={styles.categoryContainer}>
            <Text style={styles.category}>{item.category}</Text>
          </View>
          
          {item.tags && item.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {item.tags.slice(0, 2).map((tag, idx) => (
                <View key={idx} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
              {item.tags.length > 2 && (
                <Text style={styles.moreTags}>+{item.tags.length - 2}</Text>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: COLUMN_WIDTH,
    margin: SPACING.xs,
  },
  card: {
    borderRadius: SIZES.base,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  image: {
    width: '100%',
    height: COLUMN_WIDTH,
    backgroundColor: COLORS.gray3,
  },
  favoriteButton: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    backgroundColor: COLORS.white,
    borderRadius: 999,
    padding: SPACING.xs - 2,
    ...SHADOWS.small,
  },
  content: {
    padding: SPACING.xs,
  },
  name: {
    ...FONTS.body2,
    color: COLORS.gray9,
    marginBottom: 4,
  },
  categoryContainer: {
    marginBottom: 4,
  },
  category: {
    ...FONTS.caption,
    color: COLORS.gray7,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: COLORS.gray2,
    borderRadius: SIZES.base * 2,
    paddingHorizontal: SPACING.xs - 2,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 4,
  },
  tagText: {
    ...FONTS.caption,
    color: COLORS.gray7,
  },
  moreTags: {
    ...FONTS.caption,
    color: COLORS.gray6,
    marginLeft: 2,
  },
});