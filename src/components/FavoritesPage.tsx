import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import { RecipeCard } from './RecipeCard';
import { RecipeModal } from './RecipeModal';
import { useRecipeStore } from '../store/recipeStore';

export const FavoritesPage: React.FC = () => {
  const { recipes, favorites, selectRecipe, selectedRecipe } = useRecipeStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const favoriteRecipes = recipes.filter((recipe) => favorites.includes(recipe.id));

  const handleRecipeClick = (recipe: any) => {
    selectRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => selectRecipe(null), 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <FiHeart className="w-16 h-16 text-white mx-auto mb-4 fill-white" />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Your Favorite Recipes
            </h1>
            <p className="text-xl text-rose-50 mb-4">
              {favoriteRecipes.length} recipe{favoriteRecipes.length !== 1 ? 's' : ''} saved
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
            className="bg-white rounded-xl p-12 shadow-lg text-center"
          >
            <FiHeart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No Favorites Yet</h2>
            <p className="text-slate-600 mb-6">
              Start exploring recipes and save your favorites to see them here!
            </p>
            <a
              href="/"
              className="inline-block px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-shadow"
            >
              Explore Recipes
            </a>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <RecipeCard
                  recipe={recipe}
                  onClick={handleRecipeClick}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Recipe Modal */}
      <RecipeModal
        recipe={selectedRecipe}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};
