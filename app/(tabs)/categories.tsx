import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert
} from 'react-native';
import { CirclePlus as PlusCircle, CreditCard as Edit, Trash, Shirt, Wind, Tangent as Pants, Watch, Footprints } from 'lucide-react-native';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';
import { Category } from '@/types';
import { useAppStore } from '@/store';
import Screen from '@/components/Screen';
import Header from '@/components/Header';
import CategoryCard from '@/components/CategoryCard';
import Button from '@/components/Button';

// Available icons for categories
const CATEGORY_ICONS = [
  { name: 'shirt', icon: <Shirt size={24} color={COLORS.gray9} /> },
  { name: 'pants', icon: <Pants size={24} color={COLORS.gray9} /> },
  { name: 'jacket', icon: <Wind size={24} color={COLORS.gray9} /> },
  { name: 'footprints', icon: <Footprints size={24} color={COLORS.gray9} /> },
  { name: 'watch', icon: <Watch size={24} color={COLORS.gray9} /> },
];

// Available colors for categories
const CATEGORY_COLORS = [
  '#FF6B6B', '#4ECDC4', '#1A535C', '#FF9F1C', '#E76F51', 
  '#6A0572', '#AB83A1', '#7C9885', '#065471', '#65743A',
];

export default function CategoriesScreen() {
  const { categories, addCategory, updateCategory, removeCategory } = useAppStore(state => ({
    categories: state.categories,
    addCategory: state.addCategory,
    updateCategory: state.updateCategory,
    removeCategory: state.removeCategory,
  }));
  
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('shirt');
  const [selectedColor, setSelectedColor] = useState(CATEGORY_COLORS[0]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }
    
    // Check if category already exists
    if (categories.some(cat => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      Alert.alert('Error', 'A category with this name already exists');
      return;
    }
    
    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      icon: selectedIcon,
      color: selectedColor,
      count: 0,
    };
    
    addCategory(newCategory);
    
    // Reset form
    setNewCategoryName('');
    setSelectedIcon('shirt');
    setSelectedColor(CATEGORY_COLORS[0]);
    setShowAddForm(false);
  };
  
  const handleEditCategory = () => {
    if (!editingCategory) return;
    
    if (!newCategoryName.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }
    
    // Check if category name already exists (excluding the current category)
    if (categories.some(
      cat => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase() && 
      cat.id !== editingCategory.id
    )) {
      Alert.alert('Error', 'A category with this name already exists');
      return;
    }
    
    const updatedCategory: Category = {
      ...editingCategory,
      name: newCategoryName.trim(),
      icon: selectedIcon,
      color: selectedColor,
    };
    
    updateCategory(updatedCategory);
    
    // Reset form
    setNewCategoryName('');
    setSelectedIcon('shirt');
    setSelectedColor(CATEGORY_COLORS[0]);
    setEditingCategory(null);
    setIsEditing(false);
  };
  
  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    
    if (category && category.count > 0) {
      Alert.alert(
        'Warning',
        `This category contains ${category.count} items. Deleting it will remove the category from those items.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            style: 'destructive',
            onPress: () => removeCategory(categoryId) 
          }
        ]
      );
    } else {
      Alert.alert(
        'Confirm',
        'Are you sure you want to delete this category?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            style: 'destructive',
            onPress: () => removeCategory(categoryId) 
          }
        ]
      );
    }
  };
  
  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setSelectedIcon(category.icon);
    setSelectedColor(category.color);
    setIsEditing(true);
  };
  
  const cancelEdit = () => {
    setEditingCategory(null);
    setNewCategoryName('');
    setSelectedIcon('shirt');
    setSelectedColor(CATEGORY_COLORS[0]);
    setIsEditing(false);
  };
  
  return (
    <Screen>
      <Header title="Categories" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Category list */}
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <View key={category.id} style={styles.categoryItem}>
              <CategoryCard category={category} />
              
              {isEditing && (
                <View style={styles.categoryActions}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.editButton]} 
                    onPress={() => startEdit(category)}
                  >
                    <Edit size={16} color={COLORS.white} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.deleteButton]} 
                    onPress={() => handleDeleteCategory(category.id)}
                  >
                    <Trash size={16} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>
        
        {/* Add/Edit Category Form */}
        {(showAddForm || isEditing) && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>
              {isEditing ? 'Edit Category' : 'Add New Category'}
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category Name</Text>
              <TextInput
                style={styles.input}
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                placeholder="E.g., Accessories"
                placeholderTextColor={COLORS.gray5}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Icon</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.iconGrid}
              >
                {CATEGORY_ICONS.map((icon) => (
                  <TouchableOpacity
                    key={icon.name}
                    style={[
                      styles.iconItem,
                      selectedIcon === icon.name && styles.selectedIcon,
                    ]}
                    onPress={() => setSelectedIcon(icon.name)}
                  >
                    {icon.icon}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Color</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.colorGrid}
              >
                {CATEGORY_COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorItem,
                      { backgroundColor: color },
                      selectedColor === color && styles.selectedColor,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  />
                ))}
              </ScrollView>
            </View>
            
            <View style={styles.buttonGroup}>
              <Button
                title="Cancel"
                onPress={isEditing ? cancelEdit : () => setShowAddForm(false)}
                type="outline"
                style={styles.cancelButton}
              />
              
              <Button
                title={isEditing ? "Save Changes" : "Add Category"}
                onPress={isEditing ? handleEditCategory : handleAddCategory}
                disabled={!newCategoryName.trim()}
              />
            </View>
          </View>
        )}
        
        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          {!showAddForm && !isEditing && (
            <>
              <Button
                title={isEditing ? "Done" : "Edit Categories"}
                onPress={() => setIsEditing(!isEditing)}
                type={isEditing ? "primary" : "outline"}
                style={styles.actionButton}
              />
              
              <Button
                title="Add New Category"
                onPress={() => setShowAddForm(true)}
                icon={<PlusCircle size={20} color={COLORS.white} />}
                style={styles.actionButton}
              />
            </>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  categoriesGrid: {
    flexDirection: 'column',
  },
  categoryItem: {
    position: 'relative',
    marginBottom: SPACING.s,
  },
  categoryActions: {
    position: 'absolute',
    top: SPACING.s,
    right: SPACING.s,
    flexDirection: 'row',
  },
  actionButton: {
    marginVertical: SPACING.m,
  },
  actionContainer: {
    marginTop: SPACING.m,
    marginBottom: SPACING.xl,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    padding: SPACING.xs,
    marginRight: SPACING.xs,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
    borderRadius: 999,
    padding: SPACING.xs,
  },
  formContainer: {
    marginTop: SPACING.m,
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
  formTitle: {
    ...FONTS.h3,
    color: COLORS.gray9,
    marginBottom: SPACING.m,
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
  iconGrid: {
    flexDirection: 'row',
    paddingVertical: SPACING.xs,
  },
  iconItem: {
    width: 48,
    height: 48,
    borderRadius: SIZES.base,
    borderWidth: 1,
    borderColor: COLORS.gray4,
    marginRight: SPACING.s,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  selectedIcon: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: COLORS.gray1,
  },
  colorGrid: {
    flexDirection: 'row',
    paddingVertical: SPACING.xs,
  },
  colorItem: {
    width: 48,
    height: 48,
    borderRadius: 999,
    marginRight: SPACING.s,
    borderWidth: 1,
    borderColor: COLORS.gray4,
  },
  selectedColor: {
    borderColor: COLORS.gray9,
    borderWidth: 3,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.m,
  },
  cancelButton: {
    marginRight: SPACING.m,
  },
});