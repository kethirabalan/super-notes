import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card, Searchbar } from 'react-native-paper';

const favoriteNotes = [
  {
    id: '1',
    title: 'Wishlist Buku Yang Harus Dibaca Untuk...',
    preview: 'Mencapai perkembangan diri adalah perjalanan...',
    label: 'Personal',
    date: 'November 7, 2024',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2',
    isFavorite: true,
  },
  {
    id: '2',
    title: 'Tadzkirotussami Wal Mutakallim F...',
    preview: 'Pertemuan pertama yang merupakan sesi muqaddimah dari kajian...',
    label: 'Kajian Rutin',
    date: 'November 6, 2024',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
    isFavorite: true,
  },
  {
    id: '3',
    title: 'Meeting Notes - Project Planning',
    preview: 'Discussed the upcoming features and timeline for the new app...',
    label: 'Work',
    date: 'November 5, 2024',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0',
    isFavorite: true,
  },
];

export default function FavoritesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleNotePress = (noteId: string) => {
    router.push(`/note/${noteId}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Favorites</Text>
          <Text style={styles.subtitle}>{favoriteNotes.length} notes</Text>
        </View>
        <TouchableOpacity>
          <Entypo name="dots-three-horizontal" color="black" style={styles.menuDots} />
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <Searchbar
        placeholder="Search favorites..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar}
        inputStyle={{ fontSize: 16 }}
      />
      
      {/* Favorites List */}
      <FlatList
        data={favoriteNotes}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <Card style={styles.noteCard}>
            <TouchableOpacity onPress={() => handleNotePress(item.id)}>
              <View style={styles.cardContent}>
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <View style={{ flex: 1 }}>
                  <View style={styles.titleRow}>
                    <Text style={styles.noteTitle} numberOfLines={1}>{item.title}</Text>
                    <Entypo name="heart" size={16} color="#FF6B6B" />
                  </View>
                  <Text style={styles.notePreview} numberOfLines={2}>{item.preview}</Text>
                  <View style={styles.noteFooter}>
                    <Text style={styles.noteLabel}>{item.label}</Text>
                    <Text style={styles.noteDate}>{item.date}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Card>
        )}
        style={{ marginTop: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
    paddingHorizontal: 18,
    paddingTop: 44,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#22223B',
    fontFamily: 'System',
  },
  subtitle: {
    fontSize: 14,
    color: '#6C6C80',
    marginTop: 2,
  },
  menuDots: {
    fontSize: 22,
    textAlign: 'center',
    backgroundColor: '#fff',
    borderRadius: 50,
    width: 36,
    height: 36,
    padding: 6
  },
  searchBar: {
    borderRadius: 16,
    marginBottom: 10,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  noteCard: {
    borderRadius: 18,
    marginBottom: 16,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    padding: 0,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  cardImage: {
    width: 54,
    height: 54,
    borderRadius: 12,
    marginRight: 14,
    backgroundColor: '#EEE',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  noteTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#22223B',
    flex: 1,
    marginRight: 8,
  },
  notePreview: {
    fontSize: 14,
    color: '#6C6C80',
    marginBottom: 8,
  },
  noteFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  noteLabel: {
    fontSize: 12,
    color: '#6C63FF',
    backgroundColor: '#F3F0FF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
    fontWeight: '600',
  },
  noteDate: {
    fontSize: 12,
    color: '#B5B5B5',
  },
}); 