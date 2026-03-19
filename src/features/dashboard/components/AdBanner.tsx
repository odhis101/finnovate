import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';

export const AdBanner: React.FC = () => {
  const handleBannerPress = () => {
    console.log('Ad banner pressed');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBannerPress} activeOpacity={0.9}>
        <Image
          source={require('../../../../assets/AdBanner.png')}
          style={styles.banner}
          resizeMode="cover"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  banner: {
    width: 343,
    height: 86,
    borderRadius: 12,
  },
});
