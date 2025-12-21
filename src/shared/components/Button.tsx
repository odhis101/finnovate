import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { typography, colors } from '../../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return colors.border.secondary;
    if (variant === 'primary') return colors.primary.DEFAULT;
    if (variant === 'secondary') return colors.primary[100];
    return 'transparent';
  };

  const getTextColor = () => {
    if (disabled) return colors.text.tertiary;
    if (variant === 'primary') return 'white';
    if (variant === 'secondary') return colors.primary.DEFAULT;
    return colors.primary.DEFAULT;
  };

  const getPadding = () => {
    if (size === 'small') return { paddingVertical: 12, paddingHorizontal: 16 };
    if (size === 'large') return { paddingVertical: 20, paddingHorizontal: 32 };
    return { paddingVertical: 16, paddingHorizontal: 24 };
  };

  const getBorderStyle = () => {
    if (variant === 'outline') {
      return {
        borderWidth: 1,
        borderColor: disabled ? colors.border.secondary : colors.primary.DEFAULT,
      };
    }
    return {};
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => ({
        backgroundColor: getBackgroundColor(),
        borderRadius: 30,
        minHeight: 56,
        ...getPadding(),
        ...getBorderStyle(),
        opacity: pressed ? 0.8 : 1,
        width: fullWidth ? '100%' : 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
      })}
    >
      {loading ? (
        <ActivityIndicator
          color={getTextColor()}
          size="small"
        />
      ) : (
        <Text
          style={{
            ...typography.styles.bodyMedium,
            color: getTextColor(),
            textAlign: 'center',
          }}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
};