export interface Note {
  id: string;
  title: string;
  content: string;
  preview: string;
  label: string;
  date: string;
  image?: string;
  isFavorite: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  userId: string;
  noteCount: number;
}

export interface NoteFormData {
  title: string;
  content: string;
  label: string;
  image?: string;
  isFavorite: boolean;
}