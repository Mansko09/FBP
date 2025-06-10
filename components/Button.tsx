import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle 
} from 'react-native';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export default function Button({
  title,
  onPress,
  type = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  // Button styles based on type
  const getButtonStyle = () => {
    switch (type) {
      case 'primary':
        return styles.primaryButton;
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      case 'danger':
        return styles.dangerButton;
      default:
        return styles.primaryButton;
    }
  };
  
  // Text styles based on type
  const getTextStyle = () => {
    switch (type) {
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      case 'danger':
        return styles.dangerText;
      default:
        return styles.primaryText;
    }
  };
  
  // Size styles
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallButton;
      case 'medium':
        return styles.mediumButton;
      case 'large':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };
  
  // Text size styles
  const getTextSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallText;
      case 'medium':
        return styles.mediumText;
      case 'large':
        return styles.largeText;
      default:
        return styles.mediumText;
    }
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        getSizeStyle(),
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={type === 'outline' ? COLORS.primary : COLORS.white} 
          size="small" 
        />
      ) : (
        <>
          {icon && icon}
          <Text
            style={[
              styles.text,
              getTextStyle(),
              getTextSizeStyle(),
              disabled && styles.disabledText,
              icon && { marginLeft: SPACING.xs },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.base,
  },
  // Type styles
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.gray3,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  dangerButton: {
    backgroundColor: COLORS.error,
  },
  // Size styles
  smallButton: {
    paddingVertical: SPACING.xs - 2,
    paddingHorizontal: SPACING.s,
  },
  mediumButton: {
    paddingVertical: SPACING.s - 4,
    paddingHorizontal: SPACING.m,
  },
  largeButton: {
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.l,
  },
  // State styles
  disabledButton: {
    backgroundColor: COLORS.gray4,
    borderColor: COLORS.gray4,
  },
  // Text styles
  text: {
    textAlign: 'center',
  },
  primaryText: {
    ...FONTS.body2,
    fontFamily: 'Inter-Medium',
    color: COLORS.white,
  },
  secondaryText: {
    ...FONTS.body2,
    fontFamily: 'Inter-Medium',
    color: COLORS.gray8,
  },
  outlineText: {
    ...FONTS.body2,
    fontFamily: 'Inter-Medium',
    color: COLORS.primary,
  },
  dangerText: {
    ...FONTS.body2,
    fontFamily: 'Inter-Medium',
    color: COLORS.white,
  },
  // Text size styles
  smallText: {
    ...FONTS.body3,
  },
  mediumText: {
    ...FONTS.body2,
  },
  largeText: {
    ...FONTS.body1,
  },
  // State text styles
  disabledText: {
    color: COLORS.gray6,
  },
});