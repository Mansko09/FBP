import { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  Keyboard 
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search...',
  autoFocus = false,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleClear = () => {
    onChangeText('');
    Keyboard.dismiss();
  };
  
  return (
    <View style={[
      styles.container,
      isFocused && styles.containerFocused
    ]}>
      <Search size={20} color={COLORS.gray6} style={styles.searchIcon} />
      
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.gray5}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus={autoFocus}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      
      {value.length > 0 && (
        <TouchableOpacity 
          onPress={handleClear}
          style={styles.clearButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={16} color={COLORS.gray6} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    borderWidth: 1,
    borderColor: COLORS.gray3,
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.m,
  },
  containerFocused: {
    borderColor: COLORS.primary,
  },
  searchIcon: {
    marginRight: SPACING.xs,
  },
  input: {
    flex: 1,
    ...FONTS.body2,
    color: COLORS.gray9,
    padding: 0,
  },
  clearButton: {
    padding: SPACING.xs / 2,
  },
});