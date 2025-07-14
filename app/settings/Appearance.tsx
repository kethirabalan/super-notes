import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { Button } from 'react-native-paper';

export default function Appearance() {
  const [theme, setTheme] = useState('light');
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.navigate('profile' as never)}>
        <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
      </TouchableOpacity>
      <Text style={styles.title}>Appearance</Text>
      <Text>Theme and display settings.</Text>
      <View style={styles.themeContainer}>  
        <Text>Theme</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#6C63FF' }}
          thumbColor={theme === 'dark' ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onTintColor="#6C63FF"
          value={theme === 'dark'}
          onValueChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        />
      </View>
      <Button
        mode="contained"
        onPress={() => {}}
        loading={false}
        disabled={false}
        style={{ marginTop: 40, backgroundColor: '#FF6B6B', borderRadius: 8 }}
        labelStyle={{ color: '#fff', fontWeight: 'bold' }}
      >
        Save Changes
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48, // Adjust for status bar
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  backText: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    marginTop: 80,
    fontSize: 24,
    fontWeight: 'bold',
  },
  themeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
}); 