import { useNotes } from '@/contexts/NotesContext';
import { Note } from '@/types';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Appbar, Chip } from 'react-native-paper';

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { notes, loading, toggleFavorite, updateNote, fetchNotes } = useNotes();
  const [note, setNote] = useState<Note | undefined>(() => notes.find((n) => n.id === id));
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fallback: fetch notes if not found (for direct link)
  useEffect(() => {
    if (!note && !loading && id) {
      setFetching(true);
      fetchNotes()
        .then(() => {
          const found = notes.find((n) => n.id === id);
          setNote(found);
        })
        .catch((e) => setError('Failed to load note.'))
        .finally(() => setFetching(false));
    } else if (notes.length && id) {
      setNote(notes.find((n) => n.id === id));
    }
  }, [id, notes, loading]);

  // Like/favorite handler
  const handleToggleFavorite = async () => {
    if (!note) return;
    try {
      await toggleFavorite(note.id, !note.isFavorite);
      setNote({ ...note, isFavorite: !note.isFavorite });
    } catch (e) {
      Alert.alert('Error', 'Failed to update favorite status.');
    }
  };

  // Share handler
  const handleShare = async () => {
    if (!note) return;
    try {
      const content = `${note.title}\n\n${note.content}`;
      if (await Sharing.isAvailableAsync()) {
        // On native, create a temporary file to share
        const fileUri = `${FileSystem.cacheDirectory}note.txt`;
        await FileSystem.writeAsStringAsync(fileUri, content);
        await Sharing.shareAsync(fileUri, {
          dialogTitle: note.title,
          mimeType: 'text/plain',
          UTI: 'public.text',
        });
      } else {
        await Clipboard.setStringAsync(content);
        Alert.alert('Copied', 'Note content copied to clipboard.');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to share note.');
    }
  };

  // Edit handler
  const handleEdit = () => {
    if (!note) return;
    router.push({ pathname: '/create-note', params: { editId: note.id } });
  };

  if (loading || fetching) {
    return (
      <View style={styles.container}>
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title="" />
        </Appbar.Header>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#6C63FF', fontSize: 18 }}>Loading note...</Text>
        </View>
      </View>
    );
  }
  if (error || !note) {
    return (
      <View style={styles.container}>
        <Appbar.Header style={styles.header}>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title="" />
        </Appbar.Header>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#FF6B6B', fontSize: 18 }}>{error || 'Note not found.'}</Text>
        </View>
      </View>
    );
  }
  console.log(note.image);

  return (
    <View style={styles.container}>
     <Stack.Screen options={{ headerShown: false }} />
      {/* Header */}
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="" />
        <Appbar.Action icon={note.isFavorite ? 'heart' : 'heart-outline'} onPress={handleToggleFavorite} />
        <Appbar.Action icon="share" onPress={handleShare} />
        <Appbar.Action icon="dots-vertical" onPress={() => {}} />
      </Appbar.Header>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {note.image && <Image source={{ uri: note.image }} style={styles.noteImage} />}

        {/* Note Content */}
        <View style={styles.noteContent}>
          <Text style={styles.noteTitle}>{note.title}</Text>
          
          <View style={styles.noteMeta}>
            <Chip 
              mode="outlined" 
              textStyle={{ color: '#6C63FF' }}
              style={styles.categoryChip}
            >
              {note.category}
            </Chip>
            <Text style={styles.noteDate}>{note.createdAt?.toLocaleDateString?.() || ''}</Text>
          </View>

          <Text style={styles.noteText}>{note.content}</Text>
        </View>
      </ScrollView>

      {/* Floating Action Button for Edit */}
      <TouchableOpacity style={styles.editFab} onPress={handleEdit}>
        <MaterialIcons name="edit" size={24} color="#fff" />
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