import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiFilter, FiX, FiSearch } from "react-icons/fi";
import { useRecipeStore } from "../store/recipeStore";
import { RecipeFilter } from "../types/recipe";
import { mealDBService } from "../services/mealDBService";

interface FilterComponentProps {
  onFilterChange?: () => void;
}

export const FilterComponent: React.FC<FilterComponentProps> = ({
  onFilterChange,
}) => {
  const { filter, setFilter, clearFilter, setRecipes } = useRecipeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filter.searchTerm || "");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>(
    filter.difficulty || "",
  );
  const [selectedCuisine, setSelectedCuisine] = useState<string>(
    filter.cuisine || "",
  );
  const [maxTime, setMaxTime] = useState<number>(filter.maxTime || 120);

  const cuisines = [
    "Italian",
    "American",
    "British",
    "Canadian",
    "Chinese",
    "French",
    "Indian",
    "Mexican",
    "Thai",
    "Japanese",
  ];
  const difficulties = ["easy", "medium", "hard"];

  // Handle search with API
  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    if (!query.trim()) return;

    try {
      setIsSearching(true);
      const meals = await mealDBService.searchMeals(query);
      if (meals.length > 0) {
        const recipes = meals.map((meal) => mealDBService.mealToRecipe(meal));
        setRecipes(recipes);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleApplyFilters = () => {
    const newFilter: RecipeFilter = {
      searchTerm: searchTerm || undefined,
      difficulty:
        (selectedDifficulty as "easy" | "medium" | "hard") || undefined,
      cuisine: selectedCuisine || undefined,
      maxTime: maxTime !== 120 ? maxTime : undefined,
    };

    setFilter(newFilter);
    setIsOpen(false);
    onFilterChange?.();
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedDifficulty("");
    setSelectedCuisine("");
    setMaxTime(120);
    clearFilter();
    onFilterChange?.();
  };

  const hasActiveFilters =
    searchTerm || selectedDifficulty || selectedCuisine || maxTime !== 120;

  return (
    <>
      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search recipes by name or ingredient..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            disabled={isSearching}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:opacity-60"
          />
        </div>
      </div>

      {/* Filter Button and Badge */}
      <div className="flex items-center gap-3 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            hasActiveFilters
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <FiFilter className="w-5 h-5" />
          Filters
        </motion.button>

        {hasActiveFilters && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="text-sm text-slate-600 hover:text-slate-900 font-medium"
          >
            Reset all
          </motion.button>
        )}
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border border-slate-200 rounded-xl p-6 mb-6 space-y-6 shadow-lg"
          >
            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">
                Difficulty Level
              </label>
              <div className="flex gap-3 flex-wrap">
                {difficulties.map((level) => (
                  <motion.button
                    key={level}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setSelectedDifficulty(
                        selectedDifficulty === level ? "" : level,
                      )
                    }
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedDifficulty === level
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Cuisine Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">
                Cuisine
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {cuisines.map((cuisine) => (
                  <motion.button
                    key={cuisine}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      setSelectedCuisine(
                        selectedCuisine === cuisine ? "" : cuisine,
                      )
                    }
                    className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                      selectedCuisine === cuisine
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cuisine}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Time Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">
                Max Cooking Time: {maxTime} minutes
              </label>
              <input
                type="range"
                min="15"
                max="240"
                step="15"
                value={maxTime}
                onChange={(e) => setMaxTime(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-slate-600 mt-2">
                <span>15 min</span>
                <span>240 min</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors"
              >
                Reset
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleApplyFilters}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
              >
                Apply Filters
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
