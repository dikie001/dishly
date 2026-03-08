import React from "react";
import { motion } from "framer-motion";
import { FiClock, FiUsers, FiHeart, FiShare2, FiCopy } from "react-icons/fi";
import { Recipe } from "../types/recipe";
import { useRecipeStore } from "../store/recipeStore";
import { copyRecipeToClipboard, shareRecipe } from "../utils/recipeUtils";

interface RecipeCardProps {
  recipe: Recipe;
  onClick: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  const { toggleFavorite, isFavorite } = useRecipeStore();
  const favorite = isFavorite(recipe.id);
  const totalTime = recipe.prepTime + recipe.cookTime;

  const difficultyColors = {
    easy: "bg-emerald-100 text-emerald-700",
    medium: "bg-amber-100 text-amber-700",
    hard: "bg-rose-100 text-rose-700",
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await shareRecipe(recipe);
    if (success) {
      // Show toast notification
      console.log("Recipe shared successfully");
    }
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await copyRecipeToClipboard(recipe);
    if (success) {
      // Show toast notification
      console.log("Recipe copied to clipboard");
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(recipe.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onClick={() => onClick(recipe)}
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-slate-100"
    >
      {/* Image Container */}
      <div className="relative h-48 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[recipe.difficulty]}`}
          >
            {recipe.difficulty}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold text-slate-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">
          {recipe.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 line-clamp-2 mt-2">
          {recipe.description}
        </p>

        {/* Metadata */}
        <div className="flex gap-4 mt-4 text-sm text-slate-600 border-y border-slate-100 py-3">
          <div className="flex items-center gap-1">
            <FiClock className="w-4 h-4 text-emerald-500" />
            <span>{totalTime}m</span>
          </div>
          <div className="flex items-center gap-1">
            <FiUsers className="w-4 h-4 text-emerald-500" />
            <span>{recipe.servings}</span>
          </div>
          <div className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">
            {recipe.cuisine}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFavorite}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium text-sm transition-colors ${
              favorite
                ? "bg-rose-100 text-rose-600 hover:bg-rose-200"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <FiHeart className={`w-4 h-4 ${favorite ? "fill-current" : ""}`} />
            Favorite
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
            title="Copy recipe"
          >
            <FiCopy className="w-4 h-4" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
            title="Share recipe"
          >
            <FiShare2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
