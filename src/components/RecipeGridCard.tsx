import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { useRecipeStore } from "../store/recipeStore";
import { Recipe } from "../types/recipe";

interface RecipeGridCardProps {
  recipe: Recipe;
}

export const RecipeGridCard: React.FC<RecipeGridCardProps> = ({ recipe }) => {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useRecipeStore();
  const favorite = isFavorite(recipe.id);
  const totalTime = recipe.prepTime + recipe.cookTime;

  const difficultyColors = {
    easy: "from-green-500 to-emerald-500",
    medium: "from-orange-500 to-amber-500",
    hard: "from-red-500 to-rose-500",
  };

  return (
    <motion.div whileHover={{ y: -8 }} className="group cursor-pointer">
      <div
        onClick={() => navigate(`/recipe/${recipe.id}`)}
        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-orange-100 h-full flex flex-col"
      >
        {/* Image Container */}
        <div className="relative h-64 bg-gradient-to-br from-orange-200 to-red-200 overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Badge */}
          <div className="absolute top-4 right-4">
            <span
              className={`inline-block px-4 py-2 rounded-lg text-white text-xs font-black bg-gradient-to-r ${
                difficultyColors[recipe.difficulty]
              }`}
            >
              {recipe.difficulty.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-lg font-black text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors mb-2">
            {recipe.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {recipe.description}
          </p>

          {/* Metadata */}
          <div className="flex gap-4 text-sm text-gray-600 border-y border-orange-100 py-3 mb-4">
            <div className="flex items-center gap-1">
              <span className="text-orange-600 font-bold">⏱️</span>
              <span>{totalTime}m</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-orange-600 font-bold">👥</span>
              <span>{recipe.servings}</span>
            </div>
            <div className="text-xs bg-orange-100 px-3 py-1 rounded-lg text-gray-700 font-semibold">
              {recipe.cuisine}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(recipe.id);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-sm transition-colors ${
                favorite
                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                  : "bg-orange-100 text-orange-600 hover:bg-orange-200"
              }`}
            >
              <FiHeart
                className={`w-4 h-4 ${favorite ? "fill-current" : ""}`}
              />
              {favorite ? "Saved" : "Save"}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/recipe/${recipe.id}`);
              }}
              className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-shadow"
            >
              View Recipe
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
