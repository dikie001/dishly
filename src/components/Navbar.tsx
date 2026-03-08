import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiSearch, FiHeart } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Explore Recipes", href: "/" },
    { label: "Favorites", href: "/favorites" },
    { label: "Categories", href: "/categories" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-orange-200/30 bg-gradient-to-r from-orange-50 via-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div
                className="text-3xl font-bold"
                whileHover={{ scale: 1.05 }}
              >
                🍽️
              </motion.div>
              <motion.div
                className="text-2xl font-black bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent hidden sm:block"
                whileHover={{ scale: 1.05 }}
              >
                Dishly
              </motion.div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`relative text-sm font-semibold transition-colors ${
                    isActive(item.href)
                      ? "text-red-600"
                      : "text-gray-700 hover:text-orange-600"
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500"
                      layoutId="underline"
                      transition={{ type: "spring", stiffness: 380, damping: 40 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 hover:bg-orange-100 rounded-lg transition-colors"
              >
                <FiSearch className="w-5 h-5 text-orange-600" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-orange-100 rounded-lg transition-colors"
              >
                <FiHeart className="w-5 h-5 text-red-600" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-shadow"
              >
                Add Recipe
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-orange-100 rounded-lg transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <FiX className="w-6 h-6 text-orange-600" />
              ) : (
                <FiMenu className="w-6 h-6 text-orange-600" />
              )}
            </button>
          </div>

          {/* Search Bar */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pb-4"
              >
                <input
                  type="text"
                  placeholder="Search recipes..."
                  className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  autoFocus
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-orange-200/50 bg-gradient-to-b from-orange-50 to-white"
            >
              <div className="px-4 py-4 space-y-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      isActive(item.href)
                        ? "bg-orange-100 text-red-600"
                        : "text-gray-700 hover:bg-orange-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};
