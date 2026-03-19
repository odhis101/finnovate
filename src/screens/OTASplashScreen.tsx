import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Image,
  Text,
  ActivityIndicator,
  StyleSheet,
  Animated,
} from 'react-native';
import * as Updates from 'expo-updates';

type UpdateStatus = 'checking' | 'downloading' | 'ready' | 'error';

interface Props {
  onReady: () => void;
}

export const OTASplashScreen = ({ onReady }: Props) => {
  const [status, setStatus] = useState<UpdateStatus>('checking');
  const [statusText, setStatusText] = useState('Checking for updates...');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    // Animate logo in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(logoScaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    checkForUpdates();
  }, []);

  const checkForUpdates = async () => {
    try {
      // Skip OTA in development or when updates are disabled
      if (__DEV__ || !Updates.isEnabled) {
        await new Promise(resolve => setTimeout(resolve, 800)); // brief branded pause
        setStatus('ready');
        onReady();
        return;
      }

      setStatus('checking');
      setStatusText('Checking for updates...');

      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        setStatus('downloading');
        setStatusText('Downloading update...');

        await Updates.fetchUpdateAsync();

        setStatusText('Applying update...');
        await Updates.reloadAsync();
        // App will restart — execution stops here
      } else {
        setStatus('ready');
        onReady();
      }
    } catch {
      // Network error or update server unavailable — continue with cached bundle
      setStatus('error');
      onReady();
    }
  };

  const showStatus = status === 'checking' || status === 'downloading';

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          { opacity: fadeAnim, transform: [{ scale: logoScaleAnim }] },
        ]}
      >
        <Image
          source={require('../../assets/FinovateLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View style={[styles.statusContainer, { opacity: fadeAnim }]}>
        {showStatus ? (
          <>
            <ActivityIndicator color="rgba(255,255,255,0.9)" size="small" />
            <Text style={styles.statusText}>{statusText}</Text>
          </>
        ) : (
          // Invisible placeholder to prevent layout shift
          <View style={styles.statusPlaceholder} />
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8056A4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 220,
    height: 100,
  },
  statusContainer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
    gap: 10,
  },
  statusText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  statusPlaceholder: {
    height: 36,
  },
});
