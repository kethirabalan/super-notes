import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { NotesProvider } from '@/contexts/NotesContext';
import { useColorScheme } from '@/hooks/useColorScheme';

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const colorScheme = useColorScheme();

  if (loading) {
    return null; // Show loading screen
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="note/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="create-note" options={{ headerShown: false }} />
          </>
        ) : (
          <Stack.Screen name="auth" options={{ headerShown: false }} />
        )}
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <PaperProvider>
      <AuthProvider>
        <NotesProvider>
          <RootLayoutNav />
        </NotesProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
