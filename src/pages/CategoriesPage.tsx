import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiFilter } from "react-icons/fi";
import { useRecipeStore } from "../store/recipeStore";
import { mealDBService } from "../services/mealDBService";
import { Loader } from "../components/Loaders";
import { RecipeGridCard } from "../components/RecipeGridCard";

export const CategoriesPage: React.FC = () => {
  const { setRecipes, recipes } = useRecipeStore();
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const cats = await mealDBService.getCategories();
        setCategories(cats);

        if (cats.length > 0) {
          setSelectedCategory(cats[0].strCategory);
        }
      } catch (err) {
        console.error("Error loading categories:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!selectedCategory) return;

    const fetchCategoryRecipes = async () => {
      try {
        setIsLoading(true);
        const meals = await mealDBService.getMealsByCategory(selectedCategory);
        const converted = meals.map((meal) => mealDBService.mealToRecipe(meal));
        setRecipes(converted);
      } catch (err) {
        console.error("Error loading category recipes:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryRecipes();
  }, [selectedCategory, setRecipes]);

  const getCategoryEmoji = (category: string): string => {
    const emojiMap: Record<string, string> = {
      Seafood: "🦞",
      Pasta: "🍝",
      Dessert: "🍰",
      Breakfast: "🥞",
      Vegan: "🥗",
      Vegetarian: "🥦",
      Meat: "🥩",
      Chicken: "🍗",
      Side: "🍟",
      Miscellaneous: "🍜",
    };
    return emojiMap[category] || "🍽️";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50">
      {/* Header */}
      <div className="relative overflow-hidden py-16">
        <div className="absolute inset-0 pattern-dots opacity-5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FiFilter className="w-16 h-16 text-orange-600 mx-auto mb-4" />
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text mb-4">
              Browse by Category
            </h1>
            <p className="text-xl text-gray-600">
              Explore delicious recipes from different cuisines
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Categories</h2>
          <div className="flex flex-wrap gap-3 overflow-x-auto pb-4">
            {categories.map((category) => (
              <motion.button
                key={category.idCategory}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.strCategory)}
                className={`px-6 py-3 rounded-full font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === category.strCategory
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                    : "bg-white text-gray-700 border-2 border-orange-200 hover:border-orange-500"
                }`}
              >
                {getCategoryEmoji(category.strCategory)} {category.strCategory}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recipes Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-96">
            <Loader size="lg" text="Loading recipes..." />
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold text-gray-900">
              No recipes found
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <RecipeGridCard recipe={recipe} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
