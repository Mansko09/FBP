import { View, Text, StyleSheet, Alert, ScrollView, Switch } from 'react-native';
import { ClipboardCopy, Save, Trash, Brush, Info } from 'lucide-react-native';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';
import Screen from '@/components/Screen';
import Header from '@/components/Header';
import Button from '@/components/Button';
import { useAppStore } from '@/store';
import { clothingStorage, categoryStorage, tagStorage } from '@/utils/storage';

export default function SettingsScreen() {
  // Get the data to export
  const { items, categories, tags } = useAppStore(state => ({
    items: state.items,
    categories: state.categories,
    tags: state.tags,
  }));
  
  const handleExport = () => {
    // Create export data
    const exportData = JSON.stringify({ items, categories, tags }, null, 2);
    
    // On web we could use the clipboard API
    Alert.alert(
      'Export Data',
      'Data ready for export. On a real device, this would allow you to share or copy the data.',
      [{ text: 'OK' }]
    );
  };
  
  const handleImport = () => {
    Alert.alert(
      'Import Data',
      'On a real device, this would allow you to import data from a file or clipboard.',
      [{ text: 'OK' }]
    );
  };
  
  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all your clothing items and categories? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete Everything', 
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear all storage
              await clothingStorage.saveItems([]);
              await categoryStorage.initializeDefaultCategories(); // Reset to defaults
              await tagStorage.saveTags([]);
              
              // Refresh app state
              await useAppStore.getState().fetchItems();
              await useAppStore.getState().fetchCategories();
              await useAppStore.getState().fetchTags();
              
              Alert.alert('Success', 'All data has been cleared.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data. Please try again.');
            }
          }
        }
      ]
    );
  };
  
  return (
    <Screen>
      <Header title="Settings" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <View style={styles.card}>
            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <View style={styles.iconContainer}>
                  <Save size={24} color={COLORS.primary} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Export Data</Text>
                  <Text style={styles.settingDescription}>
                    Export your wardrobe data for backup
                  </Text>
                </View>
              </View>
              <Button
                title="Export"
                onPress={handleExport}
                type="outline"
                size="small"
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <View style={styles.iconContainer}>
                  <ClipboardCopy size={24} color={COLORS.primary} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Import Data</Text>
                  <Text style={styles.settingDescription}>
                    Import previously exported wardrobe data
                  </Text>
                </View>
              </View>
              <Button
                title="Import"
                onPress={handleImport}
                type="outline"
                size="small"
              />
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <View style={styles.iconContainer}>
                  <Trash size={24} color={COLORS.error} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Clear All Data</Text>
                  <Text style={styles.settingDescription}>
                    Delete all your wardrobe data (cannot be undone)
                  </Text>
                </View>
              </View>
              <Button
                title="Clear"
                onPress={handleClearData}
                type="danger"
                size="small"
              />
            </View>
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>App Information</Text>
          
          <View style={styles.card}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Build</Text>
              <Text style={styles.infoValue}>100</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Storage Used</Text>
              <Text style={styles.infoValue}>
                {(JSON.stringify(items).length / 1024).toFixed(2)} KB
              </Text>
            </View>
          </View>
          
          <Text style={styles.footer}>
            Wardrobe Organizer © 2025
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: SPACING.l,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.gray8,
    marginBottom: SPACING.s,
  },
  card: {
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.s,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: SIZES.base,
    backgroundColor: COLORS.gray1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.s,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    ...FONTS.body1,
    color: COLORS.gray9,
  },
  settingDescription: {
    ...FONTS.body3,
    color: COLORS.gray6,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.gray3,
    marginVertical: SPACING.xs,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.s,
  },
  infoLabel: {
    ...FONTS.body2,
    color: COLORS.gray7,
  },
  infoValue: {
    ...FONTS.body2,
    color: COLORS.gray9,
    fontFamily: 'Inter-Medium',
  },
  footer: {
    ...FONTS.caption,
    color: COLORS.gray6,
    textAlign: 'center',
    marginTop: SPACING.m,
  },
});