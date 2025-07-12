import Entypo from '@expo/vector-icons/Entypo';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Appbar, Chip } from 'react-native-paper';

const noteData = {
  id: '1',
  title: 'Wishlist Buku Yang Harus Dibaca Untuk Perkembangan Diri',
  content: `Mencapai perkembangan diri adalah perjalanan yang membutuhkan dedikasi dan konsistensi. Salah satu cara terbaik untuk mengembangkan diri adalah melalui membaca buku-buku yang berkualitas.

Buku-buku yang direkomendasikan:

1. "Atomic Habits" oleh James Clear
   - Fokus pada pembentukan kebiasaan kecil yang berdampak besar
   - Teknik-teknik praktis untuk mengubah perilaku

2. "Deep Work" oleh Cal Newport
   - Strategi untuk fokus dan produktivitas
   - Mengelola distraksi di era digital

3. "Mindset" oleh Carol Dweck
   - Perbedaan antara fixed mindset dan growth mindset
   - Cara mengembangkan pola pikir yang berkembang

4. "The Power of Habit" oleh Charles Duhigg
   - Sains di balik pembentukan kebiasaan
   - Cara mengubah kebiasaan buruk menjadi baik

5. "Essentialism" oleh Greg McKeown
   - Seni melakukan hal yang benar
   - Fokus pada yang benar-benar penting

Setiap buku ini memberikan perspektif unik tentang pengembangan diri dan dapat membantu kita menjadi versi yang lebih baik dari diri kita sendiri.`,
  label: 'Personal',
  date: 'November 7, 2024',
  image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2',
  isFavorite: true,
};

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
     <Stack.Screen options={{ headerShown: false }} />
      {/* Header */}
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="" />
        <Appbar.Action icon="heart" onPress={() => {}} />
        <Appbar.Action icon="share" onPress={() => {}} />
        <Appbar.Action icon="dots-vertical" onPress={() => {}} />
      </Appbar.Header>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Note Image */}
        <Image source={{ uri: noteData.image }} style={styles.noteImage} />

        {/* Note Content */}
        <View style={styles.noteContent}>
          <Text style={styles.noteTitle}>{noteData.title}</Text>
          
          <View style={styles.noteMeta}>
            <Chip 
              mode="outlined" 
              textStyle={{ color: '#6C63FF' }}
              style={styles.categoryChip}
            >
              {noteData.label}
            </Chip>
            <Text style={styles.noteDate}>{noteData.date}</Text>
          </View>

          <Text style={styles.noteText}>{noteData.content}</Text>
        </View>
      </ScrollView>

      {/* Floating Action Button for Edit */}
      <TouchableOpacity style={styles.editFab}>
        <Entypo name="edit" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  header: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
  },
  content: {
    flex: 1,
  },
  noteImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  noteContent: {
    padding: 20,
  },
  noteTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#22223B',
    marginBottom: 16,
    lineHeight: 32,
  },
  noteMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  categoryChip: {
    marginRight: 12,
    borderColor: '#6C63FF',
  },
  noteDate: {
    fontSize: 14,
    color: '#6C6C80',
  },
  noteText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#22223B',
  },
  editFab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: '#6C63FF',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#6C63FF',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
}); 