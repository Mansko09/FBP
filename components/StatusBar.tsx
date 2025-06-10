import { View, StyleSheet } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/theme';

interface StatusBarProps {
  backgroundColor?: string;
  barStyle?: 'light' | 'dark' | 'auto';
}

export default function StatusBar({ 
  backgroundColor = COLORS.primary, 
  barStyle = 'light' 
}: StatusBarProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <>
      <ExpoStatusBar style={barStyle} />
      <View style={[
        styles.statusBar, 
        { 
          backgroundColor,
          height: insets.top 
        }
      ]} />
    </>
  );
}

const styles = StyleSheet.create({
  statusBar: {
    width: '100%',
    zIndex: 100,
  },
});