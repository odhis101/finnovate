import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { typography, colors } from '../../theme';

interface PINKeypadProps {
  onNumberPress: (num: number) => void;
  onBackspace: () => void;
  showBiometric?: boolean;
  onBiometricPress?: () => void;
}

export const PINKeypad: React.FC<PINKeypadProps> = ({
  onNumberPress,
  onBackspace,
  showBiometric = false,
  onBiometricPress,
}) => {
  const keys = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [showBiometric ? 'biometric' : null, 0, 'backspace'],
  ];

  const renderKey = (key: number | string | null) => {
    if (key === null) {
      return <View style={styles.keyButton} />;
    }

    if (key === 'backspace') {
      return (
        <TouchableOpacity
          style={styles.keyButton}
          onPress={onBackspace}
          activeOpacity={0.7}
        >
          <Text style={styles.backspaceText}>✕</Text>
        </TouchableOpacity>
      );
    }

    if (key === 'biometric') {
      return (
        <TouchableOpacity
          style={styles.keyButton}
          onPress={onBiometricPress}
          activeOpacity={0.7}
        >
          <Text style={styles.biometricText}>👆</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.keyButton}
        onPress={() => onNumberPress(key as number)}
        activeOpacity={0.7}
      >
        <Text style={styles.keyText}>{key}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {keys.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key, keyIndex) => (
            <View key={keyIndex}>{renderKey(key)}</View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  keyButton: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    fontSize: 32,
    fontWeight: '600',
    fontFamily: typography.fontFamily.semibold,
    color: colors.text.primary,
  },
  backspaceText: {
    fontSize: 28,
    color: colors.text.primary,
  },
  biometricText: {
    fontSize: 32,
  },
});
