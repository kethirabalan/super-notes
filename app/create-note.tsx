import { useNotes } from '@/contexts/NotesContext';
import { environment } from '@/environments/environment';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Appbar } from 'react-native-paper';


const categories = [
  { id: '1', name: 'Personal', color: '#6C63FF' },
  { id: '2', name: 'Work', color: '#FF6B6B' },
  { id: '3', name: 'Study', color: '#4ECDC4' },
  { id: '4', name: 'Ideas', color: '#FFE66D' },
  { id: '5', name: 'Travel', color: '#95E1D3' },
  { id: '6', name: 'Health', color: '#F38181' },
];

const CLOUDINARY_UPLOAD_PRESET = environment.cloudinary.uploadPreset; // TODO: Replace with your Cloudinary upload preset
const CLOUDINARY_CLOUD_NAME = environment.cloudinary.cloudName; // TODO: Replace with your Cloudinary cloud name

export default function CreateNoteScreen() {
  const router = useRouter();
  const { notes, createNote, updateNote } = useNotes();
  const { editId } = useLocalSearchParams();
  const isEditing = !!editId;

  // Find the note if editing
  const editingNote = isEditing ? notes.find((n) => n.id === editId) : undefined;

  // State, initialized with editing note if present
  const [title, setTitle] = React.useState(editingNote?.title || '');
  const [content, setContent] = React.useState(editingNote?.content || '');
  const [selectedCategory, setSelectedCategory] = React.useState(editingNote?.category || 'Personal');
  const [isFavorite, setIsFavorite] = React.useState(editingNote?.isFavorite || false);
  const [saving, setSaving] = React.useState(false);
  const [image, setImage] = React.useState<string | null>(editingNote?.image || null);
  const [imageFile, setImageFile] = React.useState<File | undefined>(undefined);
  const [uploading, setUploading] = React.useState(false);

  // If editing, update state when editingNote changes (e.g. after fetch)
  React.useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
      setSelectedCategory(editingNote.category);
      setIsFavorite(editingNote.isFavorite);
      setImage(editingNote.image || null);
    }
  }, [editingNote]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access media library is required!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      setImageFile(result.assets[0].file); // Web: File object
    }
  };

  const uploadImageToCloudinary = async (uri: string, fileObj?: File): Promise<string> => {
    setUploading(true);
    try {
      const formData = new FormData();
      if (fileObj) {
        // Web: use the File object directly
        formData.append('file', fileObj);
      } else if (uri && uri.startsWith('data:')) {
        // Web fallback: send the full data URL
        formData.append('file', uri);
      } else {
        // Native: file path
        formData.append('file', {
          uri,
          type: 'image/jpeg',
          name: 'note-image.jpg',
        } as any);
      }
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', `${environment.cloudinary.folder}/images`);
      const response = await fetch(environment.cloudinary.uploadEndpoint, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!data.secure_url) throw new Error('Cloudinary upload failed');
      return data.secure_url;
    } catch (error) {
      Alert.alert('Image Upload Error', 'Failed to upload image to Cloudinary.');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please fill in both title and content');
      return;
    }
    setSaving(true);
    try {
      let imageUrl = image || '';
      if (image && imageFile) {
        imageUrl = await uploadImageToCloudinary(image, imageFile);
      }
      const noteData: any = {
        title: title.trim(),
        content: content.trim(),
        category: selectedCategory,
        tags: [],
        isFavorite,
      };
      // Always include the image if editing and it exists, or if a new image is picked
      if (imageUrl) {
        noteData.image = imageUrl;
      } else if (isEditing && editingNote?.image) {
        noteData.image = editingNote.image;
      }
      if (isEditing && editId) {
        console.log('Updating note:', noteData);
        await updateNote(editId as string, noteData);
      } else {
        console.log('Creating note:', noteData);
        await createNote(noteData);
      }
      router.back();
    } catch (error) {
      Alert.alert('Error', isEditing ? 'Failed to update note. Please try again.' : 'Failed to create note. Please try again.');
      console.error('Error saving note:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (title.trim() || content.trim()) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to leave?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => router.back() },
          // { text: 'Discard', style: 'destructive', onPress: () => router.navigate('/(tabs)/home' as never) },
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={handleBack} />
        <Appbar.Content title={isEditing ? 'Edit Note' : 'New Note'} />
        <Appbar.Action 
          icon={isFavorite ? "heart" : "heart-outline"} 
          onPress={() => setIsFavorite(!isFavorite)} 
        />
        <Appbar.Action 
          icon="check" 
          onPress={handleSave}
          disabled={saving || !title.trim() || !content.trim()}
        />
      </Appbar.Header>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image Picker */}
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage} disabled={uploading || saving}>
          {image ? (
            <View style={styles.imagePlaceholder}>
              <MaterialIcons name="camera" size={32} color="#6C6C80" style={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }} />
              <Image source={{ uri: image }} style={{ width: '100%', height: '100%', borderRadius: 16 }} resizeMode="cover" />
            </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <MaterialIcons name="camera" size={32} color="#6C6C80" />
              <Text style={styles.imagePlaceholderText}>Add Cover Image</Text>
            </View>
          )}
        </TouchableOpacity>
        {/* Image URL Input */}
        <TextInput
          style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 12,
            marginBottom: 16,
            fontSize: 16,
            borderWidth: 1,
            borderColor: '#E0E0E0',
          }}
          placeholder="Paste image URL (optional)"
          value={image || ''}
          onChangeText={setImage}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {/* Show preview if image URL is entered and not picked */}
        {image && (
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <Image source={{ uri: image }} style={{ width: '100%', height: 120, borderRadius: 16 }} resizeMode="cover" />
          </View>
        )}

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
              <MaterialIcons name="title" size={20} color="#6C6C80" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.formatButton}>
              <MaterialIcons name="title" size={20} color="#6C6C80" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.formatButton}>
              <MaterialIcons name="format-list-numbered" size={20} color="#6C6C80" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.formatButton}>
              <MaterialIcons name="link" size={20} color="#6C6C80" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.formatButton}>
              <MaterialIcons name="image" size={20} color="#6C6C80" />
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