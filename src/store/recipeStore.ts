import { create } from "zustand";
import { Recipe, RecipeFilter } from "../types/recipe";

interface RecipeStore {
  recipes: Recipe[];
  favorites: string[];
  filter: RecipeFilter;
  selectedRecipe: Recipe | null;

  // Recipe actions
  setRecipes: (recipes: Recipe[]) => void;
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;

  // Filter actions
  setFilter: (filter: RecipeFilter) => void;
  clearFilter: () => void;

  // Favorite actions
  toggleFavorite: (recipeId: string) => void;
  isFavorite: (recipeId: string) => boolean;

  // Selection actions
  selectRecipe: (recipe: Recipe | null) => void;

  // Search
  getFilteredRecipes: () => Recipe[];
}

export const useRecipeStore = create<RecipeStore>((set, get) => ({
  recipes: [],
  favorites: [],
  filter: {},
  selectedRecipe: null,

  setRecipes: (recipes) => set({ recipes }),

  addRecipe: (recipe) =>
    set((state) => ({ recipes: [...state.recipes, recipe] })),

  updateRecipe: (id, recipe) =>
    set((state) => ({
      recipes: state.recipes.map((r) =>
        r.id === id ? { ...r, ...recipe } : r,
      ),
    })),

  deleteRecipe: (id) =>
    set((state) => ({
      recipes: state.recipes.filter((r) => r.id !== id),
      favorites: state.favorites.filter((fav) => fav !== id),
    })),

  setFilter: (filter) => set({ filter }),

  clearFilter: () => set({ filter: {} }),

  toggleFavorite: (recipeId) =>
    set((state) => ({
      favorites: state.favorites.includes(recipeId)
        ? state.favorites.filter((fav) => fav !== recipeId)
        : [...state.favorites, recipeId],
    })),

  isFavorite: (recipeId) => {
    const state = get();
    return state.favorites.includes(recipeId);
  },

  selectRecipe: (recipe) => set({ selectedRecipe: recipe }),

  getFilteredRecipes: () => {
    const state = get();
    const { recipes, filter } = state;

    return recipes.filter((recipe) => {
      if (filter.searchTerm) {
        const term = filter.searchTerm.toLowerCase();
        if (
          !recipe.title.toLowerCase().includes(term) &&
          !recipe.description.toLowerCase().includes(term)
        ) {
          return false;
        }
      }

      if (filter.difficulty && recipe.difficulty !== filter.difficulty) {
        return false;
      }

      if (filter.cuisine && recipe.cuisine !== filter.cuisine) {
        return false;
      }

      if (
        filter.maxTime &&
        recipe.prepTime + recipe.cookTime > filter.maxTime
      ) {
        return false;
      }

      if (
        filter.tags &&
        filter.tags.length > 0 &&
        !filter.tags.some((tag) => recipe.tags.includes(tag))
      ) {
        return false;
      }

      return true;
    });
  },
}));
