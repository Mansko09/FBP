export type ClothingItem = {
  id: string;
  name: string;
  imageUri: string;
  category: string;
  tags: string[];
  notes?: string;
  color?: string;
  brand?: string;
  dateAdded: number;
  isFavorite: boolean;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
};

export type Tag = {
  id: string;
  name: string;
};

export type AppTheme = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  error: string;
  success: string;
  warning: string;
  border: string;
  cardBackground: string;
};