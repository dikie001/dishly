import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { useRecipeStore } from "../store/recipeStore";
import { RecipeGridCard } from "../components/RecipeGridCard";

export const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { recipes, favorites } = useRecipeStore();

  const favoriteRecipes = recipes.filter((recipe) =>
    favorites.includes(recipe.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-orange-50">
      {/* Header */}
      <div className="relative overflow-hidden py-16">
        <div className="absolute inset-0 pattern-dots opacity-5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FiHeart className="w-16 h-16 text-red-600 mx-auto mb-4 fill-current" />
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text mb-4">
              Your Favorites
            </h1>
            <p className="text-xl text-gray-600">
              {favoriteRecipes.length} recipe{favoriteRecipes.length !== 1 ? "s" : ""}{" "}
              saved
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {favoriteRecipes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-12 shadow-lg text-center border border-orange-200"
          >
            <FiHeart className="w-20 h-20 text-orange-300 mx-auto mb-6" />
            <h2 className="text-3xl font-black text-gray-900 mb-4">
              No Favorites Yet
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Start exploring recipes and save your favorites to see them here!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-bold text-lg hover:shadow-lg transition-shadow"
            >
              Explore Recipes
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoriteRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
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
