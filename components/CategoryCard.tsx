import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, FONTS, SIZES, SHADOWS, SPACING } from '@/constants/theme';
import { Category } from '@/types';
import { Shirt, Tangent as Pants, Wind, Footprints, Watch } from 'lucide-react-native';

interface CategoryCardProps {
  category: Category;
  style?: ViewStyle;
}

export default function CategoryCard({ category, style }: CategoryCardProps) {
  const router = useRouter();
  
  const handlePress = () => {
    router.push(`/category/${category.id}`);
  };
  
  const getIcon = () => {
    switch (category.icon) {
      case 'shirt':
        return <Shirt size={24} color={COLORS.white} />;
      case 'pants':
        return <Pants size={24} color={COLORS.white} />;
      case 'jacket':
        return <Wind size={24} color={COLORS.white} />;
      case 'footprints':
        return <Footprints size={24} color={COLORS.white} />;
      case 'watch':
        return <Watch size={24} color={COLORS.white} />;
      default:
        return <Shirt size={24} color={COLORS.white} />;
    }
  };
  
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: category.color }, style]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Text style={styles.count}>{category.count}</Text>
      <Text style={styles.title}>{category.name}</Text>
      <TouchableOpacity style={styles.iconContainer}>
        {getIcon()}
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: SIZES.base,
    padding: SPACING.m,
    height: 120,
    marginBottom: SPACING.s,
    ...SHADOWS.small,
  },
  title: {
    ...FONTS.h4,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  count: {
    ...FONTS.h2,
    color: COLORS.white,
    position: 'absolute',
    top: SPACING.m,
    right: SPACING.m,
  },
  iconContainer: {
    position: 'absolute',
    bottom: SPACING.m,
    right: SPACING.m,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 999,
    padding: SPACING.xs,
  },
});