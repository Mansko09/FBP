import { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  Keyboard
} from 'react-native';
import { X } from 'lucide-react-native';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store';

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export default function TagInput({ tags, onTagsChange }: TagInputProps) {
  const [tagInput, setTagInput] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const allTags = useAppStore(state => state.tags);
  
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (!trimmedTag) return;
    
    // Check if tag already exists
    if (!tags.includes(trimmedTag)) {
      const newTags = [...tags, trimmedTag];
      onTagsChange(newTags);
      
      // Add to global tags if it's a new tag
      if (!allTags.some(t => t.name.toLowerCase() === trimmedTag.toLowerCase())) {
        useAppStore.getState().addTag({ id: Date.now().toString(), name: trimmedTag });
      }
    }
    
    setTagInput('');
  };
  
  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    onTagsChange(newTags);
  };
  
  const handleSubmit = () => {
    if (tagInput.trim()) {
      addTag(tagInput);
    }
  };
  
  const handleTagPress = (tag: string) => {
    addTag(tag);
  };
  
  const filteredSuggestions = allTags
    .filter(tag => 
      tagInput.trim() !== '' && 
      tag.name.toLowerCase().includes(tagInput.toLowerCase()) && 
      !tags.includes(tag.name)
    )
    .slice(0, 5);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tags</Text>
      
      <View style={styles.inputContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tagsScrollView}
          contentContainerStyle={styles.tagsContainer}
        >
          {tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
              <TouchableOpacity onPress={() => removeTag(index)} style={styles.removeButton}>
                <X size={14} color={COLORS.gray7} />
              </TouchableOpacity>
            </View>
          ))}
          
          <TextInput
            ref={inputRef}
            style={[styles.input, { width: tagInput ? tagInput.length * 12 + 20 : 100 }]}
            value={tagInput}
            onChangeText={setTagInput}
            placeholder={tags.length > 0 ? "" : "Add tags..."}
            placeholderTextColor={COLORS.gray5}
            returnKeyType="done"
            blurOnSubmit={false}
            onSubmitEditing={handleSubmit}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => {
              // Short delay to allow tag selections to register
              setTimeout(() => setIsInputFocused(false), 150);
            }}
          />
        </ScrollView>
      </View>
      
      {isInputFocused && filteredSuggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {filteredSuggestions.map((tag) => (
            <TouchableOpacity
              key={tag.id}
              style={styles.suggestionItem}
              onPress={() => handleTagPress(tag.name)}
            >
              <Text style={styles.suggestionText}>{tag.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.m,
  },
  label: {
    ...FONTS.body2,
    color: COLORS.gray8,
    marginBottom: SPACING.xs,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: COLORS.gray4,
    borderRadius: SIZES.base,
    backgroundColor: COLORS.white,
  },
  tagsScrollView: {
    maxHeight: 80,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    padding: SPACING.xs,
  },
  tag: {
    backgroundColor: COLORS.gray2,
    borderRadius: SIZES.base * 2,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
    paddingLeft: 10,
    paddingRight: 4,
    paddingVertical: 6,
  },
  tagText: {
    ...FONTS.body3,
    color: COLORS.gray8,
    marginRight: 4,
  },
  removeButton: {
    padding: 2,
  },
  input: {
    ...FONTS.body2,
    color: COLORS.gray8,
    padding: 8,
    minWidth: 100,
    marginBottom: 8,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    borderWidth: 1,
    borderColor: COLORS.gray3,
    zIndex: 10,
    ...SHADOWS.medium,
  },
  suggestionItem: {
    padding: SPACING.s,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray3,
  },
  suggestionText: {
    ...FONTS.body2,
    color: COLORS.gray8,
  },
});