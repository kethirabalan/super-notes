import Entypo from '@expo/vector-icons/Entypo';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Appbar } from 'react-native-paper';

const categories = [
  { id: '1', name: 'Personal', color: '#6C63FF' },
  { id: '2', name: 'Work', color: '#FF6B6B' },
  { id: '3', name: 'Study', color: '#4ECDC4' },
  { id: '4', name: 'Ideas', color: '#FFE66D' },
  { id: '5', name: 'Travel', color: '#95E1D3' },
  { id: '6', name: 'Health', color: '#F38181' },
];

export default function CreateNoteScreen() {
  const router = useRouter();
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('Personal');
  const [isFavorite, setIsFavorite] = React.useState(false);

  return (
    <View style={styles.container}>
     <Stack.Screen options={{ headerShown: false }} />
      {/* Header */}
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="New Note" />
        <Appbar.Action 
          icon={isFavorite ? "heart" : "heart-outline"} 
          onPress={() => setIsFavorite(!isFavorite)} 
        />
        <Appbar.Action icon="check" onPress={() => router.back()} />
      </Appbar.Header>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image Picker */}
        <TouchableOpacity style={styles.imagePicker}>
          <View style={styles.imagePlaceholder}>
            <Entypo name="camera" size={32} color="#6C6C80" />
            <Text style={styles.imagePlaceholderText}>Add Cover Image</Text>
          </View>
        </TouchableOpacity>

        {/* Title Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.titleInput, { fontSize: 24, fontWeight: '700', color: '#22223B' }]}
            placeholder="Note title..."
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Category Selection */}
        <View style={styles.categoryContainer}>
          <Text style={styles.sectionTitle}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setSelectedCategory(category.name)}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.name && {
                    backgroundColor: category.color,
                    borderColor: category.color,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.name && { color: '#fff' },
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.sectionTitle}>Content</Text>
          <TextInput
            style={[styles.contentInput, { fontSize: 16, lineHeight: 24, color: '#22223B' }]}
            placeholder="Start writing your note..."
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Formatting Tools */}
        <View style={styles.formattingContainer}>
          <Text style={styles.sectionTitle}>Formatting</Text>
          <View style={styles.formattingTools}>
            <TouchableOpacity style={styles.formatButton}>
              <Entypo name="text" size={20} color="#6C6C80" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.formatButton}>
              <Entypo name="text" size={20} color="#6C6C80" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.formatButton}>
              <Entypo name="list" size={20} color="#6C6C80" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.formatButton}>
              <Entypo name="link" size={20} color="#6C6C80" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.formatButton}>
              <Entypo name="image" size={20} color="#6C6C80" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    padding: 20,
  },
  imagePicker: {
    marginBottom: 24,
  },
  imagePlaceholder: {
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: '#6C6C80',
    marginTop: 8,
  },
  inputContainer: {
    marginBottom: 24,
  },
  titleInput: {
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#22223B',
    marginBottom: 12,
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6C6C80',
  },
  contentInput: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    minHeight: 200,
    fontSize: 16,
    lineHeight: 24,
  },
  formattingContainer: {
    marginBottom: 24,
  },
  formattingTools: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 8,
  },
  formatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
}); 