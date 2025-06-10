import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Alert, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pencil, Heart, Trash, Tag } from 'lucide-react-native';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store';
import { ClothingItem } from '@/types';
import { useImagePicker } from '@/hooks/useImagePicker';
import Screen from '@/components/Screen';
import Header from '@/components/Header';
import Button from '@/components/Button';
import TagInput from '@/components/TagInput';

export default function ItemDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const { 
    items, 
    categories, 
    fetchItems,
    updateItem,
    removeItem,
    toggleFavorite 
  } = useAppStore(state => ({
    items: state.items,
    categories: state.categories,
    fetchItems: state.fetchItems,
    updateItem: state.updateItem,
    removeItem: state.removeItem,
    toggleFavorite: state.toggleFavorite,
  }));
  
  const { image, loading, pickImage, takePhoto, resetImage } = useImagePicker();
  
  const [item, setItem] = useState<ClothingItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [brand, setBrand] = useState('');
  
  // Load item data
  useEffect(() => {
    fetchItems().then(() => {
      const foundItem = items.find(item => item.id === id);
      if (foundItem) {
        setItem(foundItem);
        // Initialize form data
        setName(foundItem.name);
        setSelectedCategory(foundItem.category);
        setTags(foundItem.tags || []);
        setNotes(foundItem.notes || '');
        setBrand(foundItem.brand || '');
      }
    });
  }, [id]);
  
  const handleImageCapture = async () => {
    Alert.alert(
      'Change Photo',
      'Choose a method to change the photo',
      [
        {
          text: 'Take Photo',
          onPress: takePhoto,
        },
        {
          text: 'Choose from Library',
          onPress: pickImage,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              if (item) {
                await removeItem(item.id);
                router.back();
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete item. Please try again.');
            }
          }
        }
      ]
    );
  };
  
  const handleToggleFavorite = async () => {
    if (item) {
      await toggleFavorite(item.id);
      // Update local state for immediate UI feedback
      setItem(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
  };
  
  const handleSave = async () => {
    if (!item) return;
    
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name for your item');
      return;
    }
    
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    
    try {
      const updatedItem: ClothingItem = {
        ...item,
        name: name.trim(),
        imageUri: image || item.imageUri,
        category: selectedCategory,
        tags,
        notes,
        brand: brand.trim(),
      };
      
      await updateItem(updatedItem);
      setItem(updatedItem);
      setIsEditing(false);
      resetImage();
    } catch (error) {
      Alert.alert('Error', 'Could not save changes. Please try again.');
    }
  };
  
  if (!item) {
    return (
      <Screen>
        <Header title="Item Details" showBackButton />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </Screen>
    );
  }
  
  return (
    <Screen scrollable={false} padding={false}>
      <Header 
        title={isEditing ? "Edit Item" : item.name} 
        showBackButton 
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: image || item.imageUri }} 
            style={styles.image}
            resizeMode="cover"
          />
          
          {isEditing ? (
            <View style={styles.editImageButtonContainer}>
              <Button
                title="Change Photo"
                onPress={handleImageCapture}
                type="primary"
                loading={loading}
              />
            </View>
          ) : (
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.favoriteButton]}
                onPress={handleToggleFavorite}
              >
                <Heart 
                  size={24} 
                  color={COLORS.white} 
                  fill={item.isFavorite ? COLORS.white : 'none'}
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.editButton]}
                onPress={() => setIsEditing(true)}
              >
                <Pencil size={24} color={COLORS.white} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.deleteButton]}
                onPress={handleDelete}
              >
                <Trash size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <View style={styles.contentContainer}>
          {isEditing ? (
            // Edit mode
            <View style={styles.editForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="E.g., Blue Denim Jacket"
                  placeholderTextColor={COLORS.gray5}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Category</Text>
                <ScrollView 
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoriesContainer}
                >
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      title={category.name}
                      onPress={() => setSelectedCategory(category.name)}
                      type={selectedCategory === category.name ? 'primary' : 'outline'}
                      size="small"
                      style={styles.categoryButton}
                    />
                  ))}
                </ScrollView>
              </View>
              
              <TagInput tags={tags} onTagsChange={setTags} />
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Brand (optional)</Text>
                <TextInput
                  style={styles.input}
                  value={brand}
                  onChangeText={setBrand}
                  placeholder="E.g., Levi's"
                  placeholderTextColor={COLORS.gray5}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Notes (optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Add any extra details here..."
                  placeholderTextColor={COLORS.gray5}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
              
              <View style={styles.editButtonsContainer}>
                <Button
                  title="Cancel"
                  onPress={() => {
                    setIsEditing(false);
                    // Reset form to current values
                    setName(item.name);
                    setSelectedCategory(item.category);
                    setTags(item.tags || []);
                    setNotes(item.notes || '');
                    setBrand(item.brand || '');
                    resetImage();
                  }}
                  type="outline"
                  style={styles.cancelButton}
                />
                
                <Button
                  title="Save Changes"
                  onPress={handleSave}
                  type="primary"
                  disabled={!name || !selectedCategory}
                />
              </View>
            </View>
          ) : (
            // View mode
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Category</Text>
                <View style={[
                  styles.categoryPill, 
                  { backgroundColor: categories.find(c => c.name === item.category)?.color || COLORS.gray4 }
                ]}>
                  <Text style={styles.categoryPillText}>{item.category}</Text>
                </View>
              </View>
              
              {item.brand && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Brand</Text>
                  <Text style={styles.detailValue}>{item.brand}</Text>
                </View>
              )}
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Added</Text>
                <Text style={styles.detailValue}>
                  {new Date(item.dateAdded).toLocaleDateString()}
                </Text>
              </View>
              
              {item.tags && item.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  <View style={styles.tagsHeader}>
                    <Tag size={16} color={COLORS.gray7} />
                    <Text style={styles.tagsTitle}>Tags</Text>
                  </View>
                  
                  <View style={styles.tagsList}>
                    {item.tags.map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              
              {item.notes && (
                <View style={styles.notesContainer}>
                  <Text style={styles.notesLabel}>Notes</Text>
                  <Text style={styles.notesText}>{item.notes}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...FONTS.body1,
    color: COLORS.gray7,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 400,
    backgroundColor: COLORS.gray3,
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: SPACING.m,
    right: SPACING.m,
    flexDirection: 'row',
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.xs,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
      web: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
    }),
  },
  favoriteButton: {
    backgroundColor: COLORS.accent,
  },
  editButton: {
    backgroundColor: COLORS.primary,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
  },
  editImageButtonContainer: {
    position: 'absolute',
    bottom: SPACING.m,
    right: SPACING.m,
  },
  contentContainer: {
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.l,
  },
  detailsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    padding: SPACING.m,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.s,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray3,
  },
  detailLabel: {
    ...FONTS.body2,
    color: COLORS.gray7,
  },
  detailValue: {
    ...FONTS.body2,
    color: COLORS.gray9,
  },
  categoryPill: {
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs / 2,
    borderRadius: SIZES.base * 2,
  },
  categoryPillText: {
    ...FONTS.body3,
    fontFamily: 'Inter-Medium',
    color: COLORS.white,
  },
  tagsContainer: {
    marginTop: SPACING.m,
  },
  tagsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  tagsTitle: {
    ...FONTS.body2,
    color: COLORS.gray7,
    marginLeft: SPACING.xs,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: COLORS.gray2,
    borderRadius: SIZES.base * 2,
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs / 2,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  tagText: {
    ...FONTS.body3,
    color: COLORS.gray8,
  },
  notesContainer: {
    marginTop: SPACING.m,
    paddingTop: SPACING.s,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray3,
  },
  notesLabel: {
    ...FONTS.body2,
    color: COLORS.gray7,
    marginBottom: SPACING.xs,
  },
  notesText: {
    ...FONTS.body2,
    color: COLORS.gray9,
  },
  editForm: {
    marginBottom: SPACING.xxl,
  },
  inputGroup: {
    marginBottom: SPACING.m,
  },
  label: {
    ...FONTS.body2,
    color: COLORS.gray8,
    marginBottom: SPACING.xs,
  },
  input: {
    ...FONTS.body2,
    color: COLORS.gray9,
    borderWidth: 1,
    borderColor: COLORS.gray4,
    borderRadius: SIZES.base,
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.s,
    backgroundColor: COLORS.white,
  },
  textArea: {
    minHeight: 100,
    paddingTop: SPACING.s,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingVertical: SPACING.xs,
  },
  categoryButton: {
    marginRight: SPACING.xs,
  },
  editButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.l,
  },
  cancelButton: {
    marginRight: SPACING.m,
  },
});