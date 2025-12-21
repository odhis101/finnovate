import React from 'react';
import { ImageBackground, StyleSheet, ViewStyle } from 'react-native';

interface AppBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const AppBackground: React.FC<AppBackgroundProps> = ({ children, style }) => {
  return (
    <ImageBackground
      source={require('../../../assets/background.png')}
      style={[styles.background, style]}
      resizeMode="cover"
    >
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
});
