import axios from 'axios';
import { Recipe, Ingredient, Step } from '../types/recipe';

const API_BASE = 'https://www.themealdb.com/api/json/v1/1';

interface MealDBMeal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  [key: string]: string | null;
}

interface MealDBCategory {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
}

export const mealDBService = {
  // Get all categories
  async getCategories(): Promise<MealDBCategory[]> {
    try {
      const response = await axios.get(`${API_BASE}/categories.php`);
      return response.data.categories || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get meals by category
  async getMealsByCategory(category: string): Promise<MealDBMeal[]> {
    try {
      const response = await axios.get(`${API_BASE}/filter.php?c=${category}`);
      return response.data.meals || [];
    } catch (error) {
      console.error('Error fetching meals by category:', error);
      throw error;
    }
  },

  // Get meals by area/cuisine
  async getMealsByArea(area: string): Promise<MealDBMeal[]> {
    try {
      const response = await axios.get(`${API_BASE}/filter.php?a=${area}`);
      return response.data.meals || [];
    } catch (error) {
      console.error('Error fetching meals by area:', error);
      throw error;
    }
  },

  // Search meals by name
  async searchMeals(name: string): Promise<MealDBMeal[]> {
    try {
      const response = await axios.get(`${API_BASE}/search.php?s=${encodeURIComponent(name)}`);
      return response.data.meals || [];
    } catch (error) {
      console.error('Error searching meals:', error);
      throw error;
    }
  },

  // Get meal details
  async getMealDetails(id: string): Promise<MealDBMeal | null> {
    try {
      const response = await axios.get(`${API_BASE}/lookup.php?i=${id}`);
      return response.data.meals?.[0] || null;
    } catch (error) {
      console.error('Error fetching meal details:', error);
      throw error;
    }
  },

  // Get random meal
  async getRandomMeal(): Promise<MealDBMeal | null> {
    try {
      const response = await axios.get(`${API_BASE}/random.php`);
      return response.data.meals?.[0] || null;
    } catch (error) {
      console.error('Error fetching random meal:', error);
      throw error;
    }
  },

  // Extract ingredients from MealDB meal
  extractIngredients(meal: MealDBMeal): Ingredient[] {
    const ingredients: Ingredient[] = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          id: `${i}`,
          name: ingredient.trim(),
          amount: measure?.trim() || '1',
          unit: '',
        });
      }
    }
    return ingredients;
  },

  // Convert MealDB meal to Recipe format
  mealToRecipe(meal: MealDBMeal): Recipe {
    const ingredients = this.extractIngredients(meal);

    // Parse instructions into steps
    const instructionText = meal.strInstructions || '';
    const steps: Step[] = instructionText
      .split('.')
      .filter((step) => step.trim().length > 0)
      .map((step, index) => ({
        id: `step-${index}`,
        number: index + 1,
        description: step.trim(),
      }));

    // Estimate times based on cuisine/category
    const estimateCookTime = (category: string): number => {
      const times: Record<string, number> = {
        Seafood: 20,
        Pasta: 20,
        Dessert: 25,
        Breakfast: 15,
        Vegan: 25,
        Vegetarian: 25,
      };
      return times[category] || 30;
    };

    const estimatePrepTime = (category: string): number => {
      const times: Record<string, number> = {
        Seafood: 15,
        Pasta: 10,
        Dessert: 20,
        Breakfast: 10,
        Vegan: 15,
        Vegetarian: 15,
      };
      return times[category] || 15;
    };

    const category = meal.strCategory || 'Other';
    const area = meal.strArea || 'Unknown';

    return {
      id: meal.idMeal,
      title: meal.strMeal,
      description: `A delicious ${category.toLowerCase()} meal from ${area}`,
      image: meal.strMealThumb,
      servings: 4,
      prepTime: estimatePrepTime(category),
      cookTime: estimateCookTime(category),
      difficulty: 'medium',
      cuisine: area,
      tags: [category.toLowerCase(), area.toLowerCase()],
      ingredients,
      steps: steps.length > 0 ? steps : [
        {
          id: '1',
          number: 1,
          description: meal.strInstructions || 'Prepare and enjoy!',
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      rating: Math.random() * 5,
      reviews: Math.floor(Math.random() * 500),
    };
  },
};
