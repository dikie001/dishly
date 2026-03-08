export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
}

export interface Step {
  id: string;
  number: number;
  description: string;
  duration?: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  servings: number;
  prepTime: number;
  cookTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisine: string;
  tags: string[];
  ingredients: Ingredient[];
  steps: Step[];
  createdAt: Date;
  updatedAt: Date;
  rating?: number;
  reviews?: number;
  isFavorite?: boolean;
}

export interface RecipeFilter {
  cuisine?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  maxTime?: number;
  tags?: string[];
  searchTerm?: string;
}

export interface ShareData {
  title: string;
  url: string;
  recipeName: string;
}
