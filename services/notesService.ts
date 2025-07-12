import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, Timestamp, updateDoc, where } from 'firebase/firestore';
import { globalErrorHandler } from '../lib/errorHandler';
import { db } from '../lib/firebase';
import { performanceMonitor } from '../lib/performance';
import { Note } from '../types';

export class NotesService {
  private static instance: NotesService;
  private readonly collectionName = 'notes';

  static getInstance(): NotesService {
    if (!NotesService.instance) {
      NotesService.instance = new NotesService();
    }
    return NotesService.instance;
  }

  async createNote(userId: string, note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'userId'>): Promise<string> {
    performanceMonitor.startTimer('create_note');
    
    try {
      const noteData = {
        ...note,
        userId: userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, this.collectionName), noteData);
      performanceMonitor.endTimer('create_note', { success: true, noteId: docRef.id });
      return docRef.id;
    } catch (error) {
      const duration = performanceMonitor.endTimer('create_note', { success: false });
      globalErrorHandler.logError(error as Error, 'NotesService.createNote');
      throw new Error('Failed to create note. Please try again.');
    }
  }

  async getNotes(userId: string): Promise<Note[]> {
    performanceMonitor.startTimer('get_notes');
    
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const notes: Note[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        notes.push({
          id: doc.id,
          title: data.title,
          content: data.content,
          category: data.category,
          tags: data.tags || [],
          isFavorite: data.isFavorite || false,
          userId: data.userId,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        });
      });

      performanceMonitor.endTimer('get_notes', { success: true, count: notes.length });
      return notes;
    } catch (error) {
      const duration = performanceMonitor.endTimer('get_notes', { success: false });
      globalErrorHandler.logError(error as Error, 'NotesService.getNotes');
      throw new Error('Failed to fetch notes. Please check your connection and try again.');
    }
  }

  async getFavoriteNotes(userId: string): Promise<Note[]> {
    performanceMonitor.startTimer('get_favorite_notes');
    
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        where('isFavorite', '==', true),
        orderBy('updatedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const notes: Note[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        notes.push({
          id: doc.id,
          title: data.title,
          content: data.content,
          category: data.category,
          tags: data.tags || [],
          isFavorite: data.isFavorite || false,
          userId: data.userId,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        });
      });

      performanceMonitor.endTimer('get_favorite_notes', { success: true, count: notes.length });
      return notes;
    } catch (error) {
      const duration = performanceMonitor.endTimer('get_favorite_notes', { success: false });
      globalErrorHandler.logError(error as Error, 'NotesService.getFavoriteNotes');
      throw new Error('Failed to fetch favorite notes. Please check your connection and try again.');
    }
  }

  async updateNote(noteId: string, updates: Partial<Note>): Promise<void> {
    performanceMonitor.startTimer('update_note');
    
    try {
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now()
      };

      await updateDoc(doc(db, this.collectionName, noteId), updateData);
      performanceMonitor.endTimer('update_note', { success: true, noteId });
    } catch (error) {
      const duration = performanceMonitor.endTimer('update_note', { success: false });
      globalErrorHandler.logError(error as Error, 'NotesService.updateNote');
      throw new Error('Failed to update note. Please try again.');
    }
  }

  async deleteNote(noteId: string): Promise<void> {
    performanceMonitor.startTimer('delete_note');
    
    try {
      await deleteDoc(doc(db, this.collectionName, noteId));
      performanceMonitor.endTimer('delete_note', { success: true, noteId });
    } catch (error) {
      const duration = performanceMonitor.endTimer('delete_note', { success: false });
      globalErrorHandler.logError(error as Error, 'NotesService.deleteNote');
      throw new Error('Failed to delete note. Please try again.');
    }
  }

  async toggleFavorite(noteId: string, isFavorite: boolean): Promise<void> {
    performanceMonitor.startTimer('toggle_favorite');
    
    try {
      await updateDoc(doc(db, this.collectionName, noteId), {
        isFavorite,
        updatedAt: Timestamp.now()
      });
      performanceMonitor.endTimer('toggle_favorite', { success: true, noteId, isFavorite });
    } catch (error) {
      const duration = performanceMonitor.endTimer('toggle_favorite', { success: false });
      globalErrorHandler.logError(error as Error, 'NotesService.toggleFavorite');
      throw new Error('Failed to update favorite status. Please try again.');
    }
  }

  async searchNotes(userId: string, searchTerm: string): Promise<Note[]> {
    performanceMonitor.startTimer('search_notes');
    
    try {
      // Note: Firestore doesn't support full-text search natively
      // In production, consider using Algolia, Elasticsearch, or similar
      const allNotes = await this.getNotes(userId);
      const filteredNotes = allNotes.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      performanceMonitor.endTimer('search_notes', { success: true, count: filteredNotes.length, searchTerm });
      return filteredNotes;
    } catch (error) {
      const duration = performanceMonitor.endTimer('search_notes', { success: false });
      globalErrorHandler.logError(error as Error, 'NotesService.searchNotes');
      throw new Error('Failed to search notes. Please try again.');
    }
  }

  async getNotesByCategory(userId: string, category: string): Promise<Note[]> {
    performanceMonitor.startTimer('get_notes_by_category');
    
    try {
      const q = query(
        collection(db, this.collectionName),
        where('userId', '==', userId),
        where('category', '==', category),
        orderBy('updatedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const notes: Note[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        notes.push({
          id: doc.id,
          title: data.title,
          content: data.content,
          category: data.category,
          tags: data.tags || [],
          isFavorite: data.isFavorite || false,
          userId: data.userId,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        });
      });

      performanceMonitor.endTimer('get_notes_by_category', { success: true, count: notes.length, category });
      return notes;
    } catch (error) {
    const duration = performanceMonitor.endTimer('get_notes_by_category', { success: false });
    globalErrorHandler.logError(error as Error, 'NotesService.getNotesByCategory');
    throw new Error('Failed to fetch notes by category. Please check your connection and try again.');
  }
}
}


export const notesService = NotesService.getInstance();








