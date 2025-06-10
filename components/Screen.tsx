import { View, StyleSheet, ScrollView, ViewStyle, StyleProp } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '@/constants/theme';
import StatusBar from './StatusBar';

interface ScreenProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scrollable?: boolean;
  padding?: boolean;
  backgroundColor?: string;
  statusBarColor?: string;
  statusBarStyle?: 'light' | 'dark' | 'auto';
}

export default function Screen({ 
  children, 
  style, 
  scrollable = true,
  padding = true,
  backgroundColor = COLORS.gray1,
  statusBarColor,
  statusBarStyle = 'auto',
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  
  const containerStyle = [
    styles.container,
    { backgroundColor },
    padding && styles.padding,
    { paddingBottom: insets.bottom || SIZES.base * 2 },
    style,
  ];
  
  if (scrollable) {
    return (
      <View style={{ flex: 1, backgroundColor }}>
        <StatusBar 
          backgroundColor={statusBarColor || backgroundColor} 
          barStyle={statusBarStyle} 
        />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={containerStyle}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </View>
    );
  }
  
  return (
    <View style={[{ flex: 1, backgroundColor }]}>
      <StatusBar 
        backgroundColor={statusBarColor || backgroundColor} 
        barStyle={statusBarStyle} 
      />
      <View style={containerStyle}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  padding: {
    padding: SIZES.base * 2,
  },
});