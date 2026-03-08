import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiClock,
  FiUsers,
  FiHeart,
  FiShare2,
  FiCopy,
  FiDownload,
  FiPrinter,
} from "react-icons/fi";
import { useRecipeStore } from "../store/recipeStore";
import { mealDBService } from "../services/mealDBService";
import { Loader } from "../components/Loaders";
import {
  copyRecipeToClipboard,
  shareRecipe,
  downloadRecipeAsJSON,
  downloadRecipeAsPDF,
  adjustIngredient,
  calculateServingMultiplier,
} from "../utils/recipeUtils";

export const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<any>(null);
  const [servings, setServings] = useState(4);
  const [isLoading, setIsLoading] = useState(true);
  const { toggleFavorite, isFavorite } = useRecipeStore();

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const meal = await mealDBService.getMealDetails(id);
        if (meal) {
          const converted = mealDBService.mealToRecipe(meal);
          setRecipe(converted);
          setServings(converted.servings);
        }
      } catch (err) {
        console.error("Error loading recipe:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading recipe..." />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Recipe not found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const multiplier = calculateServingMultiplier(recipe.servings, servings);
  const favorite = isFavorite(recipe.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-16 z-40 bg-white border-b border-orange-200 shadow-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-orange-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="w-6 h-6 text-orange-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{recipe.title}</h1>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 rounded-2xl overflow-hidden shadow-xl"
            >
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-96 object-cover"
              />
            </motion.div>

            {/* Info Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-200"
            >
              <div className="text-center">
                <FiClock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Prep</div>
                <div className="text-xl font-bold text-gray-900">
                  {recipe.prepTime}m
                </div>
              </div>
              <div className="text-center">
                <FiClock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Cook</div>
                <div className="text-xl font-bold text-gray-900">
                  {recipe.cookTime}m
                </div>
              </div>
              <div className="text-center">
                <FiUsers className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Servings</div>
                <div className="text-xl font-bold text-gray-900">
                  {recipe.servings}
                </div>
              </div>
              <div className="text-center">
                <div className="font-bold text-orange-600 text-lg mb-1">⭐</div>
                <div className="text-sm text-gray-600">Rating</div>
                <div className="text-xl font-bold text-gray-900">
                  {recipe.rating?.toFixed(1)}
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <p className="text-lg text-gray-600 leading-relaxed">
                {recipe.description}
              </p>
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-black text-transparent bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text mb-6">
                👨‍🍳 Instructions
              </h2>
              <div className="space-y-4">
                {recipe.steps.map((step: any, index: number) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-4 p-4 bg-gradient-to-r from-orange-50 to-transparent rounded-xl border-l-4 border-orange-500"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center font-bold">
                      {step.number}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-gray-800 leading-relaxed">
                        {step.description}
                      </p>
                      {step.duration && (
                        <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                          <FiClock className="w-4 h-4" />
                          {step.duration} minutes
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Servings Adjuster */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="sticky top-20 bg-white p-6 rounded-2xl shadow-lg border border-orange-200 mb-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Adjust Servings
              </h3>
              <div className="flex items-center justify-center gap-4 mb-6">
                <button
                  onClick={() => setServings(Math.max(1, servings - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-orange-100 hover:bg-orange-200 rounded-lg font-bold text-orange-600 transition-colors"
                >
                  −
                </button>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={servings}
                    onChange={(e) =>
                      setServings(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-16 px-3 py-2 border border-orange-300 rounded-lg text-center font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <span className="text-gray-600">servings</span>
                </div>
                <button
                  onClick={() => setServings(servings + 1)}
                  className="w-10 h-10 flex items-center justify-center bg-orange-100 hover:bg-orange-200 rounded-lg font-bold text-orange-600 transition-colors"
                >
                  +
                </button>
              </div>
            </motion.div>

            {/* Ingredients */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-2xl shadow-lg border border-orange-200 mb-6"
            >
              <h3 className="text-2xl font-black text-transparent bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text mb-6">
                🛒 Ingredients
              </h3>
              <div className="space-y-3">
                {recipe.ingredients.map((ingredient: any) => (
                  <motion.div
                    key={ingredient.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-3 p-3 hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded border-orange-300 text-orange-600 focus:ring-orange-500 cursor-pointer mt-0.5"
                    />
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">
                        {adjustIngredient(ingredient.amount, multiplier)}{" "}
                        {ingredient.unit} {ingredient.name}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <button
                onClick={() => toggleFavorite(recipe.id)}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-colors ${
                  favorite
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-orange-100 text-orange-600 hover:bg-orange-200"
                }`}
              >
                <FiHeart
                  className={`w-5 h-5 ${favorite ? "fill-current" : ""}`}
                />
                {favorite ? "Remove from Favorites" : "Add to Favorites"}
              </button>

              <button
                onClick={() => copyRecipeToClipboard(recipe)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-100 text-blue-600 rounded-lg font-semibold hover:bg-blue-200 transition-colors"
              >
                <FiCopy className="w-5 h-5" />
                Copy Recipe
              </button>

              <button
                onClick={() => shareRecipe(recipe)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-green-100 text-green-600 rounded-lg font-semibold hover:bg-green-200 transition-colors"
              >
                <FiShare2 className="w-5 h-5" />
                Share
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => downloadRecipeAsJSON(recipe)}
                  className="flex items-center justify-center gap-2 py-3 bg-purple-100 text-purple-600 rounded-lg font-semibold hover:bg-purple-200 transition-colors text-sm"
                >
                  <FiDownload className="w-4 h-4" />
                  JSON
                </button>

                <button
                  onClick={() => downloadRecipeAsPDF(recipe)}
                  className="flex items-center justify-center gap-2 py-3 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 transition-colors text-sm"
                >
                  <FiDownload className="w-4 h-4" />
                  PDF
                </button>
              </div>

              <button
                onClick={() => window.print()}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-600 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                <FiPrinter className="w-5 h-5" />
                Print
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
