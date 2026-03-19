import React, { useState, useCallback, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Manrope_300Light,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from '@expo-google-fonts/manrope';
import { QueryProvider } from './src/shared/providers';
import { AppNavigator } from './src/navigation';
import { OTASplashScreen } from './src/screens/OTASplashScreen';

// Keep the native splash screen visible until we explicitly hide it
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [otaDone, setOtaDone] = useState(false);

  const [fontsLoaded] = useFonts({
    Manrope_300Light,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });

  // Hide the native splash only when BOTH fonts and OTA check are complete
  useEffect(() => {
    if (fontsLoaded && otaDone) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, otaDone]);

  // Called by OTASplashScreen once the update check is complete
  const handleOTAReady = useCallback(() => {
    setOtaDone(true);
  }, []);

  // Show our branded OTA splash until fonts are loaded and OTA is done
  if (!fontsLoaded || !otaDone) {
    return <OTASplashScreen onReady={handleOTAReady} />;
  }

  return (
    <SafeAreaProvider>
      <QueryProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </QueryProvider>
    </SafeAreaProvider>
  );
}
