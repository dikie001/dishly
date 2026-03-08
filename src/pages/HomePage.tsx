import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { useRecipeStore } from "../store/recipeStore";
import { mealDBService } from "../services/mealDBService";
import { Loader } from "../components/Loaders";
import { RecipeGridCard } from "../components/RecipeGridCard";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { setRecipes, recipes, getFilteredRecipes } = useRecipeStore();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [featuredRecipes, setFeaturedRecipes] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true);
        const categories = await mealDBService.getCategories();
        const allMeals: any[] = [];

        for (const category of categories.slice(0, 6)) {
          const meals = await mealDBService.getMealsByCategory(
            category.strCategory
          );
          allMeals.push(...meals.slice(0, 3));
        }

        const convertedRecipes = allMeals.map((meal) =>
          mealDBService.mealToRecipe(meal)
        );
        setRecipes(convertedRecipes);
        setFeaturedRecipes(convertedRecipes.slice(0, 6));
      } catch (err) {
        console.error("Error loading recipes:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [setRecipes]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const meals = await mealDBService.searchMeals(searchTerm);
      const converted = meals.map((meal) => mealDBService.mealToRecipe(meal));
      setRecipes(converted);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const filteredRecipes = getFilteredRecipes();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6 text-transparent bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text">
              Discover Your Next <br /> Favorite Dish
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Explore thousands of delicious recipes from cuisines around the
              world. Find inspiration, create memories, share joy.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 w-6 h-6" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for recipes, ingredients, cuisines..."
                  className="w-full pl-14 pr-6 py-4 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
                >
                  Search
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Featured Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-96">
            <Loader size="lg" text="Preparing delicious recipes..." />
          </div>
        ) : (
          <>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-black text-transparent bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text mb-12"
            >
              ✨ Featured Recipes
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRecipes.slice(0, 6).map((recipe, index) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate(`/recipe/${recipe.id}`)}
                >
                  <RecipeGridCard recipe={recipe} />
                </motion.div>
              ))}
            </div>

            {filteredRecipes.length > 6 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mt-16"
              >
                <button
                  onClick={() => navigate("/categories")}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-bold text-lg hover:shadow-lg transition-shadow"
                >
                  View All Recipes
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
