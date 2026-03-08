import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiClock,
  FiUsers,
  FiShare2,
  FiCopy,
  FiHeart,
  FiDownload,
  FiPrinter,
} from "react-icons/fi";
import { Recipe } from "../types/recipe";
import { useRecipeStore } from "../store/recipeStore";
import {
  copyRecipeToClipboard,
  shareRecipe,
  downloadRecipeAsJSON,
  downloadRecipeAsPDF,
  adjustIngredient,
  calculateServingMultiplier,
} from "../utils/recipeUtils";

interface RecipeModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({
  recipe,
  isOpen,
  onClose,
}) => {
  const { toggleFavorite, isFavorite } = useRecipeStore();
  const [servings, setServings] = useState(recipe?.servings || 1);
  const [showMoreActions, setShowMoreActions] = useState(false);

  if (!recipe) return null;

  const favorite = isFavorite(recipe.id);
  const totalTime = recipe.prepTime + recipe.cookTime;
  const multiplier = calculateServingMultiplier(recipe.servings, servings);

  const difficultyColors = {
    easy: "bg-emerald-100 text-emerald-700",
    medium: "bg-amber-100 text-amber-700",
    hard: "bg-rose-100 text-rose-700",
  };

  const handleCopy = async () => {
    const success = await copyRecipeToClipboard(recipe);
    if (success) alert("Recipe copied to clipboard!");
  };

  const handleShare = async () => {
    const success = await shareRecipe(recipe);
    if (success) alert("Recipe shared successfully!");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header Image */}
              <div className="relative h-64 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-slate-100 transition-colors"
                >
                  <FiX className="w-6 h-6 text-slate-900" />
                </motion.button>

                {/* Difficulty Badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`inline-block px-4 py-2 rounded-full font-semibold text-sm ${difficultyColors[recipe.difficulty]}`}
                  >
                    {recipe.difficulty.charAt(0).toUpperCase() +
                      recipe.difficulty.slice(1)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8">
                {/* Title and Actions */}
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold text-slate-900">
                    {recipe.title}
                  </h1>
                  <p className="text-lg text-slate-600">{recipe.description}</p>

                  {/* Quick Actions */}
                  <div className="flex gap-3 flex-wrap">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleFavorite(recipe.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        favorite
                          ? "bg-rose-100 text-rose-600 hover:bg-rose-200"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <FiHeart
                        className={`w-5 h-5 ${favorite ? "fill-current" : ""}`}
                      />
                      {favorite ? "Saved" : "Save"}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCopy}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      <FiCopy className="w-5 h-5" />
                      Copy
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleShare}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                    >
                      <FiShare2 className="w-5 h-5" />
                      Share
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowMoreActions(!showMoreActions)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      More
                    </motion.button>
                  </div>

                  {/* More Actions */}
                  <AnimatePresence>
                    {showMoreActions && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-3 flex-wrap"
                      >
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => downloadRecipeAsJSON(recipe)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                        >
                          <FiDownload className="w-5 h-5" />
                          JSON
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => downloadRecipeAsPDF(recipe)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                        >
                          <FiDownload className="w-5 h-5" />
                          PDF
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => downloadRecipeAsPDF(recipe)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          <FiPrinter className="w-5 h-5" />
                          Print
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Recipe Info */}
                <div className="grid grid-cols-4 gap-4 bg-slate-50 rounded-xl p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">
                      {recipe.prepTime}
                    </div>
                    <div className="text-sm text-slate-600">Prep</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">
                      {recipe.cookTime}
                    </div>
                    <div className="text-sm text-slate-600">Cook</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">
                      {servings}
                    </div>
                    <div className="text-sm text-slate-600">Servings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">
                      {recipe.cuisine}
                    </div>
                    <div className="text-sm text-slate-600">Cuisine</div>
                  </div>
                </div>

                {/* Servings Adjuster */}
                <div className="border border-slate-200 rounded-xl p-6">
                  <h3 className="font-semibold text-slate-900 mb-4">
                    Adjust Servings
                  </h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setServings(Math.max(1, servings - 1))}
                      className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-lg font-bold text-slate-900 transition-colors"
                    >
                      −
                    </button>
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="number"
                        value={servings}
                        onChange={(e) =>
                          setServings(parseInt(e.target.value) || 1)
                        }
                        className="w-16 px-3 py-2 border border-slate-300 rounded-lg text-center font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <span className="text-slate-600">servings</span>
                    </div>
                    <button
                      onClick={() => setServings(servings + 1)}
                      className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-lg font-bold text-slate-900 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Ingredients */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Ingredients
                  </h2>
                  <div className="space-y-3">
                    {recipe.ingredients.map((ingredient) => (
                      <motion.div
                        key={ingredient.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <input
                          type="checkbox"
                          className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer mt-1"
                        />
                        <div className="flex-1">
                          <p className="text-slate-900 font-medium">
                            {adjustIngredient(ingredient.amount, multiplier)}{" "}
                            {ingredient.unit} {ingredient.name}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Instructions
                  </h2>
                  <div className="space-y-4">
                    {recipe.steps.map((step, index) => (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-4 p-4 border-l-4 border-emerald-500 bg-slate-50 rounded-r-lg"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold">
                          {step.number}
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-900">{step.description}</p>
                          {step.duration && (
                            <p className="text-sm text-slate-500 mt-2 flex items-center gap-2">
                              <FiClock className="w-4 h-4" />
                              {step.duration} minutes
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                {recipe.tags.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-slate-900">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {recipe.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
