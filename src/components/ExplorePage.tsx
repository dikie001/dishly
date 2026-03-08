import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FilterComponent } from "./FilterComponent";
import { RecipeCard } from "./RecipeCard";
import { RecipeModal } from "./RecipeModal";
import { Loader } from "./Loaders";
import { useRecipeStore } from "../store/recipeStore";
import { sampleRecipes } from "../data/sampleRecipes";

export const ExplorePage: React.FC = () => {
  const { setRecipes, getFilteredRecipes, selectRecipe, selectedRecipe } =
    useRecipeStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setRecipes(sampleRecipes);
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [setRecipes]);

  const recipes = getFilteredRecipes();

  const handleRecipeClick = (recipe: any) => {
    selectRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => selectRecipe(null), 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 relative overflow-hidden pt-20 pb-32">
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
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Discover Delicious Recipes
            </h1>
            <p className="text-xl text-emerald-50 mb-8 max-w-2xl mx-auto">
              Explore thousands of recipes from around the world. Cook, share,
              and enjoy amazing meals with your loved ones.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <FilterComponent />

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-96 gap-4">
            <Loader size="lg" text="Loading delicious recipes..." />
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-12 shadow-lg"
            >
              <p className="text-xl text-slate-600 mb-4">
                No recipes found matching your criteria
              </p>
              <p className="text-slate-500 mb-6">
                Try adjusting your filters to find more recipes
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Reset Filters
              </button>
            </motion.div>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-slate-600 mb-6 text-sm"
            >
              Found {recipes.length} recipe{recipes.length !== 1 ? "s" : ""}
            </motion.p>

            {/* Recipe Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <RecipeCard recipe={recipe} onClick={handleRecipeClick} />
                </motion.div>
              ))}
            </div>
          </>
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
