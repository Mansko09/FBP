import { useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAppStore } from '@/store';
import { categoryStorage } from '@/utils/storage';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const initializeData = useAppStore(state => ({
    fetchItems: state.fetchItems,
    fetchCategories: state.fetchCategories,
    fetchTags: state.fetchTags
  }));
  
  // Load fonts
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-Bold': Inter_700Bold,
  });
  
  useFrameworkReady();

  // Initialize app data
  useEffect(() => {
    const initialize = async () => {
      // Initialize default categories if needed
      await categoryStorage.initializeDefaultCategories();
      
      // Load data from storage
      await initializeData.fetchCategories();
      await initializeData.fetchItems();
      await initializeData.fetchTags();
    };
    
    initialize();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      // Only hide the splash screen once fonts are loaded
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // If fonts aren't loaded and no errors, don't render anything
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      <Stack 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: '#F8F9FA' },
          animation: Platform.OS === 'ios' ? 'default' : 'fade_from_bottom',
        }}
        onLayout={onLayoutRootView}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}