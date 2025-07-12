import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card, Searchbar } from 'react-native-paper';

const categories = [
  { id: '1', name: 'Personal', icon: 'user', color: '#6C63FF', count: 8 },
  { id: '2', name: 'Work', icon: 'briefcase', color: '#FF6B6B', count: 12 },
  { id: '3', name: 'Study', icon: 'book', color: '#4ECDC4', count: 6 },
  { id: '4', name: 'Ideas', icon: 'light-bulb', color: '#FFE66D', count: 15 },
  { id: '5', name: 'Travel', icon: 'location', color: '#95E1D3', count: 4 },
  { id: '6', name: 'Health', icon: 'heart', color: '#F38181', count: 3 },
];

const recentNotes = [
  {
    id: '1',
    title: 'Meeting Notes - Project Planning',
    preview: 'Discussed the upcoming features and timeline...',
    category: 'Work',
    date: '2 hours ago',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0',
  },
  {
    id: '2',
    title: 'Book Review - Atomic Habits',
    preview: 'Key insights from James Clear\'s book about...',
    category: 'Study',
    date: '1 day ago',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f',
  },
  {
    id: '3',
    title: 'Travel Plans - Japan Trip',
    preview: 'Planning for the upcoming trip to Japan...',
    category: 'Travel',
    date: '3 days ago',
    image: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3',
  },
];

export default function ExploreScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleNotePress = (noteId: string) => {
    router.push(`/note/${noteId}`);
  };

  const renderCategory = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity style={styles.categoryCard}>
      <View style={[styles.categoryIcon, { backgroundColor: item.color + '20' }]}>
        <Entypo name={item.icon as any} size={24} color={item.color} />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.categoryCount}>{item.count} notes</Text>
    </TouchableOpacity>
  );

  const renderRecentNote = ({ item }: { item: typeof recentNotes[0] }) => (
    <Card style={styles.noteCard}>
      <TouchableOpacity onPress={() => handleNotePress(item.id)}>
        <View style={styles.cardContent}>
          <Image source={{ uri: item.image }} style={styles.cardImage} />
          <View style={{ flex: 1 }}>
            <Text style={styles.noteTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.notePreview} numberOfLines={2}>{item.preview}</Text>
            <View style={styles.noteFooter}>
              <Text style={styles.noteCategory}>{item.category}</Text>
              <Text style={styles.noteDate}>{item.date}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <TouchableOpacity>
          <Entypo name="dots-three-horizontal" color="black" style={styles.menuDots} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <Searchbar
        placeholder="Search notes, categories..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar}
        inputStyle={{ fontSize: 16 }}
      />

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        />
      </View>

      {/* Recent Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Notes</Text>
        <FlatList
          data={recentNotes}
          renderItem={renderRecentNote}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>
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
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#22223B',
    fontFamily: 'System',
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
    marginBottom: 24,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#22223B',
    marginBottom: 16,
  },
  categoriesContainer: {
    paddingRight: 18,
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 100,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22223B',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: '#6C6C80',
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
  noteTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#22223B',
    marginBottom: 2,
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
  noteCategory: {
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
