import { useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { Camera, Image as ImageIcon } from 'lucide-react-native';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';
import { useAppStore } from '@/store';
import { useImagePicker } from '@/hooks/useImagePicker';
import Screen from '@/components/Screen';
import Header from '@/components/Header';
import Button from '@/components/Button';
import TagInput from '@/components/TagInput';

export default function AddItemScreen() {
  const router = useRouter();
  const { image, loading, pickImage, takePhoto, resetImage } = useImagePicker();
  const { categories, addItem } = useAppStore(state => ({
    categories: state.categories,
    addItem: state.addItem,
  }));
  
  const [name, setName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [brand, setBrand] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleImageCapture = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    Alert.alert(
      'Add Photo',
      'Choose a method to add a photo',
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
  
  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name for your item');
      return;
    }
    
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    
    if (!image) {
      Alert.alert('Error', 'Please add an image of your item');
      return;
    }
    
    setIsLoading(true);
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    try {
      const newItem = {
        id: Date.now().toString(),
        name: name.trim(),
        imageUri: image,
        category: selectedCategory,
        tags,
        notes,
        brand: brand.trim(),
        dateAdded: Date.now(),
        isFavorite: false,
      };
      
      await addItem(newItem);
      
      // Reset form
      setName('');
      setSelectedCategory('');
      setTags([]);
      setNotes('');
      setBrand('');
      resetImage();
      
      router.push('/');
    } catch (error) {
      Alert.alert('Error', 'Could not save item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen>
      <Header title="Add Item" showBackButton />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <ImageIcon size={56} color={COLORS.gray5} />
              <Text style={styles.imagePlaceholderText}>Add image</Text>
            </View>
          )}
          
          <View style={styles.buttonContainer}>
            <Button
              title={image ? "Change Photo" : "Add Photo"}
              onPress={handleImageCapture}
              type="primary"
              icon={<Camera size={20} color={COLORS.white} />}
              loading={loading}
            />
          </View>
        </View>
        
        <View style={styles.formContainer}>
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
          
          <Button
            title="Save Item"
            onPress={handleSave}
            type="primary"
            size="large"
            style={styles.saveButton}
            loading={isLoading}
            disabled={!name || !selectedCategory || !image}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    marginBottom: SPACING.m,
    alignItems: 'center',
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: SIZES.base,
    backgroundColor: COLORS.gray3,
  },
  imagePlaceholder: {
    width: 250,
    height: 250,
    borderRadius: SIZES.base,
    backgroundColor: COLORS.gray3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    ...FONTS.body2,
    color: COLORS.gray6,
    marginTop: SPACING.s,
  },
  buttonContainer: {
    marginTop: SPACING.m,
  },
  formContainer: {
    marginTop: SPACING.m,
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
  saveButton: {
    marginTop: SPACING.m,
    marginBottom: SPACING.xxl,
  },
});