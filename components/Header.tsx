import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search } from 'lucide-react-native';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showSearchButton?: boolean;
  onSearchPress?: () => void;
  backgroundColor?: string;
  textColor?: string;
}

export default function Header({
  title,
  showBackButton = false,
  showSearchButton = false,
  onSearchPress,
  backgroundColor = COLORS.white,
  textColor = COLORS.gray9,
}: HeaderProps) {
  const router = useRouter();
  
  return (
    <View style={[styles.header, { backgroundColor }]}>
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ArrowLeft size={24} color={textColor} />
          </TouchableOpacity>
        )}
      </View>
      
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      
      <View style={styles.rightContainer}>
        {showSearchButton && (
          <TouchableOpacity
            onPress={onSearchPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Search size={24} color={textColor} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray3,
  },
  leftContainer: {
    width: 40,
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: SIZES.small / 2,
  },
  title: {
    ...FONTS.h3,
    flex: 1,
    textAlign: 'center',
  },
});