import React from 'react';
import { View, Text, TextInput as RNTextInput, StyleSheet, TextInputProps } from 'react-native';
import { typography, colors } from '../../theme';

interface InputProps extends TextInputProps {
  label?: string;
  required?: boolean;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  required = false,
  error,
  placeholder,
  value,
  onChangeText,
  ...props
}) => {
  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.asterisk}>*</Text>}
        </View>
      )}

      <RNTextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.tertiary}
        {...props}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    ...typography.styles.bodySmall,
    color: colors.text.primary,
    fontSize: 14,
  },
  asterisk: {
    color: '#EF4444',
    marginLeft: 4,
    fontSize: 14,
  },
  input: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.primary,
    height: 56,
    paddingHorizontal: 16,
    ...typography.styles.bodyMedium,
    color: colors.text.primary,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    ...typography.styles.bodySmall,
    color: '#EF4444',
    marginTop: 4,
    fontSize: 12,
  },
});
