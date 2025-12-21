import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme';

interface PINDotsProps {
  length: number;
  filled: number;
}

export const PINDots: React.FC<PINDotsProps> = ({ length, filled }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index < filled && styles.dotFilled,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginVertical: 40,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.border.secondary,
  },
  dotFilled: {
    backgroundColor: colors.primary.DEFAULT,
  },
});
