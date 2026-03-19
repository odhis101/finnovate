import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { OnboardingStackParamList } from '../../../navigation/types';
import { typography, colors } from '../../../theme';
import { Button, AppBackground } from '../../../shared/components';

type GetStartedScreenNavigationProp = NativeStackNavigationProp<OnboardingStackParamList, 'GetStarted'>;

const { width } = Dimensions.get('window');

interface CarouselSlide {
  id: string;
  headerText: string;
  title: string;
  subtitle: string;
}

const carouselData: CarouselSlide[] = [
  {
    id: '1',
    headerText: 'Welcome to Finovate',
    title: "Your trusted Mobile banking for your SACCO's",
    subtitle: "Get access to all your SACCO's under one roof for easier access to your account",
  },
  {
    id: '2',
    headerText: 'Send Money',
    title: 'Easy and seamless money transfer to your family & friends',
    subtitle: "Send money across different accounts to your loved one's back at home",
  },
];

export const GetStartedScreen = () => {
  const navigation = useNavigation<GetStartedScreenNavigationProp>();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleGetStarted = () => {
    navigation.navigate('Lookup');
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slideIndex);
  };

  return (
    <AppBackground>
      <View style={styles.container}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
        {carouselData.map((item) => (
          <View key={item.id} style={styles.slide}>
            <View style={styles.content}>
              <Image
                source={require('../../../../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />

              <Image
                source={require('../../../../assets/getStartedEclipse.png')}
                style={styles.eclipse}
                resizeMode="contain"
              />

              <View style={styles.textContainer}>
                <Text style={styles.welcomeText}>
                  {item.headerText}
                </Text>
                <Text style={styles.title}>
                  {item.title}
                </Text>
                <Text style={styles.subtitle}>
                  {item.subtitle}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.paginationContainer}>
        {carouselData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Get Started"
          onPress={handleGetStarted}
          variant="primary"
          fullWidth
        />
      </View>
      </View>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width: width,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logo: {
    width: 160,
    height: 48,
    marginTop: 20,
    marginBottom: 40,
  },
  eclipse: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeText: {
    ...typography.styles.bodyMedium,
    color: colors.primary.DEFAULT,
    textAlign: 'center',
    marginBottom: 12,
  },
  title: {
    ...typography.styles.h1,
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  subtitle: {
    ...typography.styles.bodyMedium,
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EBDBB7',
  },
  paginationDotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary.DEFAULT,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
});
